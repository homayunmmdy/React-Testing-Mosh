import { render, screen } from "@testing-library/react";
import SearchBox from "../../src/components/SearchBox";
import userEvent from "@testing-library/user-event";

describe("SearchBox", () => {
  const renderSearchBox = () => {
    const onChange = vi.fn();
    render(<SearchBox onChange={onChange} />);

    return {
      input: screen.getByPlaceholderText(/search/i),
      onChange,
      user: userEvent.setup(),
    };
  };
  it("should render an input filed for searching", () => {
    const { input } = renderSearchBox();

    expect(input).toBeInTheDocument();
  });
  it("should call onChange when Enter is pressed", async () => {
    const { input, onChange, user } = renderSearchBox();

    const searchTerm = "SearchTerm";
    await user.type(input, searchTerm + "{enter}");
    expect(onChange).toHaveBeenCalledWith(searchTerm);
  });
  
  it("should not call onChange if input filed is empty", async () => {
    const { input, onChange, user } = renderSearchBox();

    await user.type(input, "{enter}");
    expect(onChange).not.toHaveBeenCalled();
  });
});
