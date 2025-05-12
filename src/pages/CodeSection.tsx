import React, { useEffect, useRef, useState } from "react";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";

import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";

import axios from "axios";
import { logEvent, LogLevel } from "../utils/logger";
type AccessOptions = {
  whiteboard: boolean;
  codeEditor: boolean;
  codeEditorOptions: boolean;
};
import { useSocket } from "../hooks/socketContext";
import { useParams } from "react-router-dom";

const CodeSection = () => {
  const socket = useSocket();
  const { roomId } = useParams();
  const [cppValue, setCppValue] = useState(
    `#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello, C++!" << endl;\n  return 0;\n}`
  );
  const [javaValue, setJavaValue] = useState(
    `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, Java!");\n  }\n}`
  );
  const [pythonValue, setPythonValue] = useState(
    `print("Hello, Python!")\nfor i in range(5):\n    print(i)`
  );
  const [accessData, setAccessData] = useState<AccessOptions>({
    whiteboard: false,
    codeEditor: false,
    codeEditorOptions: false,
  });
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
  const [responseUpdate, setResponseUpdate] = useState("");
  const [expectedResponseUpdate, setExpectedResponseUpdate] = useState("");

  const [testCaseInput, setTestCaseInput] = useState("");
  const [SelectedProblem, setSelectedProblem] = useState(0);
  const [IsSubumit, setISsubmit] = useState(false);
  const [codeError, setCodeError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value as keyof typeof languageOptions;
    setLanguage(lang);
    setCode(languageOptions[lang].value);
    socket.emit("code-changed", languageOptions[lang].value);
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

  const loadBoilerplate = async (filename: string): Promise<string> => {
    const response = await fetch(`../../temp/${SelectedProblem}/${filename}`);
    return await response.text();
  };

  const splitBoilerplate = (
    boilerplate: string,
    startMarker: string,
    endMarker: string
  ) => {
    const startIdx = boilerplate.indexOf(startMarker);
    const endIdx = boilerplate.indexOf(endMarker) + endMarker.length;

    if (startIdx === -1 || endIdx === -1) {
      throw new Error("Start or end marker not found in the boilerplate.");
    }

    const beforeStart = boilerplate.slice(0, startIdx);
    const middle = boilerplate.slice(startIdx, endIdx);
    const afterEnd = boilerplate.slice(endIdx);

    return {
      beforeStart, // code before startMarker
      middle, // code between and including startMarker & endMarker
      afterEnd, // code after endMarker
    };
  };

  const generateNewCode = async () => {
    try {
      const [boilerplateUser1] = await Promise.all([
        loadBoilerplate("solutionCpp.txt"),
      ]);

      const { beforeStart, middle, afterEnd } = splitBoilerplate(
        boilerplateUser1,
        "//-----------startofcode--------------------",
        "//-----------endofcode--------------------"
      );
      const newCode = beforeStart + code + afterEnd;
      return newCode;
    } catch (error) {
      logEvent("Error generating new code", error, LogLevel.ERROR);
      throw error;
    }
  };
  const handleRunCode = async () => {
    try {
      const RunAPI =
        SelectedProblem === 0
          ? "http://127.0.0.1:3000/docker/editor/run"
          : "http://127.0.0.1:3000/docker/run";

      const newCode = SelectedProblem == 0 ? code : await generateNewCode();

      const response = await fetch(RunAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language,
          code: newCode,
          input: testCaseInput,
          SelectedProblem: SelectedProblem,
        }),
      });
      logEvent(
        "Received response from server",
        { status: response.status },
        LogLevel.INFO
      );

      const data = await response.json();
      if (data.ok) {
        if (SelectedProblem === 0) {
          setExpectedResponseUpdate(data.output);
          const socketData = {
            expectedResponseUpdate: data.output,
            responseUpdate: "",
          };

          socket.emit("code-response-changed", socketData);
          logEvent("Code executed successfully", { data }, LogLevel.INFO);
        } else {
          const [userOutput, expectedOutput] = data.output.split("---SPLIT---");

          setExpectedResponseUpdate(expectedOutput.trim());
          setResponseUpdate(userOutput.trim());
          const socketData = {
            expectedResponseUpdate: expectedOutput.trim(),
            responseUpdate: userOutput.trim(),
          };

          socket.emit("code-response-changed", socketData);
          logEvent("Code executed successfully", { data }, LogLevel.INFO);
        }
      } else {
        const [beforeWarning, afterWarning] =
          data.output.split(":\n/app/main.cpp:");
        const [beforeTerminate, afterTerminate] =
          afterWarning.split("terminate");
        setCodeError(beforeTerminate);
        logEvent("Response was not OK", LogLevel.WARN);
      }
      // setResonseUpdate(stringifiedData);
    } catch (error) {
      console.log(error);

      logEvent("Code execution error", { error }, LogLevel.ERROR);
    }
    setISsubmit(false);
  };

  const handleChangeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTestCaseInput("1 " + e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // reset height
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };
  const data = {
    boilerplateUser: {
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {\n \n}`,
      java: `public int[] twoSum(int[] nums, int target) {\n\n}`,
      python: `def twoSum(self, nums: List[int], target: int) -> List[int]:\n\n`,
    },
  };

  const handleResetButton = () => {
    if (SelectedProblem == 0) {
      const languageData = {
        cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello, C++!" << endl;\n  return 0;\n}`,
        java: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, Java!");\n  }\n}`,
        python: `print("Hello, Python!")\nfor i in range(5):\n    print(i)`,
      };
      if (language === "cpp") {
        setCode(languageData.cpp);
        socket.emit("code-changed", languageData.cpp);
      } else if (language === "java") {
        setCode(languageData.java);
        socket.emit("code-changed", languageData.java);
      } else if (language === "python") {
        setCode(languageData.python);
        socket.emit("code-changed", languageData.python);
      }
    } else {
      setCode(data.boilerplateUser[language]);
      socket.emit("code-changed", data.boilerplateUser[language]);
    }

    setISsubmit(false);
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = parseInt(e.target.value);
    if (selected === 0) {
      setCode(languageOptions[language].value); // Reset code to the default value for the selected language
      socket.emit("code-changed", languageOptions[language].value);
    } else {
      setCode(data.boilerplateUser[language]); // Set the appropriate boilerplate code based on the problem
      socket.emit("code-changed", data.boilerplateUser[language]);
    }
    setSelectedProblem(selected);
  };

  const handleSubmitCode = async () => {
    try {
      const newCode = await generateNewCode();

      const response = await fetch("http://127.0.0.1:3000/docker/sumbit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language,
          code: newCode,
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

        const [expectedOutput, userOutput] = data.output.split("---SPLIT---");

        setExpectedResponseUpdate(expectedOutput.trim());
        setResponseUpdate(userOutput.trim());
        const socketData = {
          expectedResponseUpdate: expectedOutput.trim(),
          responseUpdate: userOutput.trim(),
        };
        socket.emit("code-response-changed", socketData);
        setISsubmit(true);
        logEvent("Code executed successfully", { data }, LogLevel.INFO);
      } else {
        logEvent("Response was not OK", LogLevel.WARN);
      }
      // setResonseUpdate(stringifiedData);
    } catch (error) {
      logEvent("Code execution error", { error }, LogLevel.ERROR);
    }
  };

  useEffect(() => {
    const updateOptions = async () => {
      const token = localStorage.getItem("token");
      const authenticationHeader = {
        Authorization: token,
      };
      try {
        const response = await axios.get(
          `http://localhost:3000/database/api/room/get-permission`,
          {
            params: {
              roomId: roomId,
            },
            headers: authenticationHeader,
          }
        );
        setAccessData(response.data.permissions);
      } catch (error) {
        console.log(error);
      }
    };
    updateOptions();

    socket.on("access-updated", updateOptions);
  }, []);

  useEffect(() => {
    console.log(accessData);
  }, [accessData]);

  useEffect(() => {
    socket.on("code-updated", (response) => {
      setCode(response);
    });
    socket.on("code-response-updated", (response) => {
      setResponseUpdate(response.responseUpdate);
      setExpectedResponseUpdate(response.expectedResponseUpdate);
      console.log(response);
    });
  }, []);

  const handelCodeChange = (value: string) => {
    setters[language](value);
    setCode(value);
    socket.emit("code-changed", value);
  };

  const defaultCodes = {
    cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello, C++!" << endl;\n  return 0;\n}`,
    java: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, Java!");\n  }\n}`,
    python: `print("Hello, Python!")\nfor i in range(5):\n    print(i)`,
  };

  useEffect(() => {
    const sendRoomCode = async () => {
      const token = localStorage.getItem("token");
      const authenticationHeader = {
        Authorization: token,
      };
      try {
        const response = await axios.put(
          `http://localhost:3000/database/api/room/roomCode`,
          { roomId: roomId, roomCode: code },
          {
            headers: authenticationHeader,
          }
        );
        return response.data;
      } catch (error) {}
    };
    const isDefaultCode = Object.values(defaultCodes).includes(code);
    if (!isDefaultCode) sendRoomCode();
  }, [code]);

  useEffect(() => {
    const getRoomCode = async () => {
      const token = localStorage.getItem("token");
      const authenticationHeader = {
        Authorization: token,
      };
      try {
        const response = await axios.get(
          `http://localhost:3000/database/api/room/roomCode`,
          {
            params: {
              roomId: roomId,
            },
            headers: authenticationHeader,
          }
        );

        setCode(response.data.roomCode);
      } catch (error) {}
    };
    const getRoomOutput = async () => {
      const token = localStorage.getItem("token");
      const authenticationHeader = {
        Authorization: token,
      };
      try {
        const response = await axios.get(
          `http://localhost:3000/database/api/room/roomOutput`,
          {
            params: {
              roomId: roomId,
            },
            headers: authenticationHeader,
          }
        );
        setExpectedResponseUpdate(response.data.roomOutput);
      } catch (error) {}
    };
    getRoomOutput();
    getRoomCode();
  }, []);

  useEffect(() => {
    const sendRoomOutput = async () => {
      const token = localStorage.getItem("token");
      const authenticationHeader = {
        Authorization: token,
      };
      try {
        const response = await axios.put(
          `http://localhost:3000/database/api/room/roomOutput`,
          { roomId: roomId, roomOutput: expectedResponseUpdate },
          {
            headers: authenticationHeader,
          }
        );
        return response.data;
      } catch (error) {}
    };
    if (expectedResponseUpdate !== "") sendRoomOutput();
  }, [expectedResponseUpdate]);

  return (
    <div className="h-screen w-full">
      <PanelGroup
        autoSaveId="editor-layout"
        direction="vertical"
        className="h-full w-full rounded-lg border"
      >
        <Panel defaultSize={60} minSize={20} className="h-full overflow-scroll">
          <div className="h-full w-full p-4 overflow-scroll">
            <div className="mb-2 flex gap-5">
              <select
                className="border rounded px-2 py-1"
                value={language}
                onChange={handleLanguageChange}
                disabled={!accessData.codeEditorOptions}
              >
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
              </select>
              <button
                onClick={handleRunCode}
                className="bg-blue-500 rounded-xl p-2 px-5"
                disabled={!accessData.codeEditorOptions}
              >
                Run
              </button>
              <button
                onClick={handleSubmitCode}
                className="bg-blue-500 rounded-xl p-2"
                disabled={!accessData.codeEditorOptions}
              >
                Submit
              </button>
              <button
                onClick={handleResetButton}
                className="bg-blue-500 rounded-xl p-2"
                disabled={!accessData.codeEditorOptions}
              >
                Reset
              </button>

              <select
                onChange={handleQuestionChange}
                className="border rounded px-2 py-1 w-full"
                disabled={!accessData.codeEditorOptions}
              >
                <option value="" disabled>
                  ----- Select Leetcode Problem -----
                </option>
                <option value="0"> Back to Editor</option>
                <option value="1"> 1. Two Sum</option>
                <option value="2">2. Palindrome Number</option>
                <option value="3">3. Valid Parentheses</option>
                <option value="4">
                  4. Remove Duplicates from Sorted Array
                </option>
                <option value="4">
                  5. Find the Index of the First Occurrence in a String
                </option>
              </select>
            </div>

            <CodeMirror
              value={code}
              height="500px"
              extensions={[getLanguageExtension()]}
              onChange={handelCodeChange}
              theme="dark"
              readOnly={!accessData.codeEditor}
            />
          </div>
        </Panel>

        <PanelResizeHandle className="flex items-center justify-center bg-blue-600">
          <div className="z-10 flex h-6 w-4 items-center justify-center rounded-sm border bg-white shadow">
            <DragHandleDots2Icon className="h-4 w-4" />
          </div>
        </PanelResizeHandle>

        <Panel defaultSize={40} minSize={20} className="overflow-scroll">
          <div className="flex items-center  flex-col  w-full h-full bg-[#191e2e] text-[#d0d1cb] overflow-scroll">
            <h1 className="text-2xl font-bold ">Test Case</h1>
            <div className="  w-full h-20 flex gap-6">
              <label htmlFor="inputTestCase" className="font-bold">
                Input:
              </label>
              <textarea
                id="inputTestCase"
                ref={textareaRef}
                name="inputTestCase"
                className="w-full h-[40px] mr-4 resize bg-[#333333] p-2"
                onChange={handleChangeTextArea}
                disabled={!accessData.codeEditorOptions}
              />
            </div>
            {responseUpdate === expectedResponseUpdate &&
              responseUpdate !== "" && (
                <div className="text-[#00e636]">Sucess</div>
              )}
            {responseUpdate === expectedResponseUpdate && IsSubumit && (
              <div className="text-[#00e636]">All test case passed.</div>
            )}
            {responseUpdate !== expectedResponseUpdate &&
              responseUpdate !== "" && (
                <div className="text-[#a03112]">Error</div>
              )}
            {responseUpdate !== expectedResponseUpdate &&
              responseUpdate !== "" &&
              IsSubumit && <div>Test case Failed</div>}
            {responseUpdate && !IsSubumit && (
              <div className="mt-4 p-4 bg-[#1e1e2f] rounded-lg text-left w-full text-white h-full overflow-scroll">
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
                    {expectedResponseUpdate}
                  </pre>
                </div>
              </div>
            )}
            {codeError && (
              <div>
                <div className="text-[#a03112]">Error</div>
                <div>{codeError}</div>
              </div>
            )}
            {expectedResponseUpdate && responseUpdate === "" && (
              <div className="flex flex-col gap-3">
                <div className="text-[#00e636]">output</div>
                <div>{expectedResponseUpdate}</div>
              </div>
            )}
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default CodeSection;
