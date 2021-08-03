import React, { useState, useEffect } from 'react';


import { Button, Table, Typography, Input, Form, Select, Space, Tree   } from 'antd';
import Highlighter from "react-highlight-words";
import axios from './axios-settings'

import { DownOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const SearchApp = () => {
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
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
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

  const selectSource = (e) => {
    let searchString = e;
    setSearchOptions({
      ...searchOptions,
      source: searchString,
    });
  }

  const onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  }

  const getBeneficiaries = () => {
    setLoading(true);
    axios.get(`/beneficiaries`,{params: searchOptions})
      .then(function (response) {
        setLoading(false);
        let APIResponse = response.data.data;
        APIResponse.map(item => {
          item.key = item.id;
          return item;
        })
        setBeneficiaries(APIResponse);
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
    axios.get(`/beneficiaries/statistics/source`,{params: searchOptions})
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
    axios.get(`/beneficiaries/statistics/category`,{params: searchOptions})
      .then(function (response) {
        setLoading(false);
        let APIResponse = response.data.data;
        APIResponse.map((item, index) => {
          item.key = `category_statistic_${index}`;
          item.title = `${item.category}: ${item.category_count}`;
          return item;
        })
        for (let index = 0; index < sourceResponse.length; index++) {
          sourceResponse[index].children = APIResponse.filter(item => item.source == sourceResponse[index].source)
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
    axios.get(`/beneficiaries/barangays`,{params: searchOptions})
    .then(function (response) {
      setLoading(false);
      let APIResponse = response.data.data;
      APIResponse.map((item, index) => {
        item.key = `barangay_${index}`;
        return item;
      })
      setBarangays(APIResponse);
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
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
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



  const populateBarangaySelection = () => {
    let children = [];
    barangays.map(item => {
    children.push(<Option key={item.key} value={item.barangay_name}  label={item.barangay_name}>{item.barangay_name}, {item.city_name}</Option>);
    });
    return children;
  }
  const populateSourceSelection = () => {
    let children = [];
    sourceStatistics.map(item => {
    children.push(<Option key={item.key} value={item.source}  label={item.source}>{item.source}</Option>);
    });
    return children;
  }

  return (
    <div>
        <Form name="normal_login" className="login-form" layout="inline" onFinish={getBeneficiaries} >
            <Form.Item name="username">
                <Input autoComplete="off" placeholder="Search" allowClear onChange={(e) => {queryString(e)}} style={{width: "250px"}}  />
            </Form.Item>
            <Form.Item name="barangay">
                <Select
                allowClear
                mode="multiple"
                style={{ width: '300px' }}
                placeholder="Barangay"
                onChange={selectBarangay}
                optionLabelProp="label"
                >
                { populateBarangaySelection() }
                </Select>
            </Form.Item>
            <Form.Item name="source">
                <Select
                allowClear
                style={{ width: '120px' }}
                placeholder="Source"
                onChange={selectSource}
                >
                { populateSourceSelection() }
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
            <div className="table-responsive">
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
                    <p style={{ margin: 0 }}>Address: <b>{record.address}, {record.province_name}</b></p>
                    <p style={{ margin: 0 }}>Payment Category: <b>{record.payment_category}</b></p>
                    <p style={{ margin: 0 }}>Payout Branch: <b>{record.payout_branch}</b></p>
                    <p style={{ margin: 0 }}>Payout Partner: <b>{record.payout_partner}</b></p>
                    <p style={{ margin: 0 }}>
                    Cash Out Reference Number:&nbsp;
                    <b>
                        <Highlighter
                        highlightStyle={{ backgroundColor: '#ffe4bf', padding: 0 }}
                        searchWords={keywords}
                        autoEscape={true}
                        textToHighlight={`${record.cash_out_ref_number ? record.cash_out_ref_number : ""}`}
                        />
                    </b>
                    </p>
                    <p style={{ margin: 0 }}>Payout Schedule: <b>{record.schedule}</b></p>
                    <p style={{ margin: 0 }}>Batch and Part: <b>{record.batch_part}</b></p>
                    <p style={{ margin: 0 }}>Starpay Disbursement Status: <b>{record.starpay_status}</b></p>
                </div>);
                },
            }}
            />
            </div>
            <Title level={3}>Total Records: {statisticsTotal}</Title>

            <Tree
                showLine
                switcherIcon={<DownOutlined />}
                defaultExpandAll={true}
                onSelect={onSelect}
                treeData={statistics}
            />
    </div>
  );
}

export default SearchApp;
