import React from "react";
import {Input, Button, AutoComplete, Avatar, Image} from 'antd';
import {Link} from 'react-router-dom'
import { AiTwotoneCrown } from "react-icons/ai";


import './config';

export function Header(props) {
    if(global.parameter.isLoggedIn == false){
        return (
            <dev>
                <ul className="header">
                    <li className="header-item-left"><Link className="header-link" to="/security/person">证券账户</Link></li>
                    <li className="header-item-left"><Link className="header-link selected" to="/capital/person">资金账户</Link></li>
                    <li className="header-item-left"><Link className="header-link" to="/about">关于</Link></li>
                    <li className="header-item-right"><Link className="header-link" to="/administrator">管理员登录</Link></li>
                </ul>
                <dev className="bgcolor"/>
            </dev>    
        );
    }
    else{
        return (
            <dev>
                <ul className="header">
                    <li className="header-item-left"><Link className="header-link" to="/security/person">证券账户</Link></li>
                    <li className="header-item-left"><Link className="header-link selected" to="/capital/person">资金账户</Link></li>
                    <li className="header-item-left"><Link className="header-link" to="/about">关于</Link></li>
                    <li className="header-item-right">
                    <Avatar
                      style={{
                        backgroundColor: '#87d068',
                        width: 50,
                        height: 50,
                      }}
                      icon={<AiTwotoneCrown />}
                    /></li>
                </ul>
                <dev className="bgcolor"/>
            </dev>    
        );
    }
}



export function Login(props) {
    return ( 
        <dev className="login">
            <Input addonBefore={props.first} />
            <dev>
                <p></p>
            </dev>
            <Input.Password addonBefore={props.second} />
            <dev>
                <p></p>
            </dev>
            <Button>登录</Button> <Button href="/">返回</Button>
        </dev>
    );
}

export function FuncButton(props) {
    return (
        <Button icon={props.bicon} shape="round" size="large" className="btn" ><Link to={props.bhref}>{props.btext}</Link></Button>
    );
}
 
 