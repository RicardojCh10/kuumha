// routes.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Home from '../pages/Home';
import Register from '../pages/Register';




const RoutesComponent = () => {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Login />} />
                <Route path="/Register" element={<Register/>} />
                <Route path="/Home" element={<Home/>} />
            </Routes>
        </Router>
    );
};

export default RoutesComponent;
