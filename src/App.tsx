import { FluentProvider, webLightTheme, Text } from "@fluentui/react-components";
import  FluentUITable  from "./my-compontents/table/table"


function App() {

  return (
    <FluentProvider theme={webLightTheme}>
        <div style={{ 
          padding: "40px", 
          height: "1000px", 
          width: "100%",
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
