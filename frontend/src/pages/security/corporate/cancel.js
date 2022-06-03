//证券账户销户 已完成
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
const Cancel = () => {
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
    const [CorporateRegisterId, setCorporateRegisterId] = useState("");
    const [SecurityId, setSecurityId] = useState("");

    const Submit = () => {
        if (!sessionStorage.getItem('token')) {
            console.log("no token");
            setModalTitle("销户失败");
            setModalContent("请先登录！");
            setTargetLink("/administrator");
            showModal();
        }
        else {
            let Token = window.sessionStorage.getItem('token');
            console.log(Token)
            console.log("cancel now")
            axios({
                url: "http://47.99.194.140:3001/security/corporateCancel",
                method: "POST",
                data: {
                    "corporateregisterid": CorporateRegisterId,
                    "securityid": SecurityId
                },
                headers: {
                    'authorization': Token
                }
            }).then(res => {
                console.log(res);
                setModalTitle("销户成功");
                setModalContent("返回");
                setTargetLink("/security/corporate");
            }).catch(function (error) {
                setModalTitle("销户失败");
                setModalContent(error.response.data);
                setTargetLink("/security/corporate/cancel");
            })
            showModal();
        }
    }
    return (
        <dev>
            <Header type="s" />
            <dev className="blocks">
                <h1 className="title">证券账户销户</h1>
                <dev className="func">
                    <Input addonBefore="法人注册登记号" value={CorporateRegisterId} onChange={(e) => { setCorporateRegisterId(e.target.value) }} />
                    <dev>
                        <p></p>
                    </dev>
                    <Input addonBefore="证券账户卡号" value={SecurityId} onChange={(e) => { setSecurityId(e.target.value) }} />
                    <dev>
                        <p></p>
                    </dev>
                    <Button onClick={Submit}>销户</Button> <Button href="/security/person">返回</Button>
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
export default Cancel;

