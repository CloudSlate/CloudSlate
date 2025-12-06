// Admin Panel JavaScript

// Admin Configuration
const ADMIN_CONFIG = {
    password: 'admin123', // Default password - change this!
    storageKey: 'cloudslate_admin_posts',
    passwordKey: 'cloudslate_admin_password'
};

// Initialize Admin Panel
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    setupEventListeners();
    loadCategoriesList();
});

// ============================================
// AUTHENTICATION
// ============================================

function checkAuth() {
    const isAuthenticated = sessionStorage.getItem('admin_authenticated') === 'true';
    const savedPassword = localStorage.getItem(ADMIN_CONFIG.passwordKey) || ADMIN_CONFIG.password;
    
    if (isAuthenticated) {
        showDashboard();
    } else {
        showLogin();
    }
}

function showLogin() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('admin-dashboard').classList.add('hidden');
}

function showDashboard() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('admin-dashboard').classList.remove('hidden');
    loadDashboard();
}

function setupEventListeners() {
    // Login form
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    // Logout
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    
    // Navigation
    document.querySelectorAll('.admin-nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.getAttribute('data-section');
            showSection(section);
        });
    });
    
    // Post form
    document.getElementById('post-form').addEventListener('submit', handlePostSubmit);
    
    // Post actions
    document.getElementById('preview-post-btn').addEventListener('click', previewPost);
    document.getElementById('cancel-edit-btn').addEventListener('click', cancelEdit);
    
    // Export/Import
    document.getElementById('export-posts').addEventListener('click', exportPosts);
    document.getElementById('import-posts').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', handleImport);
    
    // Settings
    document.getElementById('change-password-btn').addEventListener('click', changePassword);
    document.getElementById('export-all-btn').addEventListener('click', exportAllData);
    document.getElementById('import-all-btn').addEventListener('click', () => {
        document.getElementById('import-all-file').click();
    });
    document.getElementById('import-all-file').addEventListener('change', handleImportAll);
    document.getElementById('clear-all-btn').addEventListener('click', clearAllData);
    
    // Preview modal
    document.getElementById('close-preview').addEventListener('click', () => {
        document.getElementById('preview-modal').classList.add('hidden');
    });
    
    // Search posts
    document.getElementById('search-posts').addEventListener('input', filterPosts);
    
    // Auto-generate slug from title
    document.getElementById('post-title').addEventListener('input', (e) => {
        if (!document.getElementById('post-slug').value || document.getElementById('post-slug').dataset.edited !== 'true') {
            const slug = e.target.value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            document.getElementById('post-slug').value = slug;
        }
    });
    
    document.getElementById('post-slug').addEventListener('input', function() {
        this.dataset.edited = 'true';
    });
}

function handleLogin(e) {
    e.preventDefault();
    const password = document.getElementById('admin-password').value;
    const savedPassword = localStorage.getItem(ADMIN_CONFIG.passwordKey) || ADMIN_CONFIG.password;
    
    if (password === savedPassword) {
        sessionStorage.setItem('admin_authenticated', 'true');
        showDashboard();
        document.getElementById('login-error').classList.add('hidden');
    } else {
        document.getElementById('login-error').textContent = 'Incorrect password';
        document.getElementById('login-error').classList.remove('hidden');
    }
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('admin_authenticated');
        showLogin();
        document.getElementById('login-form').reset();
    }
}

// ============================================
// NAVIGATION
// ============================================

function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(sec => {
        sec.classList.add('hidden');
    });
    
    // Remove active class from nav items
    document.querySelectorAll('.admin-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    const sectionElement = document.getElementById(`section-${section}`);
    if (sectionElement) {
        sectionElement.classList.remove('hidden');
    }
    
    // Add active class to nav item
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    
    // Update page title
    const titles = {
        'dashboard': 'Dashboard',
        'posts': 'Posts',
        'new-post': 'New Post',
        'categories': 'Categories',
        'settings': 'Settings'
    };
    document.getElementById('page-title').textContent = titles[section] || 'Admin';
    
    // Load section data
    if (section === 'dashboard') {
        loadDashboard();
    } else if (section === 'posts') {
        loadPosts();
    } else if (section === 'new-post') {
        resetPostForm();
    } else if (section === 'categories') {
        loadCategories();
    }
}

