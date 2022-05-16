import React from "react";
import {Header} from "../../../component";
import { Input, Button, DatePicker } from "antd";

const open = () => {
    return (
        <dev>
            <Header type="s"/>
            <dev className="blocks">
                <h1 className="title">证券账户法人开户<Button href="/security/person" shape="round" size="small">返回</Button> </h1>
                <dev className="func">
                    <Input addonBefore="法人注册登记号码"/>
                    <dev>
                        <p></p>
                    </dev>
                    <Input addonBefore="营业执照号码"/>
                    <dev>
                        <p></p>
                    </dev>
                    <Input addonBefore="法人姓名"/>
                    <dev>
                        <p></p>
                    </dev>
                    <Input addonBefore="性别"/>
                    <dev>
                        <p></p>
                    </dev>
                    <Input addonBefore="身份证号"/>
                    <dev>
                        <p></p>
                    </dev>
                    <Input addonBefore="家庭地址"/>
                    <dev>
                        <p></p>
                    </dev>
                    <Input addonBefore="联系电话"/>
                    <dev>
                        <p></p>
                    </dev>
                    <Input addonBefore="法人授权证券交易执行人姓名"/>
                    <dev>
                        <p></p>
                    </dev>
                    <Input addonBefore="身份证号"/>
                    <dev>
                        <p></p>
                    </dev>
                    <Input addonBefore="联系电话"/>
                    <dev>
                        <p></p>
                    </dev>
                    <Input addonBefore="地址"/>
                    <dev>
                        <p></p>
                    </dev>
                    <DatePicker />
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