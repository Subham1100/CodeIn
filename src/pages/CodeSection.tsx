import React, { useEffect, useRef, useState } from "react";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";

import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";

import axios from "axios";
import { logEvent, LogLevel } from "../utils/logger";
import { generateNewCode, submitCode } from "../utils/codeEditUtils";
import { useSocket } from "../context/socketContext";
import { useParams } from "react-router-dom";
import { useRoom } from "../context/RoomContext";
import { runCode } from "../utils/codeEditUtils";
type AccessOptions = {
  whiteboard: boolean;
  codeEditor: boolean;
  codeEditorOptions: boolean;
};
type Language = "cpp" | "java" | "python";
type LanguageSol = "cppSol" | "javaSol" | "pythonSol";
type BoilerplateCode = {
  cpp: string;
  python: string;
  java: string;
  cppSol: string;
  javaSol: string;
  pythonSol: string;
  inputText: string;
};

const CodeSection = () => {
  const socket = useSocket();
  const { roomId } = useParams();
  const [accessData, setAccessData] = useState<AccessOptions>({
    whiteboard: false,
    codeEditor: false,
    codeEditorOptions: false,
  });

  const [language, setLanguage] = useState<Language>("cpp");
  const [languageSol, setLanguageSol] = useState<LanguageSol>("cppSol");
  const [boilerplateCode, setBoilerplateCode] =
    useState<BoilerplateCode | null>(null);
  const [code, setCode] = useState("");
  const [responseUpdate, setResponseUpdate] = useState("");
  const [expectedResponseUpdate, setExpectedResponseUpdate] = useState("");

  const [testCaseInput, setTestCaseInput] = useState("");
  const [SelectedProblem, setSelectedProblem] = useState(0);
  const [IsSubumit, setISsubmit] = useState(false);
  const [codeError, setCodeError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendRoomCode, getRoomCode, getRoomOutput, sendRoomOutput } =
    useRoom();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!boilerplateCode) return;
    const lang = e.target.value as Language;
    setLanguage(lang);

    socket.emit("code-changed", boilerplateCode[lang]);
  };
  useEffect(() => {
    if (!boilerplateCode) return;
    setLanguageSol(`${language}Sol`);
    setCode(boilerplateCode[language]);
  }, [language]);

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
    setExpectedResponseUpdate("");
    setResponseUpdate("");
    setCodeError("");

    if (!boilerplateCode) return;

    try {
      const newCode =
        SelectedProblem == 0
          ? code
          : await generateNewCode(boilerplateCode[languageSol], code, language);
      const response = await runCode({
        language,
        newCode,
        testCaseInput: "1 \n" + testCaseInput,
        SelectedProblem,
      });
      const data = await response.json();
      if (data.ok) {
        if (SelectedProblem === 0) {
          setExpectedResponseUpdate(data.output);
          const socketData = {
            expectedResponseUpdate: data.output,
            responseUpdate: "",
          };
          socket.emit("code-response-changed", socketData);
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
        setCodeError(data.output);

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
    setTestCaseInput(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // reset height
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  const fetchBoilerplates = async (SelectedProblem: number) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/get_boilerplate`,
        {
          params: { SelectedProblem },
        }
      );
      return response.data.data; // contains cpp, java, python code
    } catch (error) {
      console.error("Error fetching boilerplates:", error);
    }
  };
  useEffect(() => {
    const getBoilerplates = async () => {
      const code = await fetchBoilerplates(SelectedProblem);
      if (code) {
        setBoilerplateCode(code);
        if (!textareaRef.current) return;
        textareaRef.current.value = code?.inputText || "";
      }
      setCode(code[language]); // Set the appropriate boilerplate code based on the problem
      socket.emit("code-changed", code[language]);
    };
    getBoilerplates();
  }, [SelectedProblem]);

  const handleResetButton = () => {
    if (!language || !boilerplateCode) return;
    const selectedCode = boilerplateCode[language];
    socket.emit("code-changed", selectedCode);
    setISsubmit(false);
    setCodeError("");
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = parseInt(e.target.value);
    setSelectedProblem(selected);
  };

  const handleSubmitCode = async () => {
    setExpectedResponseUpdate("");
    setResponseUpdate("");
    if (!boilerplateCode) return;
    try {
      const newCode = await generateNewCode(
        boilerplateCode[languageSol],
        code,
        language
      );

      const response = await submitCode({
        language,
        newCode,
        testCaseInput,
        SelectedProblem,
      });
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
          `${import.meta.env.VITE_API_URL}/database/api/room/get-permission`,
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

  useEffect(() => {}, [accessData]);

  useEffect(() => {
    socket.on("code-updated", (response) => {
      setCode(response);
    });
    socket.on("code-response-updated", (response) => {
      setResponseUpdate(response.responseUpdate);
      setExpectedResponseUpdate(response.expectedResponseUpdate);
    });
  }, []);

  const handelCodeChange = (value: string) => {
    setCode(value);
    socket.emit("code-changed", value);
  };

  const defaultCodes = {
    cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello, C++!" << endl;\n  return 0;\n}`,
    java: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, Java!");\n  }\n}`,
    python: `print("Hello, Python!")\nfor i in range(5):\n    print(i)`,
  };

  useEffect(() => {
    if (!roomId) return;
    const isDefaultCode = Object.values(defaultCodes).includes(code);
    if (!isDefaultCode) {
      sendRoomCode(roomId, code);
    }
  }, [code]);

  useEffect(() => {
    const loadRoomDetails = async () => {
      if (!roomId) return;
      const responseRoomCode = await getRoomCode(roomId);
      if (responseRoomCode !== "") setCode(responseRoomCode);

      const responseRoomOutput = await getRoomOutput(roomId);
      setExpectedResponseUpdate(responseRoomOutput);
    };
    loadRoomDetails();
  }, []);

  useEffect(() => {
    if (!roomId) return;
    if (expectedResponseUpdate !== "")
      sendRoomOutput(roomId, expectedResponseUpdate);
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
                style={{
                  cursor: !accessData.codeEditor ? "not-allowed" : "auto",
                }}
              >
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
              </select>
              <button
                onClick={handleRunCode}
                className="bg-blue-500 rounded-xl p-2 px-5"
                disabled={!accessData.codeEditorOptions}
                style={{
                  cursor: !accessData.codeEditor ? "not-allowed" : "auto",
                }}
              >
                Run
              </button>
              <button
                onClick={handleSubmitCode}
                className="bg-blue-500 rounded-xl p-2"
                disabled={!accessData.codeEditorOptions}
                style={{
                  cursor: !accessData.codeEditor ? "not-allowed" : "auto",
                }}
              >
                Submit
              </button>
              <button
                onClick={handleResetButton}
                className="bg-blue-500 rounded-xl p-2"
                disabled={!accessData.codeEditorOptions}
                style={{
                  cursor: !accessData.codeEditor ? "not-allowed" : "auto",
                }}
              >
                Reset
              </button>

              <select
                onChange={handleQuestionChange}
                className="border rounded px-2 py-1 w-full"
                disabled={!accessData.codeEditorOptions}
                style={{
                  cursor: !accessData.codeEditor ? "not-allowed" : "auto",
                }}
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
                <option value="5">
                  5. Find the Index of the First Occurrence in a String
                </option>
              </select>
            </div>
            <div
              style={{
                cursor: !accessData.codeEditor ? "not-allowed" : "auto",
              }}
            >
              <CodeMirror
                value={code}
                height="500px"
                extensions={[getLanguageExtension()]}
                onChange={handelCodeChange}
                theme="dark"
                readOnly={!accessData.codeEditor}
              />
            </div>
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
                className="w-full  mr-4 resize bg-[#333333] h "
                onChange={handleChangeTextArea}
                disabled={!accessData.codeEditorOptions}
                style={{
                  cursor: !accessData.codeEditor ? "not-allowed" : "auto",
                }}
                defaultValue={
                  SelectedProblem === 0 ? "" : boilerplateCode?.inputText || ""
                }
              />
            </div>
            {responseUpdate === expectedResponseUpdate &&
              responseUpdate !== "" && (
                <div className="text-[#00e636] ">Sucess</div>
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
                  <pre className="bg-black text-white p-2 rounded mt-1 overflow-auto whitespace-pre-wrap min-h-10">
                    {expectedResponseUpdate}
                  </pre>
                </div>
              </div>
            )}
            {codeError && (
              <div>
                <div className="text-[#a03112]">Error</div>
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    color: "white",
                    fontSize: "0.875rem",
                  }}
                >
                  {codeError}
                </pre>
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
