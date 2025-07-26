// src/extension.ts
// This is a generic orchestrator for a hybrid VS Code extension.
// The code below is backend-agnostic: it works for both Python and Java backends with no changes required.
// Only the backendChoice variable and the corresponding spawn command need to be set to 'Python' or 'Java'.
// The rest of the logic (process spawning, data exchange, and result handling) remains identical for both languages.
// Each line is explained in detail below.

import * as vscode from "vscode"; // Imports the VS Code Extension API, needed to interact with VS Code features.
import * as path from "path"; // Node.js path utilities, used for building file paths in a cross-platform way.
import { spawn, ChildProcess } from "child_process"; // Used to start external processes (Python/Java backend).
// Importing constants for backend configuration.
import {
  PYTHON_BACKEND,
  PYTHON_BACKEND_SCRIPT_PATH,
  JAVA_BACKEND,
  JAVA_BACKEND_JAR_PATH

} from "./extension-constants"; // Importing constants defined in extension-constants.ts

export function activate(context: vscode.ExtensionContext) {
  // This function is called when your extension is activated.

  // Registers a new command with VS Code.
  // vscode.commands.registerCommand takes two arguments:
  //   1. The unique command identifier (must match the one in package.json).
  //   2. The callback function to execute when the command is invoked.
  // This is required so that your extension can respond to user actions (e.g., from the Command Palette).
  let disposable = vscode.commands.registerCommand(
    "hybrid-demo.runProcess",
    () => {
      // Choose which backend to use. Change this to 'Java' to use the Java backend.
      // This is the only part you need to change to switch between Python and Java.
      const backendChoice: string = JAVA_BACKEND; // Change this to 'PYTHON_BACKEND' or 'JAVA_BACKEND' as needed.

      // Prompts the user for input using VS Code's input box UI.
      vscode.window
        .showInputBox({ prompt: `Enter text to process with ${backendChoice}` })
        .then((userInput) => {
          if (!userInput) {
            return; // If the user cancels or enters nothing, exit.
          }

          let process: ChildProcess; // Will hold the spawned backend process.

          if (backendChoice === PYTHON_BACKEND) {
            process = spawnPythonProcess(context);
          } else if (backendChoice === JAVA_BACKEND) {
            process = spawnJavaProcess(context);
          } else {
            vscode.window.showErrorMessage(
              `Unsupported backend: ${backendChoice}`
            );
            return;
          }

          // --- Universal Process Handling ---
          // This section is identical for both Python and Java backends.

          let stdout = "", stderr = ""; // Buffers to collect output and error messages.

          // Listen for data from the backend's stdout (the result).
          process.stdout!.on("data", (data) => (stdout += data.toString()));
          // Listen for data from the backend's stderr (errors).
          process.stderr!.on("data", (data) => (stderr += data.toString()));

          // When the backend process exits:
          process.on("close", (code) => {
            if (code === 0) {
              // Success
              // Parse the backend's JSON output.
              const result = JSON.parse(stdout);
              // Show a success message to the user in VS Code.
              vscode.window.showInformationMessage(
                `✅ Success from ${result.processed_by}! Reversed: "${result.reversed_text}" (Length: ${result.original_length})`
              );
            } else {
              // Error
              // Show an error message to the user in VS Code.
              vscode.window.showErrorMessage(`❌ Backend Error: ${stderr}`);
            }
          });

          // Send the user's input to the backend process via stdin.
          process.stdin!.write(userInput + "\n");
          // Close the stdin stream to signal end of input.
          process.stdin!.end();
        });
    }
  );

  // Adds the command to the extension's subscriptions so it is disposed automatically.
  context.subscriptions.push(disposable);
}

/**
 * Spawns a Python backend process to run the specified script.
 * @param context - VS Code extension context for path resolution.
 * @returns ChildProcess - The spawned Python process.
 */
function spawnPythonProcess(context: vscode.ExtensionContext): ChildProcess {
  // Build the path to the Python script relative to the extension's install location.
  const scriptPath = path.join(context.extensionPath,    PYTHON_BACKEND_SCRIPT_PATH );
  // Spawn a Python process to run the script.
  return spawn(PYTHON_BACKEND, [scriptPath]);
}

/**
 * Spawns a Java backend process to run the specified JAR file.
 * @param context - VS Code extension context for path resolution.
 * @returns ChildProcess - The spawned Java process.
 */
function spawnJavaProcess(context: vscode.ExtensionContext): ChildProcess {
  // The name is constructed from the <artifactId> and <version> in pom.xml.
  const jarPath = path.join(context.extensionPath,JAVA_BACKEND_JAR_PATH);
  // Spawn a Java process to run the JAR file.
  return spawn("java", ["-jar", jarPath]);
}

// This function is called when your extension is deactivated (cleanup if needed).
export function deactivate() {}
