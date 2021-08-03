import React, { useState, useEffect } from 'react';
import SearchApp from './SearchApp'
import Login from './Login'
import Layout from './Layout'
import Users from './Users'
import './styles.css';
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Popover, Button, Menu  } from 'antd';
import {
  MenuOutlined,
  SearchOutlined ,
  CaretDownOutlined ,
} from '@ant-design/icons';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";



const App = (props) => {
  const [menuShow, setMenuShow] = useState(false)

  const Content = (props) => {
    return (
      <React.Fragment>
        <ul className="list-group" style={{width: "120px"}}>
          <Link className="custom-menu" to="/"><li className="list-group-item custom-menu-item">Home</li></Link>
          <Link className="custom-menu" to="/users"><li className="list-group-item custom-menu-item">Users</li></Link>
          <Link className="custom-menu" to="/logout"><li className="list-group-item custom-menu-item">Logout</li></Link>
        </ul>
      </React.Fragment>
    );
  };

  const Menu = () => {
    return (
      <div className="container" style={{minHeight: 0, padding: "5px", height: "43px"}}>
        <Popover content={<Content {...props} />} title="" placement="bottomRight" trigger="click" className="float-right">
          <Button type="default" shape="circle" icon={<CaretDownOutlined  />} />
        </Popover>
      </div>
    );
  }

  return (
    <Router>
    <div className="App">

      
    </div>

    <Switch>
      <Route path="/users">
        <Menu />
        <Layout><Users /></Layout>
      </Route>
      <Route path="/login">
        <Menu />
        <Layout><Login /></Layout>
      </Route>
      <Route path="/">
        <Menu />
        <Layout><SearchApp /></Layout>
      </Route>
    </Switch>
    </Router>
  );
}

export default App;
