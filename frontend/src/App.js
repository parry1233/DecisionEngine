import React from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from  './Home';
import Page1 from './Page1';
import Page2 from './Page2';
import DTCreact from './DTcreact';

class App extends React.Component{
    render(){
        return(
            <Router>
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route path="/Page1" element={<Page1 />} />
                    <Route path="/Page2" element={<Page2 />} />
                    <Route path="/DT" element={<DTCreact />} />
                </Routes>
            </Router>
        );
    }
}

export default App;