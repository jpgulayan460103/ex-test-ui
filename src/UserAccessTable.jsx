import React, { useState } from 'react';
import { Table, Tag, Space } from 'antd';

const UsersAccessTable = ({userLogs, user, loading}) => {
    const dataSource = userLogs
    const columns = [
        {
            title: 'user',
            key: 'user',
            render: (text, record) => <span>
                <span>{user.username}</span><br />
            </span>,
        },
        {
            title: 'datetime',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'device',
            key: 'user_agent',
            render: (text, record) => {
                let user_agent = JSON.parse(record.user_agent);
                return (
                    <span>
                        <span>{user_agent.platform}, {user_agent.os}</span><br />
                    </span>
                )
            },
        },

    ];
    return ( 
        <React.Fragment>
            <Table dataSource={dataSource} columns={columns} style={{width: "100%"}} loading={loading} />
        </React.Fragment>
     );
}
 
export default UsersAccessTable;