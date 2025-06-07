import * as React from "react";
import { Select, useId } from "@fluentui/react-components";
import type { SelectProps } from "@fluentui/react-components";

const MySelectComponent = (props: SelectProps) => {
  const selectId = useId("fruit-select");

  return (
    <>
      <label htmlFor={selectId}>Color</label>
      <Select id={selectId} {...props}>
        <option>Red</option>
        <option>Green</option>
        <option>Blue</option>
      </Select>
    </>
  );
};

export default MySelectComponent;