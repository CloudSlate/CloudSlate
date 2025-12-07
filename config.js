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
            top: "1763336908", // Ad unit ID for top banner
            inlineTop: "1763336908", // Ad unit ID for inline top
            inlineBottom: "1763336908", // Ad unit ID for inline bottom
            sidebar: "1763336908" // Ad unit ID for sidebar (if needed)
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
// This array is kept empty as a fallback only
// All blog posts are now managed through Sanity CMS
// Visit: https://cloudslate.sanity.studio to create and manage posts
const BLOG_POSTS = [];

