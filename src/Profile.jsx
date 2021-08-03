import React, { useState, useEffect } from 'react';
import { Typography, message, Modal } from 'antd';
import axios from './axios-settings'
import RegistrationForm from './RegistrationForm';

const { Title, Text } = Typography;


const Profile = (props) => {

  return (
    <div className="Profile row h-100 p-10">
      <div className="col-md-8">
        <Title level={3} style={{textAlign:"center"}}>User Profile</Title>
        <RegistrationForm type="update" />
      </div>
    </div>
  );
}

export default Profile;
