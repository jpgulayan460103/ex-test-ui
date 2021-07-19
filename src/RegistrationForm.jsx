import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Select } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import _cloneDeep from 'lodash/cloneDeep'

const { Option } = Select;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const tailLayout = {
  wrapperCol: { offset: 5, span: 17 },
};

const RegistrationForm = (props) => {
  const formRef = React.useRef();
  const [submit, setSubmit] = useState(false);
  const [userPosition, setUserPosition] = useState("");
  const [formError, setFormError] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [barangay, setBarangay] = useState("");
  const [formType, setFormType] = useState("create");
  const [userId, setUserId] = useState(null);
  const [changePassword, setChangePassword] = useState(false);
  useEffect(() => {
    getProvinces();
  }, []);
  useEffect(() => {
    if(props.userData != null){
      setFormType("update");
      let userData = _cloneDeep(props.userData);
      setUserId(userData.id);
      setUserPosition(userData.position);
      if(userData.barangay_id){
        setCity(userData.barangay.city_psgc);
        setProvince(userData.barangay.province_psgc);
        userData.city = userData.barangay.city_psgc;
        userData.province = userData.barangay.province_psgc;
        setBarangay(userData.barangay_id);
        setCities([{
          city_name: userData.barangay.city_name,
          city_psgc: userData.barangay.city_psgc,
        }]);
        setBarangays([{
          barangay_name: userData.barangay.barangay_name,
          id: userData.barangay.id,
        }]);
      }
      formRef.current.setFieldsValue({
        ...userData
      });
    }
  }, [props.userData]);
  const onSubmit = values => {
    setSubmit(true);
    if(formType == "update"){
      values.id = userId;
    }
    console.log(values);
    
    // API.User.save(values, formType)
    // .then(res => {
    //   setSubmit(false);
    //   setFormError({});
    //   if(props.type == "registration"){
    //     formRef.current.resetFields();
    //   }
    //   let message = "";
    //   let title = "Success";
    //   if(formType == "create"){
    //     title = "Registration success";
    //     message = "Please contact administrator to activate your account.";
    //   }else if(props.type == "user"){
    //     message = "Account settings have been updated.";
    //   }else{
    //     message = "User has been updated. ";
    //   }
    //   Swal.fire({
    //     title: title,
    //     text: message,
    //     icon: 'success',
    //     confirmButtonText: 'OK',
    //     onClose: () => {

    //     }
    //   })
    //   setBarangay("");
    //   setProvince("");
    //   setCity("");
    // })
    // .catch(err => {
    //   setSubmit(false);
    //   if(err.response.status == 422){
    //     setFormError(err.response.data.errors);
    //   }
    // })
    // .then(res => {
    //   setSubmit(false);
    // })
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const displayErrors = (field) => {
    if(formError[field]){
      return {
        validateStatus: 'error',
        help: formError[field][0]
      }
    }
  }
  const getProvinces = () => {
    // API.Barangay.getProvinces()
    // .then(res => {
    //   setProvinces(res.data.provinces);
    // })
    // .catch(res => {
    // })
    // .then(res => {})
    // ;;
  }
  const getCities = (e) => {
    // setCities([]);
    // if(typeof e == "undefined"){
    //   setProvince("");
    // }else{
    //   setProvince(e);
    // }
    // API.Barangay.getCities(e)
    // .then(res => {
    //   setCities(res.data.cities);
    // })
    // .catch(res => {
    // })
    // .then(res => {})
    // ;;
  }
  const getBarangays = (city) => {
    // setBarangays([]);
    // if(typeof city == "undefined"){
    //   setCity("");
    // }else{
    //   setCity(city);
    // }
    // API.Barangay.getBarangays(province,city)
    // .then(res => {
    //   setBarangays(res.data.barangays);
    // })
    // .catch(res => {
    // })
    // .then(res => {})
    // ;;
  }

  const populateProvinces = () => {
    let items = [];
    provinces.map(item => {
      items.push(<Option value={item.province_psgc} key={item.province_psgc}>{item.province_name}</Option>);
    })
    return items;
  }
  const populateCities = () => {
    let items = [];
    cities.map(item => {
      items.push(<Option value={item.city_psgc} key={item.city_psgc}>{item.city_name}</Option>);
    })
    return items;
  }
  const populateBarangays = () => {
    let items = [];
    barangays.map(item => {
      items.push(<Option value={item.id} key={item.id}>{item.barangay_name}</Option>);
    })
    return items;
  }

  const formSetBarangay = (e) => {
    if(typeof e == "undefined"){
      setBarangay("");
    }else{
      setBarangay(e);
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

        { props.type == "user" || props.type == "update" ? (
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