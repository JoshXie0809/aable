import { getQuickJS } from "quickjs-emscripten"
import { Text

 } from "@fluentui/react-components"
import React from "react"

async function main(name: string) {
  
  // get quick js runtime
  const QuickJS = await getQuickJS()
  const vm = QuickJS.newContext()

  // 註冊變數
  const world = vm.newString(name)
  // 註冊指標
  vm.setProp(vm.global, "NAME", world)
  // world, NAME 都指向同一個值
  // smartPointer 所以我們丟掉自己的 pointer
  // 這樣 QJS 可以自動管理跟丟棄
  world.dispose()

  const result = vm.evalCode(
    `let num = 0;
    for(let i = 0; i <= 100; i++) {
      num += i;
    };
    const obj = {str: "Hello " + NAME + ", " + "from QuickJS.", num};
    obj`
  );
  var returnStr = ""

  // evalCode
  // return 2 possible result
  // 1. success -> return value
  // 2. error   -> return error

  // 所以需要錯誤處理
  if (result.error) {  
    const dumpValue = vm.dump(result.error);
    returnStr += JSON.stringify(dumpValue);    

    // 我們需要負責處理回傳值得 free
    result.error.dispose();

  } else {
    const dumpValue = vm.dump(result.value);
    returnStr += JSON.stringify(dumpValue);
    // 我們需要負責處理回傳值得 free
    result.value.dispose()
  }

  // 虛擬機 free
  vm.dispose()
  return returnStr;
}

interface QuickJSRunProps {
  greetName: string
}

const QuickJSRun: React.FC<QuickJSRunProps> = ({greetName}) =>{
  const [quickJSReturn, setQuickJSReturn] = React.useState("Loading...");
  const [inputString, setInputString] = React.useState("");


  React.useEffect(() => {
    async function fetchResult() {
      try {
        const result = await main(inputString);
        setQuickJSReturn(result);
      } catch(err) {
        console.error("Error running QuickJS:", err);
        setQuickJSReturn("Error loading content.");
      }
    }

    fetchResult()
  }, [inputString])

  return(
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <Text size={400}>
        QuickJS Runtime
      </Text>

      <div>
        <textarea 
          value={inputString} 
          onChange={(e) => setInputString(e.target.value)}>
        </textarea>
      </div>

      <pre>
        {`${quickJSReturn}`}
      </pre>
    </div>
    
  )
} 


export default  QuickJSRun;