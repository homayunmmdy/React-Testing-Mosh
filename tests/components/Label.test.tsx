import { render, screen } from "@testing-library/react";
import Label from "../../src/components/Label";
import { LanguageProvider } from "../../src/providers/language/LanguageProvider";
import { Language } from "../../src/providers/language/type";

describe("Label", () => {
  const renderComponents = (labelId: string, language: Language) => {
    render(
      <LanguageProvider language={language}>
        <Label labelId={labelId} />
      </LanguageProvider>
    );
  };

  describe("Given the current language is EN", () => {
    it.each([
      { labelId: "welcome", text: "Welcome" },
      { labelId: "new_product", text: "New Product" },
      { labelId: "edit_product", text: "Edit Product" },
    ])("should render $text for $lableId", ({ labelId, text }) => {
      renderComponents(labelId, "en");
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  describe("Given the current language is ES", () => {
    it.each([
      { labelId: "welcome", text: "Bienvenidos" },
      { labelId: "new_product", text: "Nuevo Producto" },
      { labelId: "edit_product", text: "Editar Producto" },
    ])("should render $text for $lableId", ({ labelId, text }) => {
      renderComponents(labelId, "es");
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  it('should throw an error if given an invalid labelId', () => {
   expect(() => renderComponents('!', "en")).toThrowError();
  });
  
});
