import * as React from "react";
import { Select, useId, Tooltip, makeStyles } from "@fluentui/react-components";
import { editor } from 'monaco-editor'; // <-- 更改這裡
import { CodeBlock20Filled } from "@fluentui/react-icons";


interface LanguageSelectorProps {
  languageId: string,
  setLanguageId: React.Dispatch<React.SetStateAction<string>>
  editorRef: React.MutableRefObject<editor.IStandaloneCodeEditor | null>;
}

const useStyles = makeStyles({
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

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  editorRef,
  languageId,
  setLanguageId,
}) => {

  const styles = useStyles();
  const editorId = useId("editor-language");

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  const newLanguageId = event.target.value;
  setLanguageId(newLanguageId);
  // 確保 editorRef.current 存在，並更新編輯器的語言
  if (editorRef.current) {
  editor.setModelLanguage(editorRef.current.getModel()!, newLanguageId);
  }
};

return (
  <Tooltip content="切換語言" relationship='label'>
    <div className={styles.iconText}>
      <CodeBlock20Filled />
      <Select id={editorId} 
        value={languageId} 
        onChange={handleChange}
        appearance="underline"
      >
        <option value="plaintext">Plain Text</option>
        <option value="javascript">JavaScript</option>
        <option value="typescript">TypeScript</option>
        <option value="json">JSON</option>
        <option value="html">HTML</option>
        <option value="css">CSS</option>
        <option value="scss">SCSS</option>
        <option value="less">Less</option>
        <option value="python">Python</option>
        <option value="sql">SQL</option>
        <option value="r">R</option>
        <option value="julia">Julia</option>
        <option value="java">Java</option>
        <option value="csharp">C#</option>
        <option value="shell">Shell</option>
        <option value="markdown">Markdown</option>
        <option value="yaml">YAML</option>
      </Select>
    </div>
</Tooltip>
);
};




export default LanguageSelector;