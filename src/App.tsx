import { FluentProvider, webLightTheme, Text } from "@fluentui/react-components";
import  FluentUITable  from "./my-compontents/table/table"
// import QuickJSRun  from "./my-compontents/qjs/working";

function App() {

  return (
    <FluentProvider theme={webLightTheme}>
        <div style={{ 
          padding: "40px", 
          height: "1000px", 
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}>

          <Text size={500}>Hello world</Text>

          <FluentUITable />

        </div>
    </FluentProvider>
  );

}

export default App;
