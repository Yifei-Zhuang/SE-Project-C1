import React from "react";
import {Header} from "../../../component";
import { Input, Button} from "antd";

const Loss = () => {
    return (
        <dev>
            <Header type="s"/>
            <dev className="blocks">
                <h1 className="title">证券账户修改密码<Button href="/security/person" shape="round" size="small">返回</Button> </h1>
                <dev className="func">
                    <Input addonBefore="证券账户卡号"/>
                    <dev>
                        <p></p>
                    </dev>
                    <Input.Password addonBefore="证券账户密码"/>
                    <dev>
                        <p></p>
                    </dev>
                    <Input.Password addonBefore="新证券账户密码"/>
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