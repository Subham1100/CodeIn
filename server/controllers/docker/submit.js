import fs from "fs";
import path from "path";
import { exec } from "child_process";
import os from "os";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function handleSubmit(req, res) {
  const { code, language, input = "", SelectedProblem } = req.body;
  if (!SelectedProblem) {
    return res.status(400).json({ output: "no problem selected." });
  }
  const fileNames = {
    cpp: "main.cpp",
    java: "Main.java",
    python: "main.py",
  };

  const fileName = fileNames[language];
  const tempDir = path.join(os.tmpdir(), "whiteboard-runner");
  const filePath = path.join(tempDir, fileName);

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  fs.writeFileSync(filePath, code);

  let dockerCommand = "";

  if (language === "cpp") {
    const solutionPath = path.resolve(
      __dirname,
      `../../../problemQuestion/${SelectedProblem}/solution/${language}.txt`
    );
    const testCasePath = path.resolve(
      __dirname,
      `../../../problemQuestion/${SelectedProblem}/test_case.txt`
    );

    const destinationSolutionPath = path.join(tempDir, "solution.cpp");
    const destinationTestCasePath = path.join(tempDir, "test_case.txt");

    fs.copyFileSync(solutionPath, destinationSolutionPath);
    fs.copyFileSync(testCasePath, destinationTestCasePath);

    dockerCommand = `docker run --rm -v ${tempDir}:/app code-runner-image bash -c "\
          g++ -std=c++20 /app/main.cpp -o /app/main && \
          g++ -std=c++20 /app/solution.cpp -o /app/user_sol && \
         /app/main < /app/test_case.txt  > /app/main_output.txt && \
          /app/user_sol < /app/test_case.txt > /app/user_output.txt && \
          cat /app/main_output.txt && echo '---SPLIT---' && cat /app/user_output.txt"`;
  } else if (language === "java") {
    const solutionPath = path.resolve(
      __dirname,
      `../../../problemQuestion/${SelectedProblem}/solution/${language}.txt`
    );
    const testCasePath = path.resolve(
      __dirname,
      `../../../problemQuestion/${SelectedProblem}/test_case.txt`
    );

    const destinationSolutionPath = path.join(tempDir, "Solution.java");
    const destinationTestCasePath = path.join(tempDir, "test_case.txt");

    fs.copyFileSync(solutionPath, destinationSolutionPath);
    fs.copyFileSync(testCasePath, destinationTestCasePath);

    dockerCommand = `docker run --rm -v ${tempDir}:/app code-runner-image bash -c "\
        javac /app/Main.java && \
        javac /app/Solution.java && \
        java -cp /app Main < /app/test_case.txt > /app/main_output.txt && \
        java -cp /app Solution < /app/test_case.txt > /app/user_output.txt && \
        cat /app/main_output.txt && echo '---SPLIT---' && cat /app/user_output.txt"`;
  } else if (language === "python") {
    const solutionPath = path.resolve(
      __dirname,
      `../../../problemQuestion/${SelectedProblem}/solution/${language}.txt`
    );
    const testCasePath = path.resolve(
      __dirname,
      `../../../problemQuestion/${SelectedProblem}/test_case.txt`
    );

    const destinationSolutionPath = path.join(tempDir, "solution.py");
    const destinationTestCasePath = path.join(tempDir, "test_case.txt");

    fs.copyFileSync(solutionPath, destinationSolutionPath);
    fs.copyFileSync(testCasePath, destinationTestCasePath);

    dockerCommand = `docker run --rm -v ${tempDir}:/app code-runner-image bash -c "\
        python3 /app/main.py < /app/test_case.txt > /app/main_output.txt && \
        python3 /app/solution.py < /app/test_case.txt > /app/user_output.txt && \
        cat /app/main_output.txt && echo '---SPLIT---' && cat /app/user_output.txt"`;
  } else {
    return res.status(400).json({ output: "Unsupported language." });
  }

  exec(dockerCommand, (err, stdout, stderr) => {
    if (err) {
      return res.json({ output: stderr || err.message });
    }

    res.json({ output: stdout });
  });
}

export { handleSubmit };
