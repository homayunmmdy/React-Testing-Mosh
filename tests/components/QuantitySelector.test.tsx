import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuantitySelector from "../../src/components/QuantitySelector";
import { Product } from "../../src/entities";
import { CartProvider } from "../../src/providers/CartProvider";

describe("QuantitySelector.tsx", () => {
  const renderComponents = () => {
    const product: Product = {
      id: 1,
      name: "Milk",
      price: 5,
      categoryId: 1,
    };
    render(
      <CartProvider>
        <QuantitySelector product={product} />
      </CartProvider>
    );

    const getAddToCardButton = () =>
      screen.queryByRole("button", { name: /add to cart/i });
    const getQuntityControls = () => ({
      quantity: screen.queryByRole("status"),
      decrementButton: screen.queryByRole("button", { name: "-" }),
      incrementButton: screen.queryByRole("button", { name: "+" }),
    });
    const user = userEvent.setup();

    const addToCard = async () => {
      const button = getAddToCardButton();
      await user.click(button!);
    };

    const incrementQuantity = async () => {
      const { incrementButton } = getQuntityControls();
      await user.click(incrementButton!);
    };

    const decrementQuantity = async () => {
      const { decrementButton } = getQuntityControls();
      await user.click(decrementButton!);
    };

    return {
      getAddToCardButton,
      getQuntityControls,
      addToCard,
      incrementQuantity,
      decrementQuantity,
    };
  };
  it("should render the Add to Card button", () => {
    const { getAddToCardButton } = renderComponents();

    expect(getAddToCardButton()!).toBeInTheDocument();
  });

  it("should add the product to the cart", async () => {
    const { getAddToCardButton, addToCard, getQuntityControls } =
      renderComponents();

    await addToCard();

    const { quantity, decrementButton, incrementButton } = getQuntityControls();
    expect(quantity).toHaveTextContent("1");

    expect(decrementButton).toBeInTheDocument();
    expect(incrementButton).toBeInTheDocument();
    expect(getAddToCardButton()).not.toBeInTheDocument();
  });

  it("should increment the qantity", async () => {
    const { incrementQuantity, addToCard, getQuntityControls } =
      renderComponents();
    await addToCard();

    await incrementQuantity();

    const { quantity } = getQuntityControls();
    expect(quantity).toHaveTextContent("2");
  });

  it("should decrement the qantity", async () => {
    const {
      incrementQuantity,
      decrementQuantity,
      addToCard,
      getQuntityControls,
    } = renderComponents();
    await addToCard();
    await incrementQuantity();

    await decrementQuantity();

    const { quantity } = getQuntityControls();
    expect(quantity).toHaveTextContent("1");
  });

  it("should remove the product from the card", async () => {
    const {
      getAddToCardButton,
      decrementQuantity,
      addToCard,
      getQuntityControls,
    } = renderComponents();
    await addToCard();

    await decrementQuantity();

    const { incrementButton, decrementButton, quantity } = getQuntityControls();
    expect(quantity).not.toBeInTheDocument();
    expect(decrementButton).not.toBeInTheDocument();
    expect(incrementButton).not.toBeInTheDocument();
    expect(getAddToCardButton()!).toBeInTheDocument();
  });
});
