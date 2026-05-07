const express = require('express');
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const app = express();
// 寶塔的 Node 項目管理器會自動分配 PORT，若沒有則默認 3000
const PORT = process.env.PORT || 3000; 

// 嚴格綁定當前目錄，防止寶塔守護進程路徑偏移
const POSTS_DIR = path.join(__dirname, 'posts');
const PUBLIC_DIR = path.join(__dirname, 'public');

// 自動確保 posts 文件夾存在
if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR);
}

// 託管靜態文件
app.use(express.static(PUBLIC_DIR));

// 解析 Markdown 文件的核心邏輯
function parseMarkdownFile(filename) {
    const filePath = path.join(POSTS_DIR, filename);
    const content = fs.readFileSync(filePath, 'utf-8');

    // --- 新增：在後端進行正文掃描，判定是否為 18+ 隱藏文章 ---
    const isHidden = content.includes('<div id="hidden-post"></div>');

    const titleMatch = content.match(/^#\s+(.+)/m);
    const title = titleMatch ? titleMatch[1] : filename.replace('.md', '');

    const authorMatch = content.match(/Author:\s+(.+)/i);
    const author = authorMatch ? authorMatch[1] : 'SanKuai Culture Studio';

    const tagsMatch = content.match(/#[a-zA-Z0-9_\u4e00-\u9fa5]+/g);
    const tags = tagsMatch ? [...new Set(tagsMatch.map(t => t.substring(1)))] : ['Coding'];

    const plainText = content.replace(/[#*`_>\[\]]/g, '').trim();
    const summary = plainText.substring(0, 150) + '...';

    const htmlContent = marked.parse(content);
    const stats = fs.statSync(filePath);

    return {
        id: filename.replace('.md', ''),
        title,
        author,
        // 核心修復：如果 birthtimeMs 為空，自動降級使用修改時間或當前時間
        date: stats.birthtimeMs || stats.mtimeMs || Date.now(),
        tags,
        summary,
        isHidden, 
        content: htmlContent
    };
}

// API: 獲取文章列表
app.get('/api/posts', (req, res) => {
    try {
        const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.md'));
        let posts = files.map(parseMarkdownFile);
        
        posts.sort((a, b) => b.date - a.date);
        
        const postList = posts.map(({ content, ...rest }) => rest);
        res.json(postList);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read posts.' });
    }
});

// API: 獲取單篇文章
app.get('/api/posts/:id', (req, res) => {
    try {
        const filename = `${req.params.id}.md`;
        const post = parseMarkdownFile(filename);
        res.json(post);
    } catch (error) {
        res.status(404).json({ error: 'Post not found.' });
    }
});

app.listen(PORT, () => {
    console.log(`DICK Server started on port ${PORT}`);
});