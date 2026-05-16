# ShellReq API Client

<div align="center">

[![Version](https://vsmarketplacebadges.dev/version-short/maheshshinde9100.shellreq-api-client.svg?style=for-the-badge&colorA=0078d4&colorB=0078d4&label=VERSION)](https://marketplace.visualstudio.com/items?itemName=maheshshinde9100.shellreq-api-client)
[![Installs](https://vsmarketplacebadges.dev/installs-short/maheshshinde9100.shellreq-api-client.svg?style=for-the-badge&colorA=0078d4&colorB=0078d4&label=INSTALLS)](https://marketplace.visualstudio.com/items?itemName=maheshshinde9100.shellreq-api-client)
[![Rating](https://vsmarketplacebadges.dev/rating-short/maheshshinde9100.shellreq-api-client.svg?style=for-the-badge&colorA=0078d4&colorB=0078d4&label=RATING)](https://marketplace.visualstudio.com/items?itemName=maheshshinde9100.shellreq-api-client)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)

**A native, blazing-fast API client — built right inside Visual Studio Code.**

*No context switching. No external apps. Just pure, focused API testing.*

</div>

---

## Overview

**ShellReq** is a lightweight, fully integrated API testing client for Visual Studio Code. It lives in your sidebar, speaks your workflow's language, and stays out of your way — giving you everything you need to test, inspect, and manage HTTP requests without ever leaving your editor.

> Designed for developers who want speed, clarity, and zero clutter.

---

## Features

### High-Performance Sidebar UI
A sleek, native sidebar panel that feels at home in VS Code. No tabs to juggle, no browser windows — just your requests, right where you code.

### Smart Request Collections
Organize frequently used requests into named collections with persistent storage. Access any saved request instantly, across sessions.

### Zero-Lag Request History
Automatically tracks every request you send. Revisit, reuse, or analyze past requests with a single click — no manual saving required.

### Structured Key-Value Editors
Dedicated grid-based editors for **Headers** and **Query Parameters** — clean, fast, and easy to manage without free-typing raw strings.

### Advanced Response Analysis
- **Pretty-printed JSON** with instant formatting
- **Status code** display with semantic color indicators
- **Precise response times** and **payload size** metadata
- **Full response headers** inspection panel

### Full HTTP Method Support
Complete support for `GET`, `POST`, `PUT`, `PATCH`, and `DELETE` — covering your REST API workflows end to end.

### Session Persistence
ShellReq remembers your last request state, collections, and history even after restarting VS Code — ultra-lightweight and reliable.

---

## Getting Started

### 1. Open ShellReq
Click the **ShellReq** icon in the VS Code Activity Bar (left sidebar) to open the client panel.

### 2. Build Your Request

| Section | What to Do |
|---|---|
| **Method** | Select `GET`, `POST`, `PUT`, `PATCH`, or `DELETE` from the dropdown |
| **URL** | Enter your endpoint URL |
| **Params** | Add query parameters as key-value pairs in the Params tab |
| **Headers** | Set request headers in the Headers tab |
| **Body** | Enter your JSON payload in the Body tab (for `POST`, `PUT`, `PATCH`) |

### 3. Send & Inspect
Click **SEND**. The response panel instantly displays:
- Response body (pretty-printed for JSON)
- HTTP status code
- Execution time
- Response size
- Response headers

### 4. Save to Collections
Click **SAVE** on any request to add it to your collections for reuse anytime.

---

## Commands

Access these via the **Command Palette** (`Ctrl+Shift+P` / `Cmd+Shift+P`):

| Command | Description |
|---|---|
| `ShellReq: Focus API Client` | Opens and focuses the ShellReq sidebar panel |
| `ShellReq: Run Request` | Executes the current request from the command palette |

---

## Requirements

- Visual Studio Code `^1.85.0` or later
- No external dependencies or runtime installations required

---

## Release Notes

### v0.1.2 — Production Stability Overhaul
- **Critical Bug Fixes**: Resolved UI and state-syncing issues for rock-solid reliability
- **Bi-directional Sync**: Improved state synchronization between the extension host and sidebar webview
- **Icon Reliability**: Updated activity bar icon to a high-contrast, theme-aware design compatible with all VS Code themes
- **Security Hardening**: Added Content Security Policy (CSP) headers for secure webview execution
- **Loading UX**: Introduced visual spinners and disabled button states during active request execution

### v0.1.1
- Minor stability improvements and internal refactoring

### v0.1.0 — Official Release
- Native Sidebar API Client with full HTTP testing capabilities
- Optimized state management and core request engine

### v0.0.3 — Sidebar Experience
- Introduced the sidebar-first layout
- Added persistent storage engine for collections and history

---

## Contributing

Contributions, bug reports, and feature requests are welcome!

1. Fork the [repository](https://github.com/maheshshinde9100/shellreq-api-client)
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes and open a Pull Request

---

## License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

Built by [Mahesh Shinde](https://github.com/maheshshinde9100)

[Marketplace](https://marketplace.visualstudio.com/items?itemName=maheshshinde9100.shellreq-api-client) · [GitHub](https://github.com/maheshshinde9100/shellreq-api-client) · [Report an Issue](https://github.com/maheshshinde9100/shellreq-api-client/issues)

</div>
