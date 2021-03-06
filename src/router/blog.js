const { getList, getDetail, newBlog, updateBlog, deleteBlog } = require('../controller/blog');
const { SuccessModel, ErrorModel } = require('../model/resModel');

// 登录验证
const loginCheck = (req) => {
    if (!req.session.username) {
        return Promise.resolve(
            new ErrorModel('尚未登陆')
        );
    }
}

const handlerBlogRouter = (req, res) => {
    const method = req.method;
    const id = req.query.id || req.body.id || '';
    const loginCheckResult = loginCheck(req); // 登录验证 有返回值说明未登录
    if (loginCheckResult) return loginCheckResult;

    // 获取博客列表
    if (method === 'GET' && req.path === '/api/blog/list') {
        const author = req.query.author || '';
        const keyword = req.query.keyword || '';
        // const listData = getList(author, keyword);
        // return new SuccessModel(listData);
        const result = getList(author, keyword);
        return result.then(listData => {
            return new SuccessModel(listData);
        })
    }

    if (method === 'GET' && req.path === '/api/blog/detail') {
        const result = getDetail(id);
        return result.then(data => {
            return new SuccessModel(data);
        });
    }

    if (method === 'POST' && req.path === '/api/blog/new') {
        req.body.author = req.session.username;
        const result = newBlog(req.body);
        return result.then(data => {
            return new SuccessModel(data);
        });
    }

    if (method === 'POST' && req.path === '/api/blog/update') {
        const result = updateBlog(id, req.body);
        return result.then(data => {
            if (data) return new SuccessModel(data);
            else return new ErrorModel('更新博客失败');
        });
    }

    if (method === 'POST' && req.path === '/api/blog/delete') {
        const result = deleteBlog(id);
        return result.then(data => {
            if (data) return new SuccessModel(data);
            else return new ErrorModel('删除博客失败');
        });
    }
}

module.exports = handlerBlogRouter;