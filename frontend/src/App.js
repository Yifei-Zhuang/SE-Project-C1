import React, {useState} from "react";
import history from './history'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import CorporateSecurityPage from "./pages/security/corporate/index";
import PersonSecurityPage from "./pages/security/person/index";
import CorporateCapital from "./pages/capital/corporate/index";
import PersonCapital from "./pages/capital/person/index";

import CorporateSecurityOpen from "./pages/security/corporate/open";
import CorporateSecurityMakeup from "./pages/security/corporate/makeup";
import CorporateSecurityLoss from "./pages/security/corporate/loss";
import CorporateSecurityCancel from "./pages/security/corporate/cancel";

import PersonSecurityOpen from "./pages/security/person/open";
import PersonSecurityMakeup from "./pages/security/person/makeup";
import PersonSecurityLoss from "./pages/security/person/loss";
import PersonSecurityCancel from "./pages/security/person/cancel";

import PersonCapitalOpen from "./pages/capital/person/open";
import CorporateCapitalLoss from "./pages/capital/person/loss";
import CorporateCapitalCancel from "./pages/capital/person/cancel";
import CorporateCapitalMakeup from "./pages/capital/person/makeup";
import CorporateCapitalDeposit from "./pages/capital/person/deposit";
import CorporateCapitalWithdraw from "./pages/capital/person/withdraw";
import CorporateCapitalQuery from "./pages/capital/person/query";
import CorporateCapitalChangePw from "./pages/capital/person/changepw";


import {Header, Login, FuncButton} from "./component";
import axios from "axios";
import {Button, Menu, Input, Modal} from "antd";
import { AiOutlineUser, AiTwotoneCrown, AiOutlinePlus, AiOutlineExclamation, AiOutlineKey, AiOutlineQuestion } from "react-icons/ai";

import './config'

export default function App() {
  return (
    <Router >
      <div>
        {/* A <Routes> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/administrator" element={<Administrator />} />
          <Route path="/capitalusers" element={<CapitalUsers />} />
          <Route path="/securityusers" element={<SecurityUsers />} />

          <Route path="/security/corporate" element={<CorporateSecurityPage />} />
          <Route path="/security/corporate/open" element={<CorporateSecurityOpen />} />
          <Route path="/security/corporate/loss" element={<CorporateSecurityLoss />} />
          <Route path="/security/corporate/cancel" element={<CorporateSecurityCancel />} />
          <Route path="/security/corporate/makeup" element={<CorporateSecurityMakeup />} />


          <Route path="/security/person" element={<PersonSecurityPage />} />
          <Route path="/security/person/open" element={<PersonSecurityOpen />} />
          <Route path="/security/person/loss" element={<PersonSecurityLoss />} />
          <Route path="/security/person/cancel" element={<PersonSecurityCancel />} />
          <Route path="/security/person/makeup" element={<PersonSecurityMakeup />} />

          <Route path="/capital/corporate" element={<CorporateCapital />} />
          <Route path="/capital/person" element={<PersonCapital />} />

          <Route path="/capital/person/open" element={<PersonCapitalOpen />} />
          <Route path="/capital/person/loss" element={<CorporateCapitalLoss />} />
          <Route path="/capital/person/cancel" element={<CorporateCapitalCancel />} />
          <Route path="/capital/person/makeup" element={<CorporateCapitalMakeup />} />
          <Route path="/capital/person/deposit" element={<CorporateCapitalDeposit />} />
          <Route path="/capital/person/withdraw" element={<CorporateCapitalWithdraw />} />
          <Route path="/capital/person/query" element={<CorporateCapitalQuery />} />
          <Route path="/capital/person/changepw" element={<CorporateCapitalChangePw />} />

        </Routes>
      </div>
    </Router>
  );
}
// --------------------------------------------------------------------------------








// --------------------------------------------------------------------------------

function Home() {
  const onClick = (e) => {
    console.log('click ', e);
  };
  return (
      <dev>
          
          <Header type = "s" />
          {/* <img src={require('../../../img/slides/4.png')} alt="" /> */}
          {/* <center>
            <Menu
              onClick={onClick}
              style={{
                  width: 256,
              }}
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              mode="inline"
              items={items}
            />
          </center> */}
          <center>
          <dev className="indexblocks">
              <h1 className="title">证券交易系统</h1>
              <dev className="selections">
                  <dev>
                      <p></p>
                  </dev>
                  <dev className="indexselection">
                      <p><FuncButton bhref="/administrator" bicon={<AiTwotoneCrown/>} btext=" 管理员登录" /></p>
                  </dev>
                  <dev>
                      <p></p>
                  </dev>
                  <dev className="indexselection">
                      <p><FuncButton bhref="/capitalusers" bicon={<AiOutlineUser/>} btext=" 用户登录" /></p>
                  </dev>
              </dev>
          </dev>
          </center>
      </dev>
  )
}

