import React from 'react';
import { Editor, OnMount } from '@monaco-editor/react';
import * as monacoType from 'monaco-editor';
import { Text, makeStyles, Tooltip } from '@fluentui/react-components';

interface MonacoEditorBoxProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
  width?: string;
  onEditorReady?: (editor: monacoType.editor.IStandaloneCodeEditor, monaco: typeof monacoType) => void;
};

const useStyles = makeStyles({
  languageText: {
    ":hover": {
      cursor: "pointer"
    }
  },
});

const MonacoEditorBox: React.FC<MonacoEditorBoxProps> = ({
  value,
  onChange,
  language = "plaintxt",
  height = "300px",
  width = "100%",
  onEditorReady,
}) => {

  const editorRef = React.useRef<null | monacoType.editor.IStandaloneCodeEditor>(null);
  const [languageId, setLanguageId] = React.useState<string>("");
  const styles = useStyles();

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
      <div>
        <Tooltip content="切換語言" relationship='label'>
          <Text
            className={styles.languageText}
            size={300}
            color='black'
            onClick={() => {
              const model = editorRef.current?.getModel();
              if(model) {
                const l = languageId === "python" ? "plaintext" : "python";
                monacoType.editor.setModelLanguage(model, l);
                setLanguageId(l);
              }
            }}
          >{languageId}</Text>
        </Tooltip>
      </div>
      



    </div>
  )
}

export default MonacoEditorBox;