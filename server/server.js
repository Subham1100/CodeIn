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
      callback({ status: "ok" });
    } catch (err) {
      console.error("Error joining room:", err);
      callback({ status: "error", error: "Failed to join room." });
    }
  });

  socket.on("drawElement", (newElement, callback) => {
    try {
      socket.broadcast.emit("updateCanvas", {
        type: "updateCanvas",
        element: newElement,
      });
      callback({ status: "ok" });
    } catch (err) {
      console.error("Error in drawElement:", err);
      callback({ status: "error", error: "Failed to broadcast drawing." });
    }
  });

  socket.on("clearCanvas", (newElement, callback) => {
    try {
      socket.broadcast.emit("updateClearCanvas", {
        type: "clearCanvas",
      });
      callback({ status: "ok" });
    } catch (err) {
      console.error("Error in clearCanvas:", err);
      callback({ status: "error", error: "Failed to clear canvas." });
    }
  });

  socket.on("undoCanvas", (newElement, callback) => {
    try {
      socket.broadcast.emit("updateUndoCanvas", {
        type: "undoCanvas",
      });
      callback({ status: "ok" });
    } catch (err) {
      console.error("Error in undoCanvas:", err);
      callback({ status: "error", error: "Failed to undo." });
    }
  });

  socket.on("redoCanvas", (newElement, callback) => {
    try {
      socket.broadcast.emit("updateRedoCanvas", {
        type: "redoCanvas",
      });
      callback({ status: "ok" });
    } catch (err) {
      console.error("Error in redoCanvas:", err);
      callback({ status: "error", error: "Failed to redo." });
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
  console.log(1);

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
    dockerCommand = `docker run --rm -v ${tempDir}:/app code-runner-image bash -c "g++ /app/main.cpp -o /app/main && echo '${input}' | /app/main"`;
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
