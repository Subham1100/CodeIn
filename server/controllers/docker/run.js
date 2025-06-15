import fs from "fs";
import path from "path";
import { exec } from "child_process";
import os from "os";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function handleRun(req, res) {
  const { code, language, input = "", SelectedProblem = "0" } = req.body;

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
    const destinationPath = path.join(tempDir, "solution.cpp");
    fs.copyFileSync(solutionPath, destinationPath);

    dockerCommand = `docker run --rm -v ${tempDir}:/app code-runner-image bash -c "\
          g++ -std=c++20 /app/main.cpp -o /app/main && \
          g++ -std=c++20 /app/solution.cpp -o /app/user_sol && \
          echo '${input}' | /app/main > /app/main_output.txt && \
          echo '${input}' | /app/user_sol > /app/user_output.txt && \
          cat /app/main_output.txt && echo '---SPLIT---' && cat /app/user_output.txt"`;
  } else if (language === "java") {
    const solutionPath = path.resolve(
      __dirname,
      `../../../problemQuestion/${SelectedProblem}/solution/${language}.txt`
    );
    const destinationPath = path.join(tempDir, "solution.java");

    fs.copyFileSync(solutionPath, destinationPath);
    dockerCommand = `docker run --rm -v ${tempDir}:/app code-runner-image bash -c "\
      javac /app/Main.java /app/solution.java && \
      echo '${input}' | java -cp /app Main > /app/main_output.txt && \
      echo '${input}' | java -cp /app Solution > /app/user_output.txt && \
      cat /app/main_output.txt && echo '---SPLIT---' && cat /app/user_output.txt"`;
  } else if (language === "python") {
    const solutionPath = path.resolve(
      __dirname,
      `../../../problemQuestion/${SelectedProblem}/solution/${language}.txt`
    );
    const destinationPath = path.join(tempDir, "solution.py");

    fs.copyFileSync(solutionPath, destinationPath);
    dockerCommand = `docker run --rm -v ${tempDir}:/app code-runner-image bash -c "\
      echo '${input}' | python3 /app/main.py > /app/main_output.txt && \
      echo '${input}' | python3 /app/solution.py > /app/user_output.txt && \
      cat /app/main_output.txt && echo '---SPLIT---' && cat /app/user_output.txt"`;
  } else {
    return res.status(400).json({ output: "Unsupported language." });
  }

  exec(dockerCommand, (err, stdout, stderr) => {
    if (stderr) {
      return res.status(200).json({
        ok: false,
        output: stderr || err.message,
      });
    }
    if (err) {
      return res.status(500).json({
        ok: false,
        output: stderr || err.message,
      });
    }

    res.json({ ok: true, output: stdout });
  });
}

export { handleRun };
