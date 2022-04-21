import React from "react";
import { Link } from "react-router-dom";
import './template/title.css'
import axios from "axios";
import { Button } from "reactstrap";
import useToken from "./components/UseToken";

class Home extends React.Component{
    
    //function
    constructor(props){
        super(props)
        this.state = {
            dtLib: [],
            scLib: [],
            varLib: [],
            ruleLib: [],
        }
    }
    componentDidMount(){
        this.refreshLibs();
    }

    refreshLibs = () => {
        axios
          .get("/api/ScoreCardLibrary/")
          .then((res) => {
              //console.log(res.data["names"])
              this.setState({ scLib: res.data });
              
          })
          .catch((err) => console.log(err));
        axios
          .get("/api/DecisionTreeLibrary/")
          .then((res) => {
              //console.log(res.data["names"])
              this.setState({ dtLib: res.data });
              
          })
          .catch((err) => console.log(err));
        axios
          .get("/api/VariableLibrary/")
          .then((res) => {
              //console.log(res.data["names"])
              this.setState({ varLib: res.data });
              
          })
          .catch((err) => console.log(err));
        axios
          .get("/api/RuleSetLibrary/")
          .then((res) => {
              //console.log(res.data["names"])
              this.setState({ ruleLib: res.data });
              
          })
          .catch((err) => console.log(err));
    }

    renderSCLib = () => {
        return this.state.scLib.map((eachCase) => (
            <li key={eachCase["id"]}>
                <Link to={`/ScoreCard`} state ={{id:eachCase["id"], name:eachCase["name"]}}>
                    {eachCase["name"]}
                </Link>
            </li>
        ));
    };

    renderDTLib = () => {
        return this.state.dtLib.map((eachCase) => (
            <li key={eachCase["id"]}>
                <Link to={`/DecisionTree`} state ={{id:eachCase["id"], name:eachCase["name"]}}>
                    {eachCase["name"]}
                </Link>
            </li>
        ));
    }

    renderVarLib = () => {
        return this.state.varLib.map((eachCase) => (
            <li key={eachCase["id"]}>
                <Link to={`/Variable`} state ={{id:eachCase["id"], name:eachCase["name"]}}>
                    {eachCase["name"]}
                </Link>
            </li>
        ));
    }

    renderRuleLib = () => {
        return this.state.ruleLib.map((eachCase) => (
            <li key={eachCase["id"]}>
                <Link to={`/RuleSet`} state ={{id:eachCase["id"], name:eachCase["name"]}}>
                    {eachCase["name"]}
                </Link>
            </li>
        ));
    }

    logout = () => {
        this.props.removeToken(this.props.getToken(),'aaa','bbb')
    }

    //render html
    render(){
        return(
            <div>
                <div className="header">
                    <img src={require('./img/1200px-O-Bank_logo.png')} size="small" width="150"/>
                    <h2>O-Bank Decision Engine</h2>
                    <hr/>
                </div>
                <div className="menu-bar">
                    <ul>
                        <li>
                            <a href="/">Home</a>
                        </li>
                        <li>
                            <Link to="/ScoreLibrary">Score Card</Link>
                            <ul>
                                {this.renderSCLib()}
                            </ul>
                        </li>
                        <li>
                        <Link to="/DecisionTreeLibrary">Decision Tree</Link>
                            <ul>
                                {this.renderDTLib()}
                            </ul>
                        </li>
                        <li>
                            <Link to="/VariableLibrary">Variable</Link>
                            <ul>
                                {this.renderVarLib()}
                            </ul>
                        </li>
                        <li>
                            <Link to="/RuleSetLibrary">Rule Set</Link>
                            <ul>
                                {this.renderRuleLib()}
                            </ul>
                        </li>
                        <li>
                            <Link to="/Engine">Engine</Link>
                        </li>
                        <li className="float-right">
                            <Link to="#" className="disabledCursor float-right" onClick={()=>this.logout()}>Logout</Link>
                        </li>
                    </ul>
                </div>
            </div>
            
        );
    }
}

export default function(){
    const {getToken, removeToken} = useToken();
    return <Home getToken={getToken} removeToken = { removeToken }/>;
};