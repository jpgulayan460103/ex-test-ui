import React from 'react';
import axios from 'axios'
import { Modal, message } from 'antd';

import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

axios.defaults.baseURL = 'http://localhost:3000/';

axios.interceptors.response.use((response) => {
    return response;
}, (error) => {

    if (error.response && error.response.status == 401) {
        window.location = "/pages/login";
    } else if (error.response && error.response.status == 403) {
        message.error("Unauthorized Access, Please contact administrator");
    } else if (error.response && error.response.status >= 500) {
        message.error("Opss! Something went wrong. Please report this to your technical support");
    }
    return Promise.reject(error);
});



export default axios;