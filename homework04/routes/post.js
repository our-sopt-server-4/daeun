var express = require('express');
var router = express.Router();
let responseMessage = require('../modules/responseMessage');
let statusCode = require('../modules/statusCode');
let util = require('../modules/util');
let Post = require('../models/post');
let moment = require('moment');

// 모든 게시글 조회
router.get('/', async (req,res)=>{
    return res.status(statusCode.OK)
        .send(util.success(statusCode.OK,responseMessage.READ_ALL_POST_SUCCESS, await Post.readAllPost()));
});


// 게시글 고유 id값을 조회
router.get('/:id', async (req,res)=>{
    const id = req.params.id;

    try{
        const post = await Post.readPost(id);
        // 해당 게시글 없음
        if(post.length === 0)
            return res.status(statusCode.OK).send(util.fail(statusCode.OK,responseMessage.READ_FAIL));

        // 성공
        return res.status(statusCode.OK).send(util.success(statusCode.OK,responseMessage.READ_POST_SUCCESS, post[0]));
    } catch(err){
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, err.message));
        throw err;
    }
});


// 게시글 생성
router.post('/', async (req,res)=>{
    const {author, title, content} = req.body;

    try{
        // null 값
        if(!author || !title || !content)
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST,responseMessage.NULL_VALUE));

        const postIdx = await Post.writePost(author, title, content);

        // 성공
        return res.status(statusCode.CREATED)
            .send(util.success(statusCode.CREATED,responseMessage.CREATED_POST_SUCCESS, {postIdx : postIdx}));
    } catch(err){
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, err.message));
        throw err;
    }
});



// 게시글 고유 id값을 가진 게시글 수정
router.put('/:id', async (req,res)=>{
    const id = req.params.id;
    const {title, content} = req.body;

    try {
        // null 값
        if (!id)
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));

        await Post.updatePost(id, title, content)
        const post = await Post.readPost(id);

        // 성공
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, responseMessage.MODIFY_POST_SUCCESS, post[0]));
    } catch(err){
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, err.message));
        throw err;
    }
});



// 게시글 고유 id값을 가진 게시글 삭제
router.delete('/:id', async (req,res)=>{
    const id = req.params.id;

    try {
        // null 값
        if (!id)
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));

        await Post.deletePost(id);
        // 성공
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, responseMessage.DELETE_POST_SUCCESS, {deletedIdx: id}));
    } catch(err){
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, err.message));
        throw err;
    }
});


module.exports = router;