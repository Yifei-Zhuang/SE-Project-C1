import React from "react";
import {Header} from "../../../component";
import { Input, Button, Select} from "antd";
const { Option } = Select;

const withdraw = () => {
    return (
        <dev>
            <Header type="c"/>
            <dev className="blocks">
                <h1 className="title">资金账户取款<Button href="/capital/person" shape="round" size="small">返回</Button> </h1>
                <dev className="func">
                    <dev>
                        <p></p>
                    </dev>
                    <Input addonBefore="资金账户卡号"/>
                    <dev>
                        <p></p>
                    </dev>
                    <Input.Password addonBefore="取款密码"/>
                    <dev>
                        <p></p>
                    </dev>
                    <Input addonBefore="取款金额"/>
                    <dev>
                        <p></p>
                    </dev>
                    <Button>取款</Button>
                </dev>
            </dev>
        </dev>
    )
}
export default withdraw;