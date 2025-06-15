import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function boilerplate(req, res) {
  const { SelectedProblem } = req.query;

  if (!SelectedProblem) {
    return res.status(400).json({ error: "SelectedProblem is required" });
  }
  if (SelectedProblem === "0") {
    try {
      const cppPath = path.resolve(
        __dirname,
        `../../problemQuestion/${SelectedProblem}/boilerplate/cpp.txt`
      );
      const javaPath = path.resolve(
        __dirname,
        `../../problemQuestion/${SelectedProblem}/boilerplate/java.txt`
      );
      const pythonPath = path.resolve(
        __dirname,
        `../../problemQuestion/${SelectedProblem}/boilerplate/python.txt`
      );

      const [cpp, java, python] = await Promise.all([
        fs.readFile(cppPath, "utf-8"),
        fs.readFile(javaPath, "utf-8"),
        fs.readFile(pythonPath, "utf-8"),
      ]);

      return res.status(200).json({
        data: { cpp, java, python },
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Failed to read boilerplate files" });
    }
  }

  try {
    const cppPath = path.resolve(
      __dirname,
      `../../problemQuestion/${SelectedProblem}/boilerplate/cpp.txt`
    );
    const javaPath = path.resolve(
      __dirname,
      `../../problemQuestion/${SelectedProblem}/boilerplate/java.txt`
    );
    const pythonPath = path.resolve(
      __dirname,
      `../../problemQuestion/${SelectedProblem}/boilerplate/python.txt`
    );
    const cppSolutionPath = path.resolve(
      __dirname,
      `../../problemQuestion/${SelectedProblem}/solution/cpp.txt`
    );
    const javaSolutionPath = path.resolve(
      __dirname,
      `../../problemQuestion/${SelectedProblem}/solution/java.txt`
    );
    const pythonSolutionPath = path.resolve(
      __dirname,
      `../../problemQuestion/${SelectedProblem}/solution/python.txt`
    );
    const inputTextPath = path.resolve(
      __dirname,
      `../../problemQuestion/${SelectedProblem}/input.txt`
    );

    const [cpp, java, python, cppSol, javaSol, pythonSol, inputText] =
      await Promise.all([
        fs.readFile(cppPath, "utf-8"),
        fs.readFile(javaPath, "utf-8"),
        fs.readFile(pythonPath, "utf-8"),
        fs.readFile(cppSolutionPath, "utf-8"),
        fs.readFile(javaSolutionPath, "utf-8"),
        fs.readFile(pythonSolutionPath, "utf-8"),
        fs.readFile(inputTextPath, "utf-8"),
      ]);

    return res.status(200).json({
      data: { cpp, java, python, cppSol, javaSol, pythonSol, inputText },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to read boilerplate files" });
  }
}
