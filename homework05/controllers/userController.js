let responseMessage = require('../modules/responseMessage');
let statusCode = require('../modules/statusCode');
let util = require('../modules/util');
let User = require('../models/user');
const crypto = require('crypto');
const jwt = require('../modules/jwt');

exports.signup = async (req, res) => {
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
};

exports.signin =  async(req,res)=>{
    const {id, password} = req.body;

    try {
        // request data null 값 확인
        if (!id || !password)
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));

        // 아이디 존재 확인
        if (await User.checkUser(id) === false)
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NO_USER));

        const user = await User.signin(id, password);
        // 비밀번호 확인
        if (user === false)
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.MISS_MATCH_PW));

        // jwt
        const {token, _} = await jwt.sign(user[0]);

        // 성공
        return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.LOGIN_SUCCESS, {accessToken: token}));
    } catch(err){
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, err.message));
        throw err;
    }
};

exports.readProfile= async(req,res)=>{
    const id = req.params.id;

    try{
        // 존재하지 않는 아이디
        if(await User.checkUser(id) === false)
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST,responseMessage.NO_USER));

        // 성공
        const user = await User.getUserById(id);
        const userDto = {
            id : user.id,
            name : user.name,
            email : user.email
        }
        return res.status(statusCode.OK).send(util.success(statusCode.OK,responseMessage.READ_PROFILE_SUCCESS, userDto));
    } catch(err){
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, err.message));
        throw err;
    }
};