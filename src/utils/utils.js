
// 处理post方法中传入的参数
const getPostData = (req) => {
    const promise = new Promise((res, rej) => {
        if (req.method !== 'POST' || req.headers['content-type'] !== 'application/json') {
            res({});
            return;
        }
        let postData = '';
        req.on('data', chunk => {
            postData += chunk.toString();
        });
        req.on('end', () => {
            if (!postData) {
                res({});
                return;
            }
            res(JSON.parse(postData));
        })
    });
    return promise;
}

// 获取cookie的过期时间
const getCookieExrires = () => {
    const d = new Date();
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
    return d.toGMTString();
}

module.exports = { getPostData, getCookieExrires };