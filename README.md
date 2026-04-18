# Tiny-Blog

Tiny-Blog is a personal blog frontend built with `Vue 2`, `Vue Router`, `Element UI`, and `Axios`. It provides both a public reading experience and an authenticated admin workspace for publishing and managing content.

This repository contains the frontend application only. It expects a compatible backend service for authentication, blog data, comments, categories, tags, and file uploads.

## Features

- Public homepage with paginated blog feed
- Recommended posts and rotating tag cloud
- Blog detail page with Markdown rendering, code highlighting, math formula rendering, and comments
- Archives, categories, tags, and about pages
- Admin login and token-based route protection
- Blog publishing, editing, draft saving, and deletion
- Category and tag management
- Avatar, cover image, and inline Markdown image upload

## Tech Stack

- `vue@2.6`
- `vue-router@3`
- `element-ui`
- `axios`
- `mavon-editor`
- `prismjs`
- `katex`
- `dayjs`
- `less`
- `@vue/cli-service@5`

## Project Structure

```txt
.
|- public/          Static entry HTML and favicon
|- screenshots/     Screenshots used in documentation
|- src/
|  |- assets/       Images and iconfont files
|  |- components/   Reusable UI components
|  |- element/      Element UI registration
|  |- page/         Route-level pages
|  |- router/       Route definitions and auth guard
|  |- style/        Global styles
|  |- App.vue       Root component
|  `- main.js       App bootstrap and global configuration
|- package.json     Dependencies and npm scripts
`- vue.config.js    Vue CLI config
```

## Prerequisites

Before starting the frontend, make sure:

- `Node.js` and `npm` are installed
- the backend service is running
- the backend base URL matches the frontend Axios config in `src/main.js`

The current frontend default is:

```txt
http://127.0.0.1:8082/
```

## Quick Start

```bash
npm install
npm run serve
```

Open the local development URL shown by Vue CLI after startup.

## Available Scripts

- `npm run serve` starts the development server
- `npm run build` builds the production bundle
- `npm run lint` runs ESLint

## Runtime Notes

- Public pages are mounted under the shared layout in `src/page/index.vue`
- Admin pages are mounted under `src/page/blogAdmin.vue`
- Authenticated requests use a token stored in `window.sessionStorage`
- An Axios interceptor automatically injects the `Authorization` header
- Admin child routes are protected by a router guard

## Main Pages

- `/home` homepage feed
- `/archives` archive timeline
- `/detail/:blogId` blog detail
- `/categories` category browsing
- `/tags` tag browsing
- `/about` author/about page
- `/admin` admin login
- `/blogAdmin/:id/publish` create article
- `/blogAdmin/:id/manage` manage articles, tags, and categories
- `/blogAdmin/:id/edit/:blogId` edit article

## Documentation

- Project overview: `project_overview.md`
- Feature breakdown: `feature_breakdown.md`
- API reference: `API_DOCS.md`
- User manual: `USER_MANUAL.md`

## Security Notes

- No obvious private keys were found in the repository during documentation generation
- Example credentials and personal contact details in UI templates should be treated as placeholders or demo content
- Review hardcoded personal profile data before public deployment
