---
title: "Building Your First Cross-Platform Desktop App with Electron.js"
date: "2026-03-24"
description: "Learn the basics of Electron.js and how I used it with Jitsi Meet to build the Naver Cloud Meeting desktop app for Windows, macOS, and Linux."
slug: "electron-cross-platform-desktop"
published: true
tags: ["Desktop", "Electron.js", "JavaScript"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1000"
---

Before I joined the Naver Cloud Meeting project, I had never built a desktop app. The idea seemed intimidating — until I discovered **Electron.js**. It lets you build desktop apps using the same technologies you already know: HTML, CSS, and JavaScript. Here's a beginner-friendly overview of how it works.

## What Is Electron?

Electron bundles **Chromium** (the browser engine behind Chrome) and **Node.js** into a single runtime. That means your app runs in a real browser environment, but it also has full access to the operating system — reading files, sending notifications, managing windows, and more.

Our Naver Cloud Meeting desktop app was built on top of **Jitsi Meet** (an open-source video conferencing library) wrapped inside an Electron shell. This let us ship a native-feeling app for Windows, macOS, and Linux from a single codebase.

## Main Process vs Renderer Process

Electron has two types of processes you need to understand:

- **Main process** — the Node.js backend of your app. It manages windows, system tray icons, and native OS features.
- **Renderer process** — the Chromium frontend. This is where your HTML/CSS/JS UI lives.

```js
// main.js (Main Process)
const { app, BrowserWindow } = require('electron')

app.whenReady().then(() => {
  const win = new BrowserWindow({ width: 1200, height: 800 })
  win.loadURL('https://your-app.com') // or a local file
})
```

They communicate via Electron's **IPC** (inter-process communication) — think of it like sending messages between two workers.

## Packaging for Every Platform

One of Electron's biggest selling points is cross-platform packaging. With tools like **electron-builder**, a single command can produce:

- `.exe` for Windows
- `.dmg` for macOS
- `.AppImage` for Linux

```bash
npx electron-builder --win --mac --linux
```

## What I Learned

The biggest challenge wasn't writing code — it was understanding the two-process model. Once that clicked, everything else fell into place. If you know how to build a web app, you already have most of the skills to build a desktop app with Electron. Give it a shot!
