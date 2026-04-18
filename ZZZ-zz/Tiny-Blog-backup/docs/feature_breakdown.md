# Tiny-Blog Feature Breakdown

## 1. Functional Module Overview

The project is a single-page blog frontend that combines a public reading experience with an authenticated admin workspace.

### Public modules

- Homepage feed: paginated blog list, recommended posts, sidebar profile card, and tag cloud.
- Blog detail: rendered article body, TOC, code highlighting, math rendering, comments, and view count tracking.
- Archives: timeline view of published posts.
- Categories: category switcher with blog summaries under each category.
- Tags: tag selector with filtered blog summaries.
- About: author profile rendered from Markdown-style content.

### Admin modules

- Login: username/password authentication and token storage.
- Admin shell: authenticated layout, user dropdown actions, profile editing, avatar upload.
- Publish blog: create draft or published article, upload cover image, upload inline Markdown images.
- Manage blog: paginated admin blog table, delete article, jump to edit page, create/delete categories, create/delete tags.
- Edit blog: load raw article data, modify content, re-save as draft or published post.

### Shared modules

- `generInfo.vue`: loads default author profile and aggregate site statistics for multiple pages.
- `blogSummary.vue`: shared blog list card used by homepage, categories, and tags.
- `wordCloud.vue`: renders a rotating tag cloud based on tag data.
- Global event bus: homepage search is triggered from the public layout header and consumed by the home page.

## 2. Page and Route List

| Route | View | Purpose | Auth |
|---|---|---|---|
| `/` | redirect | Redirects to homepage | No |
| `/home` | `src/page/index.vue` + `src/page/home.vue` | Public shell and homepage feed | No |
| `/archives` | `src/page/index.vue` + `src/page/archives.vue` | Archive timeline | No |
| `/detail/:blogId` | `src/page/index.vue` + `src/page/detail.vue` | Blog detail and comments | No |
| `/categories` | `src/page/index.vue` + `src/page/categories.vue` | Category-based browsing | No |
| `/tags` | `src/page/index.vue` + `src/page/tags.vue` | Tag-based browsing | No |
| `/about` | `src/page/index.vue` + `src/page/about.vue` | Author/about page | No |
| `/admin` | `src/page/login.vue` | Admin login | No |
| `/blogAdmin/:id/publish` | `src/page/blogAdmin.vue` + `src/page/publish.vue` | Create article | Yes |
| `/blogAdmin/:id/manage` | `src/page/blogAdmin.vue` + `src/page/manage.vue` | Manage articles, categories, tags | Yes |
| `/blogAdmin/:id/edit/:blogId` | `src/page/blogAdmin.vue` + `src/page/edit.vue` | Edit existing article | Yes |

### Route behavior

- Public pages share a common shell in `src/page/index.vue`.
- Admin pages share a separate shell in `src/page/blogAdmin.vue`.
- Admin child routes use a simple route guard based on `sessionStorage.token`.
- Search is emitted from the public shell and handled only by the homepage module.

## 3. API Endpoint Inventory

The frontend talks directly to backend endpoints through `Axios`. Base URL is configured in `src/main.js` as a local backend address.

### Public endpoints

| Method | Endpoint | Used by | Purpose |
|---|---|---|---|
| `POST` | `/public/login` | Login page | Authenticate admin user |
| `GET` | `/public/blog` | Home, Archives | Fetch paginated or full blog list |
| `GET` | `/public/blog/recommend` | Home | Fetch recommended blogs |
| `GET` | `/public/blog/:blogId` | Detail | Fetch rendered blog detail |
| `GET` | `/public/blog/raw/:blogId` | Edit | Fetch raw editable blog data |
| `POST` | `/public/blog/view/:blogId` | Detail | Increase blog view count |
| `GET` | `/public/comment/:blogId` | Detail | Fetch comment tree for a blog |
| `POST` | `/public/comment` | Detail | Submit a comment or reply |
| `GET` | `/public/categories` | Categories, Publish, Edit, Manage | Fetch category list |
| `GET` | `/public/tags` | Tags, Publish, Edit, Manage, WordCloud | Fetch tag list |
| `GET` | `/public/user/default` | About, GeneralInfo | Fetch default author profile |
| `GET` | `/public/statistics` | GeneralInfo | Fetch aggregate site counters |

### Private endpoints

| Method | Endpoint | Used by | Purpose |
|---|---|---|---|
| `GET` | `/private/user/:id` | Admin shell | Fetch current user profile |
| `PUT` | `/private/user/:id` | Admin shell | Update current user profile |
| `POST` | `/private/blog` | Publish | Create a new blog |
| `PUT` | `/private/blog` | Edit | Update an existing blog |
| `GET` | `/private/blog` | Manage | Fetch admin blog list |
| `DELETE` | `/private/blog/:id` | Manage | Delete a blog |
| `POST` | `/private/categories` | Manage | Create category |
| `DELETE` | `/private/categories/:id` | Manage | Delete category |
| `POST` | `/private/tags` | Manage | Create tag |
| `DELETE` | `/private/tags/:id` | Manage | Delete tag |
| `POST` | `/private/user/upload` | Admin shell upload dialog | Upload avatar |
| `POST` | `/private/blog/upload` | Publish, Edit | Upload article cover or inline image |

