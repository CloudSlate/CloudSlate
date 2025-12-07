// Engagement & Gamification System
// Makes the website addictive with interactive features

class EngagementSystem {
    constructor() {
        this.stats = this.loadStats();
        this.init();
    }

    init() {
        this.initReadingProgress();
        this.initReactions();
        this.initReadingStreak();
        this.initAchievements();
        this.initNotifications();
        this.initRecommendations();
        this.initSocialProof();
        this.trackEngagement();
    }

    // ============================================
    // READING PROGRESS TRACKER
    // ============================================
    
    initReadingProgress() {
        // Reading progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.innerHTML = '<div class="reading-progress-fill"></div>';
        document.body.appendChild(progressBar);

        // Track scroll progress
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / scrollHeight) * 100;
            
            const fill = progressBar.querySelector('.reading-progress-fill');
            fill.style.width = `${Math.min(progress, 100)}%`;
            
            // Award points for reading milestones
            if (progress >= 25 && lastScroll < 25) this.awardPoints(5, '25% read');
            if (progress >= 50 && lastScroll < 50) this.awardPoints(10, '50% read');
            if (progress >= 75 && lastScroll < 75) this.awardPoints(15, '75% read');
            if (progress >= 100 && lastScroll < 100) this.awardPoints(25, 'Finished reading!');
            
