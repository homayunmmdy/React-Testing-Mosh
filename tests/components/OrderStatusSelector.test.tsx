import { render, screen } from "@testing-library/react";
import OrderStatusSelector from "../../src/components/OrderStatusSelector";
import { Theme } from "@radix-ui/themes";
import userEvent from "@testing-library/user-event";

describe("OrderStatusSelector", () => {
    const renderComponents = () => {

        render(
          <Theme>
            <OrderStatusSelector onChange={vi.fn()} />
          </Theme>
        );

        return {
            trigger: screen.getByRole("combobox"),
            getOptions : () => screen.findAllByRole("option")
        }
    }
  it("should render new as default value", () => {
    const {trigger} = renderComponents()

    expect(trigger).toHaveTextContent(/new/i);
  });

  it("should render correct statuses", async () => {
    const {trigger, getOptions} = renderComponents()

    const user = userEvent.setup();
    await user.click(trigger);

    const options = await getOptions();
    expect(options).toHaveLength(3);
    const labels = options.map((option) => option.textContent);
    expect(labels).toEqual(["New", "Processed", "Fulfilled"]);
  });
});
