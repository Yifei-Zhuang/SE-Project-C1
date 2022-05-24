var express = require('express');
var router = express.Router();

var db = require('../database/db');

const utils = {
    addPrefix0: (number, totalsize = 18) => {
        return number.toString().padStart(totalsize, 0);
    },
    getMaxCapitalAccountId: (callback) => {
        let sql = `select max(capitalaccountid) as mid from capitalaccount`;
        db(sql, [], (err, result) => {
            if (err) {
                console.log("[Get max capital account of all error] - ", err.message);
                return;
            }
            if (result[0].mid !== null)
                callback(result[0].mid);
            else {
                callback(0);
            }
        })
    }
}

const openAccount = {
    // 开户
    // maxID表示所有账户中的最大资金账户id
    // 0表示成功
    // -1表示缺失参数
    // -2表示数据库错误
    // -3表示其证券账户存在问题(冻结)
    // -4表示不存在对应的证券账户
    openCapitalAccount: (maxID, req, callback) => {
        temp = req.body;
        if (!("identityid" in temp) || !("securityId" in temp) || !("tradepassword" in temp) || !("cashpassword" in temp)) {
            callback(-1);
            return;
        }
        let sql = `select * from personSecurity, corporateSecurity where corporateSecurity.securityId = \'${req.body.securityId}\' or personSecurity.securityId = \'${req.body.securityId}\' order by personSecurity.registerdate, corporateSecurity.registerdate desc limit 1`
        db(sql, [], (err, result) => {
            if (err) { /* 未找到该个人用户开设的证券账户 */
                console.log("[Select identity from personSecurity or corporateSecurity error, you need to create a security account firstly.] - ", err.message);
                callback(-2);
                return;
            } else if (result.length == 0) {
                // 没有对应的证券账户
                callback(-4);
                return;
            }
            else if ((result.length > 0 && result[0].accountstate == 'frozen')) {
                console.log("[Security account frozen error] - ", err.message)
                callback(-3);
                return;
            }
            else if ((result.length > 0 && (result[0].accountstate == 'normal' || result[0].accountstate == 'cancel'))) {
                let newcapitalaccountid = utils.addPrefix0(parseInt(maxID) + 1);
                let rollbackTypeSql = `delete from capitalaccount where capitalaccountid ='${newcapitalaccountid}'`
                let insertSqlStatement1 = `insert into capitalaccount(capitalaccountid, identityid, securityId, tradepassword, cashpassword) values (
                    \'${newcapitalaccountid}\',
                    \'${req.body.identityid}\',
                    \'${req.body.securityId}\',
                    \'${req.body.tradepassword}\',
                    \'${req.body.cashpassword}\'
                    );`
                db(insertSqlStatement1, [], (err, result) => {
                    if (err) {
                        console.log("[ insert into capitalaccount error ] - ", err.message);
                        db(rollbackTypeSql, [], () => {
                            callback(-2);
                            return;
                        })
                    }
                    //插入成功
                    callback(0);
                })
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
    LoseCapitalAccount: (capitalaccountid, callback) => {
        let sql = `select accountstate from capitalaccount where capitalaccountid = \'${capitalaccountid}\'`
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
                    let sql1 = `update capitalaccount set accountstate = 'frozen'
                    where capitalaccountid = \'${capitalaccountid}\' and accountstate = 'normal'`
                    db(sql1, [], (err, result) => {
                        if (err) {
                            console.log("[update accountstate of capitalaccount error] - ");
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
    // -6表示账户信息核对错误，cashpassword不正确
    // -7表示对应的证券账户id无效
    CapitalAccountMakeUp: (req, callback) => {
        let temp = req.body;
        if (!("capitalaccountid" in temp) || !("identityid" in temp) || !("securityId" in temp)) {
            callback(-1, null);
            return;
        }
        let sql = `select accountstate from capitalAccount where capitalaccountid = \'${req.body.capitalaccountid}\'`
        db(sql, [], (err, result) => {
            if (err) {
                console.log("[Select accountstate from capitalaccount error] - ", err.message);
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
                else if (result[0].cashpassword != req.cashpassword) {
                    callback(-6, null);
                }

                //将原来的账户改为cancel
                let sql = `update capitalaccount set accountstate = 'cancel' where capitalaccountid = \'${req.body.capitalaccountid}\' and accountstate = 'frozen'`
                db(sql, [], (err, result) => {
                    if (err) {
                        console.log("[update error in person makeup] - ", err.message);
                        callback(-2, null);
                        return;
                    }
                    // 成功
                    // 开新的户
                    // 开户
                    utils.getMaxCapitalAccountId((maxID) => {
                        openAccount.openCapitalAccount(maxID, req, (statusCode) => {
                            if (statusCode == -2) {/* 数据库错误 */
                                callback(-2, null);
                                return;
                            } else if (statusCode == -4) {
                                // 不存在对应的证券账户
                                callback(-7, null);
                                return;
                            } else {
                                callback(statusCode, maxID);
                            }
                        })
                    })
                })
            } else {
                callback(- 3, null);
                return;
            }
        })
    }
}


const cancelAccount = {
    // 0表示销户成功
    // -1表示信息不匹配
    // -2表示数据库错误
    // -3表示更新账户状态失败
    // -4表示之前已经销户了
    // 提供身份证identityid和证券账户id即可
    CancelCapitalAccount: (req, callback) => {
        let sql = `select accountstate, balance,identityid,securityid from capitalaccount where capitalaccountid = \'${req.body.capitalaccountid}\'`
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
                if (result[0].identityid !== req.body.identityid || result[0].securityid !== req.body.securityid) {
                    callback(-1, null);
                    return;
                }
                //将原来的账户改为cancel
                let sql1 = `update capitalaccount set accountstate = 'cancel' where capitalaccountid = \'${req.body.capitalaccountid}\' and accountstate in ('frozen','normal')`
                db(sql1, [], (err, result) => {
                    if (err) {
                        console.log("[update error in capital account cancel] - ", err.message);
                        callback(-3, null);
                        return;
                    }
                    // 销户成功
                    callback(0, null);
                })
            } else {
                callback(-3, null);
                return;
            }
        })
    }
}

/* 登陆 */
const capitalLogin = {
    // 0 表示登陆成功
    // -1表示缺失参数
    // -2表示数据库错误
    // -3表示登陆账号或者密码错误
    Login: (req, callback) => {
        let temp = req.body;
        if (!("capitalaccountid" in temp) || !("cashpassword" in temp)) {
            callback(-1, null);
            return;
        }
        let sql = `select * from capitalaccount where capitalaccountid = \'${req.body.capitalaccountid}\' and cashpassword = \'${req.body.cashpassword}\'`
        db(sql, [], (err, result) => {
            if (err) {
                console.log("[Select * from capitalaccount error] - ", err.message);
                callback(-2, null);
                return;
            }
            if (result.length == 0) {
                console.log("[Input error / cash password error] - ", err.message);
                callback(-3, null);
                return;
            }
            else if (result.length > 0) {
                console.log("Login!");
                callback(0, null);
            }
        })
    }
}

/* 登出 */
const capitalLogout = {
    Logout: (req, callback) => {
        console.log("log out!");
        callback(0, null);
    }
}

/* 修改交易密码trade password */
const tradepasswordChange = {
    // 0 表示修改成功
    // -1表示缺失参数
    // -2表示数据库错误
    changeTradePassword: (req, callback) => {
        let temp = req.body;
        if (!("capitalaccountid" in temp) || !("newpassword" in temp)) {
            callback(-1, null);
            return;
        }
        let sql = `update capitalaccount set tradepassword = \'${req.body.newpassword}\' where capitalaccountid = \'${req.body.capitalaccountid}\'`
        db(sql, [], (err, result) => {
            if (err) {
                console.log("[update capitalaccount error] - ", err.message);
                callback(-2, null);
                return;
            }
            if (result.length == 0) {
                console.log("[capitalaccount error] - ", err.message);
                callback(-3, null);
                return;
            }
            else if (result.length > 0) {
                console.log("Successfully update!");
                callback(0, null);
            }
        })
    }
}

/* 修改存取款密码cash password */
const cashpasswordChange = {
    // 0 表示修改成功
    // -1表示缺失参数
    // -2表示数据库错误
    changeCashPassword: (req, callback) => {
        let temp = req.body;
        if (!("capitalaccountid" in temp) || !("newpassword" in temp)) {
            callback(-1, null);
            return;
        }
        let sql = `update capitalaccount set cashpassword = \'${req.body.newpassword}\' where capitalaccountid = \'${req.body.capitalaccountid}\'`
        db(sql, [], (err, result) => {
            if (err) {
                console.log("[update capitalaccount error] - ", err.message);
                callback(-2, null);
                return;
            }
            if (result.length == 0) {
                console.log("[capitalaccount error] - ", err.message);
                callback(-3, null);
                return;
            }
            else if (result.length > 0) {
                console.log("Successfully update!");
                callback(0, null);
            }
        })
    }
}

/**
 * 0：成功
 * -1：账户不存在
 * -2：数据库错误
 * -3：账户已经销户
 * -4：账户已被冻结
 * -5：（取款）余额不足
 */
const changeBalance = {
    userDeposit: (req, callback) => {
        let selectsql = `select * from capitalaccount where capitalaccountid = \'${req.body.capitalaccountid}\'`;
        db(selectsql, [], (err, result) => {
            if (err) {
                console.log("[Select while depositing error] -", err.message);
                callback(-2);
                return;
            }
            else {
                if (result.length == 0) {
                    console.log("该账户不存在！");
                    callback(-1);
                    return;
                }
                else if (result[0].accountstate == 'cancel') {
                    console.log("该账户已被销户！");
                    callback(-3);
                    return;
                }
                else if (result[0].accountstate == 'frozen') {
                    console.log("该账户已被冻结！");
                    callback(-4);
                    return;
                }
                else {
                    let addDeposit = `update capitalaccount set balance = balance +
                    ${req.body.amount} where capitalaccountid = \'${req.body.capitalaccountid}\'`;
                    db(addDeposit, [], (err, result) => {
                        if (err) {
                            console.log("[Update while depositing error] - ", err.message);
                            callback(-2);
                            return;
                        }
                        //successfully depositing
                        let getId = `select max(id) as mid from transactions`;
                        let maxId;
                        db(getId, [], (err, result) => {
                            if (err) {
                                console.log("[Get max transaction error] - ", err.message);
                                callback(-2);
                                return;
                            }
                            else if (result[0].length == 0)
                                maxId = 1;
                            else maxId = result[0].mid + 1;
                            let transactionSql = `insert into transactions(id, capitalaccountid, amount, description) values(
                                ${maxId}, \'${req.body.capitalaccountid}\', ${req.body.amount}, \'Deposite Money.\'
                            );`;
                            db(transactionSql, [], (err, result) => {
                                if (err) {
                                    console.log("[Fail to update transaction] - ", err.message);
                                    callback(-2);
                                    return;
                                }
                                else;
                            })
                            callback(0);
                        })
                    })
                }
            }
        })
    },
    userWithdraw: (req, callback) => {
        let selectsql = `select * from capitalaccount where capitalaccountid = \'${req.body.capitalaccountid}\'`;
        let amount = req.body?.amount;
        db(selectsql, [], (err, result) => {
            if (err) {
                console.log("[Select while withdrawing error] -", err.message);
                callback(-2);
                return;
            }
            else {
                if (result.length == 0) {
                    console.log("该账户不存在！");
                    callback(-1);
                    return;
                }
                else if (result[0].accountstate == 'cancel') {
                    console.log("该账户已被销户！");
                    callback(-3);
                    return;
                }
                else if (result[0].accountstate == 'frozen') {
                    console.log("该账户已被冻结！");
                    callback(-4);
                    return;
                }
                else if (result[0].balance < amount) {
                    console.log("余额不足!");
                    callback(-5);
                    return;
                }
                else {
                    let addDeposit = `update capitalaccount set balance = balance -
                    ${req.body.amount} where capitalaccountid = \'${req.body.capitalaccountid}\'`;
                    db(addDeposit, [], (err, result) => {
                        if (err) {
                            console.log("[Update while withdrawing error] - ", err.message);
                            callback(-2);
                            return;
                        }
                        let getId = `select max(id) as mid from transactions`;
                        let maxId;
                        db(getId, [], (err, result) => {
                            if (err) {
                                console.log("[Get max transaction error] - ", err.message);
                                callback(-2);
                                return;
                            }
                            else if (result[0].length == 0)
                                maxId = 1;
                            else maxId = result[0].mid + 1;
                            let transactionSql = `insert into transactions(id, capitalaccountid, amount, description) values(
                                ${maxId}, \'${req.body.capitalaccountid}\', -${req.body.amount}, \'Withdraw Money.\'
                            );`;
                            db(transactionSql, [], (err, result) => {
                                if (err) {
                                    console.log("[Fail to update transaction] - ", err.message);
                                    callback(-2);
                                    return;
                                }
                                else { }
                            })
                            callback(0);
                        })
                    })
                }
            }
        })
    }
}
/**
 * 0：成功
 * -1：账户不存在
 * -2：数据库错误
 * -3：账户已经销户
 * -4：账户已被冻结
 * -5：利息为0
 */
const interestToBalance = {
    interestToBalance: (req, callback) => {
        let selectsql = `select * from capitalaccount where capitalaccountid = \'${req.body.capitalaccountid}\'`;
        db(selectsql, [], (err, result) => {
            if (err) {
                console.log("[Select while changing interests error] -", err.message);
                callback(-2);
                return;
            }
            else {
                if (result.length == 0) {
                    console.log("该账户不存在！");
                    callback(-1);
                    return;
                }
                else if (result[0].accountstate == 'cancel') {
                    console.log("该账户已被销户！");
                    callback(-3);
                    return;
                }
                else if (result[0].accountstate == 'frozen') {
                    console.log("该账户已被冻结！");
                    callback(-4);
                    return;
                }
                else {
                    let temp_interest = result[0].interest;
                    if (result[0].interest == 0) {
                        console.log("无可用利息！");
                        callback(-5);
                        return;
                    }
                    let convertSql = `update capitalaccount set interest = 0, balance = balance + ${temp_interest} where capitalaccountid = \'${req.body.capitalaccountid}\'`;
                    db(convertSql, [], (err, result) => {
                        if (err) {
                            console.log("[Select while changing interests error] -", err.message);
                            callback(-2);
                            return;
                        }
                        else {
                            console.log("本次成功转换利息数量为：", temp_interest);
                            callback(0);
                            return;
                        }
                    })
                }
            }
        })
    }
}
/**
 * 0：资金转出成功
 * -1：该账户不存在
 * -2：数据库错误
 * -3：可用资金不足
 * -4：账户已冻结
 * -5：账户已注销
 */
const moneyout = {
    getMoneyOut: (req, callback) => {
        let selectsql = `select * from capitalaccount where capitalaccountid = \'${req.body.capitalaccountid}\' `;
        db(selectsql, [], (err, result) => {
            if (err) {
                console.log("[Select while moneyout error] - ", err.message);
                callback(-2);
                return;
            }
            else if (result.length == 0) {
                console.log("该账户不存在！");
                callback(-1);
                return;
            }
            else if (result[0].accountstate == 'frozen') {
                console.log("该账户已被冻结！");
                callback(-4);
            }
            else if (result[0].accountstate == 'cancel') {
                console.log("该账户已被注销！");
                callback(-5);
            }
            else if (result[0].balance < req.body.amount) {
                console.log("可用资金不足，无法转为冻结资金！");
                callback(-3);
            }
            else {
                let updatesql = `update capitalaccount set balance = balance - ${req.body.amount}, frozenmoney = frozenmoney +${req.body.amount} where capitalaccountid = \'${req.body.capitalaccountid}\'`;
                db(updatesql, [], (err, result) => {
                    if (err) {
                        console.log("[Update while moneyout error] - ", err.message);
                        callback(-2);
                        return;
                    }
                    else {
                        callback(0);
                        return;
                    }
                })
            }
        })
    }
}
/**
 * 0：转账成功
 * -1：sender余额不足
 * -2：数据库错误
 * -3：sender账户不存在
 * -4：receiver账户不存在
 * -5：sender被冻结
 * -6：sender被注销
 * -7：receiver被冻结
 * -8：receiver被注销
 */
const moneyin = {
    getMoneyIn: (req, callback) => {
        let sendersel = `select * from capitalaccount where capitalaccountid = ${req.body.senderid}`;
        let receiversel = `select * from capitalaccount where capitalaccountid = ${req.body.receiverid}`;
        db(sendersel, [], (err, result) => {
            if (err) {
                console.log("[select sender in moneyin error] - ", err.message);
                callback(-2);
                return;
            }
            else if (result.length == 0) {
                console.log("sender账户不存在！");
                callback(-3);
                return;
            }
            else if (result[0].accountstate == 'frozen') {
                console.log("sender账户被冻结！");
                callback(-5);
                return;
            }
            else if (result[0].accountstate == 'cancel') {
                console.log("sender账户被注销！");
                callback(-6);
                return;
            }
            else if (result[0].balance < req.body.amount) {
                console.log("sender可用余额不足，无法转账！");
                callback(-1);
                return;
            }
        })
        db(receiversel, [], (err, result) => {
            if (err) {
                console.log("[select receiver in moneyin error] - ", err.message);
                callback(-2);
                return;
            }
            else if (result.length == 0) {
                console.log("receiver账户不存在！");
                callback(-4);
                return;
            }
            else if (result[0].accountstate == 'frozen') {
                console.log("receiver账户被冻结！");
                callback(-7);
                return;
            }
            else if (result[0].accountstate == 'cancel') {
                console.log("receiver账户被注销！");
                callback(-8);
                return;
            }
        })
        reducesql = `update capitalaccount set balance = balance - ${req.body.amount} where capitalaccountid = \'${req.body.senderid}\'`;
        addsql = `update capitalaccount set balance = balance + ${req.body.amount} where capitalaccountid = \'${req.body.receiverid}\'`;
        db(reducesql, [], (err, callback) => {
            if (err) {
                console.log("[error while reducing money in moneyin] - ", err.message);
                callback(-2);
                return;
            }
            else {
                db(addsql, [], (err, callback) => {
                    if (err) {
                        console.log("[err while adding in moneyin] - ", err.message);
                        callback(-2);
                        return;
                    }
                    else {
                        callback(0);
                        return;
                    }
                })
            }
        })
    }
}
/**
 * 0：交易撤销成功
 * -1：该账户不存在
 * -2：数据库错误
 * -3：冻结资金不足
 * -4：账户已冻结
 * -5：账户已注销
 */
const revertTrade = {
    revertTradefunc: (req, callback) => {
        let selectsql = `select * from capitalaccount where capitalaccountid = \'${req.body.capitalaccountid}\' `;
        db(selectsql, [], (err, result) => {
            if (err) {
                console.log("[Select while moneyout error] - ", err.message);
                callback(-2);
                return;
            }
            else if (result.length == 0) {
                console.log("该账户不存在！");
                callback(-1);
                return;
            }
            else if (result[0].accountstate == 'frozen') {
                console.log("该账户已被冻结！");
                callback(-4);
            }
            else if (result[0].accountstate == 'cancel') {
                console.log("该账户已被注销！");
                callback(-5);
            }
            else if (result[0].frozenmoney < req.body.amount) {
                console.log("剩余冻结资金不足，无法转为可用资金！");
                callback(-3);
            }
            else {
                let updatesql = `update capitalaccount set balance = balance + ${req.body.amount}, frozenmoney = frozenmoney - ${req.body.amount} where capitalaccountid = \'${req.body.capitalaccountid}\'`;
                db(updatesql, [], (err, result) => {
                    if (err) {
                        console.log("[Update while moneyout error] - ", err.message);
                        callback(-2);
                        return;
                    }
                    else {
                        callback(0);
                        return;
                    }
                })
            }
        })
    }
}

/* 资金账户开户 */
router.post('/OpenAccount', function (req, res) {
    //  0表示成功
    // -1表示缺失identity参数
    // -2表示数据库错误
    // -3表示证券账户冻结，禁止开资金账户
    console.log(req.body);
    utils.getMaxCapitalAccountId((maxID) => {
        openAccount.openCapitalAccount(maxID, req, (statusCode) => {
            if (statusCode == -1) {
                res.status(400).end("缺失capital account的参数");
                return;
            } else if (statusCode == -2) {
                res.status(503).end("数据库错误");
                return;
            } else if (statusCode == -3) {
                res.status(403).end("账户已经冻结，请补办");
                return;
            } else if (statusCode == -4) {
                res.status(403).end("证券账户不存在，请开户");
                return;
            }
            else {
                let newcapitalaccountid = utils.addPrefix0(parseInt(maxID) + 1);
                res.status(200).end(`开户成功,您的资金账户id为${newcapitalaccountid.toString()}`);
            }
            return;
        })
    })
});

/* 资金账户挂失 */
router.post("/LoseAccount", function (req, res) {
    if (!("capitalaccountid" in req.body)) {
        res.status(400).end("缺失capitalaccount参数");
        return;
    }
    // 0  表示成功
    // -1 表示无账户
    // -2 表示数据库错误
    // -3 表示已经销户
    // -4 表示已经挂失
    loseAccount.LoseCapitalAccount(req.body.capitalaccountid, (statusCode) => {
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

/* 资金账户补办 */
router.post("/makeup", function (req, res) {
    // 0 表示补办成功
    // -1表示参数缺失
    // -2表示数据库错误
    // -3表示无账户信息，所以无法补办
    // -4表示账户是normal，无法补办
    // -5表示账户已经销户，无法补办
    // -6表示账户信息核对错误，cashpassword不正确
    // -7表示对应的证券账户id无效
    makeupAccount.CapitalAccountMakeUp(req, (statusCode, maxID) => {
        if (statusCode == -1) {
            res.status(400).end("缺失capitalaccountid 或 identityid参数");
            return;
        }
        else if (statusCode == -2) {
            res.status(503).end("数据库错误");
            return;
        }
        else if (statusCode == -3) {
            res.status(400).end("请先注册一个资金账户");
            return;
        }
        else if (statusCode == -4) {
            res.status(400).end("只能够对挂失的账户进行补办");
            return;
        }
        else if (statusCode == -5) {
            res.status(400).end("您已经执行销户操作，无法补办");
            return;
        } else if (statusCode == -6) {
            res.status(400).end("错误的密码，请检查是否输入错误");
            return;
        } else if (statusCode == -7) {
            res.status(400).end("无效的证券账户id");
            return;
        } else {
            // 成功
            console.log(maxID);
            let newcapitalaccountid = utils.addPrefix0(parseInt(maxID) + 1);
            res.status(200).end(`补办成功,您的证券账户id为${newcapitalaccountid.toString()}`);
        }
    })
});


/* 资金账户销户 */
router.post("/cancel", function (req, res) {
    // TODO 检查资金账户是否还有现金
    let sql = `select balance from capitalaccount where capitalaccountid = \'${req.body.capitalaccountid}\'`
    db(sql, [], (err, result) => {
        if (err) {
            console.log("[Select while moneyout error] - ", err.message);
            return;
        }
        if (!("capitalaccountid" in req.body)) {
            res.status(400).end("缺少字段");
            return;
        }
        if(result[0].length == 0){
            res.status(400).end("信息不匹配");
            return;
        }
        if(result[0].balance > 0){
            res.status(400).end("资金账户仍有余额, 请先转出余额再销户");
            return;
        }
    })
    // 1. 检查是否对应
    // 2. 检查账户状态
    //TODO 
    // 3. 检查资金账户是否有钱
    cancelAccount.CancelCapitalAccount(req, (statusCode, result) => {
        // 0表示销户成功
        // -2表示数据库错误
        // -3表示更新账户状态失败
        // -4表示之前已经销户了
        if (statusCode == 0) {
            res.status(200).end("销户成功");
        } else if (statusCode == -1) {
            res.status(400).end("信息不匹配");
        } else if (statusCode == -2 || statusCode == -3) {
            res.status(503).end("数据库错误");
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
    capitalLogin.Login(req, (statusCode, result) => {
        if (statusCode == -2)
            res.status(503).end("数据库连接错误");
        else if (statusCode == -3)
            res.status(400).end("登陆账号或密码输入错误");
    })
    capitalLogin.Login(req, (statusCode, result) => {
    })
})

router.post("/changeCashpassword", function (req, res) {
    cashpasswordChange.changeCashPassword(req, (statusCode, result) => {
        if (statusCode == -2)
            res.status(503).end("数据库连接错误");
    })
})
router.post("/changeTradepassword", function (req, res) {
    tradepasswordChange.changeTradePassword(req, (statusCode, result) => {
        if (statusCode == -2)
            res.status(503).end("数据库连接错误");
    })
})

/**
 * 0：成功
 * -1：账户不存在
 * -2：数据库错误
 * -3：账户已经销户
 * -4：账户已被冻结
 * -5：余额不足
 */
router.post("/withdraw", (req, res) => {
    if (!("capitalaccountid" in req.body)) {
        res.status(400).end("缺失capitalaccountid参数");
        return;
    }
    else if (!("amount" in req.body)) {
        res.status(400).end("缺失amount参数");
        return;
    }
    changeBalance.userWithdraw(req, (statusCode) => {
        if (statusCode == -1) {
            res.status(400).end("该账户不存在！");
            return;
        }
        else if (statusCode == -2) {
            res.status(503).end("数据库错误！");
            return;
        }
        else if (statusCode == -3) {
            res.status(403).end("该账户已被销户！");
            return;
        }
        else if (statusCode == -4) {
            res.status(403).end("该账户已被冻结！");
            return;
        }
        else if (statusCode == -5) {
            res.status(403).end("余额不足！");
            return;
        }
        else {
            res.status(200).end("取款成功！");
            return;
        }
    })
})
/**
 * 0：成功
 * -1：账户不存在
 * -2：数据库错误
 * -3：账户已经销户
 * -4：账户已被冻结
 */
router.post("/deposit", (req, res) => {
    if (!("capitalaccountid" in req.body)) {
        res.status(400).end("缺失capitalaccountid参数");
        return;
    }
    else if (!("amount" in req.body)) {
        req.status(400).end("缺失amount参数");
        return;
    }
    changeBalance.userDeposit(req, (statusCode) => {
        if (statusCode == -1) {
            res.status(400).end("该账户不存在！");
            return;
        }
        else if (statusCode == -2) {
            res.status(503).end("数据库错误！");
            return;
        }
        else if (statusCode == -3) {
            res.status(403).end("该账户已被销户！");
            return;
        }
        else if (statusCode == -4) {
            res.status(403).end("该账户已被冻结！");
            return;
        }
        else {
            res.status(200).end("存款成功！");
            return;
        }
    })
})
/**
 * 0：成功
 * -1：账户不存在
 * -2：数据库错误
 * -3：账户已经销户
 * -4：账户已被冻结
 * -5：利息为0
 */
router.post('/interestToBalance', function (req, res) {
    if (!("capitalaccountid" in req.body)) {
        res.status(400).end("缺失capitalaccountid参数");
        return;
    }
    interestToBalance.interestToBalance(req, (statusCode) => {
        if (statusCode == -1) {
            res.status(400).end("该账户不存在！");
            return;
        }
        else if (statusCode == -2) {
            res.status(503).end("数据库错误！");
            return;
        }
        else if (statusCode == -3) {
            res.status(403).end("该账户已被销户！");
            return;
        }
        else if (statusCode == -4) {
            res.status(403).end("该账户已被冻结！");
            return;
        }
        else if (statusCode == -5) {
            res.status(403).end("无可用利息！");
            return;
        }
        else {
            res.status(200).end("转换成功！");
            return;
        }
    })
})
/**
 * 0：资金转出成功
 * -1：该账户不存在
 * -2：数据库错误
 * -3：可用资金不足
 * -4：账户已冻结
 * -5：账户已注销
 */
router.post('/moneyout', function (req, res) {
    if (!("capitalaccountid" in req.body)) {
        res.status(400).end("缺失capitalaccountid参数");
        return;
    }
    else if (!("amount" in req.body)) {
        res.status(400).end("缺失amount参数");
        return;
    }
    moneyout.getMoneyOut(req, (statusCode) => {
        if (statusCode == -1) {
            res.status(403).end("该账户不存在！");
            return;
        }
        else if (statusCode == -2) {
            res.status(503).end("数据库错误！");
            return;
        }
        else if (statusCode == -3) {
            res.status(403).end("可用资金不足！");
            return;
        }
        else if (statusCode == -4) {
            res.status(403).end("账户已冻结");
            return;
        }
        else if (statusCode == -5) {
            res.status(403).end("账户已注销！");
            return;
        }
        else if (statusCode == 0) {
            res.status(200).end("资金转出成功！");
            return;
        }
    })
})
/**
 * 0：转账成功
 * -1：sender余额不足
 * -2：数据库错误
 * -3：sender账户不存在
 * -4：receiver账户不存在
 * -5：sender被冻结
 * -6：sender被注销
 * -7：receiver被冻结
 * -8：receiver被注销
 */
router.post('/moneyin', function (req, res) {
    if (!("senderid" in req.body)) {
        res.status(400).end("缺失senderid参数");
        return;
    }
    else if (!("receiverid" in req.body)) {
        res.status(400).end("缺失receiverid参数");
        return;
    }
    else if (!("amount" in req.body)) {
        res.status(400).end("缺失amount参数");
        return;
    }
    moneyin.getMoneyIn(req, (statusCode) => {
        if (statusCode == -1) {
            res.status(403).end("sender余额不足！");
            return;
        }
        else if (statusCode == -2) {
            res.status(503).end("数据库错误！");
            return;
        }
        else if (statusCode == -3) {
            res.status(403).end("sender账户不存在！");
            return;
        }
        else if (statusCode == -4) {
            res.status(403).end("receiver账户不存在！");
            return;
        }
        else if (statusCode == -5) {
            res.status(403).end("sender已被冻结！");
            return;
        }
        else if (statusCode == -6) {
            res.status(403).end("sender已被销户！");
            return;
        }
        else if (statusCode == -7) {
            res.status(403).end("receiver已被冻结！");
            return;
        }
        else if (statusCode == -8) {
            res.status(403).end("receiver已被销户！");
            return;
        }
    })
})
/**
 * 0：交易撤销成功
 * -1：该账户不存在
 * -2：数据库错误
 * -3：冻结资金不足
 * -4：账户已冻结
 * -5：账户已注销
 */
router.post('/revertTrade', function (req, res) {
    if (!("capitalaccountid" in req.body)) {
        res.status(400).end("缺失accountid参数");
        return;
    }
    else if (!("amount" in req.body)) {
        res.status(400).end("缺失amount参数");
        return;
    }
    revertTrade.revertTradefunc(req, (statusCode) => {
        if (statusCode == -1) {
            res.status(403).end("该账户不存在！");
            return;
        }
        else if (statusCode == -2) {
            res.status(503).end("数据库错误！");
            return;
        }
        else if (statusCode == -3) {
            res.status(403).end("剩余冻结资金不足！");
            return;
        }
        else if (statusCode == -4) {
            res.status(403).end("账户已冻结");
            return;
        }
        else if (statusCode == -5) {
            res.status(403).end("账户已注销！");
            return;
        }
        else if (statusCode == 0) {
            res.status(200).end("撤销交易成功！");
            return;
        }
    })
})
/**
 * 接口那里accountid应该是transaction的id？。。
 * 0：逆转成功
 * -1：交易不存在
 * -2：数据库出错
 * -3：逆转失败，账户不存在
 * -4：逆转失败，账户冻结
 * -5：逆转失败，账户注销
 * -6：逆转失败，所提供的钱不足以恢复该笔交易的取出量
 * -7：逆转失败，余额少于该笔交易的存款量
 */

router.post('/revertTrade', function (req, res) {
    revertTrade.revertTradefunc(req, (statusCode) => {
        if (statusCode == -1) {
            res.status(400).end("该笔交易不存在！");
            return;
        }
        else if (statusCode == -2) {
            res.status(503).end("数据库错误！");
            return;
        }
        else if (statusCode == -3) {
            res.status(403).end("该账户不存在！");
            return;
        }
        else if (statusCode == -4) {
            res.status(403).end("该账户已被冻结！");
            return;
        }
        else if (statusCode == -5) {
            res.status(403).end("该账户已被销户！");
            return;
        }
        else if (statusCode == -6) {
            res.status(403).end("提供金额小于该笔交易取款量！")
            return;
        }
        else if (statusCode == -7) {
            res.status(403).end("账户余额小于该笔交易存款量！")
            return;
        }
        else {
            res.status(200).end("成功撤销该笔交易！");
            return;
        }
    })
})
router.get('/getBalance', function (req, res) {
    //console.log(req.body.capitalaccountid);
    let sql = `select * from capitalaccount where capitalaccountid = \'${req.body.capitalaccountid}\'`;
    console.log(sql);
    //console.log(sql);
    db(sql, [], function (err, result) {
        if (err) {
            console.log("[Select balance error] - ", err.message);
            return -1;
        }
        if (result.length == 0) {
            res.status(400).end("账号不存在");
        }
        res.status(200).end(
            JSON.stringify({
                "capitalaccountid": req.body.capitalaccountid,
                "balance": result[0].balance
            })
        )
    });
});

router.get('/getInfo', function (req, res) {
    let sql = `select * from transactions where capitalaccountid = \'${req.body.capitalaccountid}\'`;
    db(sql, [], function (err, result) {
        if (err) {
            console.log("[Select Info error] - ", err.message);
            return -1;
        }
        let data = result.map(item => {
            return {
                "time": item.time,
                "amount": item.amount,
                "currency": item.currency,
                "description": item.description
            }
        })
        res.status(200).end(JSON.stringify(data));
    });
});

module.exports = router;