var express = require('express');
var router = express.Router();

var db = require('../database/db');

const utils = {
  addPrefix0: (totalsize = 10, number) => {
    return number.toString().padStart(totalsize, 0);
  },
  getMaxPersonSecurityId: (callback) => {
    let sql = `select max(securityid) as mid from personSecurity`;
    db(sql, [], (err, result) => {
      if (err) {
        console.log("[Get max security of persons error] - ", err.message);
        return;
      }
      callback(result[0].mid);
    })
  },
  getMaxSecurityId: (callback) => {
    let sql = `select max(securityid) as mid from security_type`;
    db(sql, [], (err, result) => {
      if (err) {
        console.log("[Get max security of all error] - ", err.message);
        return;
      }
      callback(result[0].mid);
    })
  }
}

const openAccount = {
  // 开户
  // maxID表示所有账户中的最大证券账户id
  // 0表示成功
  // -1表示缺失参数
  // -2表示数据库错误
  // -3表示已经存在账户，无需开户
  // -4表示账户冻结，禁止开户
  openPersonAccount: (maxID, req, callback) => {
    temp = req.body;
    if (!("name" in temp) || !("gender" in temp) || !("identityid" in temp) || !("homeaddress" in temp) || !("work" in temp) || !("education" in temp) || !("workaddress" in temp) || !("phone" in temp)) {
      callback(-1);
      return;
    }
    let sql = `select * from personSecurity where identityid = \'${req.body.identityid}\' order by registerdate desc`
    db(sql, [], (err, result) => {
      if (err) {
        console.log("[Select state from personSecurity error] - ", err.message);
        callback(-2);
        return;
      } else {
        if ((result.length > 0 && result[0].state != 'cancel')) {
          if (result[0].state == 'normal') {
            // 已经存在账户，无需开户 
            console.log("req.body.identityid is ", req.body.identityid, " and result[0] is ", result[0]);

            callback(-3);
            return;
          } else if (result[0].state == 'frozen') {
            callback(-4);
            return;
          }
        }
        else {
          let insertTypeSql = `insert into security_type(securityid,accountType) values('${maxID + 1}','person')`
          db(insertTypeSql, [], (err, result) => {
            if (err) {
              console.log("[Insert into security_type error] - ", err.message);
              callback(-2);
              return;
            }
            console.log("in inserting");
            console.log("maxid is ", maxID);
            if (req.body.haveagent) {
              let insertSqlStatement1 = `insert into personSecurity(securityid,name, gender, identityid, homeaddress, work, education, workaddress, phone,agentidentityid) values (
                \'${maxID + 1}\',
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
              db(insertSqlStatement1, [], (err, result) => {
                if (err) {
                  console.log("[ insert into personSecurity error ] - ", err.message);
                  callback(-2);
                  return;
                }
                //插入成功
                callback(0);
              })
            } else {
              // 无代理
              let insertSqlStatement1 = `insert into personSecurity(securityid,name, gender, identityid, homeaddress, work, education, workaddress, phone) values (
                \'${maxID + 1}\',
                \'${req.body.name}\',
                \'${req.body.gender}\',
                \'${req.body.identityid}\',
                \'${req.body.homeaddress}\',
                \'${req.body.work}\',
                \'${req.body.education}\',
                \'${req.body.workaddress}\',
                \'${req.body.phone}\'
                 );`
              db(insertSqlStatement1, [], (err, result) => {
                if (err) {
                  console.log("[ insert into personSecurity error ] - ", err.message);
                  callback(-2);
                  return;
                }
                // 插入成功
                callback(0);
              })
            }
          })
        }
      }
    })
  }
};


const loseAccount = {

  // 0  表示成功
  // -1 表示无账户
  // -2 表示数据库错误
  // -3 表示已经销户
  // -4 表示已经挂失
  personLoseAccount: (identityid, callback) => {
    let sql = `select accountState from personSecurity where identityid = \'${identityid}\' order by registerdate desc`
    db(sql, [], (err, result) => {
      if (err) {
        console.log("[select error] - ", err.message);
        callback(-2);
        return;
      }
      if (result.length > 0) {
        if (result[0].state == 'cancel') {
          callback(-3);
        } else if (result[0].state == 'frozen') {
          callback(-4);
        } else {
          // 状态正常，执行挂失操作
          let sql1 = `
          update personSecurity 
          set state = 'frozen'
          where identityid = \'${identityid}\' and state = 'normal'`
          db(sql1, [], (err, result) => {
            if (err) {
              console.log("[update state of personSecurity error] - ");
              callback(-2);
              return;
            }
            else {
              //成功
              callback(0);
            }
          })
        }
      } else {
        callback(-1);
        return;
      }
    })
  }
}

const makeupAccount = {

  // 0 表示补办成功
  // -1表示参数缺失
  // -2表示数据库错误
  // -3表示无账户信息，所以无法补办
  // -4表示账户是normal，无法补办
  // -5表示账户已经销户，无法补办

  personMakeUp: (req, callback) => {
    let temp = req.body;
    if (!("name" in temp) || !("gender" in temp) || !("identityid" in temp) || !("homeaddress" in temp) || !("work" in temp) || !("education" in temp) || !("workaddress" in temp) || !("phone" in temp)) {
      callback(-1, null);
      return;
    }
    let originalSid = 0;
    let sql = `select state,securityid from personSecurity where identityid = \'${req.body.identityid}\' order by registerdate desc`
    db(sql, [], (err, result) => {
      if (err) {
        console.log("[Select state from personSecurity error] - ", err.message);
        callback(-2, null);
        return;
      }
      if (result.length > 0) {
        if (result[0].state == "normal") {
          callback(-4, null);
          return;
        }
        else if (result[0].state == "cancel") {
          callback(-5, null);
          return;
        }
        originalSid = result[0].securityid;
        //将原来的账户改为cancel
        let sql1 = `update personSecurity set state = 'cancel' where identityid = \'${req.body.identityid}\' and state = 'frozen'`
        db(sql1, [], (err, result) => {
          if (err) {
            console.log("[update error in person makeup] - ", err.message);
            callback(-2, null);
            return;
          }
          // 成功
          // 开新的户
          // 开户
          utils.getMaxSecurityId((maxID) => {
            openAccount.openPersonAccount(maxID, req, (statusCode) => {
              if (statusCode == -2) {
                callback(-2, null);
                return;
              } else if (statusCode == -3) {
                callback(-4, null);
                return;
              } else {
                // 更改原有资金账户的关联
                let sql2 = `update capitalaccount set securityid = \'${maxID + 1}\' where securityid = \'${originalSid}\'`
                db(sql2, [], (err, result) => {
                  if (err) {
                    console.log("[update capitalaccount error] - ", err.message);
                    callback(-2, null);
                    return;
                  }
                  callback(0, maxID);
                })
              }
            })
          })
        })
      } else {
        callback(-3, null);
        return;
      }
    })
  }
}
// 0表示成功
// -1表示缺失identity参数
// -2表示数据库错误
// -3表示已经存在账户，无需开户
// -4表示账户冻结，禁止开户
/* 个人开户 */
router.post('/personalOpen', function (req, res) {
  console.log(req.body);
  utils.getMaxSecurityId((maxID) => {
    openAccount.openPersonAccount(maxID, req, (statusCode) => {
      if (statusCode == -1) {
        res.status(400).send("缺失identityid参数");
        return;
      } else if (statusCode == -2) {
        res.status(503).send("数据库错误");
        return;
      } else if (statusCode == -3) {
        res.status(403).send("账户已经存在，请勿重复开户");
        return;
      } else if (statusCode == -4) {
        res.status(403).send("账户已经冻结，请执行挂失操作");
        return;
      } else {
        res.status(200).send(`开户成功,您的证券账户id为${utils.addPrefix0(10, (maxID + 1)).toString()}`);
      }
    })
  })
});

/* 个人挂失 */
router.post("/personLoss", (req, res) => {
  if (!("identityid" in req.body)) {
    req.status(400).end("缺失identity参数");
    return;
  }
  // 0  表示成功
  // -1 表示无账户
  // -2 表示数据库错误
  // -3 表示已经销户
  // -4 表示已经挂失
  loseAccount.personLoseAccount(req.body.identityid, (statusCode) => {
    if (statusCode == 0) {
      res.status(200).end("挂失成功");
      return;
    } else if (statusCode == -1) {
      res.status(403).end("您还未开户,无法执行挂失");
      return;
    } else if (statusCode == -2) {
      res.status(503).end("数据库错误");
      return;
    } else if (statusCode == -3) {
      res.status(403).end("您之前已经销户，请执行补办操作");
      return;
    } else {
      res.status(403).end("请勿重复执行挂失操作");
      return;
    }
  })
});

/* 个人补办 */
// 0 表示补办成功
// -1表示参数缺失
// -2表示数据库错误
// -3表示无账户信息，所以无法补办
// -4表示账户是normal，无法补办
// -5表示账户已经销户，无法补办
router.post("/personmakeup", (req, res) => {
  makeupAccount.personMakeUp(req, (statusCode, maxID) => {
    if (statusCode == -1) {
      res.status(400).end("缺失identityid参数");
      return;
    }
    else if (statusCode == -2) {
      res.status(503).end("数据库错误");
      return;
    }
    else if (statusCode == -3) {
      res.status(400).end("请先注册一个账户");
      return;
    }
    else if (statusCode == -4) {
      res.status(400).end("只能够对挂失的账户进行补办");
      return;
    }
    else if (statusCode == -5) {
      res.status(400).end("您已经执行销户操作，无法补办");
      return;
    } else {
      // 成功
      res.status(200).end(`补办成功,您的证券账户id为${utils.addPrefix0(10, (maxID + 1)).toString()}`);
    }
  })
});

//个人销户
router.post("/pcalcel", (req, res) => {
  // TODO 检查股票是否清空
  if (!("identityid" in req.body) || !("securityid" in req.body)) {
    res.status(400).end("缺少字段");
    return;
  }
  // 1. 检查是否对应
  // 2. 检查账户状态
  //TODO 
  // 3. 检查股票账户状态
  let checkSecurityIdAndIdentityIDSql = `select * from personSecurity where `
})
module.exports = router;
