import React from "react";
import {Header} from "../../../component";
import { Input, Button, Select } from "antd";
const { Option } = Select;

const selectBefore = (
    <Select defaultValue="本人身份证">
        <Option>本人身份证: </Option>
        <Option>法人注册登记号: </Option>
    </Select>
);

const cancel = () => {
    return (
        <dev>
            <Header type="c"/>
            <dev className="blocks">
                <h1 className="title">资金账户销户<Button href="/capital/person" shape="round" size="small">返回</Button> </h1>
                <dev className="func">
                    <Input addonBefore={selectBefore} />
                    <dev>
                        <p></p>
                    </dev>
                    <Input addonBefore="证券账户卡号"/>
                    <dev>
                        <p></p>
                    </dev>
                    <Input.Password addonBefore="证券账户密码"/>
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
                    <Button>销户</Button>
                </dev>
            </dev>
        </dev>
    )
}
export default cancel;