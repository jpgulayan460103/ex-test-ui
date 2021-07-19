import React, { useState, useEffect } from 'react';
import { Typography   } from 'antd';
import logo from './logo.png';
import LoginForm from './LoginForm'
import RegistrationForm from './RegistrationForm'
const { Title, Text } = Typography;


const Layout = (props) => {

  return (
    <div className="Layout row h-100 p-10">
        <div className="col-6">
            <Title level={3} style={{textAlign:"center"}}>Login Form</Title>
            <LoginForm />
        </div>
        <div className="col-6">
            <Title level={3} style={{textAlign:"center"}}>Registration Form</Title>
            <RegistrationForm />
        </div>
    </div>
  );
}

export default Layout;
