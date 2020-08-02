import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
import logo from './logo.png';
// import './App.css';
import './styles.css';
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Table, Typography, Input, Form, Select } from 'antd';
import axios from 'axios';

import { CloseCircleTwoTone, CheckCircleTwoTone } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

function App() {
  useEffect(() => {
    getBeneficiaries();
    getStatistics();
  }, []);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [searchOptions, setSearchOptions] = useState({});
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState([]);
  const [barangays, setBarangays] = useState([]);

  const queryString = (e) => {
    let searchString = e.target.value;
    setSearchOptions({
      ...searchOptions,
      keyword: searchString,
    });
  }

  const selectBarangay = (e) => {
    let searchString = e;
    setSearchOptions({
      ...searchOptions,
      barangay: searchString,
    });
  }

  const getBeneficiaries = () => {
    setLoading(true);
    axios.get('http://localhost:3000/beneficiaries',{params: searchOptions})
      .then(function (response) {
        setLoading(false);
        let beneficiaryResponse = response.data.data;
        beneficiaryResponse.map(item => {
          item.key = item.id;
          return item;
        })
        setBeneficiaries(beneficiaryResponse);
      })
      .catch(function (error) {
        setLoading(false);
        console.log(error);
      })
      .then(function () {
        setLoading(false);
      });
  }

  const getStatistics = () => {
    axios.get('http://localhost:3000/beneficiaries/statistics',{params: searchOptions})
      .then(function (response) {
        setLoading(false);
        let beneficiaryResponse = response.data.data;
        beneficiaryResponse.map((item, index) => {
          item.key = `statistic_${index}`;
          return item;
        })
        setStatistics(beneficiaryResponse);
        getBarangays();
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
      });
  }

  const getBarangays = () => {
    axios.get('http://localhost:3000/beneficiaries/barangays',{params: searchOptions})
      .then(function (response) {
        setLoading(false);
        let beneficiaryResponse = response.data.data;
        beneficiaryResponse.map((item, index) => {
          item.key = `barangay_${index}`;
          return item;
        })
        setBarangays(beneficiaryResponse);
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
      });
  }
  
  const dataSource = beneficiaries;
  
  const columns = [
    {
      title: '',
      key: 'status',
      render: (text, record) => (
        <span>
          <span>
            { (record.category == "certified list") ? (<CheckCircleTwoTone  style={{fontSize: 20}}  twoToneColor="#52c41a"/>) : "" }
            { (record.category != "certified list" && record.category != "waitlisted") ? (<CloseCircleTwoTone  style={{fontSize: 20}}  twoToneColor="#eb2f96"/>) : "" }
          </span>
        </span>
      ),
    },
    {
      title: 'Name',
      key: 'full_name_ln',
      render: (text, record) => (
        <span>
          <span>{`${record.lastname ? record.lastname : ""}, ${record.firstname ? record.firstname : ""} ${record.midname ? record.midname : ""} ${record.ext ? record.ext : ""}`}</span>
        </span>
      ),
    },
    {
      title: 'Birthday',
      dataIndex: 'birthday',
      key: 'birthday',
    },
    {
      title: 'Barangay',
      dataIndex: 'barangay_name',
      key: 'barangay_name',
    },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
    },
  ];


  const populateStatistics = () => {
    return (
      <div>
        {statistics.map(statistic => {
          return (
            <p key={statistic.key}>
              <b>{statistic.category.toUpperCase()}:</b> <span>{statistic.category_count}</span>
            </p>
          );
        })}
      </div>
    );
  }

  const populateBarangaySelection = () => {
    let children = [];
    barangays.map(item => {
      children.push(<Option key={item.key} value={item.barangay_name}>{item.barangay_name}</Option>);
    });
    return children;
  }

  return (
    <div className="App">
      <div className="main-layout-container">
        <div className="container"> 
          <div className="row justify-content-center align-items-center p-3">
            <img className="h-16" src={logo} alt=""/>
          </div>
          <div className="row">
            <div className="col-md-12">
              <Title level={2} style={{textAlign: "center"}}>Social Amelioration Information System</Title>
              <br />
              <Form name="normal_login" className="login-form" layout="inline" onFinish={getBeneficiaries} >
                <Form.Item name="username">
                  <Input placeholder="Search" allowClear onChange={(e) => {queryString(e)}} style={{width: "250px"}}  />
                </Form.Item>
                <Form.Item name="barangay">
                  <Select
                    allowClear
                    mode="multiple"
                    style={{ width: '250px' }}
                    placeholder="Please select Barangay"
                    onChange={selectBarangay}
                  >
                    { populateBarangaySelection() }
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" className="login-form-button">
                    Search
                  </Button>
                </Form.Item>
              </Form>
              <br />
              <Table dataSource={dataSource} columns={columns} loading={loading} pagination={{ position: ['topLeft', 'bottomLeft'] }} />
              <Title level={3}>Total Records:</Title>
              { populateStatistics() }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
