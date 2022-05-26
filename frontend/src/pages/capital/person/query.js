import React, { useEffect, useState } from "react";
import { Header } from "../../../component";
import { Input, Button, Table } from "antd";
import axios from "axios";

const Query = () => {
    let [info, SetInfo] = useState([]);
    const getInfo = () => {
        axios({
            method: "GET",
            url: "http://47.99.194.140:3001/capital/getInfo",
            params: {
                capitalaccountid: '000000000000000001'
            },
        }).then(
            res => {
                // console.log(res.data);
                // let temp = JSON.parse(res.data);
                let temp = res.data;
                let index = 0;
                let another = temp.map(item => {
                    return {
                        key: index++,
                        ...item
                    }
                });
                SetInfo(another)
            }
        )
    };
    const columns = [
        {
            title: 1,
            dataIndex: "time",
            key: "time"
        },
        {
            title: 2,
            dataIndex: "amount",
            key: "amount"
        },
        {
            title: 3,
            dataIndex: "currency",
            key: "currency"
        },
        {
            title: 4,
            dataIndex: "description",
            key: "description"
        }
    ]
    return (
        <dev>
            <Header type="c" />
            <dev className="blocks">
                <h1 className="title">资金账户信息查询<Button href="/capital/person" shape="round" size="small">返回</Button> </h1>
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
                    <div>
                        <h2>
                            交易信息
                        </h2>
                        <div>
                            <Table dataSource={info} columns={columns} />
                        </div>
                        <Button onClick={getInfo}>获取</Button>
                    </div>
                </dev>
            </dev>
        </dev>
    )
}
export default Query;