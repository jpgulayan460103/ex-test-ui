import React, { useState, useEffect } from 'react';
import { Typography, message } from 'antd';
import UsersTable from './UsersTable';
import UserAccessTable from './UserAccessTable';
import axios from './axios-settings'
const { Title, Text } = Typography;


const Users = (props) => {
  useEffect(() => {
    getUsers();
  }, []);
  //states
  const [users, setUsers] = useState([]);
  const [userLogs, setUserLogs] = useState([]);
  const [user, setUser] = useState({});

  //actions
  const getUsers = () => {
    axios.get(`/users`)
    .then(res => {
      setUsers(res.data.data);
    })
    .catch(err => {})
    .then(res => {})
  }
  const getUserAccess = (user) => {
    setUser(user);
    axios.get(`/users/access/${user.id}`)
    .then(res => {
      setUserLogs(res.data.data);
    })
    .catch(err => {})
    .then(res => {})
  }

  const changeActiveStatus = (value, user) => {
    let formData = {
      ...user,
      is_active: value ? "yes" : "no"
    };
    axios.put(`/users/${user.id}`, formData)
    .then(res => {
      message.success(`${user.username} has been updated`);
    })
    .catch(err => {})
    .then(res => {})
  }

  return (
    <div className="Users row h-100 p-10">
      <div className="col-md-6">
        <h4 style={{textAlign: "center"}}>Users</h4>
        <div className="table-responsive">
          <UsersTable users={users} getUserAccess={getUserAccess} changeActiveStatus={changeActiveStatus}/>
        </div>
      </div>
      <div className="col-md-6">
        <h4 style={{textAlign: "center"}}>Access Logs</h4>
        <div className="table-responsive">
          <UserAccessTable userLogs={userLogs} user={user} />
        </div>
      </div>
    </div>
  );
}

export default Users;
