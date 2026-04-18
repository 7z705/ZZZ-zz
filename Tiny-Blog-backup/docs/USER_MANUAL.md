# Tiny-Blog User Manual

## 1. What This System Does

Tiny-Blog is a personal blog frontend with two main usage modes:

- public browsing for readers
- admin management for the blog owner

Readers can browse articles, filter by category or tag, and leave comments. Administrators can log in, publish posts, edit content, manage categories and tags, and update profile information.

## 2. Reader Guide

### Homepage

Open `/home` to access the main blog feed.

You can:

- browse the latest posts
- use pagination to switch pages
- view recommended posts in the sidebar
- click a tag in the rotating tag cloud
- use the top search box to filter blog results on the homepage

### Article Detail

Open any article to enter the detail page.

The page supports:

- article cover image display
- Markdown-rendered content
- code highlighting
- math formula rendering
- table of contents navigation
- comment list and reply actions

When the page opens, the system also records one view for that article.

### Archives

Open `/archives` to browse articles in a timeline-style archive list.

### Categories

Open `/categories` to browse posts grouped by category.

You can switch categories and view the articles under the selected category.

### Tags

Open `/tags` to browse posts grouped by tag.

Click a tag to load the corresponding article list.

### About

Open `/about` to read the site owner profile and description content.

## 3. Admin Guide

### Step 1: Log In

Open `/admin` and enter your username and password.

After a successful login:

- the frontend stores the returned token in browser session storage
- you are redirected to the admin workspace

### Step 2: Use the Admin Workspace

The admin area is organized into two main sections:

- Publish
- Manage

The user avatar dropdown also provides:

- return to homepage
- edit personal information
- upload avatar
- log out

### Publish a Blog Post

Go to `/blogAdmin/:id/publish`.

Fill in:

- title
- article type
- summary
- Markdown content
- category
- tags
- optional cover image
- article switches such as comments, recommendation, appreciation, and share statement

Then choose:

- Save: stores the post as a draft
- Publish: stores the post as a published article

### Edit an Existing Blog Post

Go to the manage page and click the edit button on a blog row.

The edit page loads the current article content, category, tags, and settings. After changes, you can save as draft again or publish the updated content.

### Manage Blog List

Go to `/blogAdmin/:id/manage`.

You can:

- browse blog records in a paginated table
- inspect title, timestamps, author, category, tags, and publish status
- delete a blog after confirmation
- jump to the edit page

### Manage Categories

On the manage page, use the category section to:

- create a new category
- delete an existing category

### Manage Tags

On the manage page, use the tag section to:

- create a new tag
- delete an existing tag

### Edit Personal Profile

Use the avatar dropdown in the admin header and choose the profile edit action.

You can modify:

- nickname
- password
- email
- motto
- personal description

### Upload Avatar

Use the avatar dropdown and choose the upload action.

Current frontend validation expects:

- JPEG format
- file size under 2 MB

## 4. Operational Notes

### Backend dependency

This frontend requires a backend API service. If the backend is unavailable, login, blog loading, comments, publishing, and uploads will fail.

### Local base URL

The frontend currently points to:

```txt
http://127.0.0.1:8082/
```

If your backend runs elsewhere, update the Axios base URL in `src/main.js`.

### Authentication scope

Admin pages depend on a token in `sessionStorage`. If the token is missing, protected routes redirect back to `/admin`.

### Upload behavior

Avatar, cover image, and Markdown inline image upload all require a valid authenticated session.

## 5. Troubleshooting

### Cannot log in

- confirm the backend service is running
- confirm the login API is reachable
- confirm the username and password are correct

### Public pages load but no data appears

- confirm the backend API base URL is correct
- check whether `/public/*` endpoints are available
- inspect browser console and network requests

### Admin page redirects back to login

- confirm the login request succeeded
- confirm the token exists in `sessionStorage`
- confirm the token is accepted by the backend

### Image upload fails

- confirm the upload endpoint is available
- confirm the token is still valid
- confirm the file format and size meet frontend validation rules

## 6. Privacy Notes

- Personal contact details present in the current UI should be reviewed before production deployment
- Example account data should be replaced with real environment-specific values
- Do not document or distribute real secrets inside frontend source files
