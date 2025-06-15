export const splitBoilerplate = (
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
    beforeStart,
    middle,
    afterEnd,
  };
};
export const generateNewCode = async (
  boilerplate: string,
  code: string,
  language: string
) => {
  try {
    if (language === "python") {
      const { beforeStart, middle, afterEnd } = splitBoilerplate(
        boilerplate,
        "#-----------startofcode--------------------",
        "#-----------endofcode--------------------"
      );

      const newCode = beforeStart + code + afterEnd;
      return newCode;
    } else {
      const { beforeStart, middle, afterEnd } = splitBoilerplate(
        boilerplate,
        "//-----------startofcode--------------------",
        "//-----------endofcode--------------------"
      );

      const newCode = beforeStart + code + afterEnd;
      return newCode;
    }
  } catch (error) {
    throw error;
  }
};

export const runCode = async ({
  language,
  newCode,
  testCaseInput,
  SelectedProblem,
}: {
  language: string;
  newCode: string;
  testCaseInput: string;
  SelectedProblem: number;
}) => {
  const RunAPI =
    SelectedProblem === 0
      ? `${import.meta.env.VITE_API_URL}/docker/editor/run`
      : `${import.meta.env.VITE_API_URL}/docker/run`;

  const response = await fetch(RunAPI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      language,
      code: newCode,
      input: testCaseInput,
      SelectedProblem,
    }),
  });

  return response;
};
// utils/codeEditUtils.ts

type SubmitCodeParams = {
  language: string;
  newCode: string;
  testCaseInput: string;
  SelectedProblem: number;
};

export const submitCode = async ({
  language,
  newCode,
  testCaseInput,
  SelectedProblem,
}: SubmitCodeParams): Promise<Response> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/docker/submit`,
      {
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
      }
    );

    return response;
  } catch (error) {
    console.error("Error in submitCode:", error);
    throw error;
  }
};
