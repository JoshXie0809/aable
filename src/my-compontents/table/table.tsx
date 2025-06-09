import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  makeStyles,
  mergeClasses,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogSurface,
  Tooltip,
} from "@fluentui/react-components";

import { InfoLabel, InfoLabelProps, Link } from "@fluentui/react-components";

import { SaveEdit20Regular, Settings20Regular, SaveEdit20Filled } from "@fluentui/react-icons";

import { useVirtualizer } from "@tanstack/react-virtual";
import { CellTypes, RowData, defaultSheet, useSheetStyles } from "./rowtype";
import { useCellStyles, CellValue } from "./CellValue";


import { tokens, Tab, TabList } from "@fluentui/react-components";
import type {
  SelectTabData,
  SelectTabEvent,
  TabValue,
} from "@fluentui/react-components";

import {
  Toolbar,
  ToolbarButton,
} from "@fluentui/react-components";

import MonacoEditorBox from "../txteditor/MonacoEditorBox";
import * as monacoType from 'monaco-editor';

import {
  AirplaneRegular,
  AirplaneFilled,
  AirplaneTakeOffRegular,
  AirplaneTakeOffFilled,
  TimeAndWeatherRegular,
  TimeAndWeatherFilled,
  bundleIcon,
} from "@fluentui/react-icons";
import EditingPanelDialog from "./EditingPanel";

const Airplane = bundleIcon(AirplaneFilled, AirplaneRegular);
const AirplaneTakeOff = bundleIcon(
  AirplaneTakeOffFilled,
  AirplaneTakeOffRegular
);
const TimeAndWeather = bundleIcon(TimeAndWeatherFilled, TimeAndWeatherRegular);


const useEditingPanelStyles = makeStyles({
  editingPanel: {
    width: "1000px",
    maxWidth: "none",
    gap: "16px", 
  }
})


export type EditingCell = {
  rowIndex: number;
  columnId: string;
  cellObject: CellTypes;
  top: number;
  left: number;
  width: number;
  height: number;
};

export type SetEditingCell = React.Dispatch<React.SetStateAction<EditingCell | null>>;


