import React from "react";
import {Header} from "../../../component";
import { Input, Button, Select} from "antd";
const { Option } = Select;

const deposit = () => {
    return (
        <dev>
            <Header type="c"/>
            <dev className="blocks">
                <h1 className="title">资金账户存款</h1>
                <dev className="func">
                    <dev>
                        <p></p>
                    </dev>
                    <Input addonBefore="资金账户卡号"/>
                    <dev>
                        <p></p>
                    </dev>
                    <Input.Password addonBefore="资金账户密码"/>
                    <dev>
                        <p></p>
                    </dev>
                    <Input.Password addonBefore="存款金额"/>
                    <dev>
                        <p></p>
                    </dev>
                    <Button>存款</Button> <Button href="/security/person">返回</Button> 
                </dev>
            </dev>
        </dev>
    )
}
export default deposit;