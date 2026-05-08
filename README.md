<div align="center">

# ⚡ FetchUp

**A lightweight, terminal-native API testing tool for developers.**

Fast. Scriptable. Git-friendly.

[![Status](https://img.shields.io/badge/status-early%20development-orange)](https://github.com/maheshshinde9100/FetchUp)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.x-brightgreen)](https://nodejs.org/)

> This project is just getting started. Nothing is production-ready yet — this README reflects the idea and direction, not a finished tool.

</div>

---

## The Idea

I got tired of opening Postman just to fire a quick API request. It's heavy, it's slow, and it's overkill for most things I do day-to-day.

**FetchUp** is my attempt to build a simple CLI tool that lets you:

- Make HTTP requests straight from the terminal
- Save requests as files you can commit to Git
- Switch between environments (dev, staging, prod) easily
- Eventually publish it as an npm package anyone can install

That's it. No fancy UI. No cloud sync. Just a fast, simple terminal tool.

---

## What I Want to Build

Here's the rough list of things I'm planning — in the order I'll probably tackle them:

- [ ] Basic CLI — run `fetchup get <url>` and see a response
- [ ] Support all common HTTP methods — GET, POST, PUT, PATCH, DELETE
- [ ] Send headers and JSON body from the command line
- [ ] Pretty-print the response (status code, headers, body)
- [ ] Load variables from a `.env` file
- [ ] Save a request to a `.yaml` or `.json` file and re-run it later
- [ ] Switch environments with a flag like `--env staging`
- [ ] Publish the package on npm so others can `npm install -g fetchup`

Things I'd *like* to explore later (no promises):

- [ ] Chain multiple requests together
- [ ] Basic assertions — check if a response has a certain status or field
- [ ] Import a Postman collection and run it

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
| YAML support | [`js-yaml`](https://www.npmjs.com/package/js-yaml) | Read/write saved request collection files |
| Build tool | [`tsup`](https://tsup.egoist.dev/) | Bundle TypeScript to JS for npm publishing |
| Testing | [`vitest`](https://vitest.dev/) | Simple and fast — I'll add tests as I go |

---

## Folder Structure (What I'm Starting With)

```
fetchup/
├── src/
│   ├── index.ts          # CLI entry point
│   ├── commands/
│   │   └── request.ts    # Handle get, post, etc.
│   ├── output/
│   │   └── formatter.ts  # Pretty-print responses
│   └── env/
│       └── loader.ts     # Load .env and resolve variables
├── tests/
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

I'll grow this as I add more features.

---

## How to Run Locally (Once I Have Something Working)

```bash
git clone https://github.com/maheshshinde9100/FetchUp.git
cd FetchUp
npm install
npm run build
npm link

# Then try:
fetchup get https://jsonplaceholder.typicode.com/posts/1
```

---

## npm Publishing Plan

Once the basic version is working, I plan to publish it as a global npm package:

```bash
npm install -g fetchup
```

The goal is to make the package small, dependency-light, and installable with a single command.

---

## Contributing

This is a personal project and very early stage — but if you have ideas, suggestions, or want to help, feel free to open an issue or PR on [GitHub](https://github.com/maheshshinde9100/FetchUp).

---

## License

[MIT](LICENSE)

---

<div align="center">
  Built by <a href="https://github.com/maheshshinde9100">Mahesh Shinde</a>
</div>
