import React from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from  './Home';
import ScoreLibrary from './ScoreLibrary';
import Page2 from './Page2';
import ScoreCard from "./ScoreCard";
import ScoreCardAll from "./ScoreCardAll";

class App extends React.Component{
    render(){
        return(
            <Router>
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route path="/ScoreLibrary" element={<ScoreLibrary />} />
                    <Route path="/ScoreCard" element={<ScoreCard />} />
                    <Route path="/ScoreCardAll" element={<ScoreCardAll />} />
                    <Route path="/Page2" element={<Page2 />} />
                </Routes>
            </Router>
        );
    }
}

export default App;