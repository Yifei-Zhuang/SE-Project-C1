# api列表
## 证券管理系统
1. 个人开户
- url : /security/personalOpen

- method: post

- description: 进行个人开户

- request parameter
> { 	
> ​	name： 'xxx',
> ​	gender: 'male' or 'female',
> ​	identityid: 123456789012345678,
> ​	homeaddress： 'zju',
> ​	work : 'tercher',
> ​	education: 'undergraduate',
> ​	workaddress: 'zju',
> ​	phone: '12345678',
>
> ​	haveagent:'false',//是否有委托人，true/false
>
> ​	agentidentityid: '' //委托人id，没有可不填该字段
>
> }

response

- success(statusCode 200)

  >  {
  >      "msg": "插入成功"
  >  }	
  
- fail (code other than 200)

  >{
  >  "msg": "插入失败"
  >}	

2. 个人挂失

- url : /security/personLoss

- method: post

- description: 进行个人挂失,（在后端就是将state改变为frozen）

- request parameter
> { 	
>
> ​	identityid: '123456789012345678'，
> }

response

- success(statusCode 200)

  >  {
  >      "msg": "挂失成功"
  >  }	
  
- fail (code other than 200)

  >{
  >  "msg": "挂失失败"
  >}	
  


3. 个人补办

 - url : /security/personmakeup

- method: post

- description: 进行个人补办，执行逻辑在原身份证id对应的证券账户状态为冻结的情况下开一个新的户，将绑定到原先证券账户上的资金账户的绑定更改为新开的这个户。

- request parameter
> //和开户类似

response

- success(statusCode 200)

  >  {
  >      "msg": "补办成功"
  >  }	
  
- fail (code other than 200)

  >{
  >  "msg": "补办失败"
  >}	
4. 个人销户

- url : /security/pcalcel

- method: post

- description: 进行个人销户

- request parameter
> { 	
>
> ​	securityid: 1，
> ​	identityid: '123456789012345678'
> }

response

- success(statusCode 200)

  >  {
  >      "msg": "销户成功"
  >  }	
  
- fail (code other than 200)

  >{
  >  	"msg": "销户失败"
  >}	

5. 法人开户
- url : /security/cop

- method: post

- description: 进行法人开户

- request parameter
> { 	
>
> ​	securityid: 1，
> ​	corporateregisterid： '1',
> ​	licenseid : '1', *-- 营业执照*
>
> ​    corporateidentityid:'123456789012345678', *-- 法人身份证*
>
> ​    corporatename:'john', *-- 法人姓名*
>
> ​    corporatephone: '12345677', *-- 法人电话*
>
> ​    contactaddress:'zju', *-- 法人联系地址* 
>
> ​    authorizername: 'tester', *-- 授权者姓名* 
>
> ​    authorizeridentityid:'123456789012345678', *-- 授权者身份证号* 
>
> ​    authorizerphone:'1234567890', *-- 授权者电话* 
>
> ​    authorizeraddress:'zju', *-- 授权者地址* 
>
> }

response

- success(statusCode 200)

  >  {
  >      "msg": "插入成功"
  >  }	
  
- fail (code other than 200)

  >{
  >  "msg": "插入失败"
  >}	

6. 法人挂失

- url : /security/closs

- method: post

- description: 进行法人挂失

- request parameter
> { 	
>
> ​	corporateregisterid: '123456789012345678'，
> }

response

- success(statusCode 200)

  >  {
  >      "msg": "挂失成功"
  >  }	
  
- fail (code other than 200)

  >{
  >  "msg": "挂失失败"
  >}	
  

7. 个人补办

 - url : /security/cmakeup

- method: post

- description: 进行法人补办

- request parameter
> //和开户类似

response

- success(statusCode 200)

  >  {
  >      "msg": "补办成功"
  >  }	
  
- fail (code other than 200)

  >{
  >  "msg": "补办失败"
  >}	
8. 法人销户

- url : /security/ccalcel

- method: post

- description: 进行法人销户

- request parameter
> { 	
>
> ​	securityid: 1，
> ​	corporateidentityid: '123456789012345678'
> }

response

- success(statusCode 200)

  >  {
  >      "msg": "销户成功"
  >  }	
  
- fail (code other than 200)

  >{
  >  	"msg": "销户失败"
  >}	