import React from "react";
import { Link } from "react-router-dom";


const corporatePage = (props) => {
    return (
        <h5>
            法人证券账户管理
            <nav>
                <Link to={"open"} > 法人开户</Link>
                <Link to={"makeup"} > 法人补办</Link>
                <Link to={"cancel"} > 法人销户</Link>
                <Link to={"loss"} >法人挂失</Link>
            </nav>
        </h5>
    )
}
export default corporatePage;