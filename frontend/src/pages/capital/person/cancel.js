import React, {useState} from "react";
import {Header} from "../../../component";
import { Input, Button, Modal } from "antd";
import {
  BrowserRouter as Router,
  Link
} from "react-router-dom";
import axios from "axios";

const cancel = () => {
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
    const [CapitalAccountId, setCapitalAccountId] = useState("");
    const [CashPassword, setCashPassword] = useState("");
    const [IdentityId, setIdentityId] = useState("");
    const [SecurityId, setSecurityId] = useState("");
    const Submit = () => {
    if(!sessionStorage.getItem('token'))
    {
        console.log("no token");
        setModalTitle("销户失败");
        setModalContent("请先登录！");
        setTargetLink("/administrator");
        showModal();
    }
    else
    {
        let Token = window.sessionStorage.getItem('token');
        console.log(Token)
        console.log("cancel now")
        axios({
        url: "http://47.99.194.140:3001/capital/cancel",
        method: "POST",
        data:{
            "capitalaccountid":CapitalAccountId,
            "cashpassWord":CashPassword,
            "identityid":IdentityId,
            "securityid":SecurityId
        },
        headers:{
            'authorization':Token
        }
        }).then(res => {
        console.log(res);
        setModalTitle("销户成功");
        setModalContent(res.data);
        setTargetLink("/capital/person");
        }).catch(function (error) {
        setModalTitle("销户失败");
        setModalContent(error.response.data);
        setTargetLink("/capital/person/cancel");
        })
        showModal();
    }
    }
    return (
        <dev>
            <Header type="c"/>
            <dev className="blocks">
                <h1 className="title">资金账户销户</h1>
                <dev className="func">
                    <Input addonBefore="资金账户卡号" value={CapitalAccountId} onChange={(e) => { setCapitalAccountId(e.target.value) }}/>
                    <dev>
                        <p></p>
                    </dev>
                    <Input.Password addonBefore="资金账户密码" value={CashPassword} onChange={(e) => { setCashPassword(e.target.value) }}/>
                    <dev>
                        <p></p>
                    </dev>
                    <Input addonBefore="身份证号" value={IdentityId} onChange={(e) => { setIdentityId(e.target.value) }}/>
                    <dev>
                        <p></p>
                    </dev>
                    <Input addonBefore="证券账户卡号" value={SecurityId} onChange={(e) => { setSecurityId(e.target.value) }}/>
                    <dev>
                        <p></p>
                    </dev>
                    <Button onClick={Submit}>销户</Button>  <Button><Link to="/capital/person">返回</Link></Button>
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
export default cancel;