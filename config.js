// Blog Configuration
const BLOG_CONFIG = {
    name: "CloudSlate",
    description: "A clean, secure, and student-friendly platform built for speed, creativity, and effortless browsing.",
    url: "https://cloudslate.pages.dev", // Cloudflare Pages domain
    author: "Muhammad Khuhro",
    
    // Contact Information
    contact: {
        email: "info.cloudslate@gmail.com",
        whatsapp: "+923258423208"
    },
    
    // Vision Statement
    vision: "At CloudSlate, we envision a world where technology knowledge is accessible, practical, and transformative. We're committed to providing high-quality content that bridges the gap between complex technical concepts and real-world applications. Our mission is to empower developers, students, and tech enthusiasts to build innovative solutions, stay ahead of industry trends, and contribute to the ever-evolving digital landscape. Through comprehensive tutorials, insightful articles, and community engagement, we aim to be your trusted companion on your journey to technological excellence.",
    
    // Social Media Links
    social: {
        twitter: "https://twitter.com/cloudslate",
        github: "https://github.com/cloudslate",
        linkedin: "https://linkedin.com/company/cloudslate"
    },
    
    // Google AdSense
    adsense: {
        enabled: true, // Set to true when you have AdSense approved
        publisherId: "ca-pub-9866065970678838", // Your AdSense Publisher ID
        adUnits: {
            top: "1234567890", // Ad unit ID for top banner
            inlineTop: "1234567891", // Ad unit ID for inline top
            inlineBottom: "1234567892", // Ad unit ID for inline bottom
            sidebar: "1234567893" // Ad unit ID for sidebar (if needed)
        }
    },
    
    // Newsletter (integrate with your email service)
    newsletter: {
        enabled: true,
        service: "mailchimp", // Options: "mailchimp", "convertkit", "custom"
        // Add your newsletter service configuration here
    },
    
    // Number of featured posts to show
    featuredPostsCount: 3,
    
    // Posts per page
    postsPerPage: 9
};

