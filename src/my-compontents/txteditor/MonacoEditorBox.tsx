import React from 'react';
import { Editor, OnMount } from '@monaco-editor/react';
import * as monacoType from 'monaco-editor';
import { Text, makeStyles, Tooltip, Toolbar } from '@fluentui/react-components';
import { CodeBlockFilled } from "@fluentui/react-icons";
import LanguageSelector from './LanguageSelector';



interface MonacoEditorBoxProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
  width?: string;
  onEditorReady?: (editor: monacoType.editor.IStandaloneCodeEditor, monaco: typeof monacoType) => void;
};


const MonacoEditorBox: React.FC<MonacoEditorBoxProps> = ({
  value,
  onChange,
  language = "plaintxt",
  height = "450px",
  width = "100%",
  onEditorReady,
}) => {

  const editorRef = React.useRef<null | monacoType.editor.IStandaloneCodeEditor>(null);
  const [languageId, setLanguageId] = React.useState<string>("");
  

  const handleEditorMount: OnMount = (editor, monaco) => {
    // 設定外層的 ref
    if(onEditorReady) 
      onEditorReady(editor, monaco);

    // EditorBox 要用的 ref
    editorRef.current = editor;
    const lang = editor.getModel()?.getLanguageId() ?? "";
    setLanguageId(lang);
  }

  return(
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '4px',
      overflow: 'hidden',
      display: "flex",
      flexDirection: "column",
      gap: "4px",
      padding: "4px",
    }}>
      <Editor
        height={height}
        width={width}
        language={language}
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
        />
      </Toolbar>
      

    </div>
  )
}

export default MonacoEditorBox;