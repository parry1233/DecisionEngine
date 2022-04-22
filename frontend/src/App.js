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
import Login from './Login';
import useToken from './components/UseToken';
import { useState } from 'react';
import axios from "axios";
import Cookies from 'universal-cookie'

export default function App(){
    //const { token, setToken } = useToken();
    const cookies = new Cookies();
    const retreiveToken = () => {
        const tokenString = cookies.get('token');
        return tokenString
        //const tokenString = sessionStorage.getItem('token');
        //const userToken = JSON.parse(tokenString);
        //return userToken?.token
    };

    const [token, setToken] = useState(retreiveToken());

    const saveToken = userToken => {
        cookies.set('token', userToken, {path:'/'});
        //sessionStorage.setItem('token', JSON.stringify(userToken));
        setToken(userToken);
    };

    const resetToken = (userToken,id,pw) => {
        cookies.remove('token',{path:'/'});
        //setToken(retreiveToken());
        window.location.reload();
        
        /*
        axios
        .post(`/api/Logout/`,
        {
            //here is body(data)
            'username': `${id}`,
            'password': `${pw}`,
            'token': `${retreiveToken()}`
        },
        {
            headers:{
                //here is headers for token and cookies
                'token': `${retreiveToken()}`
            }
        })
        .then((res) => {
            if(res.data)
            {
                if(res.data["logout"]==="success")
                {
                    cookies.remove('token',{path:'/'});
                    window.location.reload();
                }
                if(res.data["error"])
                {
                    alert(res.data["error"])
                }
            }
        })
        .catch((err) => console.log(err));
        */
    }

    
    if(!token) {
        return <Login setToken={saveToken} />
    }
    else{
        //return <App/>
        return (
            <Router>
                <Routes>
                    <Route exact path="/" element={<Home getToken={retreiveToken} removeToken={resetToken} />} />
                    <Route path="/ScoreLibrary" element={<ScoreLibrary getToken={retreiveToken} />} />
                    <Route path="/ScoreCard" element={<ScoreCard getToken={retreiveToken} />} />
                    <Route path="/ScoreCardAll" element={<ScoreCardAll getToken={retreiveToken} />} />
                    <Route path="/VariableLibrary" element={<VariableLibrary getToken={retreiveToken} />} />
                    <Route path="/VariableAll" element={<VariableAll getToken={retreiveToken} />} />
                    <Route path="/Variable" element={<Variable getToken={retreiveToken} />} />
                    <Route path="/RuleSetLibrary" element={<RuleSetLibrary getToken={retreiveToken} />} />
                    <Route path="/RuleSetAll" element={<RuleSetAll getToken={retreiveToken} />} />
                    <Route path="/RuleSet" element={<RuleSet getToken={retreiveToken} />} />
                    <Route path="/DecisionTreeLibrary" element={<DecisionTreeLibrary getToken={retreiveToken} />} />
                    <Route path="/DecisionTree" element={<DecisionTree getToken={retreiveToken} />} />
                    <Route path="/Engine" element={<Engine getToken={retreiveToken} />} />
                </Routes>
            </Router>
        );
    }
};