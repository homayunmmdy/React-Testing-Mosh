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

    return {
      getAddToCardButton: () => screen.queryByRole("button", { name: /add to cart/i }),
      getQuntityControls: () => ({
        quantity: screen.queryByRole("status"),
        decrementButton: screen.queryByRole("button", { name: "-" }),
        incrementButton: screen.queryByRole("button", { name: "+" }),
      }),
      user: userEvent.setup(),
    };
  };
  it("should render the Add to Card button", () => {
    const { getAddToCardButton } = renderComponents();

    expect(getAddToCardButton()!).toBeInTheDocument();
  });

  it("should add the product to the cart", async () => {
    const { getAddToCardButton, user, getQuntityControls } = renderComponents();

    await user.click(getAddToCardButton()!);

    const { quantity, decrementButton, incrementButton } = getQuntityControls();
    expect(quantity).toHaveTextContent("1");

    expect(decrementButton).toBeInTheDocument();
    expect(incrementButton).toBeInTheDocument();
    expect(getAddToCardButton()).not.toBeInTheDocument();
  });

  it("should increment the qantity", async () => {
    const { getAddToCardButton, user, getQuntityControls } = renderComponents();
    await user.click(getAddToCardButton()!);

    const { incrementButton, quantity } = getQuntityControls();
    await user.click(incrementButton!);

    expect(quantity).toHaveTextContent("2");
  });

  it("should decrement the qantity", async () => {
    const { getAddToCardButton, user, getQuntityControls } = renderComponents();
    await user.click(getAddToCardButton()!);
    const { incrementButton, decrementButton, quantity } = getQuntityControls();
    await user.click(incrementButton!);

    await user.click(decrementButton!);

    expect(quantity).toHaveTextContent("1");
  });

  it("should remove the product from the card", async () => {
    const { getAddToCardButton, user, getQuntityControls } = renderComponents();
    await user.click(getAddToCardButton()!);
    const {incrementButton, decrementButton, quantity } = getQuntityControls();

    await user.click(decrementButton!);

    expect(quantity).not.toBeInTheDocument();
    expect(decrementButton).not.toBeInTheDocument();
    expect(incrementButton).not.toBeInTheDocument();
    expect(getAddToCardButton()!).toBeInTheDocument();
  });
});
