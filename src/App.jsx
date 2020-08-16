import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
import logo from './logo.png';
// import './App.css';
import './styles.css';
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Table, Typography, Input, Form, Select, Space, Tree   } from 'antd';
import axios from 'axios';
import Highlighter from "react-highlight-words";

import { CloseCircleTwoTone, CheckCircleTwoTone, ExclamationCircleTwoTone, SmileTwoTone, DownOutlined  } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

function App() {
  useEffect(() => {
    getBeneficiaries();
    getSourceStatistics();
    getBarangays();
  }, []);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [searchOptions, setSearchOptions] = useState({});
  const [loading, setLoading] = useState(false);
  const [categoryStatistics, setCategoryStatistics] = useState([]);
  const [sourceStatistics, setSourceStatistics] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [statisticsTotal, setStatisticsTotal] = useState(0);
  const [barangays, setBarangays] = useState([]);
  const [keywords, setKeywords] = useState([]);

  const queryString = (e) => {
    let searchString = e.target.value;
    setSearchOptions({
      ...searchOptions,
      keyword: searchString,
    });
    setKeywords(searchString.split(",").map(item => item.trim()));
  }

  const selectBarangay = (e) => {
    let searchString = e;
    setSearchOptions({
      ...searchOptions,
      barangay: searchString,
    });
  }

  const onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
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

  const getSourceStatistics = () => {
    axios.get('http://localhost:3000/beneficiaries/statistics/source',{params: searchOptions})
      .then(function (response) {
        setLoading(false);
        let sourceResponse = response.data.data;
        sourceResponse.map((item, index) => {
          item.key = `source_statistic_${index}`;
          item.title = `${item.source}: ${item.source_count}`;
          return item;
        })
        setSourceStatistics(sourceResponse);
        getCategoryStatistics(sourceResponse);
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
      });
  }

  const getCategoryStatistics = (sourceResponse) => {
    axios.get('http://localhost:3000/beneficiaries/statistics/category',{params: searchOptions})
      .then(function (response) {
        setLoading(false);
        let beneficiaryResponse = response.data.data;
        beneficiaryResponse.map((item, index) => {
          item.key = `category_statistic_${index}`;
          item.title = `${item.category}: ${item.category_count}`;
          return item;
        })
        for (let index = 0; index < sourceResponse.length; index++) {
          sourceResponse[index].children = beneficiaryResponse.filter(item => item.source == sourceResponse[index].source)
        }
        let total = sourceResponse.reduce((accumulator, currentValue) => {
          return accumulator + parseInt(currentValue.source_count);
        }, 0);
        setStatisticsTotal(total);
        setStatistics(sourceResponse)
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
    
  const iconStatus = (record) => {
    if(record.source == "1st tranche" && record.category == "consolidated paid beneficiaries"){
      return <SmileTwoTone  style={{fontSize: 20}}  twoToneColor="#FFD700"/>;
    }
    if(record.source == "additional" && record.category == "certified list without reference number"){
      return <ExclamationCircleTwoTone  style={{fontSize: 20}}  twoToneColor="#842feb"/>;
    }else if(record.source == "additional" && record.category != "certified list without reference number"){
      return <CloseCircleTwoTone  style={{fontSize: 20}}  twoToneColor="#eb2f96"/>;
    }
    switch (record.category) {
      case "certified list without reference number":
      case "certified list with reference number":
        return <CheckCircleTwoTone  style={{fontSize: 20}}  twoToneColor="#52c41a"/>;
        break;
      default:
        return <CloseCircleTwoTone  style={{fontSize: 20}}  twoToneColor="#eb2f96"/>;
        break;
    }
  }
  
  const dataSource = beneficiaries;
  
  const columns = [
    {
      title: '',
      key: 'status',
      render: (text, record) => (
        <span>
          <span>
            { iconStatus(record) }
          </span>
        </span>
      ),
    },
    {
      title: 'Name',
      key: 'full_name_ln',
      render: (text, record) => (
        <span>
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffe4bf', padding: 0 }}
            searchWords={keywords}
            autoEscape={true}
            textToHighlight={`${record.lastname ? record.lastname : ""}, ${record.firstname ? record.firstname : ""} ${record.midname ? record.midname : ""} ${record.ext ? record.ext : ""}`}
          />
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


  const populateCategoryStatistics = () => {
    return (
      <div>
        {sourceStatistics.map(statistic => {
          return (
            <p key={statistic.key}>
              <b>{statistic.source.toUpperCase()}:</b> <span>{statistic.source_count}</span>
            </p>
          );
        })}
        {categoryStatistics.map(statistic => {
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
                  <Input autoComplete="off" placeholder="Search" allowClear onChange={(e) => {queryString(e)}} style={{width: "250px"}}  />
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
              { (keywords.length != 0 ? (
                <Space>
                  <Text>keywords: </Text>
                  {keywords.map(item => {
                    return <Text>"<Text strong>{item}</Text>"</Text>
                  })}
                </Space>
              ) : "") }
              <br />
              <Table
                dataSource={dataSource}
                columns={columns}
                loading={loading}
                pagination={{ position: ['topLeft', 'bottomLeft'] }}
                expandable={{
                  expandedRowRender: record => {
                    return (<div>
                      <p style={{ margin: 0 }}>Source: <b>{record.source}</b></p>
                      <p style={{ margin: 0 }}>Category: <b>{record.category} {record.remarks}</b></p>
                      <p style={{ margin: 0 }}>Name: <b>{record.full_name_fn}</b></p>
                      <p style={{ margin: 0 }}>Payment Category: <b>{record.payment_category}</b></p>
                      <p style={{ margin: 0 }}>Payout Branch: <b>{record.payout_branch}</b></p>
                      <p style={{ margin: 0 }}>Payout Partner: <b>{record.payout_partner}</b></p>
                      <p style={{ margin: 0 }}>Cash Out Reference Number: <b>{record.cash_out_ref_number}</b></p>
                      <p style={{ margin: 0 }}>Payout Schedule: <b>{record.schedule}</b></p>
                      <p style={{ margin: 0 }}>Batch and Part: <b>{record.batch_part}</b></p>
                      <p style={{ margin: 0 }}>Starpay Disbursement Status: <b>{record.starpay_status}</b></p>
                    </div>);
                  },
                }}
                />
              <Title level={3}>Total Records: {statisticsTotal}</Title>
              {/* { populateCategoryStatistics() } */}

              <Tree
                showLine
                switcherIcon={<DownOutlined />}
                defaultExpandAll={true}
                onSelect={onSelect}
                treeData={statistics}
            />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
