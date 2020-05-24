var express = require('express');
var router = express.Router();
let responseMessage = require('../modules/responseMessage');
let statusCode = require('../modules/statusCode');
let util = require('../modules/util');
let User = require('../models/user');
const crypto = require('crypto');

router.post('/signup', async (req,res)=>{
    const {id, name, password, email} = req.body;
    try {
        // null 값 확인
        if (!id || !name || !password || !email)
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));

        // already ID
        if (await User.checkUser(id))
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.ALREADY_ID));

        // password hash 해서 salt 값과 같이 저장
        const salt = crypto.randomBytes(32).toString();
        const hashedPassword = crypto.pbkdf2Sync(password, salt, 1, 32, 'sha512').toString('hex');

        const idx = await User.signup(id, name, hashedPassword, salt, email);
        if (idx === -1)
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, responseMessage.DB_ERROR));

        //성공
        return res.status(statusCode.CREATED).send(util.success(statusCode.CREATED, responseMessage.CREATED_USER, {userId: idx}));
    } catch(err){
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, err.message));
        throw err;
    }
});

router.post('/signin', async(req,res)=>{
    const {id, password} = req.body;

    try {
        // request data null 값 확인
        if (!id || !password)
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));

        // 아이디 존재 확인
        if (await User.checkUser(id) === false)
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NO_USER));

        // 비밀번호 확인
        if (await User.signin(id, password) === false)
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.MISS_MATCH_PW));

        // 성공
        return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.LOGIN_SUCCESS, {userId: id}));
    } catch(err){
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, err.message));
        throw err;
    }
});

module.exports = router;
