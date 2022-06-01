import React from "react";
import {Header} from "../../../component";
import { Input, Button } from "antd";

const open = () => {
    return (
        <dev>
            <Header type="s"/>
            <dev className="blocks">
                <h1 className="title">证券账户个人开户</h1>
                <dev className="func">
                    <Input addonBefore="姓名"/>
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
                    <Input addonBefore="职业"/>
                    <dev>
                        <p></p>
                    </dev>
                    <Input addonBefore="学历"/>
                    <dev>
                        <p></p>
                    </dev>
                    <Input addonBefore="工作单位"/>
                    <dev>
                        <p></p>
                    </dev>
                    <Input addonBefore="联系电话"/>
                    <dev>
                        <p></p>
                    </dev>
                    <Button>开户</Button>  <Button href="/security/person">返回</Button> 
                </dev>
            </dev>
        </dev>
    )
}
export default open;