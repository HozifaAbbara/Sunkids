import React, { useState } from 'react';
import AppLayout from './containers/AppLayout';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {

  const [endpoint, setEndPoint] = useState('child/children');
  const [appName, setAppName] = useState('child');
  const [modelName, setModelName] = useState('child');

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login endpoint={endpoint} />} />
        <Route element={<ProtectedRoute />}>
          <Route path='*' element={<AppLayout endpoint={endpoint} setEndPoint={setEndPoint}
            appName={appName} setAppName={setAppName} modelName={modelName} setModelName={setModelName} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
