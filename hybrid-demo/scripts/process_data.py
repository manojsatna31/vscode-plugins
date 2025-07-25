# scripts/process_data.py
import sys, json

def process_data(input_text):
    return {
        "processed_by": "Python",
        "reversed_text": input_text[::-1],
        "original_length": len(input_text)
    }

if __name__ == "__main__":
    try:
        for line in sys.stdin:
            result = process_data(line.strip())
            print(json.dumps(result))
            sys.stdout.flush() # CRITICAL: Ensures data is sent immediately
    except Exception as e:
        sys.stderr.write(json.dumps({"error": str(e)}))
        sys.stderr.flush()