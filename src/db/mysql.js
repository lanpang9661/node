const mysql = require('mysql');
const { MYSQL_CONF } = require('../conf/db');

// 创建链接对象
const con = mysql.createConnection(MYSQL_CONF);

// 开始链接
con.connect();

// 同意执行sql的函数
function exec(sql) {
    const promise = new Promise((res, rej) => {
        con.query(sql, (err, result) => {
            if (err) {
                rej(err);
                return;
            }
            res(result);
        })
    })
    return promise;
}

module.exports = {
    exec
}