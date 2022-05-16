import React from "react";
import { Link } from "react-router-dom";
import {Header, FuncButton} from "../../../component";
import { AiOutlinePlus, AiOutlineExclamation, AiOutlineKey, AiOutlineQuestion } from "react-icons/ai";
import {Button} from "antd";

const personPage = (props) => {
    return (
        <dev>
            <Header type = "s" />
            <dev className="blocks">
                <h1 className="title">证券账户管理</h1>
                <dev className="selections">
                    <dev className="seletion">
                        <p><Button href="/" shape="round" size="small">返回</Button></p>
                    </dev>
                    <dev>
                        <p></p>
                    </dev>
                    <dev className="seletion">
                        <p><FuncButton bhref="/security/person/open" bicon={<AiOutlinePlus/>} btext="个人开户" />个人开设证券账户</p>
                    </dev>
                    <dev>
                        <p></p>
                    </dev>
                    <dev className="seletion">
                        <p><FuncButton bhref="/security/corporate/open" bicon={<AiOutlinePlus/>} btext="法人开户" />法人开设证券账户</p>
                    </dev>
                    <dev>
                        <p></p>
                    </dev>
                    <dev className="seletion">
                        <p><FuncButton bhref="/security/person/makeup" bicon={<AiOutlineQuestion/>} btext="挂失补办" />挂失并补办证券账户</p>
                    </dev>
                    <dev>
                        <p></p>
                    </dev>
                    <dev className="seletion">
                    <p><FuncButton bhref="/security/person/cancel" bicon={<AiOutlineExclamation/>} btext="账户销户" />证券账户销户</p>
                    </dev>
                    <dev>
                        <p></p>
                    </dev>
                    <dev className="seletion">
                        <p><FuncButton bhref="/security/person/loss" bicon={<AiOutlineKey/>} btext="修改密码" />修改证券账户密码</p>
                    </dev>
                </dev>
            </dev>
        </dev>
    )
}
export default personPage;