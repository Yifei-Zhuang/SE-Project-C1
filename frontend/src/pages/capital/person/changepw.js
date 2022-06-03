import React, { useState, useEffect } from "react";
import { Header } from "../../../component";
import { Input, Button, Modal, Select } from "antd";
import {
  BrowserRouter as Router,
  Link
} from "react-router-dom";
import axios from "axios";
const { Option } = Select;

const selectBefore = (
  <Select defaultValue="本人身份证">
    <Option>本人身份证: </Option>
    <Option>法人注册登记号: </Option>
  </Select>
);

const Loss = () => {
  const handleOk = () => {
    setIsModalVisible(false);
  };
  useEffect(() => {
    if (!sessionStorage.getItem('token')) {
      console.log("no token");
      setModalTitle("权限不足");
      setModalContent("请先登录！");
      setTargetLink("/administrator");
      showModal();
    }
  }, [])
  const [TargetLink, setTargetLink] = useState("/");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ModalTitle, setModalTitle] = useState("");
  const [ModalContent, setModalContent] = useState("");
  const showModal = () => {
    setIsModalVisible(true);
  };
  const [CapitalAccountId, setCapitalAccountId] = useState("");
  const [NewPassword, setNewPassword] = useState("");
  const [OldPassword, setOldPassWord] = useState("");
  const Submit = () => {
    if (!sessionStorage.getItem('token')) {
      console.log("no token");
      setModalTitle("密码修改失败");
      setModalContent("请先登录！");
      setTargetLink("/administrator");
      showModal();
    }
    else {
      let Token = window.sessionStorage.getItem('token');
      console.log(Token)
      console.log("open now")
      axios({
        url: "http://47.99.194.140:3001/capital/changeTradepassword",
        method: "POST",
        data: {
          "capitalaccountid": CapitalAccountId,
          "newpassword": NewPassword,
          "oldpassword": OldPassword
        },
        headers: {
          'authorization': Token
        }
      }).then(res => {
        console.log(res);
        setModalTitle("密码修改成功");
        setModalContent(res.data);
        setTargetLink("/capital/person");
      }).catch(function (error) {
        setModalTitle("密码修改失败");
        setModalContent(error.response.data);
        setTargetLink("/capital/person/changepw");
      })
      showModal();
    }
  }
  return (
    <dev>
      <Header type="s" />
      <dev className="blocks">
        <h1 className="title">资金账户修改密码</h1>
        <dev className="func">
          <Input addonBefore="资金账户卡号" value={CapitalAccountId} onChange={(e) => { setCapitalAccountId(e.target.value) }} />
          <dev>
            <p></p>
          </dev>
          <Input.Password addonBefore="资金账户密码" value={OldPassword} onChange={(e) => { setOldPassWord(e.target.value) }} />
          <dev>
            <p></p>
          </dev>
          <Input.Password addonBefore="新资金账户密码" value={NewPassword} onChange={(e) => { setNewPassword(e.target.value) }} />
          <dev>
            <p></p>
          </dev>
          <Button onClick={Submit}>修改密码</Button> <Button><Link to="/capital/person">返回</Link></Button>
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
export default Loss;