const {getPostData, getCookieExrires} = require('./src/utils/utils');
const queryString = require('querystring');
const handlerBlogRouter = require('./src/router/blog');
const handlerUserRouter = require('./src/router/user');

const SESSION_DATA = {}; // session对象

const serverHandler = (req, res) => {
    console.log('SESSION_DATA', SESSION_DATA);
    res.setHeader('Content-type', 'application/json'); // 设置返回格式 JSON
    req.path = req.url.split('?')[0];
    req.query = queryString.parse(req.url.split('?')[1]); // get方式url？号后面的数据

    // 解析cookie
    const cookieStr = req.headers.cookie || '';
    req.cookie = {};
    cookieStr.split(';').forEach(item => {
        if (!item) return;
        const arr = item.split('=');
        const key = arr[0].trim();
        const val = arr[1].trim();
        req.cookie[key] = val;
    });
    console.log('cookie is ', req.cookie);

    // 解析session
    let needSetCookie = false; // 是否需要设置cookie
    let userId = req.cookie.userid;
    if (userId) {
        if (!SESSION_DATA[userId]) {
            SESSION_DATA[userId] = {};
        }
    } else {
        needSetCookie = true;
        userId = `${Date.now()}_${Math.random()}`;
        SESSION_DATA[userId] = {};
    }
    req.session = SESSION_DATA[userId];
    // debugger;
    console.log('req.session', req.session);

    // 老方法
    // const blogData = handlerBlogRouter(req, res);
    // if (blogData) {
    //     res.end(JSON.stringify(blogData));
    //     return;
    // }

    // 处理postdata
    getPostData(req).then(postData => {
        req.body = postData;
        const blogResult = handlerBlogRouter(req, res);
        if (blogResult) {
            blogResult.then(blogData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie',
                        `userid=${userId}; path=/; httpOnly; expires=${getCookieExrires()}`);
                }
                res.end(
                    JSON.stringify(blogData)
                )
            });
            return;
        }

        const userResult = handlerUserRouter(req, res);
        if (userResult) {
            userResult.then(isLogin => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie',
                        `userid=${userId}; path=/; httpOnly; expires=${getCookieExrires()}`);
                }
                res.end(
                    JSON.stringify(isLogin)
                )
            });
            return;
        }

        // 未命中 返回404
        res.writeHead(404, { 'Content-type': 'text/plain' });
        res.write('404 notFount\n');
        res.end();
    });
}
module.exports = serverHandler;