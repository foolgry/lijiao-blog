const fs = require('fs');
const markdownIt = require('markdown-it');
const ejs = require('ejs');
const chokidar = require('chokidar');
const { title } = require('process');

const md = markdownIt();

const getDirInfo = (dir) => {
    let postData = [];
    const posts = fs.readdirSync(dir);
    for (let post of posts) {
        if (post.endsWith('.md') == false) continue;
        let stat = fs.statSync(`${dir}/${post}`);
        postData.push({
            title: post.replace('.md', ''),
            date: stat.birthtime
        });
    }
    return postData;
}

const buildSite = () => {
    let postData = getDirInfo("posts")
    postData = postData.sort((a, b) => b.date - a.date);

    let allTags = new Set();
    allTags.add('foolgry');
    allTags.add('blog');

    for (let post of postData) {
        let content = fs.readFileSync(`posts/${post.title}.md`, 'utf8');
        // Find text beginning with "#" and ending with a space, without "#" in the middle, and allowing multiple matches in a single line
        const regex = /(^|\s)#([^#\s]+)(?=\s)/g;
        let match;

        let tags = new Set();
        tags.add('foolgry');
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
        keywords: "foolgry, blog, 技术, 生活",
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

    const imgs = fs.readdirSync('posts/imgs/');
    for (let img of imgs) {
        fs.copyFileSync(`posts/imgs/${img}`, `public/imgs/${img}`)
    }
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



