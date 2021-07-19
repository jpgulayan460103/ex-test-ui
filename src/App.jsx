import React, { useState, useEffect } from 'react';
import SearchApp from './SearchApp'
import Login from './Login'
import Layout from './Layout'
import './styles.css';
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {

  return (
    <div className="App">
      <Layout>
        {/* <SearchApp /> */}
        <Login />
      </Layout>
    </div>
  );
}

export default App;
