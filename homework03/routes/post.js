var express = require('express');
var router = express.Router();
let responseMessage = require('../modules/responseMessage');
let statusCode = require('../modules/statusCode');
let util = require('../modules/util');
let Post = require('../models/post');
let moment = require('moment');

// 모든 게시글 조회
router.get('/', async (req,res)=>{
    res.status(statusCode.OK)
        .send(util.success(statusCode.OK,responseMessage.READ_ALL_POST_SUCCESS,Post));
});


// 게시글 고유 id값을 조회
router.get('/:id', async (req,res)=>{
    const id = req.params.id;

    const post = Post.filter(post => post.postIdx == id);
    // 해당 게시글 없음
    if(post.length === 0)
        res.status(statusCode.OK)
            .send(util.fail(statusCode.OK,responseMessage.READ_FAIL));

    // 성공
    res.status(statusCode.OK)
        .send(util.success(statusCode.OK,responseMessage.READ_POST_SUCCESS, post[0]));
});


// 게시글 생성
router.post('/', async (req,res)=>{
    const {author, title, content} = req.body;

    // null 값
    if(!author || !title || !content)
        res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST,responseMessage.NULL_VALUE));

    // 날짜 정보 등록
    const postIdx = parseInt(Post[Post.length-1].postIdx) + 1;
    const date = moment().format("YYYY년 MM월 DD일");
    Post.push( {postIdx, author, title, content, date} );
    const post = Post.filter(post => post.postIdx == postIdx);

    // 성공
    res.status(statusCode.CREATED)
        .send(util.success(statusCode.CREATED,responseMessage.CREATED_POST_SUCCESS, post[0]));
});



// 게시글 고유 id값을 가진 게시글 수정
router.put('/:id', async (req,res)=>{
    const id = req.params.id;
    const dto = {author, title, content} = req.body;

    // null 값
    if(!id)
        res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST,responseMessage.NULL_VALUE));

    const post = Post.filter(post => post.postIdx == id);
    for(item in dto) {
        post[0][`${item}`] = dto[`${item}`];
    }
    post[0].date = moment().format("YYYY년 MM월 DD일");

    // 성공
    res.status(statusCode.OK)
        .send(util.success(statusCode.OK,responseMessage.MODIFY_POST_SUCCESS, post[0]));
});



// 게시글 고유 id값을 가진 게시글 삭제
router.delete('/:id', async (req,res)=>{
    const id = req.params.id;

    // null 값
    if(!id)
        res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST,responseMessage.NULL_VALUE));

    const post = Post.filter(post => post.postIdx == id);
    if(id !== post[0].postIdx)
        res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST,responseMessage.OUT_OF_VALUE));

    Post.splice(id);
    // console.log(Post);

    // 성공
    res.status(statusCode.OK)
        .send(util.success(statusCode.OK,responseMessage.DELETE_POST_SUCCESS, {deletedIdx: id}));
});


module.exports = router;