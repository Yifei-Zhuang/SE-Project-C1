import React from "react";
import { Link } from "react-router-dom";
import {Header, FuncButton} from "../../../component";
import { AiOutlinePlus, AiOutlineExclamation, AiOutlineKey, AiOutlineQuestion, AiOutlineMonitor, AiFillMoneyCollect, AiFillPayCircle } from "react-icons/ai";
import {Button} from "antd";

const PersonCapital = () => {
    return (
        <dev>
            <Header type = "c" />
            <dev className="blocks">
                <h1 className="title">资金账户管理</h1>
                <dev className="selections">
                    <dev className="seletion">
                        <p><Button href="/" shape="round" size="small">返回</Button></p>
                    </dev>
                    <dev>
                        <p></p>
                    </dev>
                    <dev className="seletion">
                        <p><FuncButton bhref="/capital/person/open" bicon={<AiOutlinePlus/>} btext="资金开户" />开设资金账户</p>
                    </dev>
                    <dev>
                        <p></p>
                    </dev>
                    <dev className="seletion">
                        <p><FuncButton bhref="/capital/person/makeup" bicon={<AiOutlineQuestion/>} btext="挂失补办" />挂失并补办资金账户</p>
                    </dev>
                    <dev>
                        <p></p>
                    </dev>
                    <dev className="seletion">
                    <p><FuncButton bhref="/capital/person/cancel" bicon={<AiOutlineExclamation/>} btext="账户销户" />资金账户销户</p>
                    </dev>
                    <dev>
                        <p></p>
                    </dev>
                    <dev className="seletion">
                        <p><FuncButton bhref="/capital/person/loss" bicon={<AiOutlineKey/>} btext="修改密码" />修改资金账户密码</p>
                    </dev>
                    <dev>
                        <p></p>
                    </dev>
                    <dev className="seletion">
                        <p><FuncButton bhref="/capital/person/deposit" bicon={<AiFillMoneyCollect/>} btext="资金存款" />资金账户存款</p>
                    </dev>
                    <dev>
                        <p></p>
                    </dev>
                    <dev className="seletion">
                        <p><FuncButton bhref="/capital/person/withdraw" bicon={<AiFillPayCircle/>} btext="资金取款" />资金账户取款</p>
                    </dev>
                    <dev>
                        <p></p>
                    </dev>
                    <dev className="seletion">
                        <p><FuncButton bhref="/capital/person/query" bicon={<AiOutlineMonitor/>} btext="资金查询" />查询资金账户信息</p>
                    </dev>
                </dev>
            </dev>
        </dev>
    )
}
export default PersonCapital;