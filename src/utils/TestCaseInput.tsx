import React, { useRef, useState } from "react";

const TestCaseInput = () => {
  const [testCaseInput, setTestCaseInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const handleChangeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTestCaseInput(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "4px"; // reset height
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };
  return (
    <div>
      <label htmlFor="inputTestCase" className="font-bold">
        Enter:
      </label>
      <textarea
        id="inputTestCase"
        ref={textareaRef}
        name="inputTestCase"
        className="w-full h-[10px] mr-4 resize bg-[#333333] p-2"
        onChange={handleChangeTextArea}
      />
    </div>
  );
};

export default TestCaseInput;
