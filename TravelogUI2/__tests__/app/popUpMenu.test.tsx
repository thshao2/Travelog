import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import PopupMenu from "../../app/popupMenu";

/**
 * @jest-environment jsdom
 */
describe("PopUpMenu", () => {
  const mockOnClose = jest.fn();
  const mockOnAddJournal = jest.fn();
  const mockOnDeletePin = jest.fn();
  const mockSelectedPin = { pinId: 1, marker: null, position: { top: 100, left: 100 } };

  const renderPopUpMenu = () => {
    render(
      <PopupMenu
        selectedPin={mockSelectedPin}
        onClose={mockOnClose}
        onAddJournal={mockOnAddJournal}
        onDeletePin={mockOnDeletePin}
      />,
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * @jest-environment jsdom
   */
  test("Render PopUpMenu", () => {
    renderPopUpMenu();
    expect(screen.getByText("Memories")).toBeTruthy();
    expect(screen.getByText("Add Journal")).toBeTruthy();
    expect(screen.getByText("Delete Pin")).toBeTruthy();
  });

  test("Function called when \"Add Journal\" button is pressed", () => {
    renderPopUpMenu();

    // const addJournalButton = screen.getByTestId('add-journal-button');
    const addJournalButton = screen.getByText("Add Journal");
    fireEvent.press(addJournalButton);

    expect(mockOnAddJournal).toHaveBeenCalledTimes(1);
  });

  test("calls onClose when Close button is pressed", () => {
    renderPopUpMenu();
    const closeButton = screen.getByRole("button", { name: "close-icon" });
    fireEvent.press(closeButton);
  
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});