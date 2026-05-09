<div align="center">

# ⚡ BlinkAPI

**A lightweight terminal REST client for developers.**

Fast. Scriptable. Git-friendly.

[![Status](https://img.shields.io/badge/status-early%20development-orange)](https://github.com/maheshshinde9100/BlinkAPI)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.x-brightgreen)](https://nodejs.org/)

> MVP is implemented and usable from terminal.

</div>

---

## The Idea

I got tired of opening Postman just to fire a quick API request. It's heavy, it's slow, and it's overkill for most things I do day-to-day.

**BlinkAPI** is my attempt to build a simple CLI tool that lets you:

- Make HTTP requests straight from the terminal
- Save requests as files you can commit to Git
- Switch between environments (dev, staging, prod) easily
- Eventually publish it as an npm package anyone can install

That's it. No fancy UI. No cloud sync. Just a fast, simple terminal tool.

---

## Current Features

- [x] CLI command system (`get`, `post`, `put`, `patch`, `delete`)
- [x] Real HTTP requests with native `fetch`
- [x] Custom request headers (`-H`, `--header`)
- [x] JSON request body (`-j`, `--json`) for write methods
- [x] Structured response output (status, time, headers, body)
- [x] Environment variable placeholders in URLs (`{{API_BASE_URL}}`)
- [x] TypeScript project structure with modular layers

---

## Tech Stack

Keeping it simple — just Node.js, TypeScript, and a few well-known packages.

| What | Package / Tool | Why |
|---|---|---|
| Runtime | [Node.js](https://nodejs.org/) `>=18` | Built-in `fetch`, no extra HTTP library needed to start |
| Language | [TypeScript](https://www.typescriptlang.org/) | Catching mistakes early while I build |
| CLI parsing | [`commander`](https://www.npmjs.com/package/commander) | Easy way to define commands and flags |
| Terminal colors | [`chalk`](https://www.npmjs.com/package/chalk) | Makes the output actually readable |
| `.env` support | [`dotenv`](https://www.npmjs.com/package/dotenv) | Load environment variables from a file |
| Build tool | [`typescript`](https://www.typescriptlang.org/) | Compile source to runnable CLI output |
| Testing | [`vitest`](https://vitest.dev/) | Simple and fast — I'll add tests as I go |

---

## Folder Structure

```
blinkapi/
├── src/
│   ├── index.ts
│   ├── cli/
│   │   ├── program.ts
│   │   ├── registerCommands.ts
│   │   ├── commandDefinitions.ts
│   │   └── commands/
│   │       └── request.ts
│   ├── http/
│   │   └── client.ts
│   ├── output/
│   │   └── console.ts
│   ├── env/
│   │   └── resolver.ts
│   └── utils/
│       ├── requestOptions.ts
│       ├── validators.ts
│       └── errors.ts
├── tests/
│   ├── envResolver.test.ts
│   ├── httpClient.test.ts
│   └── requestOptions.test.ts
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## How to Run Locally

```bash
git clone https://github.com/maheshshinde9100/BlinkAPI.git
cd BlinkAPI
npm install
npm run build

# Then try:
node dist/index.js get https://jsonplaceholder.typicode.com/posts/1
node dist/index.js post https://jsonplaceholder.typicode.com/posts --json '{"title":"foo"}'
node dist/index.js get "{{API_BASE_URL}}/posts/1"
```

Create a `.env` file in the project root when you want environment interpolation:

```bash
API_BASE_URL=https://jsonplaceholder.typicode.com
```

Run tests:

```bash
npm test
```

---

## npm Publishing (Planned)

Once final packaging is complete, BlinkAPI can be published as a global npm package:

```bash
npm install -g blinkapi
```

The goal is to keep it small, dependency-light, and installable with one command.

---

## Contributing

This is a personal project and very early stage — but if you have ideas, suggestions, or want to help, feel free to open an issue or PR on [GitHub](https://github.com/maheshshinde9100/BlinkAPI).

---

## License

[MIT](LICENSE)

---

<div align="center">
  Built by <a href="https://github.com/maheshshinde9100">Mahesh Shinde</a>
</div>
