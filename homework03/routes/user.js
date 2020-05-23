var express = require('express');
var router = express.Router();
let responseMessage = require('../modules/responseMessage');
let statusCode = require('../modules/statusCode');
let util = require('../modules/util');
let User = require('../models/user');

const crypto = require('crypto');

router.post('/signup', async (req,res)=>{
  const {id, name, password, email} = req.body;

  // null 값 확인
  if(!id || !name || !password || !email)
    res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST,responseMessage.NULL_VALUE));

  // already ID
  const user = User.filter(user => user.id == id);
  if(user.length > 0)
    res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST,responseMessage.ALREADY_ID));

  // password hash 해서 salt 값과 같이 저장 (level_2)
  const salt = crypto.randomBytes(32).toString();
  const hashedPassword = crypto.pbkdf2Sync(password, salt, 1, 32, 'sha512').toString('hex');
  User.push({id, name, password: hashedPassword, salt, email});

  // console.log(salt);
  // console.log(hashedPassword);

  //성공
  res.status(statusCode.CREATED).send(util.success(statusCode.CREATED,responseMessage.CREATED_USER, {userId : id}));
});

router.post('/signin', async(req,res)=>{
  const {id, password} = req.body;

  // request data null 값 확인
  if(!id || !password)
    res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST,responseMessage.NULL_VALUE));

  // 아이디 존재 확인
  const user = User.filter(user => user.id == id);
  if(user.length==0)
    res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST,responseMessage.NO_USER));

  // 비밀번호 확인
  if(user[0].password !== password)
    res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST,responseMessage.MISS_MATCH_PW));

  // 성공
  res.status(statusCode.OK).send(util.success(statusCode.OK,responseMessage.LOGIN_SUCCESS, {userId: id}));

});

router.get('/profile/:id',async(req,res)=>{
  const id = req.params.id;

  // 존재하지 않는 아이디
  const user = User.filter(user => user.id == id);
  if(user[0] === undefined)
    res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST,responseMessage.NO_USER));

  // 성공
  res.status(statusCode.OK).send(util.success(statusCode.OK,responseMessage.READ_PROFILE_SUCCESS, user[0]));

});

module.exports = router;
