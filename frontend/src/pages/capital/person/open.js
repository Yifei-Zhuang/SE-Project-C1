import React from "react";
import {Header} from "../../../component";
import { Input, Button } from "antd";

const open = () => {
    return (
        <dev>
            <Header type="c"/>
            <dev className="blocks">
                <h1 className="title">资金账户开户<Button href="/capital/person" shape="round" size="small">返回</Button> </h1>
                <dev className="func">
                    <Input addonBefore="本人身份证"/>
                    <dev>
                        <p></p>
                    </dev>
                    <Input addonBefore="证券账户卡"/>
                    <dev>
                        <p></p>
                    </dev>
                    <Input.Password addonBefore="证券账户密码"/>
                    <dev>
                        <p></p>
                    </dev>
                    <Input addonBefore="银行卡号"/>
                    <dev>
                        <p></p>
                    </dev>
                    <Input addonBefore="开户行"/>
                    <dev>
                        <p></p>
                    </dev>
                    <Input.Password addonBefore="银行卡密码"/>
                    <dev>
                        <p></p>
                    </dev>
                    <Button>开户</Button>
                </dev>
            </dev>
        </dev>
    )
}
export default open;