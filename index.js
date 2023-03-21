const fs = require('fs');
const markdownIt = require('markdown-it');
const ejs = require('ejs');
const chokidar = require('chokidar');

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

    for (let post of postData) {
        let content = fs.readFileSync(`posts/${post.title}.md`, 'utf8');
        post.html = md.render(content);
        post.toc = md.render(content, {
            toc: true
        });
    }

    ejs.renderFile('source/index.ejs', { posts: postData }).then(homepage => {
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



