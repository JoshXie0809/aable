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
} from '@fluentui/react-components';


import MonacoEditorBox from "../txteditor/MonacoEditorBox";
import { InfoLabel } from '@fluentui/react-components'; // 確保這是你在用的組件
import * as  monacoType from 'monaco-editor';


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

type EditingPanelDialogProps = {
  editPanelOpen: boolean;
  setEditPanelOpen: (open: boolean) => void;
  editingCell: {
    rowIndex: number;
    columnId: string;
    cellObject: { value: string };
  };

  monacoEditorValue: string;
  setMonacoEditorValue: (val: string) => void;
  handlePanelSave: (rowIndex: number, columnId: string, value: string) => void;
  handleEditorReady: (editor: monacoType.editor.IStandaloneCodeEditor, monaco: typeof monacoType) => void;
  editingPanelStyles?: { editingPanel?: string };
  cellstyles?: { overflowButton1?: string };

};



const EditingPanelDialog: React.FC<EditingPanelDialogProps> = ({
  editPanelOpen,
  setEditPanelOpen,
  editingCell,
  monacoEditorValue,
  setMonacoEditorValue,
  handlePanelSave,
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
                編輯
              </Tab>
              <Tab id="edit-panel-setting" value="setting">
                設定
              </Tab>
              <Tab id="edit-panel-other" value="other">
                其他
              </Tab>
            </TabList>
          </DialogTitle>

          <DialogContent style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              注意事項{' '}
              <InfoLabel info={'目前無法正常使用 Tab 縮排，請使用空白鍵。'} />
            </div>

            <Toolbar style={{ backgroundColor: 'rgba(216, 216, 216, 0.2)' }}>
              <Tooltip content="Save" relationship="label">
                <ToolbarButton
                  icon={<SaveEdit20Regular />}
                  onClick={() =>
                    handlePanelSave(editingCell.rowIndex, editingCell.columnId, monacoEditorValue)
                  }
                />
              </Tooltip>
              <Tooltip content="Save and Close" relationship="label">
                <ToolbarButton
                  icon={<SaveEdit20Filled />}
                  onClick={() => {
                    handlePanelSave(editingCell.rowIndex, editingCell.columnId, monacoEditorValue);
                    setMonacoEditorValue('');
                    setEditPanelOpen(false);
                  }}
                />
              </Tooltip>
            </Toolbar>

            <MonacoEditorBox
              value={monacoEditorValue}
              onChange={(newValue) => setMonacoEditorValue(newValue || '')}
              onEditorReady={handleEditorReady}
            />
          </DialogContent>

          <DialogActions>
            <Button
              appearance="secondary"
              onClick={() => {
                setMonacoEditorValue('');
                setEditPanelOpen(false);
              }}
            >
              關閉
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default EditingPanelDialog;
