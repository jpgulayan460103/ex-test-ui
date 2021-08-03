import React, { useState } from 'react';
import { Table, Tag, Switch } from 'antd';

const UsersTable = ({users, getUserAccess, changeActiveStatus} ) => {
    const dataSource = users
    const columns = [
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
            title: 'logs',
            key: 'logs',
            render: (text, record) => (
                <span>
                    <a href="javascript:void(0)" onClick={() => { getUserAccess(record) }}>View</a>
                </span>
            ),
        },
        {
            title: 'Access',
            key: 'is_active',
            render: (text, record) => (
                <span>
                    <Switch checkedChildren="On" unCheckedChildren="Off" defaultChecked={record.is_active == 1} onChange={(e) => { changeActiveStatus(e, record) }} />
                </span>
            ),
        },
        

    ];
    return ( 
        <React.Fragment>
            <Table dataSource={dataSource} columns={columns} style={{width: "100%"}} />
        </React.Fragment>
     );
}
 
export default UsersTable;