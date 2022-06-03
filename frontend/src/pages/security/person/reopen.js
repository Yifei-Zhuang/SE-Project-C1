//证券账户挂失后重新开户 已完成 但未测试
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

const Makeup = () => {
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
  const [IdentityId, setIdentityId] = useState("");
  const [Name, setName] = useState("");
  const [Gender, setGender] = useState("");
  const [HomeAddress, setHomeAddress] = useState("");
  const [Work, setWork] = useState("");
  const [Education, setEducation] = useState("");
  const [WorkAddress, setWorkAddress] = useState("");
  const [Phone, setPhone] = useState("");

  const Submit = () => {
    if (!sessionStorage.getItem('token')) {
      console.log("no token");
      setModalTitle("补办失败");
      setModalContent("请先登录！");
      setTargetLink("/administrator");
      showModal();
    }
    else if (IdentityId == "") {
      setModalTitle("补办失败");
      setModalContent("请输入有效的身份证号！");
      setTargetLink("/security/person/reopen");
      showModal();
    }
    else if (Name == "") {
      setModalTitle("补办失败");
      setModalContent("请输入姓名！");
      setTargetLink("/security/person/reopen");
      showModal();
    }
    else if (Gender == "") {
      setModalTitle("补办失败");
      setModalContent("请输入性别！");
      setTargetLink("/security/person/reopen");
      showModal();
    }
    else if (HomeAddress == "") {
      setModalTitle("补办失败");
      setModalContent("请输入家庭住址！");
      setTargetLink("/security/person/reopen");
      showModal();
    }
    else if (Work == "") {
      setModalTitle("补办失败");
      setModalContent("请输入职业！");
      setTargetLink("/security/person/reopen");
      showModal();
    }
    else if (Education == "") {
      setModalTitle("补办失败");
      setModalContent("请输入学历！");
      setTargetLink("/security/person/reopen");
      showModal();
    }
    else if (WorkAddress == "") {
      setModalTitle("补办失败");
      setModalContent("请输入工作单位！");
      setTargetLink("/security/person/reopen");
      showModal();
    }
    else if (Phone == "") {
      setModalTitle("补办失败");
      setModalContent("请输入联系电话！");
      setTargetLink("/security/person/reopen");
      showModal();
    }
    else {
      let Token = window.sessionStorage.getItem('token');
      console.log(Token)
      console.log("makeup now")
      axios({
        url: "http://47.99.194.140:3001/security/personmakeup",
        method: "POST",
        data: {
          "identityid": IdentityId,
          "name": Name,
          "gender": Gender,
          "homeaddress": HomeAddress,
          "work": Work,
          "education": Education,
          "workaddress": WorkAddress,
          "phone": Phone
        },
        headers: {
          'authorization': Token
        }
      }).then(res => {
        console.log(res);
        setModalTitle("补办成功");
        setModalContent(res.data);
        setTargetLink("/security/person");
      }).catch(function (error) {
        setModalTitle("补办失败");
        setModalContent(error.response.data);
        setTargetLink("/security/person/reopen");
      })
      showModal();
    }
  }
  return (
    <dev>
      <Header type="s" />
      <dev className="blocks">
        <h1 className="title">证券账户重新开户</h1>
        <dev className="func">
          <Input addonBefore="姓名" value={Name} onChange={(e) => { setName(e.target.value) }} />
          <dev>
            <p></p>
          </dev>
          <Input addonBefore="性别" value={Gender} onChange={(e) => { setGender(e.target.value) }} />
          <dev>
            <p></p>
          </dev>
          <Input addonBefore="身份证号" value={IdentityId} onChange={(e) => { setIdentityId(e.target.value) }} />
          <dev>
            <p></p>
          </dev>
          <Input addonBefore="家庭地址" value={HomeAddress} onChange={(e) => { setHomeAddress(e.target.value) }} />
          <dev>
            <p></p>
          </dev>
          <Input addonBefore="职业" value={Work} onChange={(e) => { setWork(e.target.value) }} />
          <dev>
            <p></p>
          </dev>
          <Input addonBefore="学历" value={Education} onChange={(e) => { setEducation(e.target.value) }} />
          <dev>
            <p></p>
          </dev>
          <Input addonBefore="工作单位" value={WorkAddress} onChange={(e) => { setWorkAddress(e.target.value) }} />
          <dev>
            <p></p>
          </dev>
          <Input addonBefore="联系电话" value={Phone} onChange={(e) => { setPhone(e.target.value) }} />
          <dev>
            <p></p>
          </dev>
          <Button onClick={Submit}>重新开户</Button>  <Button href="/security/person">返回</Button>
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
export default Makeup;