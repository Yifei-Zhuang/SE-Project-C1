import React, {useState} from "react";
import {Header} from "../../../component";
import { Input, Button, Modal } from "antd";
import {
  BrowserRouter as Router,
  Link
} from "react-router-dom";
import axios from "axios";

const open = () => {
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
    const [SecurityId, setSecurityId] = useState("");
    const [TradePassword, setTradePassword] = useState("");
    const [CashPassword, setCashPassword] = useState("");
    const [CardNum, setCardNum] = useState("");
    const [Bank, setBank] = useState("");
    const Submit = () => {
      if(!sessionStorage.getItem('token'))
      {
        console.log("no token");
        setModalTitle("开户失败");
        setModalContent("请先登录！");
        setTargetLink("/administrator");
        showModal();
      }
      else if(IdentityId == "")
      {
        setModalTitle("开户失败");
        setModalContent("请输入有效的身份证号！");
        setTargetLink("/capital/person/open");
        showModal();
      }
      else if(CardNum == "")
      {
        setModalTitle("开户失败");
        setModalContent("请输入银行卡号！");
        setTargetLink("/capital/person/open");
        showModal();
      }
      else if(Bank == "")
      {
        setModalTitle("开户失败");
        setModalContent("请输入开户行信息！");
        setTargetLink("/capital/person/open");
        showModal();
      }
      else
      {
        let Token = window.sessionStorage.getItem('token');
        console.log(Token)
        console.log("open now")
        axios({
          url: "http://47.99.194.140:3001/capital/OpenAccount",
          method: "POST",
          data:{
            "identityid":IdentityId,
            "securityId":SecurityId,
            "tradepassword":TradePassword,
            "cashpassword":CashPassword 
          },
          headers:{
            'authorization':Token
          }
        }).then(res => {
          console.log(res);
          setModalTitle("开户成功");
          setModalContent(res.data);
          setTargetLink("/capital/person");
        }).catch(function (error) {
          setModalTitle("开户失败");
          setModalContent(error.response.data);
          setTargetLink("/capital/person/open");
        })
        showModal();
      }
    }
    return (
        <dev>
            <Header type="c"/>
            <dev className="blocks">
                <h1 className="title">资金账户开户</h1>
                <dev className="func">
                    <Input addonBefore="本人身份证" value={IdentityId} onChange={(e) => { setIdentityId(e.target.value) }}/>
                    <dev>
                        <p></p>
                    </dev>
                    <Input addonBefore="证券账户卡" value={SecurityId} onChange={(e) => { setSecurityId(e.target.value) }}/>
                    <dev>
                        <p></p>
                    </dev>
                    <Input.Password addonBefore="证券账户密码" value={TradePassword} onChange={(e) => { setTradePassword(e.target.value) }}/>
                    <dev>
                        <p></p>
                    </dev>
                    <Input addonBefore="银行卡号" value={CardNum} onChange={(e) => { setCardNum(e.target.value) }}/>
                    <dev>
                        <p></p>
                    </dev>
                    <Input addonBefore="开户行" value={Bank} onChange={(e) => { setBank(e.target.value) }}/>
                    <dev>
                        <p></p>
                    </dev>
                    <Input.Password addonBefore="银行卡密码" value={CashPassword} onChange={(e) => { setCashPassword(e.target.value) }}/>
                    <dev>
                        <p></p>
                    </dev>
                    <Button onClick={Submit}>开户</Button> <Button><Link to="/capital/person">返回</Link></Button> 
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
    )
}
export default open;