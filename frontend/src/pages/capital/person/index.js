import React from "react";
import { Link } from "react-router-dom";
import {Header, FuncButton} from "../../../component";
import { AiOutlinePlus, AiOutlineExclamation, AiOutlineKey, AiOutlineQuestion, AiOutlineMonitor, AiFillMoneyCollect, AiFillPayCircle } from "react-icons/ai";
import {Button} from "antd";

const PersonCapital = () => {
    return (
        <dev>
            <Header type = "c" />
            <center>
            <dev className="blocks">
                <h1 className="title">资金账户管理</h1>
                <dev className="selections">
                    <dev>
                        <p></p>
                    </dev>
                    <dev className="seletion">
                        <p><FuncButton bhref="/capital/person/open" bicon={<AiOutlinePlus/>} btext="资金开户" /></p>
                        {/* 开设资金账户 */}
                    </dev>
                    <dev>
                        <p></p>
                    </dev>
                    <dev className="seletion">
                        <p><FuncButton bhref="/capital/person/loss" bicon={<AiOutlineQuestion/>} btext="挂失补办" /></p>
                        {/* 挂失并补办资金账户 */}
                    </dev>
                    <dev>
                        <p></p>
                    </dev>
                    <dev className="seletion">
                    <p><FuncButton bhref="/capital/person/cancel" bicon={<AiOutlineExclamation/>} btext="账户销户" /></p>
                    {/* 资金账户销户 */}
                    </dev>
                    <dev>
                        <p></p>
                    </dev>
                    <dev className="seletion">
                        <p><FuncButton bhref="/capital/person/changepw" bicon={<AiOutlineKey/>} btext="修改密码" /></p>
                        {/* 修改资金账户密码 */}
                    </dev>
                    <dev>
                        <p></p>
                    </dev>
                    <dev className="seletion">
                        <p><Button shape="round" size="large"><Link className="btn" to="/">返回</Link></Button></p>
                    </dev>
                </dev>
            </dev>
            </center>
        </dev>
    )
}
export default PersonCapital;