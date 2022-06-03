import { MailOutlined, SettingOutlined, AppstoreOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import React from "react";
import { Link } from "react-router-dom";
import {Header, FuncButton} from "../../../component";
import { AiOutlinePlus, AiOutlineExclamation, AiOutlineKey, AiOutlineQuestion } from "react-icons/ai";
import {Button} from "antd";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = [
  getItem('Navigation One', 'sub1', <MailOutlined />, [
    getItem('Item 1', 'g1', null, [getItem('Option 1', '1'), getItem('Option 2', '2')], 'group'),
    getItem('Item 2', 'g2', null, [getItem('Option 3', '3'), getItem('Option 4', '4')], 'group'),
  ]),
  getItem('Navigation Two', 'sub2', <AppstoreOutlined />, [
    getItem('Option 5', '5'),
    getItem('Option 6', '6'),
    getItem('Submenu', 'sub3', null, [getItem('Option 7', '7'), getItem('Option 8', '8')]),
  ]),
  getItem('Navigation Three', 'sub4', <SettingOutlined />, [
    getItem('Option 9', '9'),
    getItem('Option 10', '10'),
    getItem('Option 11', '11'),
    getItem('Option 12', '12'),
  ]),
];

// const App = () => {
//   const onClick = (e) => {
//     console.log('click ', e);
//   };

//   return (
//     <Menu
//       onClick={onClick}
//       style={{
//         width: 256,
//       }}
//       defaultSelectedKeys={['1']}
//       defaultOpenKeys={['sub1']}
//       mode="inline"
//       items={items}
//     />
//   );
// };

//export default App;

const { Component } = React

class EntryPage extends Component {
  constructor(props){
    super(props)
    this.state = {
      currentView: "signUp"
    }
  }

  changeView = (view) => {
    this.setState({
      currentView: view
    })
  }

  currentView = () => {
    switch(this.state.currentView) {
      case "signUp":
        return (
          <form>
            <h2>Sign Up!</h2>
            <fieldset>
              <legend>Create Account</legend>
              <ul>
                <li>
                  <label for="username">Username:</label>
                  <input type="text" id="username" required/>
                </li>
                <li>
                  <label for="email">Email:</label>
                  <input type="email" id="email" required/>
                </li>
                <li>
                  <label for="password">Password:</label>
                  <input type="password" id="password" required/>
                </li>
              </ul>
            </fieldset>
            <button>Submit</button>
            <button type="button" onClick={ () => this.changeView("logIn")}>Have an Account?</button>
          </form>
        )
        break
      case "logIn":
        return (
          <form>
            <h2>Welcome Back!</h2>
            <fieldset>
              <legend>Log In</legend>
              <ul>
                <li>
                  <label for="username">Username:</label>
                  <input type="text" id="username" required/>
                </li>
                <li>
                  <label for="password">Password:</label>
                  <input type="password" id="password" required/>
                </li>
                <li>
                  <i/>
                  <a onClick={ () => this.changeView("PWReset")} href="#">Forgot Password?</a>
                </li>
              </ul>
            </fieldset>
            <button>Login</button>
            <button type="button" onClick={ () => this.changeView("signUp")}>Create an Account</button>
          </form>
        )
        break
      case "PWReset":
        return (
          <form>
          <h2>Reset Password</h2>
          <fieldset>
            <legend>Password Reset</legend>
            <ul>
              <li>
                <em>A reset link will be sent to your inbox!</em>
              </li>
              <li>
                <label for="email">Email:</label>
                <input type="email" id="email" required/>
              </li>
            </ul>
          </fieldset>
          <button>Send Reset Link</button>
          <button type="button" onClick={ () => this.changeView("logIn")}>Go Back</button>
        </form>
        )
      default:
        break
    }
  }


  render() {
    return (
      <section id="entry-page">
        {this.currentView()}
      </section>
    )
  }
}

// ReactDOM.render(<EntryPage/>, document.getElementById("app"))




const SecurityIndexPage = (props) => {
    const onClick = (e) => {
      console.log('click ', e);
    };
    return (
        <dev>
            
            <Header type = "s" />
            <center>
            <dev className="aboutblocks">
                <h1 className="title">证券账户管理</h1>
                <dev className="indexselections">
                    <dev>
                        <p></p>
                    </dev>
                    <dev className="indexselection">
                        <p><FuncButton bhref="/security/corporate" bicon={<AiOutlinePlus/>} btext="法人证券账户管理" /></p>
                        {/* 法人开设证券账户 */}
                    </dev>
                    <dev>
                        <p></p>
                    </dev>
                    <dev className="indexselection">
                        <p><FuncButton bhref="/security/person" bicon={<AiOutlineQuestion/>} btext="个人证券账户管理" /></p>
                        {/* 挂失并补办证券账户 */}
                    </dev>
                    <dev>
                        <p></p>
                    </dev>
                    <dev className="indexselection">
                        <p><Button shape="round" size="large"><Link className="btn" to="/">返回</Link></Button></p>
                    </dev>
                </dev>
            </dev>
            </center>
        </dev>
    )
}
 export default SecurityIndexPage;