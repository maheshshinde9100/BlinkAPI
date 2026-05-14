# ShellReq API Client

[![Version](https://img.shields.io/visual-studio-marketplace/v/maheshshinde9100.shellreq-api-client?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=maheshshinde9100.shellreq-api-client)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/maheshshinde9100.shellreq-api-client?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=maheshshinde9100.shellreq-api-client)

A powerful, lightning-fast API testing client built natively for Visual Studio Code. ShellReq provides a high-performance, minimalist interface to test your endpoints without the bloat of external applications.

## Key Features

- **Optimized UI**: A sleek, high-performance interface in your sidebar for a seamless, lightweight workflow.
- **Structured Grid Editors**: Manage Headers and Parameters efficiently with our native key-value editors.
- **Smart Collections**: Organize your most-used requests into permanent collections for instant access.
- **Instant History**: Zero-lag access to your recent requests with a detailed history view.
- **Advanced Response Analysis**: 
  - Lightning-fast JSON pretty-printing.
  - Real-time metadata: Status codes, precise response times, and payload sizes.
  - Comprehensive headers inspection.
- **Full HTTP Support**: Complete support for `GET`, `POST`, `PUT`, `PATCH`, and `DELETE`.
- **Ultra-Light Persistence**: Efficiently remembers your session even after restarting VS Code.

---

## How to Use

### 1. Open the Client
Click the **ShellReq Lightning Bolt** icon in your VS Code Activity Bar (left sidebar).

### 2. Configure Your Request
- **Method**: Select the HTTP method from the dropdown.
- **URL**: Enter your endpoint URL.
- **Params/Headers**: Use the dedicated tabs to add key-value pairs.
- **Body**: For payload-based requests, use the Body tab to enter your JSON.

### 3. Send & Analyze
Click **SEND**. The response panel will instantly show your data, status code, and execution time.

### 4. Save to Collections
Keep your workflow organized by clicking **SAVE** to add any request to your permanent collections.

---

## Commands

- `ShellReq: Focus API Client` - Jump straight to the API sidebar.
- `ShellReq: Run Request` - Quick command-palette based request execution.

---

## Release Notes

### 0.1.2
- **Production Overhaul**: Fixed critical UI and state-syncing bugs for rock-solid performance.
- **Improved Persistence**: Added bi-directional syncing between extension and sidebar.
- **Icon Reliability**: Updated activity bar icon to a high-contrast, theme-aware native design.
- **Security Headers**: Added CSP for robust Webview execution.
- **Loading UX**: Added visual feedback (spinners) and disabled states during requests.

### 0.1.1

### 0.1.0
- **Official Release**: Native Sidebar API Client with full testing capabilities.
- Optimized state management and core logic.

### 0.0.3
- **Sidebar Integration**: Introduced the streamlined sidebar-first experience.
- **Persistent Storage**: High-performance storage for collections.

---

**Built by [Mahesh Shinde](https://github.com/maheshshinde9100)**
