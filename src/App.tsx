import { FluentProvider, webLightTheme, Text } from "@fluentui/react-components";
import  FluentUITable  from "./my-compontents/table/table"
import DraggableEditingPanel from "./my-compontents/txteditor/woking";

function App() {

  return (
    <FluentProvider theme={webLightTheme}>
        <div style={{ 
          padding: "40px", 
          height: "1000px", 
          display: "flex",
          flexDirection: "column",
          gap: 24,
          // backgroundColor: "yellow"
        }}>

          <Text size={500}>Hello world</Text>
          <div>
            <DraggableEditingPanel />
          </div>
          
          {/* <FluentUITable /> */}

        </div>
    </FluentProvider>
  );

}

export default App;
