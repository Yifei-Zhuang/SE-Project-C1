var express = require('express');
var router = express.Router();

var db = require('../database/db');
/* 用户资金管理系统  */
router.get('/', function (req, res, next) {
  res.render('userLogin', { title: '用户资金管理系统' });
});

module.exports = router;
