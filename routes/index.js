var express = require('express');
var router = express.Router();

var db = require('../database/db');
/* 起始页面 */
router.get('/', function (req, res, next) {
    res.render('index', { title: '欢迎' });
});

module.exports = router;
