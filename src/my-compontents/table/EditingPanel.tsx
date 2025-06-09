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
  makeStyles,
  Input,
} from '@fluentui/react-components';


import MonacoEditorBox from "../txteditor/MonacoEditorBox";
import { InfoLabel } from '@fluentui/react-components'; // 確保這是你在用的組件
import * as  monacoType from 'monaco-editor';
import { CellTypes, PossibleCellType } from './rowtype';
import { EditingCell, SetEditingCell } from './table';

import {
  SaveEdit20Regular,
	Settings20Regular,
	SaveEdit20Filled,
  Tag20Filled,
} from "@fluentui/react-icons";
import type { InputProps } from "@fluentui/react-components";

import type {
  SelectTabData,
  SelectTabEvent,
  TabValue,
} from "@fluentui/react-components";
import CellTypeSelector from './CellTypeSelector';



export const usePanelStyles = makeStyles({
  toolbar: {
    backgroundColor: 'rgba(216, 216, 216, 0.2)', borderRadius: '4px', marginBottom: "16px",
  },

  editingPanelContent: {
    border: "2px solid #ccc", borderRadius: "8px", padding: "4px", height: "100%", overflow: "auto",
  },

  languageText: {
    ":hover": {
    cursor: "pointer"
  }

  },
    iconText: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  }
});


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
    let newCellObj__text = {...editingCell?.cellObject};
    newCellObj__text.value = newValue;
    setEditingCell(prev => prev ? { ...prev, cellObject: newCellObj__text } : null);
    
    updateTable(
      editingCell.rowIndex, 
      editingCell.columnId, 
      newCellObj__text,
    );

  } else if(editingCell?.cellObject.celltype === "null") {
    
    let newCellObj__null = {...editingCell?.cellObject};
    
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

const handlePanelSave_SettingPage = (
  editingCell: EditingCell,
  setEditingCell: SetEditingCell,
  selectedCellType: PossibleCellType,
  newUniqueName: string,
  updateTable: (rowIndex: number, columnID: string, newCellObj: CellTypes) => void,
) => {

  let newCellObj = {...editingCell?.cellObject};
  newCellObj.celltype = selectedCellType;
  newCellObj.cellUniqueName = newUniqueName;

  setEditingCell(prev => prev ? { ...prev, cellObject: newCellObj } : null);

  updateTable(
    editingCell.rowIndex, 
    editingCell.columnId, 
    newCellObj,
  );
}




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

  const styles = usePanelStyles();

  const [selectedTab, setSelectedTab] =
    React.useState<TabValue>("edit");
  const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    setSelectedTab(data.value);
  };

  const [selectedCellType, setSelectedCellType] = 
    React.useState<PossibleCellType>(editingCell.cellObject.celltype)

  const [newUniqueName, setNewUniqueName] = React.useState(editingCell.cellObject.cellUniqueName);
  const handleUniqueNameChange: InputProps["onChange"] = (event, data) => {
    // 需要寫一個驗證 UniqueName 的機制
    setNewUniqueName(data.value)
  }

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
            <TabList selectedValue={selectedTab} onTabSelect={onTabSelect}>
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
                selectedTab === "edit" && (
                  <>
                    <Toolbar className={styles.toolbar}>
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
                      className={styles.editingPanelContent}
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
                selectedTab === "setting" && (
                  <>
                    <Toolbar className={styles.toolbar}>
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
                            handlePanelSave_EditPage(editingCell, setEditingCell, monacoEditorValue, setMonacoEditorValue, updateTable);
                            handlePanelSave_SettingPage(editingCell, setEditingCell, selectedCellType, newUniqueName, updateTable);
                            setMonacoEditorValue('');
                            setEditPanelOpen(false);
                          }}
                        />
                      </Tooltip>
                    </Toolbar>

                    <div className={styles.editingPanelContent} >


                      <div style={{ padding: "16px", paddingLeft: "24px", display: "flex", alignItems: "center", alignContent: "center", gap: "16px"}}> 
                        <CellTypeSelector selectedCellType={selectedCellType} setSelectedCellType={setSelectedCellType} />
                        <Text>
                          單元格型態設定
                        </Text>
                      </div>

                      <div style={{ padding: "16px", paddingLeft: "24px", display: "flex", alignItems: "center", alignContent: "center", gap: "16px"}}> 
                        <Tag20Filled />
                        <Input appearance="underline" value={newUniqueName} onChange={handleUniqueNameChange} />
                        <Text>
                          單元格別名設定
                        </Text>
                      </div>


                    </div>

                  </>
                )

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