const FluentUITable: React.FC = () => {

  const [data, setData] = useState(defaultSheet);
  const styles = useSheetStyles();
  const cellstyles = useCellStyles();
  const editingPanelStyles = useEditingPanelStyles();

  function updateTable(
    rowIndex: number, 
    columnId: string, 
    newCellObj: CellTypes) 
  {

    setData((old) =>
      old.map((row, i) => {
        if (i !== rowIndex) return row;
        return {
          ...row,
          [columnId]: {
            ...row[columnId],
            ...newCellObj
          },
        };
      })
    );
  }

  const [hoveredCell, setHoveredCell] = 
    useState<{ rowIndex: number | null; colIndex: number | null }>({ rowIndex: null, colIndex: null });
  
  const [editingCell, setEditingCell] = useState<null | EditingCell>(null);

  const [editPanelOpen, setEditPanelOpen] = useState<boolean>(false);
  
  // Monaco Editor 內部的文本值
  const [monacoEditorValue, setMonacoEditorValue] = useState<string>('');
  const editorRef = useRef<monacoType.editor.IStandaloneCodeEditor | null>(null);
  const handleEditorReady = (
    editor: monacoType.editor.IStandaloneCodeEditor,
    monaco: typeof monacoType,
  ) => {
    editorRef.current = editor;
  }

  const parentRef = useRef<HTMLDivElement>(null);
  const columns = React.useMemo(() => {
    if (!data[0]) return [];

    const columnKeys = Object.keys(data[0]);

    return [
      {
        id: "_rowIndex",
        header: "",
        cell: (info: any): React.ReactNode => `R${info.row.index + 1}`,
      },
      ...columnKeys.map((key) => ({
        accessorKey: key,
        header: key,
        cell: (info: any) => {
          const rowIndex = info.row.index;
          const columnId = info.column.id;
          const cellObject: CellTypes = info.row.original[info.column.id] ?? null;

          return (
            <div
              tabIndex={0}
              onFocus={(e) => {
                const cellElement = (e.target as HTMLElement).parentElement;
                if (!cellElement) return;
                const rect = cellElement.getBoundingClientRect();
                const containerRect = parentRef.current?.getBoundingClientRect();
                if (!containerRect) return;

                setEditingCell({
                  rowIndex,
                  columnId,
                  cellObject,
                  top: rect.top - containerRect.top + parentRef.current!.scrollTop,
                  left: rect.left - containerRect.left + parentRef.current!.scrollLeft,
                  width: rect.width,
                  height: rect.height,
                });
              }}
              
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
              }}
            >
              <CellValue cellObj={cellObject} className={cellstyles.cellTextEllipsis} />
            </div>
          );
        },
      })),
    ];
  }, [data, cellstyles]);

  const table = useReactTable({ 
      data, 
      columns, 
      getCoreRowModel: getCoreRowModel(),
    });

  const rows = useMemo(() => {
    return table.getRowModel().rows
  }, [table, data]);




  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 5,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0;
  const paddingBottom =
    virtualRows.length > 0 ? rowVirtualizer.getTotalSize() - (virtualRows.at(-1)?.end ?? 0) : 0;

  const headers = table.getHeaderGroups()[0].headers;


   const handleScroll = React.useCallback(() => {
    // 只有當有儲存格正在編輯時才執行
    if (editingCell && parentRef.current) {
      // 找到正在編輯的儲存格的實際 DOM 元素
      // 這裡需要一種方式來重新獲取該儲存格的當前位置
      // 最可靠的方法是重新找到對應的 TableCell DOM 元素
      const cellSelector = `[data-row-index="${editingCell.rowIndex}"][data-column-id="${editingCell.columnId}"]`;
      const currentEditingCellElement = parentRef.current.querySelector(cellSelector);

      if (currentEditingCellElement) {
        const rect = currentEditingCellElement.getBoundingClientRect();
        const containerRect = parentRef.current.getBoundingClientRect();

        setEditingCell(prev => {
          if (!prev) return null; // 如果在滾動過程中編輯模式被關閉，則不更新

          return {
            ...prev,
            top: rect.top - containerRect.top + parentRef.current!.scrollTop,
            left: rect.left - containerRect.left + parentRef.current!.scrollLeft,
            width: rect.width, // 寬度可能也會因為虛擬化而變化，所以最好重新獲取
            height: rect.height, // 高度也一樣
          };
        });
      } else {
        // 如果滾動導致編輯中的儲存格被虛擬化移出 DOM，則關閉編輯模式
        setEditingCell(null);
      }
    }
  }, [editingCell]); // 依賴 editingCell，當它從 null 變為有值時，handleScroll 才會更新

  // 使用 useEffect 監聽滾動事件
  React.useEffect(() => {
    const parentElement = parentRef.current;
    if (parentElement) {
      parentElement.addEventListener('scroll', handleScroll);
      return () => {
        parentElement.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]); // 依賴 handleScroll 確保事件監聽器正確添加/移除



  
  return (
    <div
      style={{ overflowX: "auto", height: "100%", overflowY: "auto", position: "relative" }}
      ref={parentRef}
      onMouseLeave={() => setHoveredCell({ rowIndex: null, colIndex: null })}
    >      
      <Table style={{ position: "relative" }}>
        <TableHeader>
          <TableRow>
            {headers.map((header, i) => (
              <TableHeaderCell
                key={header.id}
                className={mergeClasses(
                  i === 0 ? styles.stickyHeader : styles.header,
                  hoveredCell.colIndex === i ? styles.hoveredColumnCell : "",
                  hoveredCell.rowIndex === -1 && hoveredCell.colIndex === i && i === 0
                    ? styles.hoveredStickyHeader
                    : ""
                )}
                onMouseEnter={() => setHoveredCell({ rowIndex: -1, colIndex: i })}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody style={{ position: "relative" }}>
          {paddingTop > 0 && (
            <TableRow style={{ height: `${paddingTop}px` }}>
              <TableCell colSpan={headers.length} style={{ padding: 0, border: "none", background: "transparent" }} />
            </TableRow>
          )}

          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index];
            const actualRowIndex = row.index;
            return (
              <TableRow
                key={row.id}
                className={mergeClasses(
                  styles.row,
                  hoveredCell.rowIndex === actualRowIndex ? styles.hoveredRowCell : ""
                )}
                onMouseEnter={() => setHoveredCell({ rowIndex: actualRowIndex, colIndex: -1 })}
              >
                {row.getVisibleCells().map((cell, i) => {
                  const actualColIndex = i;
                  const isStickyCell = actualColIndex === 0;
                  return (
                    <TableCell
                      key={cell.id}
                      data-row-index={actualRowIndex}
                      data-column-id={cell.column.id}
                      className={mergeClasses(
                        isStickyCell ? styles.stickyCell : styles.cell,
                        hoveredCell.rowIndex === actualRowIndex ? styles.hoveredRowCell : "",
                        hoveredCell.colIndex === actualColIndex ? styles.hoveredColumnCell : "",
                        hoveredCell.rowIndex === actualRowIndex && hoveredCell.colIndex === 0 && isStickyCell
                          ? styles.hoveredStickyCell
                          : ""
                      )}
                      onMouseEnter={() => setHoveredCell({ rowIndex: actualRowIndex, colIndex: actualColIndex })}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}

          {paddingBottom > 0 && (
            <TableRow style={{ height: `${paddingBottom}px` }}>
              <TableCell colSpan={headers.length} style={{ padding: 0, border: "none", background: "transparent" }} />
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* 懸浮輸入框 */}
      {editingCell && (
        <div 
            className={cellstyles.editCellParent}
            tabIndex={-1}
            style={{
              top: editingCell.top,
              left: editingCell.left,
              width: editingCell.width,
              height: editingCell.height,
            }}>

          <CellValue className={cellstyles.cell} cellObj={editingCell.cellObject}/>
          
          <EditingPanelDialog 
            editPanelOpen={editPanelOpen}
            setEditPanelOpen={setEditPanelOpen}

            editingCell={editingCell}
            setEditingCell={setEditingCell}

            updateTable={updateTable}
            
            monacoEditorValue={monacoEditorValue}
            setMonacoEditorValue={setMonacoEditorValue}
            
            handleEditorReady={handleEditorReady}
            editingPanelStyles={editingPanelStyles}
            cellstyles={cellstyles}

          />

        </div>


      )}
      
      

    </div>
  );
};

export default FluentUITable;