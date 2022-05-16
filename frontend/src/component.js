import React from "react";
import {Input, Button} from 'antd';

export function Header(props) {
    if(props.type == "c"){
        return (
            <dev>
                <ul className="header">
                    <li className="header-item-left"><a className="header-link" href="/security/person">证券账户</a></li>
                    <li className="header-item-left"><a className="header-link selected" href="/capital/person">资金账户</a></li>
                    <li className="header-item-left"><a className="header-link" href="/about">关于</a></li>
                    <li className="header-item-right"><a className="header-link" href="/administrator">管理员登录</a></li>
                    <li className="header-item-right"><a className="header-link" href="/capitalusers">账户登录</a></li>
                </ul>
                <dev className="bgcolor"/>
            </dev>    
        );
    }
    else{
        return (
            <dev>
                <ul className="header">
                    <li className="header-item-left"><a className="header-link selected" href="/security/person">证券账户</a></li>
                    <li className="header-item-left"><a className="header-link" href="/capital/person">资金账户</a></li>
                    <li className="header-item-left"><a className="header-link" href="/about">关于</a></li>
                    <li className="header-item-right"><a className="header-link" href="/administrator">管理员登录</a></li>
                    <li className="header-item-right"><a className="header-link" href="/securityusers">账户登录</a></li>
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
            <Button>登录</Button>
        </dev>
    );
}

export function FuncButton(props) {
    return (
        <Button href={props.bhref} icon={props.bicon} shape="round" size="large">{props.btext}</Button>
    );
}
 
 