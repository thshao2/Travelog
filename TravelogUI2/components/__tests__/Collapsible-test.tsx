import * as React from "react";
import renderer from "react-test-renderer";

import { Collapsible } from "../Collapsible";

describe("Collapsible Component", () => {
  it("matches snapshot when closed", () => {
    const tree = renderer.create(<Collapsible title="Test Title">Collapsed Content</Collapsible>).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("matches snapshot when open", () => {
    const component = renderer.create(<Collapsible title="Test Title">Expanded Content</Collapsible>);
    
    // Toggle open state by simulating the press event
    component.root.findByProps({ onPress: expect.any(Function) }).props.onPress();
    const tree = component.toJSON();
    
    expect(tree).toMatchSnapshot();
  });
});
