import React from "react";
import { Header } from "../../../component";
import { Input, Button } from "antd";

const Query = () => {
    return (
        <dev>
            <Header type="c" />
            <dev className="blocks">
                <h1 className="title">资金账户信息查询</h1>
                <dev className="func">
                    <dev>
                        <h2>开户人姓名</h2>
                        <p>张三</p>
                    </dev>
                    <br />
                    <dev>
                        <h2>当前余额</h2>
                        <p>100￥</p>
                    </dev>
                    <br />
                    <dev>
                        <h2>最近交易日期</h2>
                        <p>2022-05-14</p>
                    </dev>
                </dev>
                <Button href="/security/person">返回</Button>
            </dev>
        </dev>
    )
}
export default Query;