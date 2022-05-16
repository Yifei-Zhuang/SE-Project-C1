
import React from "react";
import {Header} from "../../../component";
import { Input, Button, Select} from "antd";
const { Option } = Select;

const selectBefore = (
    <Select defaultValue="本人身份证">
        <Option>本人身份证: </Option>
        <Option>法人注册登记号: </Option>
    </Select>
);

const Loss = () => {
    return (
        <dev>
            <Header type="s"/>
            <dev className="blocks">
                <h1 className="title">资金账户修改密码<Button href="/security/person" shape="round" size="small">返回</Button> </h1>
                <dev className="func">
                    <Input addonBefore="资金账户卡号"/>
                    <dev>
                        <p></p>
                    </dev>
                    <Input.Password addonBefore="资金账户密码"/>
                    <dev>
                        <p></p>
                    </dev>
                    <Input.Password addonBefore="新资金账户密码"/>
                    <dev>
                        <p></p>
                    </dev>
                    <Button>修改密码</Button>
                </dev>
            </dev>
        </dev>
    )
}
export default Loss;