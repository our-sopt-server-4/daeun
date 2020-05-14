var express = require('express');
var router = express.Router();

router.get('/login',(req,res)=>{
    res.send('로그인 성공');
});

router.get('/signup',(req,res)=>{
    res.send('회원가입 성공');
});

module.exports = router;