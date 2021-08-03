import React, { useState } from 'react';
import { Table, Tag, Switch } from 'antd';

const UsersTable = ({users, getUserAccess, changeActiveStatus, loading, deleteUser} ) => {
    const dataSource = users
    const columns = [
        {
            title: 'Access',
            key: 'is_active',
            render: (text, record) => (
                <span>
                    <Switch checkedChildren="On" unCheckedChildren="Off" defaultChecked={record.is_active == 1} onChange={(e) => { changeActiveStatus(e, record) }} />
                </span>
            ),
        },
        {
            title: 'type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Fullname',
            key: 'first_name',
            render: (text, record) => (
                <span>{(record.last_name ? record.last_name : "") +", "+(record.first_name ? record.first_name : "") +" "+(record.middle_name ? record.middle_name : "") }</span>
            ),
        },
        {
            title: 'Department/Unit',
            dataIndex: 'department_unit',
            key: 'department_unit',
        },
        {
            title: '',
            key: 'logs',
            align: "center",
            render: (text, record) => (
                <span>
                    <a href="javascript:void(0)" onClick={() => { getUserAccess(record) }}>View Logs</a> | <a href="javascript:void(0)" onClick={() => { deleteUser(record) }}>Delete</a>
                </span>
            ),
        },
        

    ];
    return ( 
        <React.Fragment>
            <Table dataSource={dataSource} columns={columns} style={{width: "100%"}}  loading={loading}/>
        </React.Fragment>
     );
}
 
export default UsersTable;