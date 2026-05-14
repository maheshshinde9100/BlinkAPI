# ShellReq API Client

A lightweight, powerful API testing extension for Visual Studio Code, inspired by tools like Thunder Client and powered by the ShellReq engine.

## Key Features

- **Sidebar API Testing**: A full-featured interface in your VS Code sidebar. No more context switching.
- **Save & Organize**: Save your most-used requests into **Collections** for instant access.
- **Automatic History**: Automatically tracks your recently sent requests.
- **Smart Formatting**: Pretty-prints JSON responses and provides detailed info like status code, execution time, and payload size.
- **Multi-Method Support**: Easily switch between GET, POST, PUT, DELETE, and PATCH.
- **State Persistence**: Your URL, headers, and body are remembered even if you switch files or close VS Code.

## Requirements

- [ShellReq](https://github.com/maheshshinde9100/ShellReq) installed globally (for CLI fallback)
  ```bash
  npm install -g shellreq
  ```

## How to Use

### 1. Open the API Client
Look for the **ShellReq** icon in the VS Code Activity Bar (usually on the far left). Click it to open the API Client sidebar.

### 2. Basic Request
- **Select Method**: Choose from the dropdown (default is GET).
- **Enter URL**: Type your API endpoint (e.g., `https://api.example.com/data`).
- **Send**: Click the **SEND** button to execute. Results will appear in the response panel at the bottom.

### 3. Headers and Body
- Click the **Headers** tab to add key-value pairs (e.g., `Content-Type: application/json`).
- If using POST/PUT, click the **Body** tab to enter your JSON payload.

### 4. Manage History & Collections
- **History**: The last 20 requests are automatically saved in the **History** tab. Click any item to reload it.
- **Collections**: Click the **SAVE** button next to "SEND" to permanently save the current request into your Collections.

## Commands

- `ShellReq: Focus API Client`: Quickly jump to the API sidebar.
- `ShellReq: Run Request`: Quick input-box based request (legacy shortcut).

## Release Notes

### 0.1.0
- **Official Release**: Official release of the Sidebar API Client with full testing capabilities.
- Polished UI and state management.

### 0.0.3
- **Massive UI Overhaul**: Introduced the Sidebar Webview for a seamless testing experience.
- **Collections & History**: Added persistent storage for saved and recent requests.
- **Improved Performance**: Switched core requests to Axios for better reliability.

### 0.0.2
- Initial Sidebar prototyping and basic request handling.

### 0.0.1
- Original CLI-based version release.

