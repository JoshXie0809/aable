import { Text, makeStyles } from "@fluentui/react-components";
import React from "react";

export const useCellStyles = makeStyles({
    cell: {
      whiteSpace: "nowrap", // 文字不換行
      overflow: "hidden",   // 隱藏超出部分
      textOverflow: "ellipsis", // 顯示省略號
      width: "calc(100%)",
      boxSizing: "border-box", // 包含 padding 在寬度內
      paddingLeft: "12px",
    },

    editCellParent: {
        position: "absolute",
        zIndex: .5,
        boxSizing: "border-box",
        border: "2px solid rgb(120, 190, 146)", // 較粗的綠色邊框 (例如使用翠綠色)
        outline: "none", // 移除瀏覽器預設的焦點外框
        background: "white",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
    },

    cellTextEllipsis: { // <-- 新增這個樣式名稱
      whiteSpace: "nowrap", // 文字不換行
      overflow: "hidden",   // 隱藏超出部分
      textOverflow: "ellipsis", // 顯示省略號
      width: "100%", // 確保 Text 佔滿父容器的寬度
      boxSizing: "border-box", // 包含 padding 在寬度內
    },

    overflowButton1: {
      position: "absolute",       // 絕對定位
      right: "-12px",               // 距離單元格右側 4px
      top: "0px",                 // 垂直居中
      transform: "translateY(-50%)", // 確保精確垂直居中
      zIndex: 0.5,                  // 確保按鈕在文字之上
      minWidth: "unset",          // Fluent UI 按鈕預設可能有最小寬度，移除它
      width: "24px",              // 按鈕寬度
      height: "24px",             // 按鈕高度
      padding: 0,                 // 移除內邊距
      color: "#333",              // 按鈕圖標顏色

      ":hover": {
        backgroundColor: "#c0c0c0",
      },
      display: "flex",            // 使按鈕內部圖標居中
      alignItems: "center",
      justifyContent: "center",
    },
})


type CellValueProps = {
  value: string;
  className: string;
};

export const CellValue = ({value, className}: CellValueProps) => {
  return(
    <Text wrap={false} size={400} align={"center"}
      className={className}>{value}</Text>
  )
}




  
  