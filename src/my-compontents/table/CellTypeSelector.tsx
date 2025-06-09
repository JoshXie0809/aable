import * as React from "react";
import { Select, useId, Tooltip } from "@fluentui/react-components";
import { BinRecycle20Regular, BookLetter20Filled, CodeBlock20Filled } from "@fluentui/react-icons";
import { usePanelStyles } from "../table/EditingPanel";
import { PossibleCellType } from "./rowtype";


interface CellTypeSelectorProps {
  selectedCellType: PossibleCellType,
  setSelectedCellType: React.Dispatch<PossibleCellType>,
}

const CellTypeSelector: React.FC<CellTypeSelectorProps> = ({
  selectedCellType,
  setSelectedCellType,
}) => {

  const styles = usePanelStyles();
  const editingCellType = useId("editor-setting-celltype");

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCellType = event.target.value as PossibleCellType;
    setSelectedCellType(newCellType);
  }

  return (
      <>
        
        {selectedCellType === "text" && <BookLetter20Filled />}
        {selectedCellType === "null" && <BinRecycle20Regular />}

        <Select id={editingCellType} 
          value={selectedCellType} 
          onChange={handleChange}
          appearance="underline"
        >
          <option value="null">Null</option>
          <option value="text">Text</option>
        </Select>
      </>
  );

}


export default CellTypeSelector;