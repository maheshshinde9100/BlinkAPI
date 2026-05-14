# ShellReq API Client

A lightweight API testing extension for Visual Studio Code powered by ShellReq.

## Features

- **Quick API Testing**: Run HTTP requests directly from VS Code using the `ShellReq: Run Request` command
- **JSON Response Display**: Automatically formats and displays API responses in a new editor window
- **Simple Interface**: Enter any API URL and get instant results

## Requirements

- [ShellReq](https://github.com/maheshshinde9100/ShellReq) must be installed on your system
- Node.js (for ShellReq)

### Installing ShellReq

```bash
npm install -g shellreq
```

## Usage

1. Open the Command Palette in VS Code (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Search for `ShellReq: Run Request`
3. Enter your API URL when prompted
4. The response will be displayed in a new editor window formatted as JSON

## Example

Try it with a sample API:
```
https://jsonplaceholder.typicode.com/posts/1
```

## Release Notes

### 0.0.1

Initial release of ShellReq API Client
- Basic API request execution
- JSON response formatting
- Error handling and display