// Blog Posts Data
// Each post should be stored as a JSON object
// You can also load posts from separate JSON files for better organization
const BLOG_POSTS = [
    {
        id: "getting-started-with-web-development",
        title: "Getting Started with Web Development in 2024",
        slug: "getting-started-with-web-development",
        excerpt: "A comprehensive guide to starting your journey in web development, covering modern tools, frameworks, and best practices.",
        content: `# Getting Started with Web Development in 2024

Web development has evolved significantly over the years. In this guide, we'll explore the modern landscape of web development and how to get started.

## Why Web Development?

Web development offers numerous opportunities:
- High demand in the job market
- Creative and technical challenges
- Remote work possibilities
- Continuous learning

## Essential Technologies

### HTML
HTML (HyperText Markup Language) is the foundation of every website. It structures content on the web.

### CSS
CSS (Cascading Style Sheets) makes websites beautiful and responsive.

### JavaScript
JavaScript brings interactivity to websites and is now used for both frontend and backend development.

## Getting Started

1. **Learn the Basics**: Start with HTML, CSS, and JavaScript
2. **Practice Regularly**: Build small projects
3. **Join Communities**: Connect with other developers
4. **Build a Portfolio**: Showcase your work

## Conclusion

Web development is a rewarding field with endless possibilities. Start your journey today!`,
        author: "Muhammad Khuhro",
        date: "2024-01-15",
        category: "Web Development",
        tags: ["HTML", "CSS", "JavaScript", "Beginner"],
        featured: true,
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
        readTime: "5 min read"
    },
    {
        id: "responsive-design-principles",
        title: "Modern Responsive Design Principles",
        slug: "responsive-design-principles",
        excerpt: "Learn the key principles of responsive web design and how to create websites that work beautifully on all devices.",
        content: `# Modern Responsive Design Principles

Responsive design is no longer optional—it's essential. Here's how to create websites that adapt to any screen size.

## Mobile-First Approach

Start designing for mobile devices first, then scale up. This ensures your site works on the smallest screens.

## Flexible Grids

Use CSS Grid and Flexbox to create layouts that adapt to different screen sizes.

## Media Queries

Media queries allow you to apply different styles based on device characteristics.

## Performance Matters

Optimize images, minimize CSS and JavaScript, and use modern formats like WebP.

## Conclusion

Responsive design is about creating great experiences for all users, regardless of their device.`,
        author: "Muhammad Khuhro",
        date: "2024-01-10",
        category: "Design",
        tags: ["CSS", "Responsive Design", "Mobile"],
        featured: true,
        image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800",
        readTime: "4 min read"
    },
    {
        id: "seo-optimization-guide",
        title: "Complete SEO Optimization Guide for Bloggers",
        slug: "seo-optimization-guide",
        excerpt: "Master SEO techniques to improve your blog's visibility and attract more organic traffic.",
        content: `# Complete SEO Optimization Guide for Bloggers

Search Engine Optimization (SEO) is crucial for driving organic traffic to your blog. Here's a comprehensive guide.

## On-Page SEO

### Title Tags
Your title tag is one of the most important SEO elements. Keep it under 60 characters and include your target keyword.

### Meta Descriptions
Write compelling meta descriptions that encourage clicks while accurately describing your content.

### Headings
Use proper heading hierarchy (H1, H2, H3) to structure your content.

## Content Quality

- Write original, valuable content
- Use keywords naturally
- Include internal and external links
- Optimize images with alt text

## Technical SEO

- Ensure fast page load times
- Make your site mobile-friendly
- Use proper URL structure
- Implement structured data

## Conclusion

SEO is a long-term strategy. Focus on creating great content and following best practices consistently.`,
        author: "Muhammad Khuhro",
        date: "2024-01-05",
        category: "SEO",
        tags: ["SEO", "Marketing", "Content"],
        featured: true,
        image: "https://images.unsplash.com/photo-1432888622747-4eb9a8f2d523?w=800",
        readTime: "6 min read"
    },
    {
        id: "javascript-es6-features",
        title: "Essential ES6+ JavaScript Features Every Developer Should Know",
        slug: "javascript-es6-features",
        excerpt: "Explore the most important ES6 and modern JavaScript features that will make you a better developer.",
        content: `# Essential ES6+ JavaScript Features

Modern JavaScript has introduced many powerful features. Let's explore the most important ones.

## Arrow Functions

Arrow functions provide a concise syntax for writing functions:

\`\`\`javascript
const add = (a, b) => a + b;
\`\`\`

## Destructuring

Destructuring allows you to extract values from arrays and objects:

\`\`\`javascript
const { name, age } = person;
const [first, second] = array;
\`\`\`

## Template Literals

Template literals make string interpolation easier:

\`\`\`javascript
const message = \`Hello, \${name}!\`;
\`\`\`

## Async/Await

Async/await makes asynchronous code more readable:

\`\`\`javascript
async function fetchData() {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}
\`\`\`

## Conclusion

These features make JavaScript more powerful and easier to work with. Start using them in your projects!`,
        author: "Muhammad Khuhro",
        date: "2024-01-01",
        category: "JavaScript",
        tags: ["JavaScript", "ES6", "Programming"],
        featured: false,
        image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800",
        readTime: "7 min read"
    },
    {
        id: "css-grid-vs-flexbox",
        title: "CSS Grid vs Flexbox: When to Use Each",
        slug: "css-grid-vs-flexbox",
        excerpt: "Understanding when to use CSS Grid and when to use Flexbox can make your layouts more efficient and maintainable.",
        content: `# CSS Grid vs Flexbox: When to Use Each

Both CSS Grid and Flexbox are powerful layout tools, but they serve different purposes.

## Flexbox

Use Flexbox for:
- One-dimensional layouts (row or column)
- Aligning items within a container
- Distributing space in a single direction

## CSS Grid

Use CSS Grid for:
- Two-dimensional layouts (rows and columns)
- Complex page layouts
- Precise item placement

## When to Use Both

You can use both together! Use Grid for the overall layout and Flexbox for component-level layouts.

## Conclusion

Understanding both tools gives you maximum flexibility in creating layouts.`,
        author: "Muhammad Khuhro",
        date: "2023-12-28",
        category: "CSS",
        tags: ["CSS", "Grid", "Flexbox", "Layout"],
        featured: false,
        image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800",
        readTime: "5 min read"
    },
    {
        id: "web-performance-tips",
        title: "10 Web Performance Tips for Faster Websites",
        slug: "web-performance-tips",
        excerpt: "Learn practical tips to improve your website's performance and provide a better user experience.",
        content: `# 10 Web Performance Tips for Faster Websites

Website performance directly impacts user experience and SEO. Here are 10 tips to make your site faster.

## 1. Optimize Images

- Use modern formats like WebP
- Compress images before uploading
- Implement lazy loading

## 2. Minimize HTTP Requests

- Combine CSS and JavaScript files
- Use CSS sprites for icons
- Remove unused code

## 3. Enable Caching

Set proper cache headers to reduce server load and improve load times.

## 4. Use CDN

Content Delivery Networks distribute your content globally for faster access.

## 5. Minify Code

Minify CSS, JavaScript, and HTML to reduce file sizes.

## 6. Optimize Fonts

- Use font-display: swap
- Limit font weights
- Preload critical fonts

## 7. Reduce Redirects

Minimize redirects as they add latency.

## 8. Enable Compression

Use Gzip or Brotli compression.

## 9. Optimize Critical Rendering Path

Load critical CSS inline and defer non-critical resources.

## 10. Monitor Performance

Use tools like Lighthouse and PageSpeed Insights to track performance.

## Conclusion

Performance optimization is an ongoing process. Regularly audit and improve your site's speed.`,
        author: "Muhammad Khuhro",
        date: "2023-12-25",
        category: "Performance",
        tags: ["Performance", "Optimization", "Web Development"],
        featured: false,
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
        readTime: "8 min read"
    }
];

