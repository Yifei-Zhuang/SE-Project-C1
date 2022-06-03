//法人证券账户开户 已完成

import React, { useState, useEffect } from "react";
import { Header } from "../../../component";
import { Input, Button, Modal, DatePicker } from "antd";
import {
  BrowserRouter as Router,
  Link
} from "react-router-dom";
import axios from "axios";

//---------------------------------------------------------------
const Open = () => {
  useEffect(() => {
    if (!sessionStorage.getItem('token')) {
      console.log("no token");
      setModalTitle("权限不足");
      setModalContent("请先登录！");
      setTargetLink("/administrator");
      showModal();
    }
  }, [])
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
  const [CorporaterRegisterId, setCorporaterRegisterId] = useState("");
  const [LicenseId, setLicenseId] = useState("");
  const [CorporateIdentityId, setCorporateIdentityId] = useState("");
  const [CorporateName, setCorporateName] = useState("");
  const [CorporatePhone, setCorporatePhone] = useState("");
  const [CorporateAddress, setCorporateAddress] = useState("");
  const [AuthorizeName, setAuthorizeName] = useState("");
  const [AuthorizerPhone, setAuthorizerPhone] = useState("");
  const [AuthorizerIdentityId, setAuthorizerIdentityId] = useState("");
  const [AuthorizerAddress, setAuthorizerAddress] = useState("");


  const Submit = () => {
    if (!sessionStorage.getItem('token')) {
      console.log("no token");
      setModalTitle("开户失败");
      setModalContent("请先登录！");
      setTargetLink("/administrator");
      showModal();
    }
    else if (CorporaterRegisterId == "") {
      setModalTitle("开户失败");
      setModalContent("请输入法人注册登记号码！");
      setTargetLink("/security/corporate/open");
      showModal();
    }
    else if (LicenseId == "") {
      setModalTitle("开户失败");
      setModalContent("请输入营业执照号码！");
      setTargetLink("/security/corporate/open");
      showModal();
    }
    else if (CorporateIdentityId == "") {
      setModalTitle("开户失败");
      setModalContent("请输入有效的法人身份证号！");
      setTargetLink("/security/corporate/open");
      showModal();
    }
    else if (CorporateName == "") {
      setModalTitle("开户失败");
      setModalContent("请输入正确的法人姓名！");
      setTargetLink("/security/corporate/open");
      showModal();
    }
    else if (CorporatePhone == "") {
      setModalTitle("开户失败");
      setModalContent("请输入联系电话！");
      setTargetLink("/security/corporate/open");
      showModal();
    }
    else if (CorporateAddress == "") {
      setModalTitle("开户失败");
      setModalContent("请输入家庭地址！");
      setTargetLink("/security/corporate/open");
      showModal();
    }
    else if (AuthorizeName == "") {
      setModalTitle("开户失败");
      setModalContent("请输入法人授权证券交易执行人姓名！");
      setTargetLink("/security/corporate/open");
      showModal();
    }
    else if (AuthorizerIdentityId == "") {
      setModalTitle("开户失败");
      setModalContent("请输入法人授权证券交易执行人身份证号！");
      setTargetLink("/security/corporate/open");
      showModal();
    }
    else if (AuthorizerPhone == "") {
      setModalTitle("开户失败");
      setModalContent("请输入法人授权证券交易执行人联系电话！");
      setTargetLink("/security/corporate/open");
      showModal();
    }
    else if (AuthorizerAddress == "") {
      setModalTitle("开户失败");
      setModalContent("请输入法人授权证券交易执行人家庭住址！");
      setTargetLink("/security/corporate/open");
      showModal();
    }
    else {
      let Token = window.sessionStorage.getItem('token');
      console.log(Token)
      console.log("open now")
      axios({
        url: "http://47.99.194.140:3001/security/corporateOpen",
        method: "POST",
        data: {
          "corporateregisterid": CorporaterRegisterId,
          "licenseid": LicenseId,
          "corporateidentityid": CorporateIdentityId,
          "corporatename": CorporateName,
          "corporatephone": CorporatePhone,
          "contactaddress": CorporateAddress,
          "authorizername": AuthorizeName,
          "authorizeridentityid": AuthorizerIdentityId,
          "authorizerphone": AuthorizerPhone,
          "authorizeraddress": AuthorizerAddress
        },
        headers: {
          'authorization': Token
        }
      }).then(res => {
        console.log(res);
        setModalTitle("开户成功");
        setModalContent(res.data);
        setTargetLink("/security/corporate");
      }).catch(function (error) {
        setModalTitle("开户失败");
        setModalContent(error.response.data);
        setTargetLink("/security/corporate/open");
      })
      showModal();
    }
  }
  return (
    <dev>
      <Header type="s" />
      <dev className="blocks">
        <h1 className="title">证券账户法人开户</h1>
        <dev className="func">
          <Input addonBefore="法人注册登记号码" value={CorporaterRegisterId} onChange={(e) => { setCorporaterRegisterId(e.target.value) }} />
          <dev>
            <p></p>
          </dev>
          <Input addonBefore="营业执照号码" value={LicenseId} onChange={(e) => { setLicenseId(e.target.value) }} />
          <dev>
            <p></p>
          </dev>
          <Input addonBefore="法人姓名" value={CorporateName} onChange={(e) => { setCorporateName(e.target.value) }} />
          <dev>
            <p></p>
          </dev>
          <Input addonBefore="身份证号" value={CorporateIdentityId} onChange={(e) => { setCorporateIdentityId(e.target.value) }} />
          <dev>
            <p></p>
          </dev>
          <Input addonBefore="家庭地址" value={CorporateAddress} onChange={(e) => { setCorporateAddress(e.target.value) }} />
          <dev>
            <p></p>
          </dev>
          <Input addonBefore="联系电话" value={CorporatePhone} onChange={(e) => { setCorporatePhone(e.target.value) }} />
          <dev>
            <p></p>
          </dev>
          <Input addonBefore="法人授权证券交易执行人姓名" value={AuthorizeName} onChange={(e) => { setAuthorizeName(e.target.value) }} />
          <dev>
            <p></p>
          </dev>
          <Input addonBefore="身份证号" value={AuthorizerIdentityId} onChange={(e) => { setAuthorizerIdentityId(e.target.value) }} />
          <dev>
            <p></p>
          </dev>
          <Input addonBefore="联系电话" value={AuthorizerPhone} onChange={(e) => { setAuthorizerPhone(e.target.value) }} />
          <dev>
            <p></p>
          </dev>
          <Input addonBefore="地址" value={AuthorizerAddress} onChange={(e) => { setAuthorizerAddress(e.target.value) }} />
          <dev>
            <p></p>
          </dev>
          <DatePicker />
          <dev>
            <p></p>
          </dev>
          <Button onClick={Submit}>开户</Button> <Button href="/security/person">返回</Button>
        </dev>
      </dev>
      <Modal
        title={ModalTitle}
        visible={isModalVisible}
        onOk={handleOk}
        closable={false}
        footer={[
          <Button key="ok" type="primary" onClick={handleOk} ><Link to={TargetLink}>OK</Link></Button>,
        ]}
      >
        <p>{ModalContent}</p>
      </Modal>
    </dev>
  )
}
export default Open;
