# Repository Guidelines

## Project Overview

This is a static browser app for composing a Tencent Meeting-style screenshot on an HTML canvas and exporting it as PNG.

Core files:

- `index.html`: app shell, controls, participant template, and canvas element.
- `styles.css`: layout and control styling.
- `app.js`: all canvas rendering, participant state, image loading, control binding, and PNG export logic.
- `assets/`: local image and SVG assets used by the renderer.

There is no package manager, build system, bundler, or backend in this repository.

## Run Locally

Open `index.html` directly in a browser, or serve the folder with a simple static server:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000/`.

## Validation

Use this quick syntax check after editing JavaScript:

```powershell
node --check .\app.js
```

For UI changes, manually open the page and verify:

- the canvas renders after assets load,
- participant controls update the preview,
- uploaded participant images render correctly,
- the PNG export button downloads a PNG without errors.

## Editing Notes

- Keep the app dependency-free unless the user explicitly asks for a build step or framework.
- Prefer small, direct edits to the existing HTML/CSS/vanilla JS structure.
- Keep asset paths relative to the repository root so the app works from both `file://` and a static server.
- 不能自制图标；所有图标必须使用腾讯会议软件原图标。不要引用外部资源，要把原图标复制到项目里并从本地 `assets/` 引用。
- The repository currently contains mojibake Chinese UI strings in `index.html` and `app.js`. Treat them as existing source content; fix encoding/text only when the task asks for it.
- Do not rewrite or remove local image assets unless the task specifically requires asset cleanup.
