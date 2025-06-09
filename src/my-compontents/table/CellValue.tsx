import { Text, makeStyles } from "@fluentui/react-components";
import React from "react";
import { CellTypes } from "./rowtype";
import { BookLetter20Filled, Tag20Filled } from "@fluentui/react-icons"

export const useCellStyles = makeStyles({
    cell: {
      whiteSpace: "nowrap", // 文字不換行
      overflow: "hidden",   // 隱藏超出部分
      textOverflow: "ellipsis", // 顯示省略號
      width: "100%",
      boxSizing: "border-box", // 包含 padding 在寬度內
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
  cellObj: CellTypes;
  className: string;
};

export const CellValue: React.FC<CellValueProps> = ({cellObj, className}) => {
  var retValue = "";
  
  if( cellObj.celltype === "text") {
    if(cellObj.value.length > 6)
      retValue = cellObj.value.slice(0, 6) + "...";
    else
      retValue = cellObj.value;
    return(
        cellObj.cellUniqueName !== null ?
        <Text wrap={false} size={400} align={"center"} className={className} weight="semibold"
          style={{ display: "flex", alignItems: "center", justifyContent: "center"}}
        >
          <Tag20Filled />
          {`${cellObj.cellUniqueName}`}
        </Text>
        : <Text wrap={false} size={400} align={"center"} className={className} 
          style={{ display: "flex", alignItems: "center", justifyContent: "center"}}
        >
          <BookLetter20Filled />
          {`${retValue}`}
        </Text>
    )
  } 
  else  return(
    cellObj.cellUniqueName !== null ?

        <Text wrap={false} size={400} align={"center"} className={className} weight="semibold"
          style={{ display: "flex", alignItems: "center", justifyContent: "center"}}
        >
        <Tag20Filled />
        {cellObj.cellUniqueName}
      </Text>
    
    : <Text wrap={false} size={400} align={"center"} className={className}>
      {""}
    </Text>

  )
  

}





  
  