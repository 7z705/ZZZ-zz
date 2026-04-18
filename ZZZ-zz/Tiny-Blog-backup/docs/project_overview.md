# Tiny-Blog Project Overview

## 1. Project Summary

`Tiny-Blog` is a personal blog frontend built with `Vue 2` and `Vue CLI`. It provides public-facing blog pages and an admin area for content publishing and management. The repository currently contains the frontend application only; backend capabilities are expected to be provided by a separate service.

The frontend sends API requests through `Axios` and is configured by default to use:

```txt
http://127.0.0.1:8082/
```

No obvious secrets or private keys were found during the stage-one scan.

## 2. Directory Responsibilities

```txt
.
|- public/          Static HTML shell and favicon
|- screenshots/     Project screenshots used by existing docs
|- src/
|  |- assets/       Images and iconfont assets
|  |- components/   Reusable UI components
|  |- element/      Element UI component registration
|  |- page/         Route-level page views
|  |- router/       Vue Router configuration and route guard
|  |- style/        Global stylesheet and TOC stylesheet
|  |- App.vue       Root app container
|  `- main.js       Application bootstrap and global plugin setup
|- babel.config.js  Babel config
|- jsconfig.json    JS path/intellisense config
|- package.json     Dependency and script manifest
`- vue.config.js    Vue CLI build config
```

### `src/` details

- `src/main.js`: bootstraps Vue, registers `mavon-editor`, `Element UI`, `Axios`, `dayjs`, KaTeX rendering, global styles, iconfont assets, and the event bus.
- `src/router/index.js`: defines public routes, admin routes, nested views, and token-based navigation protection for admin pages.
- `src/page/`: contains all route pages such as homepage, archives, blog detail, category/tag pages, login, publishing, editing, and management views.
- `src/components/`: contains reusable pieces including blog summary cards, general info widgets, and a word cloud visualization.
- `src/element/index.js`: performs on-demand registration of `Element UI` components and global message helpers.
- `src/style/`: stores cross-page styling and table-of-contents styles.

## 3. Technology Stack

### Core framework

- `vue@2.6.14`
- `vue-router@3.5.3`
- `@vue/cli-service@5`

### UI and styling

- `element-ui`
- `animate.css`
- `less` and `less-loader`
- `github-markdown-css`

### Content rendering

- `mavon-editor` for Markdown editing/rendering
- `prismjs` for code highlighting
- `katex` for math formula rendering
- `tocbot` for table of contents generation

### Data and utilities

- `axios` for HTTP requests
- `dayjs` for date formatting
- `core-js` for compatibility support

### Build and lint

- `babel`
- `eslint`
- `eslint-plugin-vue`

## 4. Application Entry and Runtime Notes

- The app entry is `src/main.js`.
- The root component is `src/App.vue`.
- The router uses lazy-loaded page components.
- Admin routes require a token from `window.sessionStorage`.
- `axios.defaults.baseURL` is hardcoded to local backend address `http://127.0.0.1:8082/`.
- `vue.config.js` disables `lintOnSave`.

## 5. Available npm Commands

```bash
npm install
npm run serve
npm run build
npm run lint
```

### Command meanings

- `npm install`: install project dependencies.
- `npm run serve`: start the Vue development server.
- `npm run build`: create a production build.
- `npm run lint`: run ESLint checks.

## 6. Startup Prerequisites

1. Install a recent `Node.js` version that supports modern ES features used by Vue CLI 5.
2. Install dependencies with `npm install`.
3. Ensure the backend blog server is running and reachable at `http://127.0.0.1:8082/`, or update the Axios base URL before starting the frontend.
4. Start the frontend with `npm run serve`.

## 7. Current Scope Assessment

- This repository is the frontend client for the blog system.
- Public features and admin features are both present in the same SPA.
- Backend API definitions are not stored in a dedicated client SDK layer; requests appear to be made directly from page components.
- Stage two should inspect route pages and component files to extract functional modules, API endpoints, and data structures in detail.
