import React from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from  './Home';
import ScoreLibrary from './ScoreLibrary';
import VariableLibrary from './VariableLibrary';
import VariableAll from "./VariableAll";
import Variable from "./Variable";
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
                    <Route path="/VariableLibrary" element={<VariableLibrary />} />
                    <Route path="/VariableAll" element={<VariableAll />} />
                    <Route path="/Variable" element={<Variable />} />
                </Routes>
            </Router>
        );
    }
}

export default App;