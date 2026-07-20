import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import TimeZoneSelector from './components/TimeZoneSelector';
import AddSubtractDays from './components/AddSubtractDays';
import Footer from './components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import  './App.css'


function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <div className="container">
                    <Routes>
                        <Route path="/" element={<TimeZoneSelector />} />
                        <Route path="/add-subtract" element={<AddSubtractDays />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
