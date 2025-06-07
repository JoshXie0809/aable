import { makeStyles  } from "@fluentui/react-components";

export type CellValue = {
  value: string;
}

export type RowData = {
  [colkey: string]: CellValue;
}

const rows: number[] = Array.from({ length: 500 }, (_, i) => i + 1);
const cols: number[] = Array.from({ length: 30 }, (_, i) => i + 1);

export const defaultSheet: RowData[] = rows.map(r => {
  // 產生 [ [C1, ...], ... ] 的 key-value pair 陣列
  const row: RowData = Object.fromEntries(
    cols.map(c => [`C${c}`, { value: (r + c) % 29 !== 0 ? `` : "123" }])
  );
  return row;
});

const sheetCellWidth = "108px";
const sheetCellHeight = "40px";

export const useSheetStyles = makeStyles({
  cell: {
    border: "1px solid #e0e0e0",
    width: sheetCellWidth,
    height: sheetCellHeight,
    padding: "0 8px",
    boxSizing: "border-box",
    
    ":hover": {
      backgroundColor: "#e6f7ff",
    },
  },
  header: {
    border: "1px solid #e0e0e0",
    background: "#f6f6f6",
    color: "#222",
    fontWeight: 600,
    position: "sticky",
    width: sheetCellWidth,
    height: sheetCellHeight,
    top: "-4px",
    zIndex: 2,
  },
  stickyHeader: {
    position: "sticky",
    left: 0,
    top: "-4px",
    zIndex: 3,
    background: "#ebebeb",
    border: "1px solid #e0e0e0",
    fontWeight: 700,
    width: sheetCellWidth,
    height: sheetCellHeight,
  },
  stickyCell: {
    position: "sticky",
    left: 0,
    zIndex: 1,
    background: "#f6f6f6",
    border: "1px solid #e0e0e0",
    fontWeight: 600,
    width: sheetCellWidth,
    height: sheetCellHeight,
    padding: "0 8px",
    boxSizing: "border-box",
  },

  row: {
    ":hover": {
      backgroundColor: "inherit",
    }
  },
  // 新增的 hover 樣式
  hoveredRowCell: {
    backgroundColor: "white", // 行懸停顏色
  },
  hoveredColumnCell: {
    backgroundColor: "white", // 列懸停顏色
  },
  // 特殊情況：懸停在 stickyCell (左側欄) 時，它應該也有 hover 效果
  hoveredStickyCell: {
    backgroundColor: "white", // stickyCell 懸停時的顏色，可以和普通 cell 區分
  },
  // 特殊情況：懸停在 stickyHeader (左上角) 時
  hoveredStickyHeader: {
    backgroundColor: "white", // stickyHeader 懸停時的顏色
  },
});