const { exec } = require('../db/mysql');

const getList = (author, keyword) => {
    // 因为author和keyword可能都没有, 那么where后面直接跟order会报错 所以加1=1
    let sql = `select * from blogs where 1=1 `;
    if (author) {
        sql += `and authoer=${author} `;
    }
    if (keyword) {
        sql += `and title like '%${keyword}' `;
    }
    sql += `order by createtime desc;`;
    console.log(sql);
    return exec(sql);
}

const getDetail = (id) => {
    let sql = `select * from blogs where id='${id}';`;
    return exec(sql);
}

const newBlog = (blogData = {}) => {
    console.log('new blog', blogData);
    const { title, content, author } = blogData;
    const createtime = new Date().getTime();
    const sql = `insert into blogs (title, content, createtime, author) values ('${title}', '${content}', ${createtime}, '${author}');`;
    console.log(sql);

    return exec(sql).then(insertData => {
        console.log('insert Data is', insertData);
        return insertData.insertId;
    });
}

const updateBlog = (id, blogData) => {
    let sql = `update blogs set `;
    const title = blogData.title || '';
    const content = blogData.content || '';
    if (title) {
        sql += `title='${title}' `;
    }
    if (title && content) {
        sql += `, content='${content}' `;
    } else {
        sql += `content='${content}' `;
    }
    sql += `where id=${id};`;
    console.log(sql);
    return exec(sql).then(updateData => {
        console.log('update Data is', updateData);
        if (updateData.affectedRows > 0) {
            return true;
        }
        return false;
    });
}

const deleteBlog = (id) => {
    const sql = `delete from blogs where id=${id};`;
    return exec(sql).then(deleteData => {
        console.log('delete data is ', deleteData);
        if (deleteData.affectedRows > 0) {
            return true;
        }
        return false;
    });
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog
}