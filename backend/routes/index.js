var express = require('express');
var router = express.Router();

var db = require('../database/db');

router.get('/', (req, res) => {
    res.status(200).end("服务器连接成功！")
})

module.exports = router;
