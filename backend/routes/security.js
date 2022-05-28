var express = require('express');
var router = express.Router();

var db = require('../database/db');

const utils = {
  addPrefix0: (number, totalsize = 18) => {
    return number.toString().padStart(totalsize, 0);
  },
  getMaxPersonSecurityId: (callback) => {
    let sql = `select max(securityid) as mid from personSecurity`;
    db(sql, [], (err, result) => {
      if (err) {
        console.log("[Get max security of persons error] - ", err.message);
        return;
      }
      if (result[0].mid !== null)
        callback(result[0].mid);
      else {
        callback(0);
      }
    })
  },
  getMaxCorporateSecurityId: (callback) => {
    let sql = `select max(securityid) as mid from corporateSecurity`;
    db(sql, [], (err, result) => {
      if (err) {
        console.log("[Get max security of corporates error] - ", err.message);
        return;
      }
      if (result.length == 0 || result[0].mid == null) {
        callback(0);
      }
      else {
        callback(result[0].mid);
      }
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
  },
  sumStrings: (a, b) => {
    var res = '', c = 0;
    a = a.split('');
    b = b.split('');
    while (a.length || b.length || c) {
      c += ~~a.pop() + ~~b.pop();
      res = c % 10 + res;//转成字符串
      //console.log(res);
      c = c > 9;//大于9进位
    }
    return res.replace(/^0+/, '');
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
      callback(-1, null);
      return;
    }
    let sql = `select * from personSecurity where identityid = \'${req.body.identityid}\' order by registerdate desc`
    db(sql, [], (err, result) => {
      if (err) {
        console.log("[Select accountstate from personSecurity error] - ", err.message);
        callback(-2, null);
        return;
      } else {
        if ((result.length > 0 && result[0].accountstate != 'cancel')) {
          // console.log(result[0]);
          if (result[0].accountstate == 'normal') {
            // 已经存在账户，无需开户 
            // console.log("req.body.identityid is ", req.body.identityid, " and result[0] is ", result[0]);
            callback(-3, null);
            return;
          } else if (result[0].accountstate == 'frozen') {
            callback(-4, null);
            return;
          }
        }
        else {
          let newSecurityID = utils.addPrefix0(utils.sumStrings(maxID.toString(), '1'));
          if (req.body.haveagent) {
            let insertSqlStatement1 = `insert into personSecurity(securityid,name, gender, identityid, homeaddress, work, education, workaddress, phone,agentidentityid) values (
                \'${newSecurityID}\',
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
              }
              //插入成功
              callback(0, newSecurityID);
            })
          } else {
            // 无代理
            let insertSqlStatement1 = `insert into personSecurity(securityid,name, gender, identityid, homeaddress, work, education, workaddress, phone) values (
                \'${newSecurityID}\',
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
                callback(-2, null);
                return;
              }
              // 插入成功
              callback(0, newSecurityID);
            })
          }
        }
      }
    })
  },
  // 0 表示成功
  // -1表示缺少字段
  // -2表示数据库错误
  // -3表示账户之前已经存在，无需开户
  // -4表示账户已经被冻结，不能开户
  openCorporaetaccount: (maxID, req, callback) => {
    temp = req.body;
    if (!("corporateregisterid" in temp) || !("licenseid" in temp) || !("corporateidentityid" in temp) || !("corporatename" in temp) || !("corporatephone" in temp) || !("contactaddress" in temp) || !("authorizername" in temp) || !("authorizeridentityid" in temp) || !("authorizerphone" in temp) || !("authorizeraddress" in temp)) {
      callback(-1);
      return;
    }
    let sql = `select * from corporateSecurity where corporateregisterid = \'${req.body.corporateregisterid}\' order by registerdate desc`
    db(sql, [], (err, result) => {
      if (err) {
        console.log("[Select accountstate from corporateSecurity error] - ", err.message);
        callback(-2, null);
        return;
      } else {
        if ((result.length > 0 && result[0].accountstate != 'cancel')) {
          // console.log(result[0]);
          if (result[0].accountstate == 'normal') {
            // 已经存在账户，无需开户 
            // console.log("req.body.corporateregisterid is ", req.body.corporateregisterid, " and result[0] is ", result[0]);
            callback(-3, null);
            return;
          } else if (result[0].accountstate == 'frozen') {
            callback(-4, null);
            return;
          }
        }
        else {
          let newSecurityID = utils.addPrefix0((utils.sumStrings(maxID.toString(), '1')), 17);
          if (newSecurityID.length == 17) {
            newSecurityID = '1' + newSecurityID;
          }
          // console.log("in inserting");
          // console.log("maxid is ", maxID);
          let insertSqlStatement1 = `insert into corporateSecurity(securityid,corporateregisterid,licenseid,corporateidentityid,corporatename,corporatephone,contactaddress,authorizername,authorizeridentityid,authorizerphone,authorizeraddress) values (
                \'${newSecurityID}\',
                \'${req.body.corporateregisterid}\',
                \'${req.body.licenseid}\',
                \'${req.body.corporateidentityid}\',
                \'${req.body.corporatename}\',
                \'${req.body.corporatephone}\',
                \'${req.body.contactaddress}\',
                \'${req.body.authorizername}\',
                \'${req.body.authorizeridentityid}\',
                \'${req.body.authorizerphone}\',
                \'${req.body.authorizeraddress}\'
               );`
          db(insertSqlStatement1, [], (err, result) => {
            if (err) {
              console.log("[ insert into corporateSecurity error ] - ", err.message);
              // console.log(`SQL IS ${insertSqlStatement1}`)
              callback(-2);
              return;
            }
            //插入成功
            callback(0, newSecurityID);
          });
        }
      }
    });
  }
}

