const { login } = require('../controller/user');
const { SuccessModel, ErrorModel } = require('../model/resModel');
const { setRedis } = require('../db/redis');

const handlerUserRouter = (req, res) => {
    const method = req.method;
    const { username, password } = req.body ;
    // const { username, password } = req.query;

    if (method === 'POST' && req.path === '/api/user/login') {
        const result = login(username, password);
        return result.then(data => {
            if (data.username) {
                // 设置session
                setRedis(req.sessionId, data);
                console.log('req.session is ', req.session);
                return new SuccessModel(data);
            }
            else return new ErrorModel('账号或密码错误');
        })
    }

    // 登录验证测试
    if (method === 'GET' && req.path === '/api/user/login-test') {
        if (req.session.username) return Promise.resolve(new SuccessModel({
            session: req.session
        }));
        return Promise.resolve(new ErrorModel('请先登录'));
    }
}

module.exports = handlerUserRouter; 