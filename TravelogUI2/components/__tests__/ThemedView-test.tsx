import React from "react";
import { render } from "@testing-library/react-native";

import { ThemedView } from "../ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

// mock useThemeColor hook
jest.mock("@/hooks/useThemeColor", () => ({
  useThemeColor: jest.fn(),
}));

describe("ThemedView", () => {
  test("renders w default background color", () => {
    // mock return default bkg color
    (useThemeColor as jest.Mock).mockReturnValue("#FFFFFF");

    const { getByTestId } = render(<ThemedView testID="themed-view" style={{ height: 100, width: 100 }} />);

    const view = getByTestId("themed-view");
    expect(view.props.style).toContainEqual({ backgroundColor: "#FFFFFF" });
  });

  test("renders w lightColor", () => {
    (useThemeColor as jest.Mock).mockReturnValue("#F0F0F0");

    const { getByTestId } = render(<ThemedView testID="themed-view" lightColor="#F0F0F0" style={{ height: 100, width: 100 }}/>);

    const view = getByTestId("themed-view");
    expect(view.props.style).toContainEqual({ backgroundColor: "#F0F0F0" });
  });

  test("renders w darkColor", () => {
    (useThemeColor as jest.Mock).mockReturnValue("#333333");

    const { getByTestId } = render(<ThemedView testID="themed-view" darkColor="#333333" style={{ height: 100, width: 100 }}/>);

    const view = getByTestId("themed-view");
    expect(view.props.style).toContainEqual({ backgroundColor: "#333333" });
  });

});
