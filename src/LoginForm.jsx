import React, { useState } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import axios from './axios-settings'
const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 17 },
};
const tailLayout = {
  wrapperCol: { offset: 5, span: 17 },
};

const LoginForm = props => {
  const [submit, setSubmit] = useState(false);
  const [formError, setFormError] = useState(false);
  const onSubmit = (values) => {
    setSubmit(true);
    axios.post(`/login`, values)
    .then(res => {
      setSubmit(false);
      window.location = "/";
    })
    .catch(err => {
      setSubmit(false);
    })
    .then(res => {
      setSubmit(false);
    });
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const displayErrors = () => {
    if(formError){
      return {
        validateStatus: 'error',
        help: formError.message
      }
    }
  }
  return (
    <div>
      <Form
        {...layout}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onSubmit}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Username"
          name="username"
          {...displayErrors()}
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input prefix={<UserOutlined />} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password prefix={<LockOutlined />} />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" disabled={submit} loading={submit}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

LoginForm.propTypes = {
  
};


export default LoginForm;