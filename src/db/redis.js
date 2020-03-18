const redis = require('redis');
const { REDIS_CONF } = require('../conf/db');

// 创建客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host);
redisClient.on('error', err => {
    console.error(err);
});

function setRedis(key, val) {
    if (typeof val === 'object') {
        val = JSON.stringify(val);
    }
    // redis.print 的作用是当set完之后打印是否正确set
    redisClient.set(key, val, redis.print); 
}

function getRedis(key) { // 异步
    const promise = new Promise((res, rej) => {
        redisClient.get(key, (err, val) => {
            if (err) {
                rej(err);
                return;
            }
            if (val === null) {
                res(null);
                return;
            }
            try {
                res(JSON.parse(val)); // 如果是json那返回格式化数据
            } catch (err) {
                res(val); // 如果不是直接返回
            }
        })
    });
    return promise;
}

module.exports = {
    setRedis,
    getRedis
}