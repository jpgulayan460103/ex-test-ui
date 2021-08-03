import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Select, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import _cloneDeep from 'lodash/cloneDeep'
import axios from './axios-settings'

const { Option } = Select;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const tailLayout = {
  wrapperCol: { offset: 5, span: 17 },
};

const RegistrationForm = ({type}) => {
  const formRef = React.useRef();
  const [submit, setSubmit] = useState(false);
  const [formError, setFormError] = useState({});
  const [formType, setFormType] = useState("create");
  const [userId, setUserId] = useState(null);
  const [changePassword, setChangePassword] = useState(false);

  useEffect(() => {
    if(type == "update"){
      axios.get(`/logged`)
      .then(res => {
        let userData = res.data.data;
        formRef.current.setFieldsValue({
          ...userData
        });
        setFormType('update');
        setUserId(userData.id);
      })
      .catch(err => {})
      .then(res => {})
      ;
    }
  }, []);

  const onSubmit = values => {
    setSubmit(true);
    setFormError({});
    if(formType == "update"){
      values.id = userId;
      axios.put(`/users/${userId}`,values)
      .then(res => {
        setSubmit(false);
        message.success(`You have successfully updated your profile.`);
        setFormError({});
      })
      .catch(err => {
        setSubmit(false);
        setFormError(err.response.data.errors);
        message.error(`Registration Failed.`);
      })
      .then(res => {
        setSubmit(false);
      })
      ;
    }else{
      //register
      axios.post(`/users`,values)
      .then(res => {
        setSubmit(false);
        message.success(`You are registered, please wait for admin to approve your registration`);
        formRef.current.resetFields();
        setFormError({});
      })
      .catch(err => {
        setSubmit(false);
        setFormError(err.response.data.errors);
        message.error(`Registration Failed.`);
      })
      .then(res => {
        setSubmit(false);
      })
      ;
    }
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const displayErrors = (field) => {
    if(formError[field] && formError[field].length != 0){
      return {
        validateStatus: 'error',
        help: formError[field][0]
      }
    }
  }
 

  return (
    <div>
      <Form
        {...layout}
        ref={formRef}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onSubmit}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Username"
          name="username"
          {...displayErrors('username')}
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input prefix={<UserOutlined />} />
        </Form.Item>

        { type == "update" ? (
          <Form.Item {...tailLayout} name="change_password" valuePropName="checked">
            <Checkbox onChange={(e) => {setChangePassword(e.target.checked)}}>Change Password</Checkbox>
          </Form.Item>
        ) : "" }


        { formType == "create" || changePassword ? (
          <React.Fragment>
            <Form.Item
              label="Password"
              name="password"
              {...displayErrors('password')}
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password prefix={<LockOutlined />} />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="password_confirmation"
              {...displayErrors('password_confirmation')}
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password prefix={<LockOutlined />} />
            </Form.Item>
          </React.Fragment>
        ) : "" }

        <Form.Item
          label="First Name"
          name="first_name"
          {...displayErrors('first_name')}
          rules={[{ required: true, message: 'Please input your first name.' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Middle Name"
          name="middle_name"
          {...displayErrors('middle_name')}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="last_name"
          {...displayErrors('last_name')}
          rules={[{ required: true, message: 'Please input your last name.' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Department/Unit"
          name="department_unit"
          {...displayErrors('department_unit')}
          rules={[{ required: true, message: 'Please input your department/unit.' }]}
        >
          <Input />
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

RegistrationForm.propTypes = {
  
};


export default RegistrationForm;