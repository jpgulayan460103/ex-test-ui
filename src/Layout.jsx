import React, { useState, useEffect } from 'react';
import { Typography   } from 'antd';
import logo from './logo.png';
const { Title, Text } = Typography;


const Layout = (props) => {

  return (
    <div className="Layout">
      <div className="main-layout-container">
        <div className="container"> 
          <div className="row justify-content-center align-items-center p-3">
            <img className="h-16" src={logo} alt="" style={{width: "100%"}} />
          </div>
          <div className="row">
            <div className="col-md-12">
              <Title level={2} style={{textAlign: "center"}}>Social Amelioration Information System</Title>
              <br />
              { props.children }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
