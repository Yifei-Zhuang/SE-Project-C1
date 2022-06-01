
import React, {useState} from "react";
import {Header} from "../../../component";
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
    const [TargetLink, setTargetLink] = useState("/");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [ModalTitle, setModalTitle] = useState("");
    const [ModalContent, setModalContent] = useState("");
    const showModal = () => {
    setIsModalVisible(true);
    };
    const [CapitalAccountId, setCapitalAccountId] = useState("");
    const Submit = () => {
    if(!sessionStorage.getItem('token'))
    {
        console.log("no token");
        setModalTitle("开户失败");
        setModalContent("请先登录！");
        setTargetLink("/administrator");
        showModal();
    }
    else
    {
        let Token = window.sessionStorage.getItem('token');
        console.log(Token)
        console.log("loss now")
        axios({
        url: "http://47.99.194.140:3001/capital/LoseAccount",
        method: "POST",
        data:{
            "capitalaccountid":CapitalAccountId,
        },
        headers:{
            'authorization':Token
        }
        }).then(res => {
        console.log(res);
        setModalTitle("挂失成功");
        setModalContent("前往补办");
        setTargetLink("/capital/person/makeup");
        }).catch(function (error) {
        setModalTitle("挂失失败");
        setModalContent(error.response.data);
        setTargetLink("/capital/person/loss");
        })
        showModal();
    }
    }
    return (
        <dev>
            <Header type="s"/>
            <dev className="blocks">
                <h1 className="title">资金账户挂失</h1>
                <dev className="func">
                    <Input addonBefore="资金账户卡号" value={CapitalAccountId} onChange={(e) => { setCapitalAccountId(e.target.value) }}/>
                    <dev>
                        <p></p>
                    </dev>
                    <Input.Password addonBefore="资金账户密码"/>
                    <dev>
                        <p></p>
                    </dev>
                    <Button onClick={Submit}>挂失</Button> <Button><Link to="/capital/person">返回</Link></Button>  
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
export default Loss;