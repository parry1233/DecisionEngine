import React from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from  './Home';
import ScoreLibrary from './ScoreLibrary';
import VariableLibrary from './VariableLibrary';
import VariableAll from "./VariableAll";
import Variable from "./Variable";
import ScoreCard from "./ScoreCard";
import ScoreCardAll from "./ScoreCardAll";
import RuleSetLibrary from "./RuleSetLibrary";
import RuleSetAll from "./RuleSetAll";
import RuleSet from "./RuleSet";
import DecisionTreeLibrary from "./DecisionTreeLibrary";
import DecisionTree from "./DecisionTree";
import Engine from "./Engine";


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
                    <Route path="/RuleSetLibrary" element={<RuleSetLibrary />} />
                    <Route path="/RuleSetAll" element={<RuleSetAll />} />
                    <Route path="/RuleSet" element={<RuleSet />} />
                    <Route path="/DecisionTreeLibrary" element={<DecisionTreeLibrary />} />
                    <Route path="/DecisionTree" element={<DecisionTree />} />
                    <Route path="/Engine" element={<Engine />} />
                </Routes>
            </Router>
        );
    }
}

export default App;