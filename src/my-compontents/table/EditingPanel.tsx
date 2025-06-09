import React from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Toolbar,
  ToolbarButton,
  Tooltip,
  TabList,
  Tab,
	Text,
} from '@fluentui/react-components';


import MonacoEditorBox from "../txteditor/MonacoEditorBox";
import { InfoLabel } from '@fluentui/react-components'; // 確保這是你在用的組件
import * as  monacoType from 'monaco-editor';
import { CellTypes } from './rowtype';
import { EditingCell, SetEditingCell } from './table';


import {
  SaveEdit20Regular,
	Settings20Regular,
	SaveEdit20Filled,
} from "@fluentui/react-icons";

import type {
  SelectTabData,
  SelectTabEvent,
  TabValue,
} from "@fluentui/react-components";


// 定義 handleCellValueChange
const handlePanelSave_EditPage = (
  editingCell: EditingCell,
  setEditingCell: SetEditingCell,
  newValue: string,
  setMonacoEditorValue: React.Dispatch<string>,
  updateTable: (rowIndex: number, columnID: string, newCellObj: CellTypes) => void,
) => {

  // 同步更新 Monaco Editor 的值，如果它正在編輯
  setMonacoEditorValue(newValue);

  if (editingCell?.cellObject.celltype === "text") {
    var newCellObj__text = {...editingCell?.cellObject};
    newCellObj__text.value = newValue;
    setEditingCell(prev => prev ? { ...prev, cellObject: newCellObj__text } : null);
    
    updateTable(
      editingCell.rowIndex, 
      editingCell.columnId, 
      newCellObj__text,
    );

  } else if(editingCell?.cellObject.celltype === "null") {
    var newCellObj__null = {...editingCell?.cellObject};
    // 還在想要不要清除
    // newCellObj__null.value = '';
    newCellObj__null.value = newValue;
    setEditingCell(prev => prev ? { ...prev, cellObject: newCellObj__null } : null);
    updateTable(
      editingCell.rowIndex, 
      editingCell.columnId, 
      newCellObj__null,
    );
  }
};



type EditingPanelDialogProps = {
  editPanelOpen: boolean;
  setEditPanelOpen: (open: boolean) => void;
  editingCell: EditingCell;
	setEditingCell: SetEditingCell;
  updateTable: (rowIndex: number, columnID: string, newCellObj: CellTypes) => void,

  monacoEditorValue: string;
  setMonacoEditorValue: (val: string) => void;
  handleEditorReady: (editor: monacoType.editor.IStandaloneCodeEditor, monaco: typeof monacoType) => void;
  editingPanelStyles?: { editingPanel?: string };
  cellstyles?: { overflowButton1?: string };

};



const EditingPanelDialog: React.FC<EditingPanelDialogProps> = ({
  editPanelOpen,
  setEditPanelOpen,
  editingCell,
  setEditingCell,
  updateTable,
	monacoEditorValue,
  setMonacoEditorValue,
  handleEditorReady,
  editingPanelStyles = {},
  cellstyles = {},
}) => {

    const [selectedValue, setSelectedValue] =
      React.useState<TabValue>("edit");

    const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
      setSelectedValue(data.value);
    };

  return (
    <Dialog open={editPanelOpen}>
      <DialogTrigger disableButtonEnhancement>
        <Button
          className={cellstyles.overflowButton1}
          appearance="subtle"
          onClick={() => {
            setEditPanelOpen(true);
            setMonacoEditorValue(`${editingCell.cellObject.value}`);
          }}
          icon={<Settings20Regular />}
        />
      </DialogTrigger>

      <DialogSurface className={editingPanelStyles.editingPanel}>
        <DialogBody>
          <DialogTitle>
            <TabList selectedValue={selectedValue} onTabSelect={onTabSelect}>
              <Tab id="edit-panel-edit" value="edit">
                內容
              </Tab>
              <Tab id="edit-panel-setting" value="setting">
                設定
              </Tab>
              <Tab id="edit-panel-other" value="other">
                其他
              </Tab>
            </TabList>
          </DialogTitle>

          <DialogContent style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            <div 
              style={{ 
              display: "flex",
              flexDirection: "column",
              height: "588px",
              overflow: 'auto',
              padding: "4px",
            }}>

              {
                selectedValue === "edit" && (
                  <>
                    <Toolbar style={{ backgroundColor: 'rgba(216, 216, 216, 0.2)', borderRadius: '4px', marginBottom: "16px" }}>
                      <Tooltip content="Save" relationship="label">
                        <ToolbarButton
                          icon={<SaveEdit20Regular />}
                          onClick={() =>
                            handlePanelSave_EditPage(editingCell, setEditingCell, monacoEditorValue, setMonacoEditorValue, updateTable)
                          }
                        />
                      </Tooltip>

                      <Tooltip content="Save and Close" relationship="label">
                        <ToolbarButton
                          icon={<SaveEdit20Filled />}
                          onClick={() => {
                            handlePanelSave_EditPage(editingCell, setEditingCell, monacoEditorValue, setMonacoEditorValue, updateTable)
                            setMonacoEditorValue('');
                            setEditPanelOpen(false);
                          }}
                        />
                      </Tooltip>
                    </Toolbar>
                    <div
                      style={{border: "2px solid #ccc", borderRadius: "8px", padding: "4px"}}
                    >
                      <MonacoEditorBox 
                        value={monacoEditorValue}
                        onChange={(nval) => setMonacoEditorValue(nval || "")}
                        onEditorReady={handleEditorReady}
                      />
                    </div>
                  </>
                )
              }

              {
                // selectedValue === "setting" &&
                // <Button onClick={() => {
                //   editingCell.cellObject.celltype === "text" 
                //   ? setEditingCell({...editingCell, cellObject: {...editingCell.cellObject, celltype: "null"}})
                //   : setEditingCell({...editingCell, cellObject: {...editingCell.cellObject, celltype: "text"}})
                // }}>
                //   {editingCell.cellObject.celltype}
                // </Button>
                  
              }

            </div>
          </DialogContent>

          <DialogActions>
            <Tooltip content={"請記得存檔"} relationship='label'>
                <Button
                  appearance="secondary"
                  onClick={() => {
                    setMonacoEditorValue('');
                    setEditPanelOpen(false);
                  }}
                >
                離開
              </Button>
            </Tooltip>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default EditingPanelDialog;
