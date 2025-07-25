// java_backend/src/com/example/Main.java
package com.example;

import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

public class Main {
    public static void main(String[] args) {
        boolean testEnabled = false;//Make true to enable test mode when you like to test with arguments .. to validate jar is generated correctly
        if (testEnabled) {
            // Check if at least one argument was provided.
            if (args.length == 0) {
                System.err.println(new JSONObject().put("error", "No input argument provided."));
                System.exit(1);
                return;
            }
            // We'll take the first argument as our input text.
            String inputText = args[0];

            try {
                JSONObject result = processData(inputText);
                System.out.println(result.toString());
            } catch (Exception e) {
                System.err.println(new JSONObject().put("error", e.getMessage()));
                System.exit(1);
            }
        }
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(System.in, StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                JSONObject result = new JSONObject();
                result.put("processed_by", "Java");
                result.put("reversed_text", new StringBuilder(line).reverse().toString());
                result.put("original_length", line.length());
                System.out.println(result.toString());
            }
        } catch (Exception e) {
            System.err.println(new JSONObject().put("error", e.getMessage()));
            System.exit(1); // Exit with a non-zero code to indicate failure
        }
    }

    public static JSONObject processData(String inputText) {
        JSONObject response = new JSONObject();
        response.put("processed_by", "Java (Maven - Args)");
        response.put("reversed_text", new StringBuilder(inputText).reverse().toString());
        response.put("original_length", inputText.length());
        return response;
    }
}