const loseAccount = {

  // 0  表示成功
  // -1 表示无账户
  // -2 表示数据库错误
  // -3 表示已经销户
  // -4 表示已经挂失
  personLoseAccount: (identityid, callback) => {
    let sql = `select accountstate from personSecurity where identityid = \'${identityid}\' order by registerdate desc`
    db(sql, [], (err, result) => {
      if (err) {
        console.log("[select error] - ", err.message);
        callback(-2);
        return;
      }
      if (result.length > 0) {
        if (result[0].accountstate == 'cancel') {
          callback(-3);
        } else if (result[0].accountstate == 'frozen') {
          callback(-4);
        } else {
          // 状态正常，执行挂失操作
          let sql1 = `
          update personSecurity 
          set accountstate = 'frozen'
          where identityid = \'${identityid}\' and accountstate = 'normal'`
          db(sql1, [], (err, result) => {
            if (err) {
              console.log("[update accountstate of personSecurity error] - ");
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
  },
  corporateLostAccount: (corporateregisterid, callback) => {
    let sql = `select accountstate from corporateSecurity where corporateregisterid = \'${corporateregisterid}\' order by registerdate desc`
    db(sql, [], (err, result) => {
      if (err) {
        console.log("[select error] - ", err.message);
        callback(-2);
        return;
      }
      if (result.length > 0) {
        if (result[0].accountstate == 'cancel') {
          callback(-3);
        } else if (result[0].accountstate == 'frozen') {
          callback(-4);
        } else {
          // 状态正常，执行挂失操作
          let sql1 = `
          update corporateSecurity 
          set accountstate = 'frozen'
          where corporateregisterid = \'${corporateregisterid}\' and accountstate = 'normal'`
          db(sql1, [], (err, result) => {
            if (err) {
              console.log("[update accountstate of corporateSecurity error] - ");
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
    let sql = `select accountstate,securityid from personSecurity where identityid = \'${req.body.identityid}\' order by registerdate desc`
    db(sql, [], (err, result) => {
      if (err) {
        console.log("[Select accountstate from personSecurity error] - ", err.message);
        callback(-2, null);
        return;
      }
      if (result.length > 0) {
        if (result[0].accountstate == "normal") {
          callback(-4, null);
          return;
        }
        else if (result[0].accountstate == "cancel") {
          callback(-5, null);
          return;
        }
        originalSid = result[0].securityid;
        //将原来的账户改为cancel
        let sql1 = `update personSecurity set accountstate = 'cancel' where identityid = \'${req.body.identityid}\' and accountstate = 'frozen'`
        db(sql1, [], (err, result) => {
          if (err) {
            console.log("[update error in person makeup] - ", err.message);
            callback(-2, null);
            return;
          }
          // 成功
          // 开新的户
          // 开户
          utils.getMaxPersonSecurityId((maxID) => {
            openAccount.openPersonAccount(maxID, req, (statusCode) => {
              if (statusCode == -2) {
                callback(-2, null);
                return;
              } else if (statusCode == -3) {
                callback(-4, null);
                return;
              } else {
                // 更改原有资金账户的关联
                let newSecurityID = utils.addPrefix0(utils.sumStrings(maxID, '1'));
                let sql2 = `update capitalaccount set securityid = \'${newSecurityID}\' where securityid = \'${originalSid}\'`
                db(sql2, [], (err, result) => {
                  if (err) {
                    console.log("[update capitalaccount error] - ", err.message);
                    callback(-2, null);
                    return;
                  }
                  callback(0, newSecurityID);
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
  },
  corporateMakeUpAccount: (req, callback) => {
    let temp = req.body;
    if (!("corporateregisterid" in temp) || !("licenseid" in temp) || !("corporateidentityid" in temp) || !("corporatename" in temp) || !("corporatephone" in temp) || !("contactaddress" in temp) || !("authorizername" in temp) || !("authorizeridentityid" in temp) || !("authorizerphone" in temp) || !("authorizeraddress" in temp)) {
      callback(-1);
      return;
    }
    let originalSid = 0;
    let sql = `select accountstate,securityid from corporateSecurity where corporateidentityid = \'${req.body.corporateidentityid}\' order by registerdate desc`
    db(sql, [], (err, result) => {
      if (err) {
        console.log("[Select accountstate from corporateSecurity error] - ", err.message);
        callback(-2, null);
        return;
      }
      if (result.length > 0) {
        if (result[0].accountstate == "normal") {
          callback(-4, null);
          return;
        }
        else if (result[0].accountstate == "cancel") {
          callback(-5, null);
          return;
        }
        // console.log(result);
        originalSid = result[0].securityid;
        //将原来的账户改为cancel
        let sql1 = `update corporateSecurity set accountstate = 'cancel' where corporateidentityid = \'${req.body.corporateidentityid}\' and accountstate = 'frozen'`
        db(sql1, [], (err, result) => {
          if (err) {
            console.log("[update error in corporate makeup] - ", err.message);
            callback(-2, null);
            return;
          }
          // 成功
          // 开新的户
          // 开户
          utils.getMaxCorporateSecurityId((maxID) => {
            openAccount.openCorporaetaccount(maxID, req, (statusCode) => {
              if (statusCode == -2) {
                callback(-2, null);
                return;
              } else if (statusCode == -3) {
                callback(-4, null);
                return;
              } else {
                // 更改原有资金账户的关联
                let newSecurityID = utils.addPrefix0((utils.sumStrings(maxID.toString(), '1')), 17);
                if (newSecurityID.length == 17) {
                  newSecurityID = '1' + newSecurityID;
                }
                let sql2 = `update capitalaccount set securityid = \'${newSecurityID}\' where securityid = \'${originalSid}\'`
                // console.log("debug: update sql is ", sql2);
                db(sql2, [], (err, result) => {
                  if (err) {
                    console.log("[update capitalaccount error] - ", err.message);
                    callback(-2, null);
                    return;
                  }
                  callback(0, newSecurityID);
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

// 0表示销户成功
// -2表示数据库错误
// -3表示更新账户状态失败
// -4表示之前已经销户了
const cancelAccount = {
  // 提供身份证identityid和证券账户id即可
  personCancelAccount: (req, callback) => {
    let sql = `select accountstate,securityid from personSecurity where identityid = \'${req.body.identityid}\' order by registerdate desc`
    db(sql, [], (err, result) => {
      if (err) {
        console.log("[Select accountstate from personSecurity error] - ", err.message);
        callback(-2, null);
        return;
      }
      if (result.length > 0) {
        if (result[0].accountstate == "cancel") {
          callback(-4, null);
          return;
        }
        if (result[0].securityid !== req.body.securityid) {
          callback(-1, null);
          return;
        }
        //将原来的账户改为cancel
        let sql1 = `update personSecurity set accountstate = 'cancel' where identityid = \'${req.body.identityid}\' and accountstate in ('frozen','normal')`
        db(sql1, [], (err, result) => {
          if (err) {
            console.log("[update error in person cancel] - ", err.message);
            callback(-3, null);
            return;
          }
          // 销户成功
          callback(0, null);
        })
      } else {
        callback(-5, null);
        return;
      }
    })
  },
  corporateCancelAccount: (req, callback) => {
    let sql = `select accountstate,securityid from corporateSecurity where corporateregisterid = \'${req.body.corporateregisterid}\' order by registerdate desc`
    db(sql, [], (err, result) => {
      if (err) {
        console.log("[Select accountstate from corporateSecurity error] - ", err.message);
        callback(-2, null);
        return;
      }
      if (result.length > 0) {
        if (result[0].accountstate == "cancel") {
          callback(-4, null);
          return;
        }
        if (result[0].securityid !== req.body.securityid) {
          callback(-1, null);
          return;
        }
        //将原来的账户改为cancel
        let sql1 = `update corporateSecurity set accountstate = 'cancel' where corporateregisterid = \'${req.body.corporateregisterid}\' and accountstate in ('frozen','normal')`
        db(sql1, [], (err, result) => {
          if (err) {
            console.log("[update error in corporate cancel] - ", err.message);
            callback(-3, null);
            return;
          }
          // 销户成功
          callback(0, null);
        })
      } else {
        callback(-5, null);
        return;
      }
    })
  }
}

const login = {
  Login: (req, callback) => {
    let temp = req.body;
    if (!("securityid" in temp) || !("password" in temp)) {
      callback(-1, null);
      return;
    }
    let sql = `select * from securityInfo where securityid = \'${req.body.securityid}\' and password = \'${req.body.password}\'`
    db(sql, [], (err, result) => {
      if (err) {
        console.log("[Select * from securityInfo error] - ", err.message);
        callback(-2, null);
        return;
      }
      if (result.length == 0) {
        callback(-3, null);
        return;
      }
      else if (result.length > 0) {
        callback(0, null);
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
  if (!req.session.security_is_admin) {
    res.status(403).end("非法访问");
    return;
  }
  utils.getMaxPersonSecurityId((maxID) => {
    openAccount.openPersonAccount(maxID, req, (statusCode, result) => {
      if (statusCode == -1) {
        res.status(400).end("缺失identityid参数");
        return;
      } else if (statusCode == -2) {
        res.status(503).end("数据库错误");
        return;
      } else if (statusCode == -3) {
        res.status(403).end("账户已经存在，请勿重复开户");
        return;
      } else if (statusCode == -4) {
        res.status(403).end("账户已经冻结，请执行挂失操作");
        return;
      } else {
        res.status(200).end(`开户成功,您的证券账户id为${result}`);
      }
      return;
    })
  })
});

// 0 表示成功
// -1表示缺少字段
// -2表示数据库错误
// -3表示账户之前已经存在，无需开户
// -4表示账户已经被冻结，不能开户
router.post('/corporateOpen', (req, res) => {
  if (!req.session.security_is_admin) {
    res.status(403).end("非法访问");
    return;
  }
  // console.log(req.body);
  utils.getMaxCorporateSecurityId((maxID) => {
    openAccount.openCorporaetaccount(maxID, req, (statusCode, newSecurityID) => {
      if (statusCode == -1) {
        res.status(400).end("缺失参数");
        return;
      } else if (statusCode == -2) {
        res.status(503).end("数据库错误");
        return;
      } else if (statusCode == -3) {
        res.status(403).end("账户已经存在，请勿重复开户");
        return;
      } else if (statusCode == -4) {
        res.status(403).end("账户已经冻结，请执行挂失操作");
        return;
      } else {
        res.status(200).end(`开户成功,您的证券账户id为${newSecurityID}`);
      }
      return;
    })
  })
})
/* 个人挂失 */
router.post("/personLoss", (req, res) => {
  if (!req.session.security_is_admin) {
    res.status(403).end("非法访问");
    return;
  }
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

/* 法人挂失 */
router.post("/corporateLoss", (req, res) => {
  if (!req.session.security_is_admin) {
    res.status(403).end("非法访问");
    return;
  }
  if (!("corporateregisterid" in req.body)) {
    req.status(400).end("缺失corporateregisterid参数");
    return;
  }
  // console.log(req.body)
  // 0  表示成功
  // -1 表示无账户
  // -2 表示数据库错误
  // -3 表示已经销户
  // -4 表示已经挂失
  loseAccount.corporateLostAccount(req.body.corporateregisterid, (statusCode) => {
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
  if (!req.session.security_is_admin) {
    res.status(403).end("非法访问");
    return;
  }
  makeupAccount.personMakeUp(req, (statusCode, newSecurityID) => {
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
      res.status(200).end(`补办成功,您的证券账户id为${newSecurityID}`);
    }
  })
});
/* 法人补办 */
// 0 表示补办成功
// -1表示参数缺失
// -2表示数据库错误
// -3表示无账户信息，所以无法补办
// -4表示账户是normal，无法补办
// -5表示账户已经销户，无法补办
router.post("/corporateMakeup", (req, res) => {
  if (!req.session.security_is_admin) {
    res.status(403).end("非法访问");
    return;
  }
  makeupAccount.corporateMakeUpAccount(req, (statusCode, newSecurityID) => {
    if (statusCode == -1) {
      res.status(400).end("缺失法人注册id参数");
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
      res.status(200).end(`补办成功,您的证券账户id为${newSecurityID}`);
    }
  })
});

//个人销户
router.post("/personCancelAccount", (req, res) => {
  if (!req.session.security_is_admin) {
    res.status(403).end("非法访问");
    return;
  }
  // TODO 检查股票是否清空
  if (!("identityid" in req.body) || !("securityid" in req.body)) {
    res.status(400).end("缺少字段");
    return;
  }
  // 1. 检查是否对应
  // 2. 检查账户状态
  //TODO 
  // 3. 检查股票账户状态
  cancelAccount.personCancelAccount(req, (statusCode, result) => {
    // 0表示销户成功
    // -2表示数据库错误
    // -3表示更新账户状态失败
    // -4表示之前已经销户了
    if (statusCode == 0) {
      res.status(200).end("销户成功");
    } else if (statusCode == -1) {
      res.status(503).end("信息不匹配");
    } else if (statusCode == -2) {
      res.status(503).end("服务器内部错误");
    } else if (statusCode == -5) {
      res.status(503).end("不存在对应的账户");
    } else if (statusCode == -4) {
      res.status(400).end("之前已经销户过了，请进行开户操作");
    }
  })
});

//法人销户
router.post("/corporateCancel", (req, res) => {
  if (!req.session.security_is_admin) {
    res.status(403).end("非法访问");
    return;
  }
  // TODO 检查股票是否清空
  if (!("corporateregisterid" in req.body) || !("securityid" in req.body)) {
    res.status(400).end("缺少字段");
    return;
  }
  // 1. 检查是否对应
  // 2. 检查账户状态
  //TODO 
  // 3. 检查股票账户状态
  cancelAccount.corporateCancelAccount(req, (statusCode, result) => {
    // 0表示销户成功
    // -1表示信息不匹配
    // -2表示数据库错误
    // -3表示更新账户状态失败
    // -4表示之前已经销户了
    if (statusCode == 0) {
      res.status(200).end("销户成功");
    } else if (statusCode == -1) {
      res.status(503).end("提供的信息不匹配");
    }
    else if (statusCode == -2) {
      res.status(503).end("服务器内部错误");
    } else if (statusCode == -5) {
      res.status(503).end("不存在对应的账户");
    } else if (statusCode == -4) {
      res.status(400).end("之前已经销户过了，请进行开户操作");
    }
  })
});

// 0 表示登陆成功
// -1表示缺失参数
// -2表示数据库错误
// -3表示登陆账号或者密码错误
router.post("/login", function (req, res) {
  login.Login(req, (statusCode, result) => {
    if (statusCode == -2) {
      res.status(503).end("数据库连接错误");
      return
    }
    else if (statusCode == -3) {
      res.status(400).end("登陆账号或密码输入错误");
      return;
    } else if (statusCode == -1) {
      res.status(400).end("请输入账户和密码！");
      return;
    }
  })
  login.Login(req, (statusCode, result) => {
    // console.log(req.body)
    req.session.securityid = req.body.securityid;
    if (req.body.securityid === '000000000000000000') {
      req.session.security_is_admin = true;
    }
    res.status(200).end(JSON.stringify({
      "msg": "登陆成功！",
      "is_admin": req.body.securityid === '000000000000000000'
    }));
  });
})
module.exports = router;
