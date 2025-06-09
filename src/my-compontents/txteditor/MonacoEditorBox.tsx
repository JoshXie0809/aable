import React from 'react';
import { Editor, OnMount } from '@monaco-editor/react';
import * as monacoType from 'monaco-editor';
import { Text, makeStyles, Tooltip, Toolbar } from '@fluentui/react-components';
import { CodeBlockFilled } from "@fluentui/react-icons";
import LanguageSelector from './LanguageSelector';
import { EditingCell, SetEditingCell } from '../table/table';



interface MonacoEditorBoxProps {
  value: string;
  onChange: (value: string) => void;

  editingCell: EditingCell,
  setEditingCell: SetEditingCell,

  height?: string;
  width?: string;
  onEditorReady?: (editor: monacoType.editor.IStandaloneCodeEditor, monaco: typeof monacoType) => void;
};


const MonacoEditorBox: React.FC<MonacoEditorBoxProps> = ({
  value,
  onChange,

  editingCell,
  setEditingCell,

  height = "480px",
  width = "100%",
  onEditorReady,
}) => {

  const editorRef = React.useRef<null | monacoType.editor.IStandaloneCodeEditor>(null);

  const [languageId, setLanguageId] = React.useState<string>(
    editingCell.cellObject.editorLanguage === "" ? "plaintext" : editingCell.cellObject.editorLanguage
  );

  
  const handleEditorMount: OnMount = (editor, monaco) => {
    // 設定外層的 ref
    if(onEditorReady) 
      onEditorReady(editor, monaco);

    // EditorBox 要用的 ref
    editorRef.current = editor;
  }

  return(
    <div style={{
      display: "flex",
      flexDirection: "column",
    }}>
      <Editor
        height={height}
        width={width}
        language={languageId}
        value={value}
        onChange={(newValue) => onChange(newValue || '')}
        onMount={handleEditorMount}
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          renderWhitespace: "all",
          useTabStops: true,
          insertSpaces: true,
          autoClosingBrackets: 'always',
          autoClosingQuotes: 'always',
          formatOnPaste: true,
          formatOnType: true,
        }}
      />

      <Toolbar>
        <LanguageSelector 
            languageId={languageId}
            setLanguageId={setLanguageId}
            editorRef={editorRef}
            editingCell={editingCell}
            setEditingCell={setEditingCell}
          />
      </Toolbar>
    </div>
  )
}

export default MonacoEditorBox;