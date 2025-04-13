const express = require("express");
const app = express();
app.use(express.json());

require("dotenv").config({ path: "../.env" });

const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5000", // Match your frontend port
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const server = require("http").createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5000", // Match frontend port
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("joinRoom", (data, callback) => {
    try {
      const { name, userId, roomId, host, presenter } = data;
      console.log("Joining Room:", data);
      socket.join(roomId);
    } catch (err) {
      console.error("Error joining room:", err);
    }
  });

  socket.on("drawElement", (newElement, callback) => {
    try {
      socket.broadcast.emit("updateCanvas", {
        type: "updateCanvas",
        element: newElement,
      });
    } catch (err) {
      console.error("Error in drawElement:", err);
    }
  });

  socket.on("clearCanvas", (newElement, callback) => {
    try {
      socket.broadcast.emit("updateClearCanvas", {
        type: "clearCanvas",
      });
    } catch (err) {
      console.error("Error in clearCanvas:", err);
    }
  });

  socket.on("undoCanvas", (newElement, callback) => {
    try {
      socket.broadcast.emit("updateUndoCanvas", {
        type: "undoCanvas",
      });
    } catch (err) {
      console.error("Error in undoCanvas:", err);
    }
  });

  socket.on("redoCanvas", (newElement, callback) => {
    try {
      socket.broadcast.emit("updateRedoCanvas", {
        type: "redoCanvas",
      });
    } catch (err) {
      console.error("Error in redoCanvas:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

//routes
app.get("/", (req, res) => {
  res.send("this is whiteboard");
});

app.options("/run", cors()); // Handle preflight explicitly
app.post("/run", (req, res) => {
  const { code, language, input = "" } = req.body;

  const fileNames = {
    cpp: "main.cpp",
    java: "Main.java",
    python: "main.py",
  };
  const os = require("os");

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
    dockerCommand = `docker run --rm -v ${tempDir}:/app code-runner-image bash -c "\
      g++ -std=c++20 /app/main.cpp -o /app/main && \
      g++ -std=c++20 /app/solution.cpp -o /app/user_sol && \
      echo '${input}' | /app/main > /app/main_output.txt && \
      echo '${input}' | /app/user_sol > /app/user_output.txt && \
      cat /app/main_output.txt && echo '---SPLIT---' && cat /app/user_output.txt"`;
  } else if (language === "java") {
    const solutionPath = "../temp/1/SolutionJava.txt";
    const destinationPath = path.join(tempDir, "solution.java");

    fs.copyFileSync(solutionPath, destinationPath);
    dockerCommand = `docker run --rm -v ${tempDir}:/app code-runner-image bash -c "\
    javac /app/Main.java /app/solution.java && \
    echo '${input}' | java -cp /app Main > /app/main_output.txt && \
    echo '${input}' | java -cp /app Solution > /app/user_output.txt && \
    cat /app/main_output.txt && echo '---SPLIT---' && cat /app/user_output.txt"`;
  } else if (language === "python") {
    const solutionPath = "../temp/1/SoutionPython.txt";
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
    if (err) {
      return res.json({ output: stderr || err.message });
    }

    res.json({ output: stdout });
  });
});

app.post("/submit", (req, res) => {
  const { code, language, input = "" } = req.body;

  const fileNames = {
    cpp: "main.cpp",
    java: "Main.java",
    python: "main.py",
  };
  const os = require("os");

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
    const testCasePath = "../temp/1/test_case.txt";

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
    dockerCommand = `docker run --rm -v ${tempDir}:/app code-runner-image bash -c "javac /app/Main.java && echo '${input}' | java -cp /app Main"`;
  } else if (language === "python") {
    dockerCommand = `docker run --rm -v ${tempDir}:/app code-runner-image bash -c "echo '${input}' | python3 /app/main.py"`;
  } else {
    return res.status(400).json({ output: "Unsupported language." });
  }

  exec(dockerCommand, (err, stdout, stderr) => {
    if (err) {
      return res.json({ output: stderr || err.message });
    }

    res.json({ output: stdout });
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
