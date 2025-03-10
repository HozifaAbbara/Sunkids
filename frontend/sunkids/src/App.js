import React from 'react';
import AppLayout from './containers/AppLayout';
import { Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {


  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/reception' element={<AppLayout />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
