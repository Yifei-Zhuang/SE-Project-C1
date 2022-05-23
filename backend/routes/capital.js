var express = require('express');
var router = express.Router();

var db = require('../database/db');

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
    getMoneyOut : (req, callback) => {
        let selectsql = `select * from capitalaccount where capitalaccountid = \'${req.body.capitalaccountid}\' `;
        db(selectsql, [], (err, result) => {
            if(err){
                console.log("[Select while moneyout error] - ", err.message);
                callback(-2);
                return ;
            }
            else if(result.length == 0)
            {
                console.log("该账户不存在！");
                callback(-1);
                return ;
            }
            else if(result[0].accountstate == 'frozen'){
                console.log("该账户已被冻结！");
                callback(-4);
            }
            else if(result[0].accountstate == 'cancel'){
                console.log("该账户已被注销！");
                callback(-5);
            }
            else if(result[0].balance < req.body.amount){
                console.log("可用资金不足，无法转为冻结资金！");
                callback(-3);
            }
            else{
                let updatesql =`update capitalaccount set balance = balance - ${req.body.amount}, frozenmoney = frozenmoney +${req.body.amount} where capitalaccountid = \'${req.body.capitalaccountid}\'`;
                db(updatesql, [], (err, result) => {
                    if(err){
                        console.log("[Update while moneyout error] - ", err.message);
                        callback(-2);
                        return ;
                    }
                    else{
                        callback(0);
                        return ;
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
    getMoneyIn : (req, callback) => {
        let sendersel = `select * from capitalaccount where capitalaccountid = ${req.body.senderid}`;
        let receiversel = `select * from capitalaccount where capitalaccountid = ${req.body.receiverid}`;
        db(sendersel, [], (err, result) => {
            if(err){
                console.log("[select sender in moneyin error] - ", err.message);
                callback(-2);
                return ;
            }
            else if(result.length == 0){
                console.log("sender账户不存在！");
                callback(-3);
                return ;
            }
            else if(result[0].accountstate == 'frozen'){
                console.log("sender账户被冻结！");
                callback(-5);
                return;
            }
            else if(result[0].accountstate == 'cancel'){
                console.log("sender账户被注销！");
                callback(-6);
                return ;
            }
            else if(result[0].balance < req.body.amount){
                console.log("sender可用余额不足，无法转账！");
                callback(-1);
                return ;
            }
        })
        db(receiversel, [], (err, result) => {
            if(err){
                console.log("[select receiver in moneyin error] - ", err.message);
                callback(-2);
                return ;
            }
            else if(result.length == 0){
                console.log("receiver账户不存在！");
                callback(-4);
                return ;
            }
            else if(result[0].accountstate == 'frozen'){
                console.log("receiver账户被冻结！");
                callback(-7);
                return;
            }
            else if(result[0].accountstate == 'cancel'){
                console.log("receiver账户被注销！");
                callback(-8);
                return ;
            }
        })
        reducesql = `update capitalaccount set balance = balance - ${req.body.amount} where capitalaccountid = \'${req.body.senderid}\'`;
        addsql = `update capitalaccount set balance = balance + ${req.body.amount} where capitalaccountid = \'${req.body.receiverid}\'`;
        db(reducesql, [], (err, callback) => {
            if(err){
                console.log("[error while reducing money in moneyin] - ", err.message);
                callback(-2);
                return ;
            }
            else{
                db(addsql, [], (err, callback) => {
                    if(err){
                        console.log("[err while adding in moneyin] - ", err.message);
                        callback(-2);
                        return ;
                    }
                    else{
                        callback(0);
                        return ;
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
    revertTradefunc : (req, callback) => {
        let selectsql = `select * from capitalaccount where capitalaccountid = \'${req.body.accountid}\' `;
        db(selectsql, [], (err, result) => {
            if(err){
                console.log("[Select while moneyout error] - ", err.message);
                callback(-2);
                return ;
            }
            else if(result.length == 0)
            {
                console.log("该账户不存在！");
                callback(-1);
                return ;
            }
            else if(result[0].accountstate == 'frozen'){
                console.log("该账户已被冻结！");
                callback(-4);
            }
            else if(result[0].accountstate == 'cancel'){
                console.log("该账户已被注销！");
                callback(-5);
            }
            else if(result[0].frozenmoney < req.body.amount){
                console.log("剩余冻结资金不足，无法转为可用资金！");
                callback(-3);
            }
            else{
                let updatesql =`update capitalaccount set balance = balance + ${req.body.amount}, frozenmoney = frozenmoney - ${req.body.amount} where capitalaccountid = \'${req.body.accountid}\'`;
                db(updatesql, [], (err, result) => {
                    if(err){
                        console.log("[Update while moneyout error] - ", err.message);
                        callback(-2);
                        return ;
                    }
                    else{
                        callback(0);
                        return ;
                    }
                })
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
router.post('/moneyout', function(req, res){
    if (!("capitalaccountid" in req.body)) {
        res.status(400).end("缺失capitalaccountid参数");
        return;
    }
    else if(!("amount" in req.body)){
        res.status(400).end("缺失amount参数");
        return ;
    }
    moneyout.getMoneyOut(req, (statusCode) => {
        if(statusCode == -1){
            res.status(403).end("该账户不存在！");
            return ;
        }
        else if(statusCode == -2){
            res.status(503).end("数据库错误！");
            return ;
        }
        else if(statusCode == -3){
            res.status(403).end("可用资金不足！");
            return;
        }
        else if(statusCode == -4){
            res.status(403).end("账户已冻结");
            return;
        }
        else if(statusCode == -5){
            res.status(403).end("账户已注销！");
            return;
        }
        else if(statusCode == 0){
            res.status(200).end("资金转出成功！");
            return ;
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
router.post('/moneyin', function(req, res){
    if (!("senderid" in req.body)) {
        res.status(400).end("缺失senderid参数");
        return;
    }
    else if(!("receiverid" in req.body)) {
        res.status(400).end("缺失receiverid参数");
        return;
    }
    else if(!("amount" in req.body)){
        res.status(400).end("缺失amount参数");
        return ;
    }
    moneyin.getMoneyIn(req, (statusCode) => {
        if(statusCode == -1){
            res.status(403).end("sender余额不足！");
            return ;
        }
        else if(statusCode == -2){
            res.status(503).end("数据库错误！");
            return ;
        }
        else if(statusCode == -3){
            res.status(403).end("sender账户不存在！");
            return ;
        }
        else if(statusCode == -4){
            res.status(403).end("receiver账户不存在！");
            return ;
        }
        else if(statusCode == -5){
            res.status(403).end("sender已被冻结！");
            return ;
        }
        else if(statusCode == -6){
            res.status(403).end("sender已被销户！");
            return ;
        }
        else if(statusCode == -7){
            res.status(403).end("receiver已被冻结！");
            return ;
        }
        else if(statusCode == -8){
            res.status(403).end("receiver已被销户！");
            return ;
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
 router.post('/revertTrade', function(req, res){
    if (!("capitalaccountid" in req.body)) {
        res.status(400).end("缺失accountid参数");
        return;
    }
    else if(!("amount" in req.body)){
        res.status(400).end("缺失amount参数");
        return ;
    }
    revertTrade.revertTradefunc(req, (statusCode) => {
        if(statusCode == -1){
            res.status(403).end("该账户不存在！");
            return ;
        }
        else if(statusCode == -2){
            res.status(503).end("数据库错误！");
            return ;
        }
        else if(statusCode == -3){
            res.status(403).end("剩余冻结资金不足！");
            return;
        }
        else if(statusCode == -4){
            res.status(403).end("账户已冻结");
            return;
        }
        else if(statusCode == -5){
            res.status(403).end("账户已注销！");
            return;
        }
        else if(statusCode == 0){
            res.status(200).end("撤销交易成功！");
            return ;
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

router.post('/revertTrade', function(req, res){
    revertTrade.revertTradefunc(req, (statusCode) =>{
        if(statusCode == -1){
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
