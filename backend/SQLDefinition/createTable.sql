drop database if exists StockTrading;
create database StockTrading;

use StockTrading;
drop table if exists security_type;
create table security_type (
		securityid varchar(18) primary key, -- 证券账号id 
	    accountType enum('person', 'corporate') not null-- 证券账号类型，个人/法人  
);


-- 在插入数据之前，请修改person_security表
-- 个人证券信息表 
drop table if exists personSecurity;
create table personSecurity (
	securityid varchar(18) primary key, -- 证券账号id
    registerdate timestamp not null default current_timestamp, -- 注册时间
    name varchar(50) not null, -- 姓名
    gender enum ('male', 'female') not null default 'male', -- 性别
    identityid varchar(18) not null, -- 身份证id
    homeaddress varchar(80) not null, -- 家庭住址
    work varchar(50) not null, -- 工作职业
    education varchar(40) not null, -- 教育经历
    workaddress varchar(50) not null, -- 工作地址
    phone varchar(30) not null, -- 电话
    agentidentityid varchar(20) default '', -- 委托人id， 可为空
	accountstate enum('normal', 'frozen', 'cancel') default 'normal' -- 账号状态
);


-- 法人证券信息表 
drop table if exists corporateSecurity;
create table corporateSecurity (
	securityid varchar(18) primary key, -- 证券账号id
    registerdate timestamp not null default current_timestamp, -- 注册时间
    corporateregisterid varchar(50) not null, -- 法人注册id
    licenseid varchar(50) not null, -- 营业执照
    corporateidentityid varchar(18) not null, -- 法人身份证
    corporatename varchar(50) not null, -- 法人姓名
    corporatephone varchar(30) not null, -- 法人电话
    contactaddress varchar(50) not null, -- 法人联系地址 
    authorizername varchar(50) not null, -- 授权者姓名 
    authorizeridentityid varchar(18) not null, -- 授权者身份证号 
    authorizerphone varchar(30) not null, -- 授权者电话 
    authorizeraddress varchar(50) not null, -- 授权者地址 
	accountstate enum('normal', 'frozen', 'cancel') default 'normal'  -- 账号状态
);

drop table if exists securityInfo;
create table securityInfo(
    secuirtyid varchar(18) primary key,
    password varchar(20) not null
);

-- 证券管理人员相关信息信息表 
drop table if exists securitiesadministrator;
create table securitiesadministrator(
	username varchar(20) primary key, -- 管理人员账号 
    password varchar(50) not null -- 管理人员密码  
);


drop table if exists capitalaccount;
create table capitalaccount (
	capitalaccountid varchar(20) primary key, -- 账号id
    identityid varchar(18) not null, -- 身份证
    securityId varchar(18), -- 证券id
    balance decimal(10,2) not null default 0.0, -- 余额
    tradepassword varchar(50) not null, -- 交易密码
    cashpassword varchar(50) not null, -- 存款 取款密码
    frozenmoney decimal(10,2) default 0.0, -- 冻结的钱
	accountstate enum('normal', 'frozen', 'cancel') default 'normal', -- 状态
    interest decimal(10,2) default 0.0, -- 未取利息
);

-- 资金账号收支信息
drop table if exists  transactions;
create table transactions(
    id serial primary key,
    capitalaccountid varchar(20),   -- 资金账户ID（主键、外键）
    time timestamp default current_timestamp,   -- 时间
    amount decimal(25, 2) not null,   -- 金额
    currency enum('RMB', 'USD', 'CAD', 'AUD', 'EUR', 'GBP', 'HKD', 'JPY') default 'RMB',   -- 币种
    description varchar(500) not null,   -- 交易描述信息
    foreign key(capitalaccountid)  references capitalaccount(capitalaccountid)
);


insert into personSecurity(securityid,name,gender,identityid,homeaddress,work,education,workaddress,phone)
values(
    '000000000000000000',
    'ignore_me',
    'male',
    '123456789012345678',
    'zju',
    't',
    'e',
    'zju',
    '1234'
);

insert into corporateSecurity(securityid, corporateregisterid, licenseid, corporateidentityid, corporatename, corporatephone, contactaddress,authorizername, authorizeridentityid, authorizerphone, authorizeraddress)
values(
    '100000000000000000',
    '123',
    '123',
    '123456789012345678',
    'ignore_me',
    '123',
    '123',
    '123',
    '123456789012345678',
    '123',
    '123'
);