//证券账户开户 已完成
import React, { useState, useEffect } from "react";
import { Header } from "../../../component";
import { Input, Button, Modal } from "antd";
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
      setModalTitle("开户失败");
      setModalContent("请先登录！");
      setTargetLink("/administrator");
      showModal();
    }
    else if (IdentityId == "") {
      setModalTitle("开户失败");
      setModalContent("请输入有效的身份证号！");
      setTargetLink("/security/person/open");
      showModal();
    }
    else if (Name == "") {
      setModalTitle("开户失败");
      setModalContent("请输入姓名！");
      setTargetLink("/security/person/open");
      showModal();
    }
    else if (Gender == "") {
      setModalTitle("开户失败");
      setModalContent("请输入性别！");
      setTargetLink("/security/person/open");
      showModal();
    }
    else if (HomeAddress == "") {
      setModalTitle("开户失败");
      setModalContent("请输入家庭住址！");
      setTargetLink("/security/person/open");
      showModal();
    }
    else if (Work == "") {
      setModalTitle("开户失败");
      setModalContent("请输入职业！");
      setTargetLink("/security/person/open");
      showModal();
    }
    else if (Education == "") {
      setModalTitle("开户失败");
      setModalContent("请输入学历！");
      setTargetLink("/security/person/open");
      showModal();
    }
    else if (WorkAddress == "") {
      setModalTitle("开户失败");
      setModalContent("请输入工作单位！");
      setTargetLink("/security/person/open");
      showModal();
    }
    else if (Phone == "") {
      setModalTitle("开户失败");
      setModalContent("请输入联系电话！");
      setTargetLink("/security/person/open");
      showModal();
    }
    else {
      let Token = window.sessionStorage.getItem('token');
      console.log(Token)
      console.log("open now")
      axios({
        url: "http://47.99.194.140:3001/security/personalOpen",
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
        setModalTitle("开户成功");
        setModalContent(res.data);
        setTargetLink("/security/person");
      }).catch(function (error) {
        setModalTitle("开户失败");
        setModalContent(error.response.data);
        setTargetLink("/security/person/open");
      })
      showModal();
    }
  }
  return (
    <dev>
      <Header type="s" />
      <dev className="blocks">
        <h1 className="title">证券账户个人开户</h1>
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
          <Button onClick={Submit}>开户</Button>  <Button href="/security/person">返回</Button>
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

//---------------------------------------------------------------
// const open = () => {
//     return (
//         <dev>
//             <Header type="s"/>
//             <dev className="blocks">
//                 <h1 className="title">证券账户个人开户</h1>
//                 <dev className="func">
//                     <Input addonBefore="姓名"/>
//                     <dev>
//                         <p></p>
//                     </dev>
//                     <Input addonBefore="性别"/>
//                     <dev>
//                         <p></p>
//                     </dev>
//                     <Input addonBefore="身份证号"/>
//                     <dev>
//                         <p></p>
//                     </dev>
//                     <Input addonBefore="家庭地址"/>
//                     <dev>
//                         <p></p>
//                     </dev>
//                     <Input addonBefore="职业"/>
//                     <dev>
//                         <p></p>
//                     </dev>
//                     <Input addonBefore="学历"/>
//                     <dev>
//                         <p></p>
//                     </dev>
//                     <Input addonBefore="工作单位"/>
//                     <dev>
//                         <p></p>
//                     </dev>
//                     <Input addonBefore="联系电话"/>
//                     <dev>
//                         <p></p>
//                     </dev>
//                     <Button>开户</Button>  <Button href="/security/person">返回</Button> 
//                 </dev>
//             </dev>
//         </dev>
//     )
// }
