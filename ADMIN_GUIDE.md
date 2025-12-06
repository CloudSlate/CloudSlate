# Admin Panel Guide

## Accessing the Admin Panel

⚠️ **SECURITY NOTE**: The admin panel is hidden from public view. Only access it via direct URL.

1. Navigate to `admin.html` directly (bookmark this URL for easy access)
2. Default password: `admin123`
3. **IMPORTANT**: Change the password immediately after first login!
4. **DO NOT** share the admin URL or link to it from public pages

## Features

### Dashboard
- View statistics (total posts, published posts, categories)
- See recent posts
- Quick access to edit posts

### Posts Management
- **View All Posts**: See all your blog posts in a table
- **Create New Post**: Add new blog posts with full markdown support
- **Edit Post**: Click "Edit" on any post to modify it
- **Delete Post**: Remove posts you no longer need
- **Search**: Filter posts by title or category
- **Export/Import**: Backup and restore your posts

### Categories
- View all categories
- See post count per category
- Categories are automatically created when you add posts

### Settings
- **Change Password**: Update your admin password
- **Export All Data**: Download all posts and settings
- **Import Data**: Restore from backup
- **Clear All Data**: Remove all posts (use with caution!)

## Creating a New Post

1. Click "New Post" in the sidebar
2. Fill in the required fields:
   - **Title**: Post title
   - **Slug**: URL-friendly version (auto-generated from title)
   - **Excerpt**: Short description
   - **Content**: Full post content in Markdown format
   - **Category**: Post category
   - **Tags**: Comma-separated tags
   - **Date**: Publication date
   - **Author**: Author name
   - **Read Time**: Estimated reading time
   - **Image URL**: Featured image
   - **Featured**: Check to feature on homepage
3. Click "Save Post"
4. Use "Preview" to see how it will look

## Markdown Support

The admin panel supports full Markdown syntax:

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*

- List item 1
- List item 2

1. Numbered item 1
2. Numbered item 2

[Link text](https://example.com)

![Image alt](https://example.com/image.jpg)

\`\`\`javascript
// Code block
const example = "code";
\`\`\`
```

## Data Storage

- Posts are stored in browser localStorage
- Data persists across sessions
- Export your data regularly for backup
- Import to restore on different devices/browsers

## Security Notes

⚠️ **Important Security Information:**

1. **Change Default Password**: The default password is `admin123`. Change it immediately!
2. **LocalStorage**: Data is stored locally in the browser. If you clear browser data, posts will be lost unless exported.
3. **No Server**: This is a client-side admin panel. For production use, consider:
   - Adding a backend API
   - Using a headless CMS
   - Implementing proper authentication
4. **Backup Regularly**: Export your data frequently to prevent loss

## Export/Import

### Export Posts
1. Go to "Posts" section
2. Click "Export" button
3. A JSON file will be downloaded with all your posts

### Import Posts
1. Go to "Posts" section
2. Click "Import" button
3. Select a previously exported JSON file
4. Confirm import (this will replace existing posts)

### Export All Data
1. Go to "Settings" section
2. Click "Export All Data"
3. Downloads all posts and configuration

## Tips

- Use the preview feature before publishing
- Keep slugs URL-friendly (lowercase, hyphens)
- Add featured images for better visual appeal
- Use consistent categories for better organization
- Export data before making major changes
- Test posts on the main site after creating them

## Troubleshooting

**Can't login?**
- Check if you changed the password
- Clear browser localStorage and try default password
- Check browser console for errors

**Posts not showing on main site?**
- Make sure you saved the post
- Check if post has a valid date
- Clear browser cache and reload

**Import not working?**
- Ensure file is valid JSON
- Check file format matches export format
- Try exporting first, then importing to test

## Future Enhancements

Consider adding:
- Image upload functionality
- Draft posts
- Scheduled publishing
- Post templates
- Bulk operations
- Analytics integration

---

**Need Help?** Contact: info.cloudslate@gmail.com