// ============================================
// POSTS MANAGEMENT
// ============================================

// Check if API is available, otherwise use localStorage
const useAPI = typeof AdminAPI !== 'undefined' && AdminAPI;

async function getPosts() {
    if (useAPI) {
        try {
            return await AdminAPI.getPosts();
        } catch (error) {
            console.error('API failed, using localStorage:', error);
        }
    }
    
    // Fallback to localStorage
    const saved = localStorage.getItem(ADMIN_CONFIG.storageKey);
    if (saved) {
        return JSON.parse(saved);
    }
    // If no saved posts, use config.js posts
    return BLOG_POSTS || [];
}

async function savePosts(posts) {
    if (useAPI) {
        try {
            await AdminAPI.savePosts(posts);
            return;
        } catch (error) {
            console.error('API failed, using localStorage:', error);
        }
    }
    
    // Fallback to localStorage
    localStorage.setItem(ADMIN_CONFIG.storageKey, JSON.stringify(posts));
    // Also update config.js posts in memory (for preview)
    if (typeof BLOG_POSTS !== 'undefined') {
        BLOG_POSTS.length = 0;
        BLOG_POSTS.push(...posts);
    }
}

async function loadPosts() {
    const posts = await getPosts();
    const tbody = document.getElementById('posts-table-body');
    const searchTerm = document.getElementById('search-posts').value.toLowerCase();
    
    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.category.toLowerCase().includes(searchTerm)
    );
    
    if (filteredPosts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-8 text-center text-gray-500">No posts found</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredPosts.map(post => `
        <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td class="px-6 py-4">
                <div class="font-medium text-gray-900 dark:text-white">${post.title}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">${post.excerpt.substring(0, 60)}...</div>
            </td>
            <td class="px-6 py-4">
                <span class="category-tag">${post.category}</span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">${post.date}</td>
            <td class="px-6 py-4">
                ${post.featured ? '<span class="text-green-600">✓</span>' : '<span class="text-gray-400">-</span>'}
            </td>
            <td class="px-6 py-4">
                <button onclick="editPost('${post.id}')" class="icon-button action-btn bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2">
                    <span class="icon-wrapper icon-sm icon-edit">${Icons.edit}</span> Edit
                </button>
                <button onclick="deletePost('${post.id}')" class="icon-button action-btn bg-red-600 text-white hover:bg-red-700 flex items-center gap-2">
                    <span class="icon-wrapper icon-sm icon-delete">${Icons.delete}</span> Delete
                </button>
            </td>
        </tr>
    `).join('');
}

function filterPosts() {
    loadPosts();
}

async function handlePostSubmit(e) {
    e.preventDefault();
    
    const posts = await getPosts();
    const postId = document.getElementById('post-form').dataset.postId;
    const postData = {
        id: postId || generateId(),
        title: document.getElementById('post-title').value,
        slug: document.getElementById('post-slug').value,
        excerpt: document.getElementById('post-excerpt').value,
        content: document.getElementById('post-content').value,
        author: document.getElementById('post-author').value,
        date: document.getElementById('post-date').value,
        category: document.getElementById('post-category').value,
        tags: document.getElementById('post-tags').value.split(',').map(t => t.trim()).filter(t => t),
        featured: document.getElementById('post-featured').checked,
        image: document.getElementById('post-image').value || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
        readTime: document.getElementById('post-read-time').value || '5 min read'
    };
    
    if (postId) {
        // Update existing post
        if (useAPI) {
            try {
                await AdminAPI.updatePost(postId, postData);
            } catch (error) {
                const index = posts.findIndex(p => p.id === postId);
                if (index !== -1) {
                    posts[index] = postData;
                }
                await savePosts(posts);
            }
        } else {
            const index = posts.findIndex(p => p.id === postId);
            if (index !== -1) {
                posts[index] = postData;
            }
            await savePosts(posts);
        }
    } else {
        // Add new post
        if (useAPI) {
            try {
                await AdminAPI.createPost(postData);
            } catch (error) {
                posts.push(postData);
                await savePosts(posts);
            }
        } else {
            posts.push(postData);
            await savePosts(posts);
        }
    }
    
    showMessage('Post saved successfully!', 'success');
    resetPostForm();
    showSection('posts');
    await loadPosts();
}

async function editPost(id) {
    const posts = await getPosts();
    const post = posts.find(p => p.id === id);
    
    if (!post) return;
    
    document.getElementById('post-title').value = post.title;
    document.getElementById('post-slug').value = post.slug;
    document.getElementById('post-excerpt').value = post.excerpt;
    document.getElementById('post-content').value = post.content;
    document.getElementById('post-author').value = post.author;
    document.getElementById('post-date').value = post.date;
    document.getElementById('post-category').value = post.category;
    document.getElementById('post-tags').value = post.tags.join(', ');
    document.getElementById('post-featured').checked = post.featured;
    document.getElementById('post-image').value = post.image;
    document.getElementById('post-read-time').value = post.readTime;
    
    document.getElementById('post-form').dataset.postId = post.id;
    document.getElementById('save-post-btn').textContent = 'Update Post';
    document.getElementById('cancel-edit-btn').classList.remove('hidden');
    
    showSection('new-post');
}

async function deletePost(id) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    if (useAPI) {
        try {
            await AdminAPI.deletePost(id);
        } catch (error) {
            const posts = await getPosts();
            const filtered = posts.filter(p => p.id !== id);
            await savePosts(filtered);
        }
    } else {
        const posts = await getPosts();
        const filtered = posts.filter(p => p.id !== id);
        await savePosts(filtered);
    }
    
    showMessage('Post deleted successfully!', 'success');
    await loadPosts();
    await loadDashboard();
}

function resetPostForm() {
    document.getElementById('post-form').reset();
    document.getElementById('post-form').dataset.postId = '';
    document.getElementById('save-post-btn').textContent = 'Save Post';
    document.getElementById('cancel-edit-btn').classList.add('hidden');
    document.getElementById('post-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('post-author').value = BLOG_CONFIG.author || 'Muhammad Khuhro';
    document.getElementById('post-slug').dataset.edited = 'false';
}

function cancelEdit() {
    resetPostForm();
    showSection('posts');
}

function previewPost() {
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;
    const excerpt = document.getElementById('post-excerpt').value;
    
    if (!title || !content) {
        showMessage('Please fill in title and content to preview', 'error');
        return;
    }
    
    // Use marked.js if available, otherwise show raw markdown
    let htmlContent = content;
    if (typeof marked !== 'undefined') {
        htmlContent = marked.parse(content);
    } else {
        htmlContent = `<pre>${content}</pre>`;
    }
    
    document.getElementById('preview-content').innerHTML = `
        <h1 class="text-4xl font-bold mb-4">${title}</h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 mb-6">${excerpt}</p>
        <div class="prose prose-lg dark:prose-invert max-w-none">
            ${htmlContent}
        </div>
    `;
    
    document.getElementById('preview-modal').classList.remove('hidden');
}

function generateId() {
    return 'post-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// ============================================
// DASHBOARD
// ============================================

async function loadDashboard() {
    const posts = await getPosts();
    
    document.getElementById('stat-total-posts').textContent = posts.length;
    document.getElementById('stat-published').textContent = posts.length;
    document.getElementById('stat-categories').textContent = [...new Set(posts.map(p => p.category))].length;
    
    // Recent posts
    const recentPosts = posts
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    
    const recentList = document.getElementById('recent-posts-list');
    if (recentPosts.length === 0) {
        recentList.innerHTML = '<p class="text-gray-500 dark:text-gray-400">No posts yet</p>';
    } else {
        recentList.innerHTML = recentPosts.map(post => `
            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                    <h3 class="font-medium text-gray-900 dark:text-white">${post.title}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">${post.date} • ${post.category}</p>
                </div>
                <button onclick="editPost('${post.id}')" class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                    Edit
                </button>
            </div>
        `).join('');
    }
}

// ============================================
// CATEGORIES
// ============================================

async function loadCategories() {
    const posts = await getPosts();
    const categories = [...new Set(posts.map(p => p.category))];
    
    const categoriesList = document.getElementById('categories-list');
    if (categories.length === 0) {
        categoriesList.innerHTML = '<p class="text-gray-500 dark:text-gray-400">No categories yet</p>';
    } else {
        categoriesList.innerHTML = categories.map(cat => {
            const count = posts.filter(p => p.category === cat).length;
            return `
                <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                        <h3 class="font-medium text-gray-900 dark:text-white">${cat}</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">${count} post${count !== 1 ? 's' : ''}</p>
                    </div>
                </div>
            `;
        }).join('');
    }
}

async function loadCategoriesList() {
    const posts = await getPosts();
    const categories = [...new Set(posts.map(p => p.category))];
    const datalist = document.getElementById('categories-list');
    datalist.innerHTML = categories.map(cat => `<option value="${cat}">`).join('');
}

// ============================================
// EXPORT/IMPORT
// ============================================

async function exportPosts() {
    const posts = await getPosts();
    const dataStr = JSON.stringify(posts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cloudslate-posts-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showMessage('Posts exported successfully!', 'success');
}

function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedPosts = JSON.parse(e.target.result);
            if (Array.isArray(importedPosts)) {
                if (confirm(`Import ${importedPosts.length} posts? This will replace existing posts.`)) {
                    savePosts(importedPosts);
                    showMessage('Posts imported successfully!', 'success');
                    loadPosts();
                    loadDashboard();
                }
            } else {
                showMessage('Invalid file format', 'error');
            }
        } catch (error) {
            showMessage('Error importing file', 'error');
        }
    };
    reader.readAsText(file);
    e.target.value = '';
}

async function exportAllData() {
    const data = {
        posts: await getPosts(),
        config: BLOG_CONFIG,
        exportDate: new Date().toISOString()
    };
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cloudslate-all-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showMessage('All data exported successfully!', 'success');
}

function handleImportAll(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.posts && Array.isArray(data.posts)) {
                if (confirm(`Import ${data.posts.length} posts? This will replace existing posts.`)) {
                    savePosts(data.posts);
                    showMessage('Data imported successfully!', 'success');
                    loadPosts();
                    loadDashboard();
                }
            } else {
                showMessage('Invalid file format', 'error');
            }
        } catch (error) {
            showMessage('Error importing file', 'error');
        }
    };
    reader.readAsText(file);
    e.target.value = '';
}

function clearAllData() {
    if (confirm('Are you sure you want to clear ALL data? This cannot be undone!')) {
        if (confirm('This will delete all posts. Type "DELETE" to confirm.')) {
            localStorage.removeItem(ADMIN_CONFIG.storageKey);
            showMessage('All data cleared!', 'success');
            loadPosts();
            loadDashboard();
        }
    }
}

// ============================================
// SETTINGS
// ============================================

function changePassword() {
    const newPassword = document.getElementById('admin-password-change').value;
    if (!newPassword || newPassword.length < 4) {
        showMessage('Password must be at least 4 characters', 'error');
        return;
    }
    
    localStorage.setItem(ADMIN_CONFIG.passwordKey, newPassword);
    document.getElementById('admin-password-change').value = '';
    showMessage('Password changed successfully!', 'success');
}

// ============================================
// UTILITIES
// ============================================

function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    const main = document.querySelector('main');
    main.insertBefore(messageDiv, main.firstChild);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Make functions globally available
window.editPost = editPost;
window.deletePost = deletePost;

