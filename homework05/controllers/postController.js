let responseMessage = require('../modules/responseMessage');
let statusCode = require('../modules/statusCode');
let util = require('../modules/util');
let Post = require('../models/post');
let moment = require('moment');

// 모든 게시글 조회
exports.readAllPost = async (req,res)=>{
    return res.status(statusCode.OK)
        .send(util.success(statusCode.OK,responseMessage.READ_ALL_POST_SUCCESS, await Post.readAllPost()));
};

// 게시글 고유 id값을 조회
exports.readPost = async (req,res)=>{
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
};


// 게시글 생성
exports.createPost= async (req,res)=>{
    const { title, content} = req.body;
    const userIdx = req.userIdx;

    try{
        // null 값
        if( !title || !content)
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST,responseMessage.NULL_VALUE));

        const postIdx = await Post.writePost(userIdx, title, content);

        // 성공
        return res.status(statusCode.CREATED)
            .send(util.success(statusCode.CREATED,responseMessage.CREATED_POST_SUCCESS, {postIdx : postIdx}));
    } catch(err){
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, err.message));
        throw err;
    }
};


// 게시글 고유 id값을 가진 게시글 수정
exports.modifyPost = async (req,res)=>{
    const id = req.params.id;
    const {title, content} = req.body;
    const userIdx = req.userIdx;

    try {
        // null 값
        if (!id)
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));

        // 내 게시글 아닌 경우
        const post_userIdx = (await Post.getPostById(id)).userIdx;
        if(post_userIdx !== userIdx)
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.MISS_MATCH_USER));

        // 게시글 수정
        await Post.updatePost(id, title, content)
        const post = await Post.readPost(id);

        // 성공
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, responseMessage.MODIFY_POST_SUCCESS, post[0]));
    } catch(err){
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, err.message));
        throw err;
    }
};



// 게시글 고유 id값을 가진 게시글 삭제
exports.deletePost = async (req,res)=>{
    const id = req.params.id;
    const userIdx = req.userIdx;

    try {
        // null 값
        if (!id)
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));

        // 내 게시글 아닌 경우
        const post_userIdx = (await Post.getPostById(id)).userIdx;
        if(post_userIdx !== userIdx)
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.MISS_MATCH_USER));

        // 삭제
        await Post.deletePost(id);
        // 성공
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, responseMessage.DELETE_POST_SUCCESS, {deletedIdx: id}));
    } catch(err){
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, err.message));
        throw err;
    }
};


