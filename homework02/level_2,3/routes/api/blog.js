var express = require('express');
var router = express.Router();

router.get('/post',(req,res)=>{
    res.send('api/blog/post success!');
});

module.exports = router;