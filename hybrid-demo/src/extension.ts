// src/extension.ts
// This is a generic orchestrator for a hybrid VS Code extension.
// The code below is backend-agnostic: it works for both Python and Java backends with no changes required.
// Only the backendChoice variable and the corresponding spawn command need to be set to 'Python' or 'Java'.
// The rest of the logic (process spawning, data exchange, and result handling) remains identical for both languages.
// Each line is explained in detail below.

import * as vscode from 'vscode'; // Imports the VS Code Extension API, needed to interact with VS Code features.
import * as path from 'path'; // Node.js path utilities, used for building file paths in a cross-platform way.
import { spawn, ChildProcess } from 'child_process'; // Used to start external processes (Python/Java backend).

export function activate(context: vscode.ExtensionContext) { // This function is called when your extension is activated.

    // Registers a new command with VS Code.
    // vscode.commands.registerCommand takes two arguments:
    //   1. The unique command identifier (must match the one in package.json).
    //   2. The callback function to execute when the command is invoked.
    // This is required so that your extension can respond to user actions (e.g., from the Command Palette).
    let disposable = vscode.commands.registerCommand('hybrid-demo.runProcess', () => {

        // Choose which backend to use. Change this to 'Java' to use the Java backend.
        // This is the only part you need to change to switch between Python and Java.
        const backendChoice: string = 'Python';
        //const backendChoice: string = 'Java';

        // Prompts the user for input using VS Code's input box UI.
        vscode.window.showInputBox({ prompt: `Enter text to process with ${backendChoice}` })
            .then(userInput => {
                if (!userInput) return; // If the user cancels or enters nothing, exit.

                let process: ChildProcess; // Will hold the spawned backend process.

                if (backendChoice === 'Python') {
                    // Build the path to the Python script relative to the extension's install location.
                    const scriptPath = path.join(context.extensionPath, 'scripts', 'process_data.py');
                    // Spawn a Python process to run the script.
                    process = spawn('python', [scriptPath]);
                } else { // Java backend
                    // Build the path to the Java backend directory.
                    //const backendRoot = path.join(context.extensionPath, 'java_backend');
                    // Construct the Java classpath (bin directory and all jars in lib).
                    //const classPath = [path.join(backendRoot, 'bin'), path.join(backendRoot, 'lib', '*')].join(path.delimiter);
                    // Spawn the Java process, running the Main class.
                    //process = spawn('java', ['-cp', classPath, 'com.example.Main']);
                    //# Create output directory
                    // mkdir -p java_backend/bin
                    // # Compile (use ';' instead of ':' for classpath on Windows)
                    // javac -d java_backend/bin -cp "java_backend/lib/*" java_backend/src/com/example/Main.java

                    // The name is constructed from the <artifactId> and <version> in pom.xml.
                    const jarName = 'java_backend-1.0.0-shaded.jar';
                    const jarPath = path.join(context.extensionPath, 'java_backend', 'target', jarName);
                    process = spawn('java', ['-jar', jarPath]);
                }

                // --- Universal Process Handling ---
                // This section is identical for both Python and Java backends.

                let stdout = '', stderr = ''; // Buffers to collect output and error messages.

                // Listen for data from the backend's stdout (the result).
                process.stdout!.on('data', (data) => stdout += data.toString());
                // Listen for data from the backend's stderr (errors).
                process.stderr!.on('data', (data) => stderr += data.toString());

                // When the backend process exits:
                process.on('close', (code) => {
                    if (code === 0) { // Success
                        // Parse the backend's JSON output.
                        const result = JSON.parse(stdout);
                        // Show a success message to the user in VS Code.
                        vscode.window.showInformationMessage(
                            `✅ Success from ${result.processed_by}! Reversed: "${result.reversed_text}" (Length: ${result.original_length})`
                        );
                    } else { // Error
                        // Show an error message to the user in VS Code.
                        vscode.window.showErrorMessage(`❌ Backend Error: ${stderr}`);
                    }
                });

                // Send the user's input to the backend process via stdin.
                process.stdin!.write(userInput + '\n');
                // Close the stdin stream to signal end of input.
                process.stdin!.end();
            });
    });

    // Adds the command to the extension's subscriptions so it is disposed automatically.
    context.subscriptions.push(disposable);
}

// This function is called when your extension is deactivated (cleanup if needed).
export function deactivate() {}