import { Theme } from "@radix-ui/themes";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Category, Product } from "../../src/entities";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import { CartProvider } from "../../src/providers/CartProvider";
import { db, getProductByCategory } from "../mocks/db";
import { simulateDelay, simulateEror } from "../utils";
import AllProviders from "../AllProvider";

describe("BrowseProductsPage", () => {
  const categories: Category[] = [];
  const products: Product[] = [];

  beforeAll(() => {
    [1, 2].forEach(() => {
      const category = db.category.create();
      categories.push(category);
      [1, 2].forEach(() => {
        products.push(db.product.create({ categoryId: category.id }));
      });
    });
  });

  afterAll(() => {
    const categoryIds = categories.map((c) => c.id);
    db.category.deleteMany({ where: { id: { in: categoryIds } } });

    const productIds = products.map((p) => p.id);
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });

  it("should show a loading skeleton when fetching categories", () => {
    simulateDelay("/categories");

    const { getCategorySkeleton } = renderComponent();

    expect(getCategorySkeleton()).toBeInTheDocument();
  });

  it("shoud hide the loading skeleton after categories are fetched", async () => {
    const { getCategorySkeleton } = renderComponent();

    await waitForElementToBeRemoved(getCategorySkeleton);
  });

  it("should show a loading skeleton when fetching products", () => {
    simulateDelay("products");

    const { getProductSkeleton } = renderComponent();

    expect(getProductSkeleton()).toBeInTheDocument();
  });

  it("shoud hide the loading skeleton after products are fetched", async () => {
    const { getProductSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductSkeleton);
  });

  it("should not render an error if categories cannot be fetched", async () => {
    simulateEror("/categories");

    const { getCategorySkeleton, getCategoriesComboBox } = renderComponent();

    await waitForElementToBeRemoved(getCategorySkeleton);

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    expect(getCategoriesComboBox()).not.toBeInTheDocument();
  });

  it("should render an error if products cannot be fetched", async () => {
    simulateEror("/products");

    renderComponent();

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("should render categories", async () => {
    const { getCategorySkeleton, getCategoriesComboBox } = renderComponent();

    await waitForElementToBeRemoved(getCategorySkeleton);

    const combobox = getCategoriesComboBox();
    expect(combobox).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(combobox!);

    expect(screen.getByRole("option", { name: /all/i })).toBeInTheDocument();
    categories.forEach((category) => {
      expect(
        screen.getByRole("option", { name: category.name })
      ).toBeInTheDocument();
    });
  });

  it("should render products", async () => {
    const { getProductSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductSkeleton);

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });

  it("should filter prodcuts by category", async () => {
    const { selectCategory, expectProductsToBeInTheDocument } =
      renderComponent();

    const selectedCategory = categories[0];
    await selectCategory(selectedCategory.name);

    const products = getProductByCategory(selectedCategory.id);
    expectProductsToBeInTheDocument(products);
  });

  it("should all product if all category is selected", async () => {
    const { selectCategory, expectProductsToBeInTheDocument } =
      renderComponent();

    await selectCategory(/all/i);

    const products = db.product.getAll();
    expectProductsToBeInTheDocument(products);
  });
});

const renderComponent = () => {
  render(<BrowseProducts />, { wrapper: AllProviders });

  const getProductSkeleton = () =>
    screen.queryByRole("progressbar", { name: /products/i });

  const getCategorySkeleton = () =>
    screen.getByRole("progressbar", { name: /categories/i });

  const getCategoriesComboBox = () => screen.queryByRole("combobox");

  const selectCategory = async (name: RegExp | string) => {
    await waitForElementToBeRemoved(getCategorySkeleton);
    const combobox = getCategoriesComboBox();
    const user = userEvent.setup();
    await user.click(combobox!);

    const option = screen.getByRole("option", { name });
    await user.click(option);
  };

  const expectProductsToBeInTheDocument = (products: Product[]) => {
    const rows = screen.getAllByRole("row");
    const dataRows = rows.slice(1);
    expect(dataRows).toHaveLength(products.length);

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  };

  return {
    getProductSkeleton,
    getCategorySkeleton,
    getCategoriesComboBox,
    selectCategory,
    expectProductsToBeInTheDocument,
  };
};
