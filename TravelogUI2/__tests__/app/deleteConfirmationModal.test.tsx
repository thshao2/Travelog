import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native'; // Use '@testing-library/react-native' for React Native
import DeleteConfirmationModal from '../../app/deleteConfirmationModal';

describe('DeleteConfirmationModal', () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the modal when visible prop is true', () => {
    render(
      <DeleteConfirmationModal visible={true} onClose={mockOnClose} onConfirm={mockOnConfirm} />
    );

    expect(screen.queryByText(/Are you sure you want to delete this pin?/i)).toBeTruthy();
    expect(screen.queryByText(/The journal entries will be preserved and will be visible under "Saved", but it will no longer show up in the map./i)).toBeTruthy();
    expect(screen.queryByText("Yes")).toBeTruthy();
    expect(screen.queryByText("No")).toBeTruthy();
  });

  test('does not render the modal when visible prop is false', () => {
    render(
      <DeleteConfirmationModal visible={false} onClose={mockOnClose} onConfirm={mockOnConfirm} />
    );

    expect(screen.queryByText(/Are you sure you want to delete this pin?/i)).toBeNull(); // Use queryByText to check for absence
  });

  test('calls onConfirm when Yes button is pressed', () => {
    render(
      <DeleteConfirmationModal visible={true} onClose={mockOnClose} onConfirm={mockOnConfirm} />
    );

    fireEvent.press(screen.getByText(/Yes/i)); // Simulate pressing the Yes button

    expect(mockOnConfirm).toHaveBeenCalled(); // Check if onConfirm was called
  });

  test('calls onClose when No button is pressed', () => {
    render(
      <DeleteConfirmationModal visible={true} onClose={mockOnClose} onConfirm={mockOnConfirm} />
    );

    fireEvent.press(screen.getByText("No")); // Simulate pressing the No button

    expect(mockOnClose).toHaveBeenCalled(); // Check if onClose was called
  });
});