            lastScroll = progress;
        }, { passive: true });
    }

    // ============================================
    // REACTIONS SYSTEM
    // ============================================
    
    initReactions() {
        // Add reaction buttons to posts
        const posts = document.querySelectorAll('article, .post-content');
        posts.forEach(post => {
            if (!post.querySelector('.reactions-container')) {
                const reactionsContainer = document.createElement('div');
                reactionsContainer.className = 'reactions-container';
                reactionsContainer.innerHTML = `
                    <div class="reactions-bar">
                        <button class="reaction-btn" data-reaction="like" title="Like">
                            <span class="icon-wrapper icon-sm">${Icons ? Icons.get('check', 'icon-like') : '👍'}</span>
                            <span class="reaction-count">0</span>
                        </button>
                        <button class="reaction-btn" data-reaction="love" title="Love">
                            <span class="icon-wrapper icon-sm">❤️</span>
                            <span class="reaction-count">0</span>
                        </button>
                        <button class="reaction-btn" data-reaction="insightful" title="Insightful">
                            <span class="icon-wrapper icon-sm">💡</span>
                            <span class="reaction-count">0</span>
                        </button>
                        <button class="reaction-btn" data-reaction="bookmark" title="Save">
                            <span class="icon-wrapper icon-sm">🔖</span>
                        </button>
                    </div>
                `;
                
                // Insert after post content
                const content = post.querySelector('.p-6, .post-content, .prose');
                if (content) {
                    content.appendChild(reactionsContainer);
                } else {
                    post.appendChild(reactionsContainer);
                }
            }
        });

        // Handle reactions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.reaction-btn')) {
                const btn = e.target.closest('.reaction-btn');
                const reaction = btn.dataset.reaction;
                const postId = btn.closest('article')?.id || 'default';
                
                this.handleReaction(postId, reaction, btn);
                this.awardPoints(2, 'Reaction given');
            }
        });
    }

    handleReaction(postId, reaction, button) {
        const key = `reaction_${postId}_${reaction}`;
        const hasReacted = localStorage.getItem(key) === 'true';
        
        if (hasReacted) {
            // Remove reaction
            localStorage.removeItem(key);
            button.classList.remove('active');
            const count = button.querySelector('.reaction-count');
            if (count) {
                const current = parseInt(count.textContent) || 0;
                count.textContent = Math.max(0, current - 1);
            }
        } else {
            // Add reaction
            localStorage.setItem(key, 'true');
            button.classList.add('active');
            const count = button.querySelector('.reaction-count');
            if (count) {
                const current = parseInt(count.textContent) || 0;
                count.textContent = current + 1;
            }
            this.showNotification(`You ${reaction === 'like' ? 'liked' : reaction} this post!`, 'success');
        }
    }

    // ============================================
    // READING STREAK SYSTEM
    // ============================================
    
    initReadingStreak() {
        const today = new Date().toDateString();
        const lastVisit = localStorage.getItem('lastVisit');
        const currentStreak = parseInt(localStorage.getItem('readingStreak')) || 0;
        
        if (lastVisit === today) {
            // Already visited today
            this.updateStreakDisplay(currentStreak);
        } else {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastVisit === yesterday.toDateString()) {
                // Continue streak
                const newStreak = currentStreak + 1;
                localStorage.setItem('readingStreak', newStreak);
                localStorage.setItem('lastVisit', today);
                this.updateStreakDisplay(newStreak);
                this.awardPoints(10 * newStreak, `${newStreak} day streak!`);
                this.showNotification(`🔥 ${newStreak} day reading streak!`, 'streak');
            } else {
                // Reset streak
                localStorage.setItem('readingStreak', 1);
                localStorage.setItem('lastVisit', today);
                this.updateStreakDisplay(1);
            }
        }
    }

    updateStreakDisplay(streak) {
        let streakBadge = document.getElementById('streak-badge');
        if (!streakBadge) {
            streakBadge = document.createElement('div');
            streakBadge.id = 'streak-badge';
            streakBadge.className = 'streak-badge';
            document.body.appendChild(streakBadge);
        }
        
        streakBadge.innerHTML = `
            <div class="streak-content">
                <span class="streak-icon">🔥</span>
                <span class="streak-count">${streak}</span>
                <span class="streak-label">Day Streak</span>
            </div>
        `;
        
        if (streak >= 7) {
            streakBadge.classList.add('streak-gold');
        } else if (streak >= 3) {
            streakBadge.classList.add('streak-silver');
        }
    }

    // ============================================
    // ACHIEVEMENTS SYSTEM
    // ============================================
    
    initAchievements() {
        this.checkAchievements();
    }

    checkAchievements() {
        const achievements = [
            { id: 'first_visit', name: 'Welcome!', desc: 'First visit to CloudSlate', check: () => !localStorage.getItem('first_visit') },
            { id: 'reader_5', name: 'Avid Reader', desc: 'Read 5 posts', check: () => this.stats.postsRead >= 5 },
            { id: 'reader_10', name: 'Bookworm', desc: 'Read 10 posts', check: () => this.stats.postsRead >= 10 },
            { id: 'reader_25', name: 'Scholar', desc: 'Read 25 posts', check: () => this.stats.postsRead >= 25 },
            { id: 'streak_7', name: 'Dedicated', desc: '7 day reading streak', check: () => parseInt(localStorage.getItem('readingStreak')) >= 7 },
            { id: 'points_100', name: 'Engaged', desc: 'Earn 100 points', check: () => this.stats.points >= 100 },
            { id: 'points_500', name: 'Champion', desc: 'Earn 500 points', check: () => this.stats.points >= 500 },
        ];

        achievements.forEach(achievement => {
            const key = `achievement_${achievement.id}`;
            if (!localStorage.getItem(key) && achievement.check()) {
                localStorage.setItem(key, 'true');
                this.unlockAchievement(achievement);
            }
        });
    }

    unlockAchievement(achievement) {
        this.showNotification(`🏆 Achievement Unlocked: ${achievement.name}`, 'achievement');
        this.awardPoints(50, `Achievement: ${achievement.name}`);
        
        // Show confetti
        this.showConfetti();
        
        // Show achievement modal
        this.showAchievementModal(achievement);
    }

    showConfetti() {
        const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDelay = Math.random() * 0.5 + 's';
                confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
                document.body.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 3000);
            }, i * 20);
        }
    }

    showAchievementModal(achievement) {
        const modal = document.createElement('div');
        modal.className = 'achievement-modal';
        modal.innerHTML = `
            <div class="achievement-modal-content">
                <div class="achievement-icon">🏆</div>
                <h3>${achievement.name}</h3>
                <p>${achievement.desc}</p>
                <button class="achievement-close">Awesome!</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        setTimeout(() => modal.classList.add('show'), 100);
        
        modal.querySelector('.achievement-close').addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        });
    }

    // ============================================
    // POINTS SYSTEM
    // ============================================
    
    awardPoints(amount, reason) {
        this.stats.points += amount;
        this.stats.totalPoints += amount;
        this.saveStats();
        
        // Show points notification
        this.showPointsNotification(amount, reason);
        this.updatePointsDisplay();
    }

    showPointsNotification(amount, reason) {
        const notification = document.createElement('div');
        notification.className = 'points-notification';
        notification.innerHTML = `
            <span class="points-icon">⭐</span>
            <span class="points-amount">+${amount}</span>
            <span class="points-reason">${reason}</span>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    updatePointsDisplay() {
        let pointsDisplay = document.getElementById('points-display');
        if (!pointsDisplay) {
            pointsDisplay = document.createElement('div');
            pointsDisplay.id = 'points-display';
            pointsDisplay.className = 'points-display';
            document.body.appendChild(pointsDisplay);
        }
        
        pointsDisplay.innerHTML = `
            <div class="points-content">
                <span class="points-icon">⭐</span>
                <span class="points-count">${this.stats.points}</span>
            </div>
        `;
    }

    // ============================================
    // NOTIFICATIONS SYSTEM
    // ============================================
    
    initNotifications() {
        // Notification container
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notification-container');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">×</button>
            </div>
        `;
        
        container.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // ============================================
    // RECOMMENDATIONS SYSTEM
    // ============================================
    
    initRecommendations() {
        // Show "You might also like" section
        this.showRecommendations();
    }

    async showRecommendations() {
        const posts = await getBlogPosts();
        if (posts.length < 2) return;
        
        // Get reading history
        const readPosts = JSON.parse(localStorage.getItem('readPosts') || '[]');
        
        // Recommend based on categories of read posts
        const categories = readPosts.map(id => {
            const post = posts.find(p => p.id === id);
            return post?.category;
        }).filter(Boolean);
        
        const recommended = posts
            .filter(p => !readPosts.includes(p.id))
            .filter(p => categories.includes(p.category))
            .slice(0, 3);
        
        if (recommended.length > 0) {
            this.displayRecommendations(recommended);
        }
    }

    displayRecommendations(posts) {
        const container = document.getElementById('recommendations');
        if (!container) {
            const newContainer = document.createElement('div');
            newContainer.id = 'recommendations';
            newContainer.className = 'recommendations-section';
            document.querySelector('main')?.appendChild(newContainer);
        }
        
        const recommendationsHTML = `
            <div class="recommendations-header">
                <h2>✨ You might also like</h2>
            </div>
            <div class="recommendations-grid">
                ${posts.map(post => `
                    <article class="recommendation-card fade-in">
                        <a href="post.html?id=${post.id}">
                            <img src="${post.image}" alt="${post.title}" loading="lazy" decoding="async">
                            <div class="recommendation-content">
                                <h3>${post.title}</h3>
                                <p>${post.excerpt.substring(0, 100)}...</p>
                            </div>
                        </a>
                    </article>
                `).join('')}
            </div>
        `;
        
        container.innerHTML = recommendationsHTML;
    }

    // ============================================
    // SOCIAL PROOF
    // ============================================
    
    initSocialProof() {
        // Show "X people are reading this" type messages
        this.updateSocialProof();
    }

    updateSocialProof() {
        const posts = document.querySelectorAll('article');
        posts.forEach(post => {
            const views = Math.floor(Math.random() * 100) + 10;
            const proof = document.createElement('div');
            proof.className = 'social-proof';
            proof.innerHTML = `👁️ ${views} views`;
            post.appendChild(proof);
        });
    }

    // ============================================
    // ENGAGEMENT TRACKING
    // ============================================
    
    trackEngagement() {
        // Track time on page
        const startTime = Date.now();
        
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.floor((Date.now() - startTime) / 1000);
            this.stats.timeSpent += timeSpent;
            this.stats.sessions += 1;
            this.saveStats();
        });

        // Track post reads
        document.addEventListener('click', (e) => {
            const postLink = e.target.closest('a[href*="post.html"]');
            if (postLink) {
                const postId = new URL(postLink.href).searchParams.get('id');
                if (postId) {
                    this.trackPostRead(postId);
                }
            }
        });
    }

    trackPostRead(postId) {
        const readPosts = JSON.parse(localStorage.getItem('readPosts') || '[]');
        if (!readPosts.includes(postId)) {
            readPosts.push(postId);
            localStorage.setItem('readPosts', JSON.stringify(readPosts));
            this.stats.postsRead += 1;
            this.saveStats();
            this.awardPoints(5, 'Post read');
            this.checkAchievements();
        }
    }

    // ============================================
    // STATS MANAGEMENT
    // ============================================
    
    loadStats() {
        const saved = localStorage.getItem('engagementStats');
        return saved ? JSON.parse(saved) : {
            points: 0,
            totalPoints: 0,
            postsRead: 0,
            timeSpent: 0,
            sessions: 0
        };
    }

    saveStats() {
        localStorage.setItem('engagementStats', JSON.stringify(this.stats));
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.engagementSystem = new EngagementSystem();
    });
} else {
    window.engagementSystem = new EngagementSystem();
}

