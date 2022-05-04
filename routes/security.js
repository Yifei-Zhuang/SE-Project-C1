var express = require('express');
var router = express.Router();

var db = require('../database/db');
/* 证券管理系统主页面  */
router.get('/', function (req, res, next) {
  res.render('security', { title: '证券管理系统' });
});

/* 个人证券管理系统  */
router.get('/personal', function (req, res, next) {
  res.render('personalSecurity', { title: '个人证券管理系统' });
});

/* 法人证券管理系统  */
router.get('/corporate', function (req, res, next) {
  res.render('corporateSecurity', { title: '法人证券管理系统' });
});

/* 个人开户 */
router.post('/personalOpen', function (req, res) {
  console.log(req.body);
  let sqlStatement = `select state from personSecurity where identityid = ${req.body.identityid} order by registerdate`
  console.log(sqlStatement)
  db(sqlStatement, [], (err, result) => {
    if (err) {
      console.log("数据库sql语句执行失败");
    } else {
      console.log(result)
      if (result.length > 0 && result[0].state != 'cancel') {
        // 已经存在记录
        if (result[0].state == 'forzen') {
          res.status(400).end("该证券id下的账户已经被冻结,请补办")
        }
        else {
          res.status(400).end("该证券id下的账户已经存在,请勿重复开户")
        }
      }
      else {
        // 不存在或者已经销户，那么重新开户
        let insertSqlStatement = `insert into security_type values(securityid = ${req.body.securityid},accountType = \'person\')`;
        let getMaxIdSql = `select max(securityid) as mid from personSecurity`
        console.log(getMaxIdSql)
        let maxID;
        db(getMaxIdSql, [], (err, result) => {
          if (err) {
            console.log("数据库sql语句执行失败", err.message);
          } else {
            console.log("max id is ", result[0].mid);
            maxID = result;
          }
        })
        console.log(maxID);
        console.log(insertSqlStatement);
        db(sqlStatement, [], (err, result) => {
          if (err) {
            console.log('插入security_type表失败', err.message);
          }
          else {
            let temp = req.body;
            console.log(!("gender" in temp));
            if (!("name" in temp) || !("gender" in temp) || !("identityid" in temp) || !("homeaddress" in temp) || !("work" in temp) || !("education" in temp) || !("workaddress" in temp) || !("phone" in temp)) {
              console.log(!("name" in temp) ? "name in" : "name not in");
              console.log(!("gender" in temp) ? "gender in" : "gender not in");
              console.log(!("identityid" in temp) ? "identityid in" : "identityid not in");
              console.log(!("homeaddress" in temp) ? "homeaddress in" : "homeaddress not in");
              console.log(!("work" in temp) ? "work in" : "work not in");
              console.log(!("education" in temp) ? "education in" : "education not in");
              console.log(!("phone" in temp) ? "phone in" : "namphonee not in");
              console.log(!("workaddress" in temp) ? "workaddress in" : "workaddress not in");
              res.status(400).end("请完整填写表单");
              return;
            }
            if (req.body.haveagent) {
              // 有代理人
              console.log("有代理")
              let insertSqlStatement1 = `insert into personSecurity(name, gender, identityid, homeaddress, work, education, workaddress, phone,agentidentityid) values (
                \'${req.body.name}\',
                \'${req.body.gender}\',
                \'${req.body.identityid}\',
                \'${req.body.homeaddress}\',
                \'${req.body.work}\',
                \'${req.body.education}\',
                \'${req.body.workaddress}\',
                \'${req.body.phone}\',
                \'${req.body.agentidentityid}\'
               );`
              console.log(insertSqlStatement1);
              db(insertSqlStatement1, [], (err, result) => {
                if (err) {
                  console.log('插入personSecurity表失败', err.message);
                }
                // 应该成功
                res.status(200).end("开户成功")
              });
              res.status(200).end(`开户成功,你的id是${maxID + 1}`)
            } else {
              // 没有代理人
              console.log("无代理")
              let insertSqlStatement1 = `insert into personSecurity(name, gender, identityid, homeaddress, work, education, workaddress, phone) values (
              \'${req.body.name}\',
              \'${req.body.gender}\',
              \'${req.body.identityid}\',
              \'${req.body.homeaddress}\',
              \'${req.body.work}\',
              \'${req.body.education}\',
              \'${req.body.workaddress}\',
              \'${req.body.phone}\'
               );`
              console.log(insertSqlStatement1);
              db(insertSqlStatement1, [], (err, result) => {
                if (err) {
                  console.log('插入personSecurity表失败', err.message);
                }
                // 应该成功
                res.status(200).end(`开户成功,你的id是${maxID + 1}`)
              });
            }
          }
        });
      }
    }
  });
});
module.exports = router;
