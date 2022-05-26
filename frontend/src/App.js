import React, { useState } from "react";
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

import { Header, Login } from "./component";
import axios from "axios";
import { Button, Input } from "antd";


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

        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <dev>
      <Header type="c" />
      <h2>Here is Home</h2>
    </dev>
  );
}

function About() {
  return (
    <dev>
      <Header type="c" />
    </dev>
  );
}

function Administrator() {
  return (
    <dev>
      <Header type="c" />
      <dev className="blocks">
        <h1 className="title">管理员登录</h1>
        <Login first="管理员账号" second="管理员密码" />
      </dev>
    </dev>
  );
}

function CapitalUsers() {
  const { capitalaccountid, setCapitalaccountid } = useState('');
  const { password, setPassword } = useState('');
  const Login = () => {
    console.log("Login now")
    axios.post('http://47.99.194.140:3001/capital/login',
      {
        // withCredentials: true,
        params: {
          "capitalaccountid": toString(capitalaccountid),
          "password": toString(password)
        }
      }
    )
  }
  return (
    <dev>
      <Header type="c" />
      <dev className="blocks">
        <h1 className="title">资金账户登录</h1>
        <Input addonBefore={"账户名"} value={capitalaccountid} onChange={(e) => { setCapitalaccountid(e.target.value) }} />
        <Input addonBefore={"密码"} value={password} onChange={(e) => { setPassword(e.target.value) }} />
        <Button onClick={Login}>登陆</Button>
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






