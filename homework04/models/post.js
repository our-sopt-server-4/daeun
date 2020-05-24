const pool = require('../modules/pool');
let moment = require('moment');
const table = 'post';

const post = {
    readAllPost : async () => {
        const query = `SELECT * FROM ${table}`;
        try{
            const result = await pool.queryParam(query);
            return result;
        } catch(err){
            console.log('readAllPost ERROR : ', err);
            throw err;
        }
    },
    readPost : async (id) => {
        const query = `SELECT * FROM ${table} WHERE postIdx = ${id}`;
        try{
            const result = await pool.queryParam(query);
            return result;
        } catch(err){
            console.log('readPost ERROR : ', err);
            throw err;
        }
    },
    writePost : async (author, title, content) => {
        const createdAt = moment().format("YYYY년 MM월 DD일");
        const fields = 'author, title, content, createdAt';
        const questions = `?, ?, ?, "${createdAt}"`;
        const values = [author, title, content];
        const query = `INSERT INTO ${table}(${fields}) VALUES(${questions})`;

        try {
            const result = await pool.queryParamArr(query, values);
            const insertId = result.insertId;
            return insertId;
        } catch(err){
            console.log('writePost ERROR : ', err);
            throw err;
        }
    },
    updatePost : async (id, title, content) => {
        const query = `UPDATE ${table} SET title = "${title}", content = "${content}" WHERE postIdx="${id}"`;
        try{
            await pool.queryParam(query);
        } catch(err){
            console.log('updatePost ERROR : ', err);
            throw err;
        }
    },
    deletePost : async (id) => {
        const query = `DELETE FROM ${table} where postIdx="${id}"`;
        try{
            await pool.queryParam(query);
        } catch(err){
            console.log('deletePost ERROR : ', err);
            throw err;
        }
    }
}
module.exports = post;