### Auth handling

- The token returned by `/public/login` is stored in `window.sessionStorage`.
- An Axios request interceptor injects the token into the `Authorization` header.
- Upload components also manually pass the same `Authorization` header.

## 4. Core Data Models

The frontend does not define a dedicated typed model layer, but component usage reveals the following effective structures.

### Response envelope

```json
{
  "data": {},
  "meta": {
    "status": 200,
    "msg": "ok"
  }
}
```

### User

```json
{
  "id": 1,
  "username": "redacted",
  "nickname": "string",
  "password": "string",
  "email": "redacted@example.com",
  "avatar": "string-url",
  "moto": "string",
  "description": "markdown-or-html-string"
}
```

### Blog summary

```json
{
  "id": 1,
  "title": "string",
  "description": "string",
  "createTime": "datetime",
  "updateTime": "datetime",
  "views": 0
}
```

### Blog detail / editable blog

```json
{
  "id": 1,
  "title": "string",
  "flag": "原创|转载|翻译",
  "content": "html-or-markdown",
  "description": "string",
  "firstPicture": "string-url",
  "appreciation": true,
  "commentEnable": true,
  "recommend": false,
  "shareStatement": false,
  "published": true,
  "typeId": 1,
  "tagId": [1, 2],
  "type": {
    "id": 1,
    "name": "string"
  },
  "tags": [
    { "id": 1, "name": "string" }
  ],
  "user": {
    "id": 1,
    "nickname": "string"
  }
}
```

### Blog list payload

```json
{
  "blogList": [
    {
      "id": 1,
      "title": "string"
    }
  ],
  "total": 100
}
```

### Category

```json
{
  "id": 1,
  "name": "string",
  "blogInfos": [
    {
      "id": 1,
      "title": "string"
    }
  ]
}
```

### Tag

```json
{
  "id": 1,
  "name": "string",
  "blogInfos": [
    {
      "id": 1,
      "title": "string"
    }
  ]
}
```

### Comment

```json
{
  "id": 1,
  "nickname": "string",
  "email": "redacted@example.com",
  "avatar": "string-url",
  "content": "string",
  "createTime": "datetime",
  "blogId": 1,
  "parentCommentId": -1,
  "replyComments": []
}
```

### Statistics

```json
{
  "archivesNum": 0,
  "categoriesNum": 0,
  "tagsNum": 0
}
```

## 5. Data Flow Summary

### Public browsing flow

1. Public shell loads and displays navigation plus search entry.
2. Homepage requests paginated blogs and recommended blogs.
3. Shared sidebar components request author profile, site statistics, and tags.
4. Clicking a blog opens detail view, which loads article data, comments, TOC, syntax highlighting, math rendering, and then increments views.

### Search flow

1. User enters text in the header search box on `/home`.
2. `index.vue` emits a `search` event through the global event bus.
3. `home.vue` receives the event, updates `blogQuery.searchWords`, and reloads `/public/blog`.

### Comment flow

1. Detail page loads nested comments from `/public/comment/:blogId`.
2. Frontend flattens child replies into a two-level presentation for rendering.
3. User submits comment form to `/public/comment`.
4. After success, the page refreshes comments.

### Admin auth flow

1. Login form sends credentials to `/public/login`.
2. Token is stored in `sessionStorage`.
3. Router guard checks token before entering admin child routes.
4. Axios interceptor attaches the token to subsequent private requests.

### Content authoring flow

1. Publish or edit page loads categories and tags.
2. User edits Markdown content through `mavon-editor`.
3. Cover image and inline images are uploaded through private upload endpoints.
4. Article is saved as draft or published via `/private/blog`.
5. On success, the user is redirected to the manage page.

### Admin management flow

1. Manage page loads blog table, categories, and tags.
2. Category and tag chips support direct create/delete actions.
3. Blog table supports pagination, edit navigation, and deletion with confirmation.

## 6. Sensitive Information Handling Notes

- Hardcoded sample credentials appear in the login form defaults; they should be treated as demo values and are not repeated here.
- Static personal contact details and profile links exist in UI templates; they should be reviewed before public redistribution.
- Documentation in later stages should replace personal contact fields, example emails, usernames, and upload targets with placeholders where appropriate.

## 7. Stage-Three Inputs

The next stage can safely build on this document together with `project_overview.md` to generate:

- a polished root `README.md`
- an `API_DOCS.md` for frontend-to-backend integration
- a user manual covering public browsing and admin workflows
