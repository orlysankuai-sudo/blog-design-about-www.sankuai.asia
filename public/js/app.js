const app = {
    allPosts: [],
    currentTheme: 'light',
    tocObserver: null,
    converter: null, 
    pendingPostId: null,

    activeFilters: { tags: new Set(), authors: new Set() },

    quotes: [
        { text: "「所有人羣的意志與思想都被化作了數據塔，這又是一個去中心化的過程。」", url: "https://www.sankuai.asia/?id=geek" },
        { text: "「Thoughts have no boundaries, truth is unobservable.」", url: "https://www.sankuai.asia" },
        { text: "「弱勢的國際品牌為了生存必須尊重規則，而強大的本土品牌有時會因為體制保護而忽視規則。」", url: "https://www.sankuai.asia/?id=geek" }
    ],
    currentQuoteIndex: 0,

    audio: {
        play404: () => {
            const snd = new Audio('/assets/music/404.mp3');
            snd.volume = 0.5; 
            snd.play().catch(e => console.warn("Audio play blocked by browser", e));
        },
        playError: () => {
            const snd = new Audio('/assets/music/error.mp3');
            snd.volume = 0.4;
            snd.play().catch(e => console.warn("Audio play blocked by browser", e));
        }
    },

    async init() {
        this.initTheme();
        this.initGlobalEvents();
        this.initMeow();
        this.initQuotes(); 
        
        await this.runBootSequence(); 
        await this.fetchPosts();

        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');
        if (postId) {
            this.openPost(postId);
        } else {
            this.goHome(); 
        }
    },

    async fetchPosts() {
        this.showLoader(); 
        try {
            const response = await fetch('/api/posts'); 
            if (!response.ok) throw new Error('Network error'); 
            this.allPosts = await response.json(); 
            this.hideLoader(); 
        } catch (error) {
            console.error("Fetch Posts Error: ", error); 
            const feed = document.getElementById('postFeed'); 
            if (feed) feed.innerHTML = '<p class="text-center">System Offline. Check connection.</p>'; 
            
            if (this.audio && this.audio.playError) this.audio.playError(); 
            this.hideLoader(); 
        }
    },

    async runBootSequence() {
        return new Promise(resolve => {
            const username = localStorage.getItem('dick_username');
            const lang = localStorage.getItem('dick_lang');

            if (username && lang) {
                this.setupTranslation(lang);
                this.showWelcomeBack(username, lang, resolve);
            } else {
                document.getElementById('ob-disclaimer').classList.add('active');
                this.bootResolve = resolve; 
            }
        });
    },

    acceptDisclaimer() {
        const disclaimer = document.getElementById('ob-disclaimer');
        if (disclaimer) disclaimer.classList.remove('active');
        setTimeout(() => {
            const setup = document.getElementById('ob-setup');
            if (setup) setup.classList.add('active');
        }, 800);
    },

    submitOnboarding() {
        const username = document.getElementById('ob-username').value.trim();
        const lang = document.getElementById('ob-lang').value;
        
        if (!username) {
            alert('Please enter your identifier.');
            return;
        }

        localStorage.setItem('dick_username', username);
        localStorage.setItem('dick_lang', lang);
        this.setupTranslation(lang);

        document.getElementById('ob-setup').classList.remove('active');
        setTimeout(() => {
            const loading = document.getElementById('ob-loading');
            const loadingText = document.getElementById('ob-loading-text');
            loadingText.innerText = lang === 'zh-CN' ? 'loading...' : 'loading...';
            loading.classList.add('active');

            setTimeout(() => {
                document.getElementById('onboarding').classList.add('hide');
                this.playEpicIntro(); 
                if (this.bootResolve) this.bootResolve(); 
            }, 1800);
        }, 800);
    },

    async playEpicIntro() {
        const intro = document.getElementById('epic-intro');
        const container = document.getElementById('intro-container');
        if (!intro || !container) return;
        
        intro.classList.remove('hidden');
        intro.style.opacity = '1';

        const sleep = ms => new Promise(r => setTimeout(r, ms));

        container.innerHTML = `
            <div id="step1" class="intro-text active">
                <span class="intro-letter">D</span><span class="rest" style="margin-right: 20px;">ata</span>
                <span class="intro-letter">I</span><span class="rest" style="margin-right: 20px;">nnovation</span>
                <span class="intro-letter">C</span><span class="rest" style="margin-right: 20px;">ode</span>
                <span class="intro-letter">K</span><span class="rest">nowledge</span>
            </div>
        `;
        await sleep(1500);

        document.querySelectorAll('.intro-letter').forEach(el => el.classList.add('intro-blue'));
        await sleep(1200);

        document.querySelectorAll('.rest').forEach(el => el.classList.add('intro-hide'));
        await sleep(2000);

        const step1 = document.getElementById('step1');
        step1.style.transform = 'scaleY(0.1)';
        await sleep(300);
        step1.classList.add('vortex');
        
        await sleep(500);

        container.innerHTML = `
            <div id="step2" class="intro-text active">
                <span id="txt-curated" class="whip-out">Curated Thoughts</span>
                <span id="txt-designed" style="color: #3b82f6; opacity: 0; max-width: 0; overflow: hidden; transition: all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275); margin-left: 10px; display: inline-block; vertical-align: bottom;">, Designed</span>
            </div>
        `;
        await sleep(1200); 
        
        document.getElementById('txt-curated').style.transition = 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        document.getElementById('txt-curated').style.transform = 'translateX(-20px)';
        const txtDesigned = document.getElementById('txt-designed');
        txtDesigned.style.opacity = '1';
        txtDesigned.style.maxWidth = '250px';
        await sleep(2000);

        document.getElementById('step2').style.opacity = '0';
        await sleep(800);
        container.innerHTML = `<div id="step3" class="intro-bulb" style="opacity: 1;">💡</div>`;
        await sleep(100);
        
        document.getElementById('step3').classList.add('bulb-sway');
        await sleep(1600); 

        document.getElementById('step3').classList.add('bulb-shatter');
        intro.style.background = '#000000'; 

        const words = ['I have a thought', 'Thought', 'consciousness', 'behavior', 'society', 'mind', 'psychology', 'brain', 'Is it moral'];
        for(let i = 0; i < 50; i++) {
            let p = document.createElement('div');
            p.className = 'intro-particle';
            p.innerText = words[Math.floor(Math.random() * words.length)];
            if (p.innerText === 'I have a thought') p.style.fontSize = '2.2rem';
            else p.style.fontSize = (0.8 + Math.random()) + 'rem';
            container.appendChild(p);
            
            let angle = Math.random() * Math.PI * 2;
            let dist = 100 + Math.random() * 500;
            let tx = Math.cos(angle) * dist * (Math.random() > 0.5 ? 1 : 1.8); 
            let ty = Math.sin(angle) * dist;
            let tz = -300 + Math.random() * 800; 
            let rot = (Math.random() - 0.5) * 180;
            
            requestAnimationFrame(() => {
                p.style.opacity = Math.random() * 0.7 + 0.3;
                p.style.transform = `translate3d(${tx}px, ${ty}px, ${tz}px) rotate(${rot}deg) scale(${1 + Math.random()})`;
            });
        }
        await sleep(3000);

        document.querySelectorAll('.intro-particle').forEach(el => el.style.opacity = '0');
        await sleep(1200);

        container.innerHTML = `<div id="step4" class="intro-text active" style="color: #ffffff; font-size: 1.3rem; letter-spacing: 3px; font-family: 'Inter', sans-serif;">Exploring the intersection of technology and creativity.</div>`;
        await sleep(2500);
        document.getElementById('step4').style.opacity = '0';
        await sleep(1000);

        intro.style.background = '#ffffff';
        container.innerHTML = ''; 
        await sleep(1500); 

        container.innerHTML = `<img src="/assets/img/error-fox.svg" style="max-width: 250px; mix-blend-mode: multiply; opacity: 0; transition: opacity 1.5s ease;" id="intro-fox">`;
        void container.offsetWidth; 
        document.getElementById('intro-fox').style.opacity = '1';
        await sleep(2500);

        intro.style.opacity = '0';
        await sleep(1500);
        intro.classList.add('hidden');
    },

    showWelcomeBack(username, lang, resolve) {
        const welcome = document.getElementById('ob-welcome');
        const welcomeText = document.getElementById('ob-welcome-text');
        
        welcomeText.innerText = lang === 'zh-CN' ? `Welcome back，${username}` : `Welcome back，${username}`;
        welcome.classList.add('active');

        setTimeout(() => {
            welcome.classList.remove('active');
            setTimeout(() => {
                const loading = document.getElementById('ob-loading');
                const loadingText = document.getElementById('ob-loading-text');
                loadingText.innerText = lang === 'zh-CN' ? 'loading...' : 'loading...';
                loading.classList.add('active');

                setTimeout(() => {
                    document.getElementById('onboarding').classList.add('hide');
                    resolve();
                }, 1500);
            }, 800);
        }, 2000);
    },

    setupTranslation(lang) {
        try {
            if (typeof OpenCC === 'undefined') return;
            if (lang === 'zh-CN') {
                this.converter = OpenCC.Converter({ from: 'tw', to: 'cn' });
            } else if (lang === 'zh-TW') {
                this.converter = OpenCC.Converter({ from: 'cn', to: 'tw' });
            }
        } catch (e) {
            console.warn("OpenCC translation init failed", e);
        }
    },

    t(text) {
        if (!text || !this.converter) return text;
        return this.converter(text);
    },

    initQuotes() {
        const box = document.getElementById('quoteText');
        if (!box) return;
        this.renderQuote();
        setInterval(() => {
            box.style.opacity = '0';
            setTimeout(() => {
                this.currentQuoteIndex = (this.currentQuoteIndex + 1) % this.quotes.length;
                this.renderQuote();
                box.style.opacity = '1';
            }, 800);
        }, 6000);
    },
    renderQuote() {
        const q = this.quotes[this.currentQuoteIndex];
        const box = document.getElementById('quoteText');
        if (box) box.innerText = this.t(q.text);
    },
    openQuoteUrl() {
        const url = this.quotes[this.currentQuoteIndex].url;
        if (url && url !== '#') window.open(url, '_blank');
    },

    switchView(targetId) {
        ['dashboardView', 'feedView', 'postView'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                if (id === targetId) {
                    el.classList.remove('hidden');
                    requestAnimationFrame(() => el.classList.add('fade-enter-active'));
                } else {
                    el.classList.remove('fade-enter-active');
                    el.classList.add('hidden');
                }
            }
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    goHome() {
        this.closeMobileSidebar(); 
        const cleanUrl = `${window.location.origin}${window.location.pathname}`;
        window.history.pushState({ path: cleanUrl }, '', cleanUrl);

        const copyrightDiv = document.getElementById('dick-copyright-block');
        if (copyrightDiv) copyrightDiv.style.display = 'none';

        this.switchView('dashboardView');
        this.renderActivityGraph();
        this.renderFileTree('homeExplorer', false); 
        
        const input = document.getElementById('searchInput');
        if (input) input.value = '';
    },

    goFeed() {
        this.closeMobileSidebar(); 
        const cleanUrl = `${window.location.origin}${window.location.pathname}`;
        window.history.pushState({ path: cleanUrl }, '', cleanUrl);

        const copyrightDiv = document.getElementById('dick-copyright-block');
        if (copyrightDiv) copyrightDiv.style.display = 'none';

        this.switchView('feedView');
        
        this.activeFilters = { tags: new Set(), authors: new Set() };
        this.applyFilters(); 
        this.renderFileTree('feedExplorer', true); 
    },

    // 🛡️ 核心修復：防禦性日期解析機制
    renderActivityGraph() {
        const container = document.getElementById('activityGraph');
        if (!container || this.allPosts.length === 0) return;
        
        const counts = {};
        this.allPosts.forEach(p => {
            try {
                // 如果後端依然傳來錯誤時間，預設使用當前時間，避免 JS 崩潰
                const dateObj = new Date(p.date || Date.now());
                if (!isNaN(dateObj.getTime())) {
                    const d = dateObj.toISOString().split('T')[0];
                    counts[d] = (counts[d] || 0) + 1;
                }
            } catch(e) {
                console.warn("Date parse safely bypassed:", e);
            }
        });

        let html = '';
        const today = new Date();
        for (let i = 180; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const c = counts[dateStr] || 0;
            let level = 0;
            if (c > 0) level = c > 3 ? 4 : c; 
            
            html += `<div class="activity-cell" data-level="${level}" title="${dateStr}: ${c} articles"></div>`;
        }
        container.innerHTML = html;
        const wrapper = container.parentElement;
        wrapper.scrollLeft = wrapper.scrollWidth;
    },

    renderFileTree(containerId, isFilterMode) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const tagMap = {};
        const authorMap = {};
        
        this.allPosts.forEach(post => {
            const safeTags = Array.isArray(post.tags) ? post.tags : ['Uncategorized'];
            safeTags.forEach(tag => {
                if (!tagMap[tag]) tagMap[tag] = [];
                tagMap[tag].push(post);
            });
            if (isFilterMode) {
                const safeAuthor = post.author || 'Unknown';
                if (!authorMap[safeAuthor]) authorMap[safeAuthor] = [];
                authorMap[safeAuthor].push(post);
            }
        });

        const buildFolderHTML = (title, items, type) => {
            // 🛡️ 兼容性修復：移除 ?. 語法以防舊版瀏覽器報錯
            const isSelected = this.activeFilters[type] && this.activeFilters[type].has(title);
            const activeClass = isSelected ? 'active-filter' : '';
            
            let childrenHTML = '';
            if (!isFilterMode) {
                childrenHTML = items.map(post => `
                    <div class="ft-doc ft-tooltip-target" data-fullname="${this.t(post.title)}" onclick="app.openPost('${post.id}')">
                        <svg class="ft-doc-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
                        <span class="ft-truncate">${this.t(post.title)}</span>
                    </div>
                `).join('');
            }

            const clickHandler = isFilterMode 
                ? `onclick="app.toggleFilter('${type}', '${title}')"` 
                : `onclick="app.toggleFolder(this)"`;

            const fullName = `${type === 'tags' ? '#' : '@'}${this.t(title)} (${items.length})`;

            return `
                <div class="ft-item">
                    <div class="ft-header ${activeClass} ft-tooltip-target" ${clickHandler} data-fullname="${fullName}">
                        <svg class="ft-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
                        <span class="ft-truncate">${fullName}</span>
                    </div>
                    ${!isFilterMode ? `
                    <div class="ft-children-wrapper">
                        <div class="ft-children-inner">${childrenHTML}</div>
                    </div>` : ''}
                </div>
            `;
        };

        const totalPosts = this.allPosts.length;
        const rootTagsName = `All Articles - Tags (${totalPosts})`;
        const rootAuthorsName = `All Articles - Authors (${totalPosts})`;

        let finalHTML = `
            <div class="ft-item">
                <div class="ft-header expanded ft-tooltip-target" data-fullname="${rootTagsName}" onclick="app.toggleFolder(this)">
                    <svg class="ft-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
                    <span class="ft-truncate" style="font-weight:bold;">${rootTagsName}</span>
                </div>
                <div class="ft-children-wrapper expanded">
                    <div class="ft-children-inner">
                        ${Object.keys(tagMap).map(tag => buildFolderHTML(tag, tagMap[tag], 'tags')).join('')}
                    </div>
                </div>
            </div>
        `;

        if (isFilterMode) {
            finalHTML += `
                <div class="ft-item" style="margin-top: 16px;">
                    <div class="ft-header expanded ft-tooltip-target" data-fullname="${rootAuthorsName}" onclick="app.toggleFolder(this)">
                        <svg class="ft-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
                        <span class="ft-truncate" style="font-weight:bold;">${rootAuthorsName}</span>
                    </div>
                    <div class="ft-children-wrapper expanded">
                        <div class="ft-children-inner">
                            ${Object.keys(authorMap).map(author => buildFolderHTML(author, authorMap[author], 'authors')).join('')}
                        </div>
                    </div>
                </div>
            `;
        }
        
        container.innerHTML = finalHTML;
    },

    toggleFolder(headerEl) {
        headerEl.classList.toggle('expanded');
        const wrapper = headerEl.nextElementSibling;
        if (wrapper && wrapper.classList.contains('ft-children-wrapper')) {
            wrapper.classList.toggle('expanded');
        }
    },

    toggleFilter(type, value) {
        if (this.activeFilters[type].has(value)) {
            this.activeFilters[type].delete(value);
        } else {
            this.activeFilters[type].add(value);
        }
        this.applyFilters();
        this.renderFileTree('feedExplorer', true); 
    },

    applyFilters() {
        let filtered = this.allPosts;
        if (this.activeFilters.tags.size > 0) {
            filtered = filtered.filter(p => p.tags.some(t => this.activeFilters.tags.has(t)));
        }
        if (this.activeFilters.authors.size > 0) {
            filtered = filtered.filter(p => this.activeFilters.authors.has(p.author));
        }
        this.renderHomeFeed(filtered);
    },

    renderHomeFeed(posts) {
        const feed = document.getElementById('postFeed');
        if (!feed) return;
        
        if (posts.length === 0) {
            feed.innerHTML = `
                <div class="error-state glass-card" style="margin-top: 0; min-height: 40vh; box-shadow: none; background: transparent; border: none;">
                    <img src="/assets/img/error-fox.svg" alt="No Data" class="error-img" draggable="false" oncontextmenu="return false;">
                    <p class="error-text art-font" style="font-size: 1.2rem; color: var(--text-muted);">
                        ${this.t('No matching articles found.')}
                    </p>
                </div>
            `;
            return;
        }

        feed.innerHTML = posts.map(post => `
            <article class="post-card glass-card" onclick="app.openPost('${post.id}')">
                <div class="card-meta">${this.t(post.author)} · ${new Date(post.date).toLocaleDateString()}</div>
                <h2 class="card-title art-font">${this.t(post.title)}</h2>
                <p class="card-summary">${this.t(post.summary)}</p>
                <div>${post.tags.map(tag => `<span class="tag-badge">#${this.t(tag)}</span>`).join('')}</div>
            </article>
        `).join('');
    },

    async openPost(id) {
        this.closeMobileSidebar(); 
        const newUrl = `${window.location.origin}${window.location.pathname}?id=${id}`;
        window.history.pushState({ path: newUrl }, '', newUrl);

        const targetPost = this.allPosts.find(p => p.id === id);
        
        if (targetPost && targetPost.isHidden) {
            this.pendingPostId = id;
            document.getElementById('nsfw-modal').classList.remove('hide');
            return; 
        }
        
        this.executeOpenPost(id);
    },

    async executeOpenPost(id) {
        this.showLoader();
        this.switchView('postView');

        try {
            const response = await fetch(`/api/posts/${id}`);
            if (!response.ok) throw new Error('Network error'); 
            
            const post = await response.json();
            const postIndex = this.allPosts.findIndex(p => p.id === id);

            if (!post.content || post.content.trim() === '') throw new Error('Empty content');

            const header = document.getElementById('postHeader');
            if (header) {
                header.innerHTML = `
                    <div class="meta" style="margin-bottom:12px;">${post.tags.map(tag => `<span style="margin-right:8px">#${this.t(tag)}</span>`).join('')}</div>
                    <h1 class="art-font">${this.t(post.title)}</h1>
                    <div class="meta">${this.t(post.author)} · ${new Date(post.date).toLocaleDateString()}</div>`;
            }
            
            const contentDiv = document.getElementById('postContent');
            if (contentDiv) contentDiv.innerHTML = this.t(post.content);

            let copyrightDiv = document.getElementById('dick-copyright-block');
            
            if (!copyrightDiv) {
                copyrightDiv = document.createElement('div');
                copyrightDiv.id = 'dick-copyright-block';
                contentDiv.parentNode.insertBefore(copyrightDiv, contentDiv.nextSibling);
            }

            const postUrl = `${window.location.origin}${window.location.pathname}?id=${post.id}`;
            const d = new Date(post.date || Date.now());
            const postDate = isNaN(d.getTime()) ? "Unknown" : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

            copyrightDiv.innerHTML = `
                <div class="license-container">
                    <div class="license-title">Document | Beta : ${this.t(post.title)}</div>
                    <a href="${postUrl}" class="license-blog-link" target="_blank">${postUrl}</a>
                    <div class="license-meta">
                        <div class="meta-item">
                            <span class="meta-label">Author</span>
                            <span class="meta-value">${this.t(post.author)}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Published On</span>
                            <span class="meta-value">${postDate}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">License</span>
                            <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" class="meta-license-link">CC BY-NC-SA 4.0</a>
                        </div>
                    </div>
                    <svg class="license-cc-icon" viewBox="0 0 496 512">
                        <path d="M245.83 214.87l-33.22 17.28c-9.43-19.58-25.24-19.93-27.46-19.93c-22.13 0-33.22 14.61-33.22 43.84c0 23.57 9.21 43.84 33.22 43.84c14.47 0 24.65-7.09 30.57-21.26l30.55 15.5c-6.17 11.51-25.69 38.98-65.1 38.98c-22.6 0-73.96-10.32-73.96-77.05c0-58.69 43-77.06 72.63-77.06c30.72 0 52.7 11.95 65.99 35.86m143.05 0l-32.78 17.28c-9.5-19.77-25.72-19.93-27.9-19.93c-22.14 0-33.22 14.61-33.22 43.84c0 23.55 9.23 43.84 33.22 43.84c14.45 0 24.65-7.09 30.54-21.26l31 15.5c-2.1 3.75-21.39 38.98-65.09 38.98c-22.69 0-73.96-9.87-73.96-77.05c0-58.67 42.97-77.06 72.63-77.06c30.71 0 52.58 11.95 65.56 35.86M247.56 8.05C104.74 8.05 0 123.11 0 256.05c0 138.49 113.6 248 247.56 248c129.93 0 248.44-100.87 248.44-248c0-137.87-106.62-248-248.44-248m.87 450.81c-112.54 0-203.7-93.04-203.7-202.81c0-105.42 85.43-203.27 203.72-203.27c112.53 0 202.82 89.46 202.82 203.26c0 121.69-99.68 202.82-202.84 202.82"></path>
                    </svg>
                </div>
            `;
            copyrightDiv.style.display = 'block';

            this.generateTableOfContents(contentDiv);
            this.setupSidebarLinks(postIndex);

            if (window.Prism) Prism.highlightAll();
            
            setTimeout(() => {
                this.checkRestriction(); 
                this.hideLoader();
            }, 300);

        } catch (error) {
            console.warn("View Fallback Triggered:", error.message);
            
            // 隱藏不必要的元素
            const copyrightDiv = document.getElementById('dick-copyright-block');
            if (copyrightDiv) copyrightDiv.style.display = 'none';
            const gridLayout = document.getElementById('postGridLayout');
            if (gridLayout) gridLayout.classList.add('hidden');
            
            const errorState = document.getElementById('errorState');
            if (errorState) {
                // 清空原有的容器樣式，以防與新設計衝突
                errorState.className = ''; 
                
                // 動態注入全新的 SANGUAI INC 錯誤頁面 HTML
                errorState.innerHTML = `
                    <div class="error-page-wrapper">
                        <div class="ep-header">SANGUAI INC.</div>
                        <div class="ep-subheader">WEBSITE ERROR PAGE</div>
                        <img src="/assets/img/error-fox.svg" alt="404 Fox" class="ep-fox" draggable="false" oncontextmenu="return false;">
                        <div class="ep-message-title">Error Message:</div>
                        <div class="ep-message-badge">404 error: <em>HTTP 404 Not Found</em></div>
                        <div class="ep-redirect">Redirecting to sankuai.asia<span id="redirect-dots">...</span></div>
                    </div>
                `;
                
                // 播放 404 空靈音效
                if (this.audio && this.audio.play404) this.audio.play404();

                // --- 啟動點點點動畫與自動跳轉邏輯 ---
                let dots = 0;
                const dotSpan = document.getElementById('redirect-dots');
                
                // 清除可能殘留的計時器
                if (this.redirectInterval) clearInterval(this.redirectInterval);
                if (this.redirectTimeout) clearTimeout(this.redirectTimeout);

                this.redirectInterval = setInterval(() => {
                    dots = (dots + 1) % 4;
                    if(dotSpan) dotSpan.innerText = '.'.repeat(dots);
                }, 500);

                // 4 秒後自動跳回 Dashboard 總覽頁面
                this.redirectTimeout = setTimeout(() => {
                    clearInterval(this.redirectInterval);
                    errorState.innerHTML = ''; // 清除錯誤畫面
                    if (gridLayout) gridLayout.classList.remove('hidden'); // 恢復佈局供下次使用
                    this.goHome(); 
                }, 4000);
            }

            this.hideLoader();
        }
    },

    agreeNsfw() {
        document.getElementById('nsfw-modal').classList.add('hide');
        if (this.pendingPostId) {
            this.executeOpenPost(this.pendingPostId);
            this.pendingPostId = null;
        }
    },

    declineNsfw() {
        document.getElementById('nsfw-modal').classList.add('hide');
        this.pendingPostId = null;
    },

    async checkRestriction() {
        const boundary = document.getElementById('restricted-boundary');
        if (!boundary) return;
        try {
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            if (data.country_code === 'CN') this.applyBlur(boundary);
        } catch (e) {
            console.warn("Geofence check bypassed.");
        }
    },

    applyBlur(boundary) {
        const container = document.createElement('div');
        container.className = 'restricted-container';
        const wrapper = document.createElement('div');
        wrapper.className = 'restricted-blur-zone';
        while (boundary.nextSibling) wrapper.appendChild(boundary.nextSibling);
        const overlay = document.createElement('div');
        overlay.className = 'restricted-overlay';
        
        const warningTitle = this.t('我們依照中國大陸法律法規移除了一些內容。');
        overlay.innerHTML = `<div class="restricted-msg"><p>${warningTitle}</p><p style="margin-top:20px; font-style:italic; font-size:0.95rem;">Thoughts have no boundaries, truth is unobservable; <br> To our friends in Mainland China: May we meet again in the Data Tower, VY 73!</p></div>`;
        container.appendChild(wrapper);
        container.appendChild(overlay);
        boundary.parentNode.appendChild(container);
    },

    generateTableOfContents(contentDiv) {
        const headings = contentDiv.querySelectorAll('h2, h3');
        const tocList = document.getElementById('tocList');
        const tocWidget = document.getElementById('tocWidget');
        if (!tocList || !tocWidget) return;
        tocList.innerHTML = '';
        if (!headings.length) { tocWidget.classList.add('hidden'); return; }
        tocWidget.classList.remove('hidden');
        if (this.tocObserver) this.tocObserver.disconnect();
        this.tocObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.querySelectorAll('.toc-list a').forEach(a => a.classList.remove('active'));
                    const links = document.querySelectorAll(`.toc-list a[href="#${entry.target.id}"]`);
                    links.forEach(link => link.classList.add('active'));
                }
            });
        }, { rootMargin: "0px 0px -70% 0px" });
        headings.forEach((h, i) => {
            h.id = `h-${i}`;
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${h.id}`; a.textContent = h.textContent; 
            a.onclick = (e) => { 
                e.preventDefault(); 
                h.scrollIntoView({ behavior: 'smooth' }); 
                this.closeMobileSidebar(); 
            };
            if (h.tagName.toLowerCase() === 'h3') a.classList.add('toc-h3');
            li.appendChild(a); tocList.appendChild(li); this.tocObserver.observe(h);
        });
    },

    setupSidebarLinks(idx) {
        if (this.allPosts.length === 0) return;
        const nextLink = document.getElementById('nextPostLink');
        const recLink = document.getElementById('dailyRecLink');
        
        if (nextLink) {
            const next = this.allPosts[(idx + 1) % this.allPosts.length];
            nextLink.innerHTML = `<a href="javascript:void(0)" class="sidebar-link" onclick="app.openPost('${next.id}')">${this.t(next.title)}</a>`;
        }
        if (recLink) {
            let rIdx = Math.floor(Math.random() * this.allPosts.length);
            if (rIdx === idx && this.allPosts.length > 1) rIdx = (rIdx + 1) % this.allPosts.length;
            const rec = this.allPosts[rIdx];
            recLink.innerHTML = `<a href="javascript:void(0)" class="sidebar-link" onclick="app.openPost('${rec.id}')">${this.t(rec.title)}</a>`;
        }
    },

    handleSearch() {
        const input = document.getElementById('searchInput');
        if (!input) return;
        const q = input.value.toLowerCase().trim();
        
        const feedView = document.getElementById('feedView');
        if (feedView && feedView.classList.contains('hidden')) {
            this.switchView('feedView');
        }

        const f = this.allPosts.filter(p => {
            if (q.startsWith('#')) return p.tags.some(t => this.t(t).toLowerCase() === q.slice(1));
            if (q.startsWith('@')) return this.t(p.author).toLowerCase() === q.slice(1);
            return `${this.t(p.title)} ${this.t(p.summary)}`.toLowerCase().includes(q);
        });
        this.renderHomeFeed(f);
    },

    filterByTag(t) {
        this.closeMobileSidebar();
        this.goFeed();
        this.activeFilters.tags.add(t);
        this.applyFilters();
        this.renderFileTree('feedExplorer', true);
    },
    filterByAuthor(a) {
        this.closeMobileSidebar();
        this.goFeed();
        this.activeFilters.authors.add(a);
        this.applyFilters();
        this.renderFileTree('feedExplorer', true);
    },

    initTheme() { this.setTheme(localStorage.getItem('theme') || 'light'); },
    toggleTheme() { this.setTheme(this.currentTheme === 'light' ? 'dark' : 'light'); },
    setTheme(t) { this.currentTheme = t; document.documentElement.setAttribute('data-theme', t); localStorage.setItem('theme', t); const btn = document.getElementById('themeToggle'); if (btn) btn.innerText = t === 'light' ? '🌙' : '☀️'; },
    initGlobalEvents() {
        window.addEventListener('click', (e) => {
            const menu = document.getElementById('moreMenuContainer');
            if (menu && !menu.contains(e.target)) menu.classList.remove('active');
            const mobileContainer = document.querySelector('.mobile-sort-container');
            if (mobileContainer && !mobileContainer.contains(e.target)) mobileContainer.classList.remove('active');
        });
    },
    toggleMoreMenu(e) { e.stopPropagation(); const c = document.getElementById('moreMenuContainer'); if(c) c.classList.toggle('active'); },
    
    toggleMobileSidebar(event) {
        if (event) event.stopPropagation();
        const container = document.querySelector('.mobile-sort-container');
        const drawerContent = document.getElementById('mobileDrawerContent');
        if (!container || !drawerContent) return;

        if (!container.classList.contains('active')) {
            let activeSidebar = null;
            if (!document.getElementById('feedView').classList.contains('hidden')) {
                activeSidebar = document.querySelector('.feed-sidebar');
            } else if (!document.getElementById('postView').classList.contains('hidden')) {
                activeSidebar = document.querySelector('.post-sidebar');
            }
            
            if (activeSidebar) drawerContent.innerHTML = activeSidebar.innerHTML;
            else drawerContent.innerHTML = "<p style='padding:20px;text-align:center;color:var(--text-muted);'>No options available</p>";
        }
        
        container.classList.toggle('active');
    },
    closeMobileSidebar() { const c = document.querySelector('.mobile-sort-container'); if(c) c.classList.remove('active'); },
    
    initMeow() {
        document.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('meow-target') && !e.target.classList.contains('meow-away')) {
                const el = e.target;
                el.innerText = '喵！'; 
                el.style.fontSize = '3rem';
                el.style.fontWeight = 'bold';
                el.style.fontFamily = '"Playfair Display", serif';
                setTimeout(() => {
                    el.classList.add('meow-away');
                    setTimeout(() => el.style.display = 'none', 800);
                }, 500);
            }
        });
    },
    showLoader() { const l = document.getElementById('loader'); if(l) { l.classList.remove('hidden'); requestAnimationFrame(()=>l.style.opacity='1'); } },
    hideLoader() { const l = document.getElementById('loader'); if(l) { l.style.opacity='0'; setTimeout(()=>l.classList.add('hidden'),500); } }
};

document.addEventListener('DOMContentLoaded', () => app.init());