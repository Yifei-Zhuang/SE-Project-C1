import React from "react";
import { Link } from "react-router-dom";


const personPage = (props) => {
    return (
        <h1>
            <h5>
                个人证券账户管理
                <nav>
                    <Link to={"open"} > 个人开户</Link>
                    <Link to={"makeup"} > 个人补办</Link>
                    <Link to={"cancel"} > 个人销户</Link>
                    <Link to={"loss"} >个人挂失</Link>
                </nav>
            </h5>
        </h1>
    )
}
export default personPage;