function About() {
  return (
    <dev>
      <Header type="c" />
      <center>
          <dev className="indexblocks">
              <h1 className="title">关于我们</h1>
              <dev className="selections">
                  <dev className="aboutsection">
                      <p>证券与资金账户的管理平台</p>
                      <p>证券账户业务：
                        证券账户开户、挂失与重新开户、销户
                      </p>
                      <p>资金账户业务：
                        资金账户开户、挂失与重新开户、资金账户与证券账户关联、销户、密码修改、存款、取款、挂失、资金信息查询。
                      </p>
                  </dev>
                  <dev>
                      <p></p>
                  </dev>
              </dev>
          </dev>
          <Button href="/">返回</Button>
        </center>
    </dev>
  );
}

function Administrator() {
  const handleOk = () => {
    setIsModalVisible(false);
  };
  const [TargetLink, setTargetLink] = useState("/");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ModalTitle, setModalTitle] = useState("");
  const [ModalContent, setModalContent] = useState("");
  const showModal = () => {
    setIsModalVisible(true);
  };
  const [ capitalaccountid, setCapitalaccountid ] = useState('');
  const [ password, setPassword ] = useState('');
  const Login = () => {
    console.log("Login now")
    axios({
      url: "http://47.99.194.140:3001/capital/login",
      method: "POST",
      data:{
          "capitalaccountid": capitalaccountid,
          "cashpassword": password
      }
    }).then(res => {
      window.sessionStorage.setItem('token',res.data.token);
      console.log(res);
      setModalTitle("登录成功");
      setModalContent("点击跳转...");
      global.parameter.isLoggedIn = true;
      setTargetLink("/");
    }).catch(function (error) {
      window.sessionStorage.removeItem('token');
      setModalTitle("登录失败");
      setModalContent(error.response.data);
      global.parameter.isLoggedIn = false;
      setTargetLink("/administrator");
    })
    showModal();
  }
  return (
    <dev>
      <Header type="c" />
      <dev className="blocks">
        <h1 className="title">管理员登录</h1>
        <dev className="login">
          <Input addonBefore={"账户名"} value={capitalaccountid} onChange={(e) => { setCapitalaccountid(e.target.value) }} />
          <dev>
            <p></p>
          </dev>
          <Input addonBefore={"密码"} value={password} onChange={(e) => { setPassword(e.target.value) }} />
          <dev>
            <p></p>
          </dev>
          <Button onClick={Login}>登陆</Button> <Button><Link to="/">返回</Link></Button>
        </dev>
      </dev>
      <Modal 
        title={ModalTitle}
        visible={isModalVisible} 
        onOk={handleOk}
        closable={false}
        footer={[
          <Button key = "ok" type="primary" onClick={handleOk} ><Link to={TargetLink}>OK</Link></Button>,
        ]}
      >
        <p>{ModalContent}</p>
      </Modal>
    </dev>
  );
}

function CapitalUsers() {
  return (
    <dev>
      <Header type="c" />
      <dev className="blocks">
        <h1 className="title">资金账户登录</h1>
        <Login first="资金账号" second="交易密码" />
      </dev>
    </dev>
  );
}

function SecurityUsers() {
  return (
    <dev>
      <Header type="s" />
      <dev className="blocks">
        <h1 className="title">证券账户登录</h1>
        <Login first="证券账号" second="账户密码" />
      </dev>
    </dev>
  );
}






