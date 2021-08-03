import React, { useState, useEffect } from 'react';
import { Typography, message, Modal } from 'antd';
import UsersTable from './UsersTable';
import UserAccessTable from './UserAccessTable';
import axios from './axios-settings'
import { ExclamationCircleOutlined } from '@ant-design/icons';


const { Title, Text } = Typography;
const { confirm } = Modal;


const Users = (props) => {
  useEffect(() => {
    getUsers();
  }, []);
  //states
  const [users, setUsers] = useState([]);
  const [userLogs, setUserLogs] = useState([]);
  const [user, setUser] = useState({});
  const [userLoading, setUserLoading] = useState(false);
  const [userAccessLoading, setUserAccessLoading] = useState(false);

  //actions
  const getUsers = () => {
    setUserLoading(true);
    axios.get(`/users`)
    .then(res => {
      setUserLoading(false);
      setUsers(res.data.data);
    })
    .catch(err => {
      setUserLoading(false);
    })
    .then(res => {
      setUserLoading(false);
    })
  }
  const getUserAccess = (user) => {
    setUserAccessLoading(true);
    setUser(user);
    axios.get(`/users/access/${user.id}`)
    .then(res => {
      setUserAccessLoading(false);
      setUserLogs(res.data.data);
    })
    .catch(err => {
      setUserAccessLoading(false);
    })
    .then(res => {
      setUserAccessLoading(false);
    })
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

  const deleteUser = (user) => {
    confirm({
      title: `Do you want to delete ${user.username}?`,
      icon: <ExclamationCircleOutlined />,
      content: 'This is a permanent deletion.',
      onOk() {
        // console.log('OK');
        axios.delete(`/users/${user.id}`)
        .then(res => {
          message.success(`${user.username} has been deleted`);
          getUsers();
        })
        .catch(err => {})
        .then(res => {})
      },
      onCancel() {
        // console.log('Cancel');
      },
    });

  }

  return (
    <div className="Users row h-100 p-10">
      <div className="col-md-8">
        <Title level={3} style={{textAlign:"center"}}>Users</Title>
        <div className="table-responsive">
          <UsersTable users={users} getUserAccess={getUserAccess} changeActiveStatus={changeActiveStatus} loading={userLoading} deleteUser={deleteUser}/>
        </div>
      </div>
      <div className="col-md-4">
        <Title level={3} style={{textAlign:"center"}}>Access Logs</Title>
        <div className="table-responsive">
          <UserAccessTable userLogs={userLogs} user={user} loading={userAccessLoading} />
        </div>
      </div>
    </div>
  );
}

export default Users;
