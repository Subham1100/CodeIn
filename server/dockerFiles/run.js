import fs from "fs";
import path from "path";
import { exec } from "child_process";
import os from "os";

function handleRun(req, res) {
  const { code, language, input, SelectedProblem = "" } = req.body;

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
    const solutionPath = "../temp/1/SolutionCpp.txt";
    const destinationPath = path.join(tempDir, "solution.cpp");

    fs.copyFileSync(solutionPath, destinationPath);

    dockerCommand = `docker run --rm -v ${tempDir}:/app dockerfile bash -c "\
          g++ -std=c++20 /app/main.cpp -o /app/main && \
          g++ -std=c++20 /app/solution.cpp -o /app/user_sol && \
          echo '${input}' | /app/main > /app/main_output.txt && \
          echo '${input}' | /app/user_sol > /app/user_output.txt && \
          cat /app/main_output.txt && echo '---SPLIT---' && cat /app/user_output.txt"`;
  } else if (language === "java") {
    const solutionPath = "../temp/1/SolutionJava.txt";
    const destinationPath = path.join(tempDir, "solution.java");

    fs.copyFileSync(solutionPath, destinationPath);
    dockerCommand = `docker run --rm -v ${tempDir}:/app dockerfile bash -c "\
      javac /app/Main.java /app/solution.java && \
      echo '${input}' | java -cp /app Main > /app/main_output.txt && \
      echo '${input}' | java -cp /app Solution > /app/user_output.txt && \
      cat /app/main_output.txt && echo '---SPLIT---' && cat /app/user_output.txt"`;
  } else if (language === "python") {
    const solutionPath = "../temp/1/SoutionPython.txt";
    const destinationPath = path.join(tempDir, "solution.py");

    fs.copyFileSync(solutionPath, destinationPath);
    dockerCommand = `docker run --rm -v ${tempDir}:/app dockerfile bash -c "\
      echo '${input}' | python3 /app/main.py > /app/main_output.txt && \
      echo '${input}' | python3 /app/solution.py > /app/user_output.txt && \
      cat /app/main_output.txt && echo '---SPLIT---' && cat /app/user_output.txt"`;
  } else {
    return res.status(400).json({ output: "Unsupported language." });
  }

  exec(dockerCommand, (err, stdout, stderr) => {
    if (err || stderr) {
      // If there is an error, send an error response with status `false`
      return res.status(500).json({
        ok: false,
        output: stderr || err.message,
      });
    }
    res.json({ output: stdout });
  });
}

export { handleRun };
