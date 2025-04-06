import React, { useEffect, useRef, useState } from "react";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";

import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";

import { logEvent, LogLevel } from "../utils/logger";

const CodeSection = () => {
  const [cppValue, setCppValue] = useState(
    `#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello, C++!" << endl;\n  return 0;\n}`
  );
  const [javaValue, setJavaValue] = useState(
    `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, Java!");\n  }\n}`
  );
  const [pythonValue, setPythonValue] = useState(
    `print("Hello, Python!")\nfor i in range(5):\n    print(i)`
  );

  const languageOptions = {
    cpp: {
      name: "C++",
      extension: cpp(),
      value: cppValue,
    },
    java: {
      name: "Java",
      extension: java(),
      value: javaValue,
    },
    python: {
      name: "Python",
      extension: python(),
      value: pythonValue,
    },
  };

  const setters = {
    cpp: setCppValue,
    java: setJavaValue,
    python: setPythonValue,
  };

  const [language, setLanguage] = useState<keyof typeof languageOptions>("cpp");
  const [code, setCode] = useState(languageOptions["cpp"].value);
  const [responseUpdate, setResonseUpdate] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [testCaseInput, setTestCaseInput] = useState("");

  useEffect(() => {
    const pElement = document.getElementById("responseParagraph");
    if (pElement) {
      pElement.innerHTML = responseUpdate;
    }
  }, [responseUpdate]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value as keyof typeof languageOptions;
    setLanguage(lang);
    setCode(languageOptions[lang].value);
  };

  const getLanguageExtension = () => {
    switch (language) {
      case "cpp":
        return cpp();
      case "java":
        return java();
      case "python":
        return python();
      default:
        return cpp();
    }
  };

  const handleRunCode = async () => {
    try {
      const response = await fetch("http://127.0.0.1:3000/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language,
          code,
          input: testCaseInput,
        }),
      });
      logEvent(
        "Received response from server",
        { status: response.status },
        LogLevel.INFO
      );
      if (response) {
        const data = await response.json();

        setResonseUpdate(data.output);
        logEvent("Code executed successfully", { data }, LogLevel.INFO);
      } else {
        logEvent("Response was not OK", LogLevel.WARN);
      }
      // setResonseUpdate(stringifiedData);
    } catch (error) {
      logEvent("Code execution error", { error }, LogLevel.ERROR);
    }
  };

  const handleChangeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTestCaseInput(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // reset height
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  const handleSubmitCode = async () => {};
  return (
    <div className="h-screen w-full">
      <PanelGroup
        autoSaveId="editor-layout"
        direction="vertical"
        className="h-full w-full rounded-lg border"
      >
        <Panel defaultSize={60} minSize={20}>
          <div className="h-full w-full p-4">
            <div className="mb-2 flex gap-5">
              <select
                className="border rounded px-2 py-1"
                value={language}
                onChange={handleLanguageChange}
              >
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
              </select>
              <button
                onClick={handleRunCode}
                className="bg-blue-500 rounded-xl p-2 px-5"
              >
                Run
              </button>
              <button
                onClick={handleSubmitCode}
                className="bg-blue-500 rounded-xl p-2"
              >
                Submit
              </button>
            </div>

            <CodeMirror
              value={code}
              height="500px"
              extensions={[getLanguageExtension()]}
              onChange={(value) => {
                setters[language](value);
                setCode(value);
              }}
              theme="dark"
            />
          </div>
        </Panel>

        <PanelResizeHandle className="flex items-center justify-center bg-blue-600">
          <div className="z-10 flex h-6 w-4 items-center justify-center rounded-sm border bg-white shadow">
            <DragHandleDots2Icon className="h-4 w-4" />
          </div>
        </PanelResizeHandle>

        <Panel defaultSize={40} minSize={20}>
          <div className="flex items-center  flex-col  w-full h-full bg-[#191e2e] text-[#d0d1cb]">
            <h1 className="text-2xl font-bold ">Test Case</h1>
            <div className="  w-full h-20 flex gap-6">
              <label htmlFor="inputTestCase" className="font-bold">
                Enter:
              </label>
              <textarea
                id="inputTestCase"
                ref={textareaRef}
                name="inputTestCase"
                className="w-full resize bg-[#333333] p-3"
                onChange={handleChangeTextArea}
              />
            </div>
            {responseUpdate && (
              <div className="mt-4 p-4 bg-[#1e1e2f] rounded-lg text-left w-full text-white">
                <div className="mb-2">
                  <h3 className="text-lg font-semibold text-green-400">
                    Output:
                  </h3>
                  <pre className="bg-black text-white p-2 rounded mt-1 overflow-auto whitespace-pre-wrap">
                    {responseUpdate}
                  </pre>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-400">
                    Expected Output:
                  </h3>
                  <pre className="bg-black text-white p-2 rounded mt-1 overflow-auto whitespace-pre-wrap">
                    {/* TODO: Replace this with actual expected output */}
                    Your expected output here...
                  </pre>
                </div>
              </div>
            )}
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default CodeSection;
