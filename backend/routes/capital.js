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
    userDeposit:(req, callback) => {
        let selectsql = `select * from capitalaccount where capitalaccountid = \'${req.body.capitalaccountid}\'`;
        db(selectsql, [], (err, result) => {
            if(err){
                console.log("[Select while depositing error] -", err.message);
                callback(-2);
                return ;
            }
            else{
                if(result.length == 0){
                    console.log("该账户不存在！");
                    callback(-1);
                    return ;
                }
                else if(result[0].accountstate = 'cancel'){
                    console.log("该账户已被销户！");
                    callback(-3);
                    return ;
                }
                else if(result[0].accountstate = 'frozen'){
                    console.log("该账户已被冻结！");
                    callback(-4);
                    return ;
                }
                else{
                    let addDeposit = `update capitalaccount set balance = balance +
                    ${req.body.amount} where capitalaccountid = \'${req.body.capitalaccountid}\'`;
                    db(addDeposit, [], (err, result) => {
                        if(err){
                            console.log("[Update while depositing error] - ", err.message);
                            callback(-2);
                            return ;
                        }
                        //successfully depositing
                        let getId = `select max(id) as mid from transactions`;
                        let maxId;
                        db(getId, [], (err, result) => {
                            if(err){
                                console.log("[Get max transaction error] - ",err.message);
                                callback(-2);
                                return ;
                            }
                            else if(result[0].length == 0)
                                maxId = 1;
                            else maxId = result[0].id + 1;
                        })
                        let transactionSql = `insert into transactions(id, capitalaccountid, amount, description) values(
                            ${maxId}, \'${req.body.capitalaccountid}\', ${req.body.amount}, \'Deposite Money.\'
                        );`;
                        db(transactionSql, [], (err, result) => {
                            if(err){
                                console.log("[Fail to update transaction] - ", err.message);
                                callback(-2);
                                return;
                            }
                            else;
                        })
                        callback(0);
                    })
                }
            }
        })
    },
    userWithdraw:(req, callback) => {
        let selectsql = `select * from capitalaccount where capitalaccountid = \'${req.body.capitalaccountid}\'`;
        db(selectsql, [], (err, result) => {
            if(err){
                console.log("[Select while withdrawing error] -", err.message);
                callback(-2);
                return ;
            }
            else{
                if(result.length == 0){
                    console.log("该账户不存在！");
                    callback(-1);
                    return ;
                }
                else if(result[0].accountstate = 'cancel'){
                    console.log("该账户已被销户！");
                    callback(-3);
                    return ;
                }
                else if(result[0].accountstate = 'frozen'){
                    console.log("该账户已被冻结！");
                    callback(-4);
                    return ;
                }
                else if(result[0].balance < amount){
                    console.log("余额不足!");
                    callback(-5);
                    return ;
                }
                else{
                    let addDeposit = `update capitalaccount set balance = balance -
                    ${req.body.amount} where capitalaccountid = \'${req.body.capitalaccountid}\'`;
                    db(addDeposit, [], (err, result) => {
                        if(err){
                            console.log("[Update while withdrawing error] - ", err.message);
                            callback(-2);
                            return ;
                        }
                        let getId = `select max(id) as mid from transactions`;
                        let maxId;
                        db(getId, [], (err, result) => {
                            if(err){
                                console.log("[Get max transaction error] - ",err.message);
                                callback(-2);
                                return ;
                            }
                            else if(result[0].length == 0)
                                maxId = 1;
                            else maxId = result[0].id + 1;
                        })
                        let transactionSql = `insert into transactions(id, capitalaccountid, amount, description) values(
                            ${maxId}, \'${req.body.capitalaccountid}\', -${req.body.amount}, \'Withdraw Money.\'
                        );`;
                        db(transactionSql, [], (err, result) => {
                            if(err){
                                console.log("[Fail to update transaction] - ", err.message);
                                callback(-2);
                                return;
                            }
                            else;
                        })
                        callback(0);
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
    interestToBalance :(req, callback) => {
        let selectsql = `select * from capitalaccount where capitalaccountid = \'${req.body.capitalaccountid}\'`;
        db(selectsql, [], (err, result) => {
            if(err){
                console.log("[Select while changing interests error] -", err.message);
                callback(-2);
                return ;
            }
            else{
                if(result.length == 0){
                    console.log("该账户不存在！");
                    callback(-1);
                    return ;
                }
                else if(result[0].accountstate = 'cancel'){
                    console.log("该账户已被销户！");
                    callback(-3);
                    return ;
                }
                else if(result[0].accountstate = 'frozen'){
                    console.log("该账户已被冻结！");
                    callback(-4);
                    return ;
                }
                else
                {
                    let temp_interest = result[0].interest;
                    if(result[0].interest == 0)
                    {
                        console.log("无可用利息！");
                        callback(-5);
                        return ;
                    }
                    let convertSql = `update capitalaccount set interest = 0, balance = balance + ${temp_interest} where capitalaccountid = \'${req.body.capitalaccountid}\'`;
                    db(convertSql, [], (err, result) => {
                        if(err){
                            console.log("[Select while changing interests error] -", err.message);
                            callback(-2);
                            return ;
                        }
                        else{
                            console.log("本次成功转换利息数量为：",temp_interest);
                            callback(0);
                            return ;
                        }
                    })
                }
            }
        })
    }
}
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
const revertTrade = {
    revertTradefunc : (req, callback) => {
        temp = req.body;
        let getTransactionSql = `select * from transactions where id = \'${req.body.accountid}\'`;
        db(getTransactionSql, [], (err, result) => {
            if(err){
                console.log("[Select while reverting error] -", err.message);
                callback(-2);
                return ;
            }
            else if(result.length == 0){
                    console.log("该笔交易不存在！");
                    callback(-1);
                    return ;
                }
            else 
            {
                let accoId = result[0].capitalaccountid;
                let tranAmount = result[0].amount;  //交易数额
                let findBalance = `select * from capitalaccount where capitalaccountid = \'${accoId}\'`;
                db(findBalance, [], (err, result) => {
                    if(err){
                        console.log("[Unable to find the accoding account] - ", err.message);
                        callback(-2);
                        return ;
                    }
                    else if(result[0].length == 0){
                        console.log("该账户不存在！");
                        callback(-3);
                        return ;
                    }
                    else if(result[0].accountstate = 'frozen'){
                        console.log("该账户已被冻结！");
                        callback(-4);
                        return ;
                    }
                    else if(result[0].accountstate = 'cancel'){
                        console.log("该账户已被注销！");
                        callback(-5);
                        return ;
                    }
                    else{
                        let tempBalance = result[0].balance;    //账户余额
                        if(tranAmount < 0)  //该笔交易为取款，需把钱存回去
                        {
                            if(-tranAmount > temp.amount)   //交易取走的金额大于当前提供金额
                            {
                                console.log("提供金额小于该笔交易取款金额！");
                                callback(-6);
                                return ;
                            }
                            else{   //可以正常存回
                                let absAmount = -tranAmount;
                                let saveBack = `update capitalaccount set balance = balance + ${absAmount} where capitalaccountid = \'${accoId}`;
                                db(saveBack, [], (err, result)=>{
                                    if(err){
                                        console.log("[unable to save money back] - ",err.message);
                                        callback(-2);
                                        return ;
                                    }
                                    else{
                                        let deleteTransaction = `delete from transactions where id = \'${temp.accountid}\'`;
                                        db(deleteTransaction, [], (err, result)=>{
                                            if(err){
                                                console.log("[unable to revoke the transaction's record] - ", err.message);
                                                callback(-2);
                                                return ;
                                            }
                                            else{
                                                console.log("Successfully save the money back!");
                                                callback(0);
                                                return ;
                                            }
                                        })
                                    }
                                })
                            }
                        }
                        else if(tranAmount > 0) //该笔交易为存款，需扣除余额
                        {
                            if(tempBalance < tranAmount)    //账户余额少于该次存款金额
                            {
                                console.log("账户余额少于该次存款金额!");
                                callback(-7);
                                return ;
                            }
                            else{
                                let getBack = `update capitalaccount set balance = balance - ${tranAmount} where capitalaccountid = \'${accoId}\'`;
                                db(getBack, [], (err, result) =>{
                                    if(err){
                                        console.log("[Unable to get money back] - ", err.message);
                                        callback(-2);
                                        return ;
                                    }
                                    else {
                                        let deleteTransaction = `delete from transactions where id = \'${temp.accountid}\'`;
                                        db(deleteTransaction, [], (err, result)=>{
                                            if(err){
                                                console.log("[unable to revoke the transaction's record] - ", err.message);
                                                callback(-2);
                                                return ;
                                            }
                                            else{
                                                console.log("Successfully get the money back!");
                                                callback(0);
                                                return ;
                                            }
                                        })
                                    }
                                })
                            }
                        }
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
router.post("/deposit",(req,res)=>{
    if (!("capitalaccountid" in req.body)) {
        req.status(400).end("缺失capitalaccountid参数");
        return;
    }
    else if (!("amount" in req.body)) {
        req.status(400).end("缺失amount参数");
        return;
    }
    changeBalance.userDeposit(req, (statusCode) =>{
        if(statusCode == -1){
            res.status(400).end("该账户不存在！");
            return ;
        }
        else if(statusCode == -2){
            res.status(503).end("数据库错误！");
            return ;
        }
        else if(statusCode == -3){
            res.status(403).end("该账户已被销户！");
            return ;
        }
        else if(statusCode == -4){
            res.status(403).end("该账户已被冻结！");
            return ;
        }
        else if(statusCode == -5){
            res.status(403).end("余额不足！");
            return ;
        }
        else{
            res.status(200).end("取款成功！");
            return ;
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
router.post("/deposit",(req,res)=>{
    if (!("capitalaccountid" in req.body)) {
        req.status(400).end("缺失capitalaccountid参数");
        return;
    }
    else if (!("amount" in req.body)) {
        req.status(400).end("缺失amount参数");
        return;
    }
    changeBalance.userDeposit(req, (statusCode) =>{
        if(statusCode == -1){
            res.status(400).end("该账户不存在！");
            return ;
        }
        else if(statusCode == -2){
            res.status(503).end("数据库错误！");
            return ;
        }
        else if(statusCode == -3){
            res.status(403).end("该账户已被销户！");
            return ;
        }
        else if(statusCode == -4){
            res.status(403).end("该账户已被冻结！");
            return ;
        }
        else{
            res.status(200).end("存款成功！");
            return ;
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
router.post('/interestToBalance',function(req, res){
    if (!("capitalaccountid" in req.body)) {
        req.status(400).end("缺失capitalaccountid参数");
        return;
    }
    changeBalance.userDeposit(req, (statusCode) =>{
        if(statusCode == -1){
            res.status(400).end("该账户不存在！");
            return ;
        }
        else if(statusCode == -2){
            res.status(503).end("数据库错误！");
            return ;
        }
        else if(statusCode == -3){
            res.status(403).end("该账户已被销户！");
            return ;
        }
        else if(statusCode == -4){
            res.status(403).end("该账户已被冻结！");
            return ;
        }
        else if(statusCode == -5){
            res.status(403).end("无可用利息！");
            return ;
        }
        else{
            res.status(200).end("转换成功！");
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
            return ;
        }
        else if(statusCode == -2){
            res.status(503).end("数据库错误！");
            return ;
        }
        else if(statusCode == -3){
            res.status(403).end("该账户不存在！");
            return ;
        }
        else if(statusCode == -4){
            res.status(403).end("该账户已被冻结！");
            return ;
        }
        else if(statusCode == -5){
            res.status(403).end("该账户已被销户！");
            return ;
        }
        else if(statusCode == -6){
            res.status(403).end("提供金额小于该笔交易取款量！")
            return ;
        }
        else if(statusCode == -7){
            res.status(403).end("账户余额小于该笔交易存款量！")
            return ;
        }
        else{
            res.status(200).end("成功撤销该笔交易！");
            return ;
        }
    })
})
router.get('/getBalance',function(req, res){
    //console.log(req.body.capitalaccountid);
    let sql = `select * from transactions where capitalaccountid = \'${req.body.capitalaccountid}\'`;
    //console.log(sql);
    db(sql, [], function(err, result) {
        if(err){
            console.log("[Select balance error] - ", err.message);
            return -1;
        }
        res.render('userBalance',{
            capitalaccountid: req.body.capitalaccountid,
            time: (""+ result[0].time),
            amount: (""+result[0].amount),
            currency: (""+result[0].currency),
            description: (""+result[0].description)
        });
    });
});

router.get('/getInfo',function(req, res){
    let sql = `select * from transactions where capitalaccountid = \'${req.body.capitalaccountid}\'`;
    db(sql, [], function(err, result) {
        if(err){
            console.log("[Select Info error] - ", err.message);
            return -1;
        }
        res.render('transactionIndo',{
            capitalaccountid: req.body.capitalaccountid,
            balance: (""+result[0].balance)
        });
    });
});

module.exports = router;
