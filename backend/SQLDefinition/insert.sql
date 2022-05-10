
insert into security_type(securityid,accountType) values(1000000,'person');
insert into security_type(securityid,accountType) values(2000000,'corporate');


-- 个人证券
insert into personSecurity(securityid,name,gender,identityid,homeaddress,work,education,workaddress,phone,agentidentityid,state)
values(1000000,'tester','male','12345678901234567X','zju','student','undergraduate','zju','1234512314','','normal');

-- 法人证券
insert into corporateSecurity
values(2000000,1,'license','000000000000000000','tester','123456','zju','higherTester','000000000000000001','00000000000','zju','normal');


-- 个人资金
insert into capitalaccount values(1000,'12345678901234567X',100000,1000,1234,1234,0,'normal',0);

-- 法人资金账户
insert into capitalaccount values(2000,'000000000000000000',200000,100000,1234,1234,0,'normal',0);

-- 证券管理人员相关信息信息
insert into securitiesadministrator values('123456','123456');
