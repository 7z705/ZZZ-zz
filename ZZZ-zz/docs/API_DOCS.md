# Tiny-Blog API Docs

## Overview

This frontend communicates directly with a backend HTTP API. The default Axios base URL configured in `src/main.js` is:

```txt
http://127.0.0.1:8082/
```

All request paths below are documented relative to that base URL.

## Authentication

### Login

- Method: `POST`
- Path: `/public/login`
- Used by: admin login page
- Auth required: No

Example request body:

```json
{
  "username": "<username>",
  "password": "<password>"
}
```

Example response shape:

```json
{
  "data": {
    "token": "<jwt-or-session-token>",
    "user": {
      "id": 1
    }
  },
  "meta": {
    "status": 200,
    "msg": "ok"
  }
}
```

### Token usage

- The frontend stores the login token in `window.sessionStorage`
- Subsequent private requests send the token in the `Authorization` header
- Upload requests also attach the same `Authorization` header manually

## Response Envelope

Most requests appear to follow this wrapper structure:

```json
{
  "data": {},
  "meta": {
    "status": 200,
    "msg": "ok"
  }
}
```

## Public Endpoints

### Blogs

#### `GET /public/blog`

Fetches blog list data for homepage and archives.

Query params used by the frontend:

```json
{
  "pageNum": 1,
  "pageSize": 5,
  "searchWords": ""
}
```

Example response shape:

```json
{
  "data": {
    "blogList": [],
    "total": 0
  },
  "meta": {
    "status": 200,
    "msg": "ok"
  }
}
```

#### `GET /public/blog/recommend`

Returns recommended blog items for the homepage sidebar.

#### `GET /public/blog/:blogId`

Returns rendered blog detail data for the public article page.

Expected fields in use:

```json
{
  "id": 1,
  "title": "string",
  "content": "<rendered-html>",
  "createTime": "datetime",
  "updateTime": "datetime",
  "views": 0,
  "firstPicture": "url",
  "commentEnable": true,
  "tags": [],
  "user": {}
}
```

#### `GET /public/blog/raw/:blogId`

Returns editable blog data for the admin edit page.

Expected fields in use:

```json
{
  "id": 1,
  "title": "string",
  "flag": "原创",
  "content": "markdown-content",
  "description": "string",
  "firstPicture": "url",
  "appreciation": false,
  "commentEnable": true,
  "recommend": false,
  "shareStatement": false,
  "published": false,
  "typeId": 1,
  "tagId": [1, 2],
  "userId": 1
}
```

#### `POST /public/blog/view/:blogId`

Increments article view count when the detail page loads.

### Comments

#### `GET /public/comment/:blogId`

Returns nested comments for the target blog.

Example comment shape:

```json
{
  "id": 1,
  "nickname": "string",
  "email": "<redacted@example.com>",
  "avatar": "url",
  "content": "string",
  "createTime": "datetime",
  "replyComments": []
}
```

#### `POST /public/comment`

Creates a new top-level comment or reply.

Request body used by the frontend:

```json
{
  "nickname": "string",
  "email": "<redacted@example.com>",
  "content": "string",
  "parentCommentId": -1,
  "blogId": 1
}
```

### Taxonomy

#### `GET /public/categories`

Returns category list. The frontend expects categories to include blog lists for category pages.

Example item:

```json
{
  "id": 1,
  "name": "string",
  "blogInfos": []
}
```

#### `GET /public/tags`

Returns tag list. The frontend expects tags to include blog lists for tag pages and tag cloud rendering.

Example item:

```json
{
  "id": 1,
  "name": "string",
  "blogInfos": []
}
```

### Profile and Statistics

#### `GET /public/user/default`

Returns the public default author profile used by the sidebar and about page.

Example item:

```json
{
  "id": 1,
  "nickname": "string",
  "avatar": "url",
  "moto": "string",
  "description": "markdown-or-html"
}
```

#### `GET /public/statistics`

Returns aggregate site counters.

Example response data:

```json
{
  "archivesNum": 0,
  "categoriesNum": 0,
  "tagsNum": 0
}
```

## Private Endpoints

All private endpoints require the `Authorization` header.

### User Profile

#### `GET /private/user/:id`

Returns current admin user info for the admin layout.

#### `PUT /private/user/:id`

Updates user profile fields edited in the admin dialog.

Fields observed in use:

```json
{
  "username": "<username>",
  "nickname": "string",
  "password": "<password>",
  "email": "<redacted@example.com>",
  "moto": "string",
  "description": "string",
  "avatar": "url"
}
```

#### `POST /private/user/upload`

Uploads avatar image.

- Triggered by: `el-upload`
- Header: `Authorization`
- Output used by frontend: `path`

### Blog Management

#### `GET /private/blog`

Returns paginated blog data for the admin manage page.

Query params used by the frontend:

```json
{
  "pageNum": 1,
  "pageSize": 5
}
```

#### `POST /private/blog`

Creates a new blog from the publish page.

Request body used by the frontend:

```json
{
  "title": "string",
  "flag": "原创",
  "content": "markdown",
  "description": "string",
  "appreciation": false,
  "commentEnable": true,
  "recommend": false,
  "shareStatement": false,
  "firstPicture": "url",
  "typeId": 1,
  "userId": 1,
  "tagId": [1, 2],
  "published": false
}
```

#### `PUT /private/blog`

Updates an existing blog from the edit page using the same general payload shape.

#### `DELETE /private/blog/:id`

Deletes a blog entry from the manage page.

#### `POST /private/blog/upload`

Uploads:

- article cover image
- inline Markdown editor images

Request content type:

```txt
multipart/form-data
```

Output used by the frontend:

```json
{
  "path": "uploaded-file-url"
}
```

### Category Management

#### `POST /private/categories`

Creates a category.

Request body:

```json
{
  "name": "string"
}
```

#### `DELETE /private/categories/:id`

Deletes a category.

### Tag Management

#### `POST /private/tags`

Creates a tag.

Request body:

```json
{
  "name": "string"
}
```

#### `DELETE /private/tags/:id`

Deletes a tag.

## Frontend Integration Notes

- `home.vue` reuses `GET /public/blog` for both initial feed loading and search
- `archives.vue` also uses `GET /public/blog`, but without explicit pagination params
- `detail.vue` transforms nested `replyComments` into a flattened two-level presentation
- `publish.vue` and `edit.vue` rely on the same category, tag, and upload APIs
- `manage.vue` mixes read-only public taxonomy endpoints with private create/delete operations

## Security and Documentation Notes

- Example usernames, passwords, emails, and personal contact fields are intentionally redacted here
- If the backend contract changes, update this file together with `feature_breakdown.md`
