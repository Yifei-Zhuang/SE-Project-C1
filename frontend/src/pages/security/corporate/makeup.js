//法人证券账户挂失 已完成
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
    const Submit = () => {
        if (!sessionStorage.getItem('token')) {
            console.log("no token");
            setModalTitle("挂失失败");
            setModalContent("请先登录！");
            setTargetLink("/administrator");
            showModal();
        }
        else if (CorporateRegisterId == "") {
            setModalTitle("挂失失败");
            setModalContent("请输入法人注册登记号！");
            setTargetLink("/security/corporate/makeup");
            showModal();
        }
        else {
            let Token = window.sessionStorage.getItem('token');
            console.log(Token)
            console.log("loss now")
            axios({
                url: "http://47.99.194.140:3001/security/corporateLoss",
                method: "POST",
                data: {
                    "corporateregisterid": CorporateRegisterId
                },
                headers: {
                    'authorization': Token
                }
            }).then(res => {
                console.log(res);
                setModalTitle("挂失成功");
                setModalContent("前往补办");
                setTargetLink("/security/corporate/reopen");
            }).catch(function (error) {
                setModalTitle("挂失失败");
                setModalContent(error.response.data);
                setTargetLink("/security/corporate/makeup");
            })
            showModal();
        }
    }
    return (
        <dev>
            <Header type="s" />
            <dev className="blocks">
                <h1 className="title">个人证券账户挂失并补办</h1>
                <dev className="func">
                    <dev>
                        <p></p>
                    </dev>
                    <Input addonBefore="法人注册登记号" value={CorporateRegisterId} onChange={(e) => { setCorporateRegisterId(e.target.value) }} />
                    <dev>
                        <p></p>
                    </dev>
                    <Button onClick={Submit}>重新开户</Button> <Button href="/security/person">返回</Button>
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


















//------------------------------------------
// import React from "react";
// import {Header} from "../../../component";
// import { Input, Button, Select} from "antd";
// const { Option } = Select;

// const selectBefore = (
//     <Select defaultValue="本人身份证">
//         <Option>本人身份证: </Option>
//         <Option>法人注册登记号: </Option>
//     </Select>
// );

// const makeup = () => {
//     return (
//         <dev>
//             <Header type="s"/>
//             <dev className="blocks">
//                 <h1 className="title">证券账户挂失并补办</h1>
//                 <dev className="func">
//                     <Input addonBefore={selectBefore} />
//                     <dev>
//                         <p></p>
//                     </dev>
//                     <Input addonBefore="证券账户卡号"/>
//                     <dev>
//                         <p></p>
//                     </dev>
//                     <Input.Password addonBefore="证券账户密码"/>
//                     <dev>
//                         <p></p>
//                     </dev>
//                     <Button>重新开户</Button> <Button href="/security/person">返回</Button> 
//                 </dev>
//             </dev>
//         </dev>
//     )
// }
// export default makeup;