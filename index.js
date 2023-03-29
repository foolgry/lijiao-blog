const fs = require('fs');
const markdownIt = require('markdown-it');
const ejs = require('ejs');
const chokidar = require('chokidar');
const { createWriteStream } = require('fs');
const { SitemapStream } = require('sitemap');

const md = markdownIt();

const getDirInfo = (dir) => {
    let postData = [];
    const posts = fs.readdirSync(dir);
    for (let post of posts) {
        if (post.endsWith('.md') == false) continue;
        let content = fs.readFileSync(`${dir}/${post}`, 'utf8');
        let lines = content.split('\n');
        let date = lines.shift();
        content = lines.join('\n');
        postData.push({
            title: post.replace('.md', ''),
            date: date,
            content: content
        });
    }
    return postData;
}

const createSitemap = (postData) => {
    // Creates a sitemap object given the input configuration with URLs
    const sitemap = new SitemapStream({ hostname: 'https://lijiao.foolgry.top' });

    const writeStream = createWriteStream('public/sitemap.xml');
    sitemap.pipe(writeStream);

    for (const post of postData) {
        sitemap.write(`${post.title}.html`);
    }
    sitemap.end();
    writeStream.end();
}

const buildSite = () => {
    let postData = getDirInfo("posts")
    postData = postData.sort((a, b) => b.date.localeCompare(a.date));

    let allTags = new Set();
    allTags.add('lijiao');
    allTags.add('blog');

    for (let post of postData) {
        let content = post.content;

        // Find text beginning with "#" and ending with a space, without "#" in the middle, and allowing multiple matches in a single line
        const regex = /(^|\s)#([^#\s]+)(?=\s)/g;
        let match;

        let tags = new Set();
        tags.add('lijiao');
        tags.add('blog');

        while ((match = regex.exec(content)) !== null) {
            tags.add(match[2]);
            allTags.add(match[2]);
        }

        post.html = md.render(content);
        post.keywords = Array.from(tags).join(', ');
    }

    console.log(allTags)

    fs.mkdirSync("public/imgs", { recursive: true })

    ejs.renderFile('source/index.ejs', {
        posts: postData,
        keywords: "lijiao, blog, 生活",
        title: ""
    }).then(homepage => {
        fs.writeFileSync('public/index.html', homepage);
    });


    for (let post of postData) {
        ejs.renderFile('source/post.ejs', post).then(postPage => {
            fs.writeFileSync(`public/${post.title}.html`, postPage);
        });
    }

    fs.copyFileSync('source/github-markdown.css', 'public/github-markdown.css');
    fs.copyFileSync('source/googled9fa17550ecee20b.html', 'public/googled9fa17550ecee20b.html');

    const imgs = fs.readdirSync('posts/imgs/');
    for (let img of imgs) {
        fs.copyFileSync(`posts/imgs/${img}`, `public/imgs/${img}`)
    }

    createSitemap(postData)
}

buildSite();

if (process.env[2] == 1) {
    chokidar.watch('posts', { ignoreInitial: true })
        .on('all', (event, path) => {
            buildSite();
        });
    chokidar.watch('themes', { ignoreInitial: true })
        .on('all', (event, path) => {
            buildSite();
        });
}



