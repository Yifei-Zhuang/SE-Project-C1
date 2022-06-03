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
    const [CapitalAccountId, setCapitalAccountId] = useState("");
    const [IdentityId, setIdentityId] = useState("");
    const [SecurityId, setSecurityId] = useState("");
    const [TradePassword, setTradePassword] = useState("");
    const [CashPassword, setCashPassword] = useState("");
    const [CardNum, setCardNum] = useState("");
    const [Bank, setBank] = useState("");
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
            setTargetLink("/capital/person/makeup");
            showModal();
        }
        else if (CardNum == "") {
            setModalTitle("补办失败");
            setModalContent("请输入银行卡号！");
            setTargetLink("/capital/person/makeup");
            showModal();
        }
        else if (Bank == "") {
            setModalTitle("补办失败");
            setModalContent("请输入开户行信息！");
            setTargetLink("/capital/person/makeup");
            showModal();
        }
        else {
            let Token = window.sessionStorage.getItem('token');
            console.log(Token)
            console.log("makeup now")
            axios({
                url: "http://47.99.194.140:3001/capital/makeup",
                method: "POST",
                data: {
                    "capitalaccountid": CapitalAccountId,
                    "identityid": IdentityId,
                    "securityId": SecurityId,
                    "tradepassword": TradePassword,
                    "cashpassword": CashPassword
                },
                headers: {
                    'authorization': Token
                }
            }).then(res => {
                console.log(res);
                setModalTitle("补办成功");
                setModalContent(res.data);
                setTargetLink("/capital/person");
            }).catch(function (error) {
                setModalTitle("补办失败");
                setModalContent(error.response.data);
                setTargetLink("/capital/person/makeup");
            })
            showModal();
        }
    }
    return (
        <dev>
            <Header type="c" />
            <dev className="blocks">
                <h1 className="title">资金账户补办</h1>
                <dev className="func">
                    <Input addonBefore="资金账户号码" value={CapitalAccountId} onChange={(e) => { setCapitalAccountId(e.target.value) }} />
                    <dev>
                        <p></p>
                    </dev>
                    <Input addonBefore="本人身份证" value={IdentityId} onChange={(e) => { setIdentityId(e.target.value) }} />
                    <dev>
                        <p></p>
                    </dev>
                    <Input addonBefore="证券账户卡" value={SecurityId} onChange={(e) => { setSecurityId(e.target.value) }} />
                    <dev>
                        <p></p>
                    </dev>
                    <Input.Password addonBefore="证券账户密码" value={TradePassword} onChange={(e) => { setTradePassword(e.target.value) }} />
                    <dev>
                        <p></p>
                    </dev>
                    <Input addonBefore="银行卡号" value={CardNum} onChange={(e) => { setCardNum(e.target.value) }} />
                    <dev>
                        <p></p>
                    </dev>
                    <Input addonBefore="开户行" value={Bank} onChange={(e) => { setBank(e.target.value) }} />
                    <dev>
                        <p></p>
                    </dev>
                    <Input.Password addonBefore="银行卡密码" value={CashPassword} onChange={(e) => { setCashPassword(e.target.value) }} />
                    <dev>
                        <p></p>
                    </dev>
                    <Button onClick={Submit}>重新开户</Button> <Button><Link to="/capital/person">返回</Link></Button>
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