import { render, screen, waitFor } from "@testing-library/react";
import TagList from "../../src/components/TagList";

describe("TagList", () => {
  it("should render tags", async () => {
    render(<TagList />);

    // await waitFor(() => {
    //   const ListItem = screen.getAllByRole("listitem");
    // expect(ListItem.length).toBeGreaterThan(0);

    // });
    
    const ListItem = await screen.findAllByRole("listitem");
    expect(ListItem.length).toBeGreaterThan(0);
});
});
