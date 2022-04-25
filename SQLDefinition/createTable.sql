drop table if exists security_type;
create table security_type (
		securityid int primary key, -- 证券账号id 
	    accountType enum('person', 'corporate') not null-- 证券账号类型，个人/法人  
);


drop table if exists capitalaccount; 
create table capitalaccount ( 
	capitalaccountid int primary key, -- 账号id
    identityid varchar(18) not null, -- 身份证
    securityId int references security_type(securityid), -- 证券id
    balance numeric(10,2) not null default 0.0, -- 余额
    tradepassword varchar(50) not null, -- 交易密码
    cashpassword varchar(50) not null, -- 存款 取款密码
    frozenmoney numeric(10,2) default 0.0, -- 冻结的钱
	accountstate enum('normal', 'forzen', 'cancel') default 'normal', -- 状态
    interest numeric(10,2) default 0.0 -- 未取利息
);



-- 在插入数据之前，请修改person_security表
-- 个人证券信息表 
drop table if exists personSecurity;
create table personSecurity (
	securityid int primary key references security_type(securityid), -- 证券账号id
    registerdate timestamp not null default current_timestamp, -- 注册时间
    name varchar(50) not null, -- 姓名
    gender enum ('male', 'female') not null default 'male', -- 性别
    identityid varchar(18) not null, -- 身份证id
    homeaddress varchar(80) not null, -- 家庭住址
    `work` varchar(50) not null, -- 工作职业
    education varchar(40) not null, -- 教育经历
    workaddress varchar(50) not null, -- 工作地址
    phone varchar(30) not null, -- 电话
    agentidentityid varchar(20) default '', -- 委托人id， 可为空
	state enum('normal', 'forzen', 'cancel') default 'normal' -- 账号状态
);


-- 法人证券信息表 
drop table if exists corporateSecurity;
create table corporateSecurity (
	securityid int primary key references security_type(securityid), -- 证券账号id
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
	state enum('normal', 'forzen', 'cancel') default 'normal'  -- 账号状态 
);

-- 证券管理人员相关信息信息表 
drop table if exists securitiesadministrator;
create table securitiesadministrator(
	username varchar(20) primary key, -- 管理人员账号 
    password varchar(50) not null -- 管理人员密码  
);

-- 资金账号收支信息
drop table if exists  transactions;
create table transactions(
    id serial primary key,
    capitalaccountid int references capitalaccount(capitalaccountid),   -- 资金账户ID（主键、外键）
    `time` timestamp default current_timestamp,   -- 时间
    amount numeric(25, 2) not null,   -- 金额
    currency enum('RMB', 'USD', 'CAD', 'AUD', 'EUR', 'GBP', 'HKD', 'JPY') default 'RMB',   -- 币种
    iodescription varchar(500) not null   -- 交易描述信息
);
