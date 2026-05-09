# ShellReq CLI Testing Guide

This document provides a comprehensive guide for testing the `shellreq` package via the Command Line Interface (CLI).

## Installation

Ensure you have the latest version installed:

```bash
# Global installation (Recommended)
npm install -g shellreq

# Local installation in a project
npm install shellreq
```

---

## HTTP Method Testing

We use [JSONPlaceholder](https://jsonplaceholder.typicode.com/) as a safe mock API for testing.

### 1. GET (Read)
Fetches a single post.
```bash
shellreq get https://jsonplaceholder.typicode.com/posts/1
```

### 2. POST (Create)
Creates a new resource.
```bash
shellreq post https://jsonplaceholder.typicode.com/posts --json '{"title": "New Post", "body": "Mahesh Shinde", "userId": 1}'
```

### 3. PUT (Update/Replace)
Replaces an existing resource.
```bash
shellreq put https://jsonplaceholder.typicode.com/posts/1 --json '{"id": 1, "title": "Updated Title", "body": "Updated content", "userId": 1}'
```

### 4. PATCH (Partial Update)
Updates only the fields provided.
```bash
shellreq patch https://jsonplaceholder.typicode.com/posts/1 --json '{"title": "Only Title Updated"}'
```

### 5. DELETE (Remove)
Deletes a resource.
```bash
shellreq delete https://jsonplaceholder.typicode.com/posts/1
```

---

## Advanced Features

### Verbose Mode (`--verbose`)
Shows the response headers along with the body. Useful for debugging API metadata.
```bash
shellreq get https://jsonplaceholder.typicode.com/posts/1 --verbose
```

### Custom Headers (`-H`)
Send custom headers (e.g., Auth tokens). You can use this flag multiple times.
```bash
shellreq get https://jsonplaceholder.typicode.com/posts/1 -H "Authorization: Bearer my-token" -H "X-Client: ShellReq"
```

### Environment Variables
1. Create a `.env` file in your current folder:
   ```env
   API_URL=https://jsonplaceholder.typicode.com
   ```
2. Use the variable in the CLI using double curly braces:
   ```bash
   shellreq get "{{API_URL}}/posts/1"
   ```

---

## Automated Verification Script

You can use the following `test.js` script to verify the package integrity after installation:

```javascript
const { execSync } = require('child_process');

console.log("--- Testing ShellReq CLI ---");

try {
    // 1. Test version command
    const version = execSync('shellreq --version').toString().trim();
    console.log(` CLI Version: ${version}`);

    // 2. Test GET request
    const output = execSync('shellreq get https://jsonplaceholder.typicode.com/posts/1').toString();
    if (output.includes('200 OK')) console.log(" GET Request: Success");

    // 3. Test Verbose mode
    const verboseOutput = execSync('shellreq get https://jsonplaceholder.typicode.com/posts/1 --verbose').toString();
    if (verboseOutput.includes('Headers:')) console.log(" Verbose Mode: Success");

    console.log("\n All tests passed!");
} catch (error) {
    console.error(" Test Failed:", error.message);
    process.exit(1);
}
```
