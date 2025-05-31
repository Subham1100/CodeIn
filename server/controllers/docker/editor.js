import fs from "fs";
import path from "path";
import { exec } from "child_process";
import os from "os";
function handleEditor(req, res) {
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
    dockerCommand = `docker run --rm -v ${tempDir}:/app code-runner-image bash -c "\
      g++ -std=c++20 /app/main.cpp -o /app/main && \
      echo '${input}' | /app/main"`;
  } else if (language === "java") {
    dockerCommand = `docker run --rm -v ${tempDir}:/app code-runner-image bash -c "\
      javac /app/Main.java && \
      echo '${input}' | java -cp /app Main"`;
  } else if (language === "python") {
    dockerCommand = `docker run --rm -v ${tempDir}:/app code-runner-image bash -c "\
      echo '${input}' | python3 /app/main.py"`;
  } else {
    return res.status(400).json({ output: "Unsupported language." });
  }

  exec(dockerCommand, (err, stdout, stderr) => {
    if (err || stderr) {
      // If there is an error, send an error response with status `false`
      // console.log(err);
      return res.status(500).json({
        ok: false,
        output: stderr || err.message,
      });
    }

    res.json({ output: stdout, ok: true });
  });
}

export { handleEditor };
