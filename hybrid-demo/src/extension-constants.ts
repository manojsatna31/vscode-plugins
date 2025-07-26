/**
 * Centralized constants for backend configuration.
 * Update these values to change backend paths or names.
 */

// Path to the Python script relative to the extension's root.
export const PYTHON_BACKEND = "Python"; // Used in activate
export const PYTHON_BACKEND_CODE_BASE_PATH = "python_backend"; // Base path for Python backend
export const PYTHON_BACKEND_SCRIPT_NAME = "process_data.py"; // Name of the Python script
export const PYTHON_BACKEND_SCRIPT_PATH = `${PYTHON_BACKEND_CODE_BASE_PATH}/${PYTHON_BACKEND_SCRIPT_NAME}`; // Full path to the Python script   


// Path to the Java JAR file relative to the extension's root.
export const JAVA_BACKEND = "Java"; // Used in activate
export const JAVA_BACKEND_CODE_BASE_PATH = "java_backend"; // Base path for Java backend
export const JAVA_BACKEND_JAR_NAME = "java-backend-fat.jar"; // Used in spawnJavaProcess
export const JAVA_BACKEND_JAR_PATH = `${JAVA_BACKEND_CODE_BASE_PATH}/target/${JAVA_BACKEND_JAR_NAME}`; // Full path to the JAR file