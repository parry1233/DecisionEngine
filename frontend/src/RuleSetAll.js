import React from "react";
import { Link,useLocation } from "react-router-dom";
import ScoreModal from "./components/ScoreModal";
import AddScoreModal from "./components/AddScoreModal";
import axios from "axios";

class RuleSetAll extends React.Component{
    
    //constructor
    constructor(props){
        super(props);
        //console.log(this.case_info);
        this.state = {  
            cardList: [],
            activeCard:[],
            type: -1,
            allCardPool :[],
            allDType: {}
        }
    }

    componentDidMount() {
        //this.getParams();
        this.refreshList();
    }

    //function

    toggle = () => {
        this.setState({ modal: !this.state.modal });
    };

    
    onDelete = (item) => {
        if(!this.props.getToken()) window.location.reload();
        else
        {
            axios
            .delete(`/api/RuleSetPool/${item["id"]}/`,
            {
                //here is body(data)
            },
            {
              headers:{
                  //here is headers for token and cookies
                  'token':'try4sdgsdsafsd232a84sd'
              }
            })
            .then((res) => {
                //console.log(res.data["names"])
                //console.log(res.data)
                this.refreshList();
                //this.setState({
                //    activeCase: res.data,
                //    modal: !this.state.modal });
                //console.log(this.state.activeCase)
            })
            .catch((err) => console.log(err));
        }
    }

    refreshList = () => {
        axios
            .get(`/api/VariablePool/`)
            .then((res => {
                this.setState( { allCardPool:res.data } );
            }))
            .catch((err) => console.log(err));
           
        axios
            .get(`/staticdt/datatype/`,
            {
                //here is body(data)
            },
            {
                headers:{
                    //here is headers for token and cookies
                    'token':'try4sdgsdsafsd232a84sd'
                }
            }
            )
            .then((res) => {
                this.setState({ allDType: res.data});
            })
            .catch((err) => console.log(err));
        axios
            .get(`/api/RuleSetPool/`)
            .then((res => {
                this.setState( { cardList:res.data } );
            }))
            .catch((err) => console.log(err));
    };

    findObjectByValue = (val) => {
        return this.state.allCardPool.find(x => x.id === val);
    };

    datatypeStr = (type) => {
        let dType = this.state.allDType[type]
        if (dType==="Bool") return '布林值'
        else if (dType==="Float") return '浮點數'
        else if (dType==="Integer") return '整數'
        else return dType
    }

    operatorStr = (o) => {
        if (o==="b") return '>'
        else if (o==="e") return '='
        else if (o==="s") return '<'
        else if (o==="a") return '>='
        else if (o==="p") return '<='
        else return o
    }
    
    renderRuleSet = () => {
        const cards = this.state.cardList;

        return cards.map((eachCard)=>(
            <tr key = {eachCard["id"]}>
                <td>
                    <table key= {`rule_`+eachCard["id"]}>
                        <thead>
                            <th>name</th>
                            <th>datatype</th>
                            <th>operator</th>
                            <th>value</th>
                        </thead>
                        <tbody>
                            {eachCard["rule"].map((eachrule) => {return (
                                <tr>
                                    <td>{eachrule["name"]}</td>
                                    <td>{this.datatypeStr(eachrule["datatype"])}</td>
                                    <td>{this.operatorStr(eachrule["operator"])}</td>
                                    <td>{eachrule["value"].toString()}</td>
                                </tr>      
                            ); })}
                        </tbody>
                    </table>
                </td>
                <td>
                    <table key={`action_`+eachCard["id"]}>
                        <thead>
                            <th>method</th>
                            <th>content</th>
                        </thead>
                        <tbody>
                            {eachCard["action"] ? eachCard["action"].map((eachaction) => {
                                return (
                                    <tr>
                                        <td>{eachaction["method"]===1? `輸出`:`賦值`}</td>
                                        <td>
                                            <table>
                                                <tr>{"id" in eachaction["content"] ? `變數 : ${this.findObjectByValue(eachaction["content"]["id"]).name}`:``}</tr>
                                                <tr>{"value" in eachaction["content"] ? `變數值 : ${eachaction["content"]["value"]}`:``}</tr>
                                                <tr>{"log" in eachaction["content"] ? `${eachaction["content"]["log"]}`:``}</tr>
                                            </table>
                                        </td>
                                    </tr>
                                );
                            } ) : <td></td> }     
                        </tbody> 
                    </table>
                </td>
                <td>                            
                    <table key={`naction_`+eachCard["id"]}>
                        <thead>
                            <th>method</th>
                            <th>content</th>
                        </thead>
                        <tbody>
                            {eachCard["naction"] ? eachCard["naction"].map((eachaction) => {
                                return (
                                    <tr>
                                        <td>{eachaction["method"]===1? `輸出`:`賦值`}</td>
                                        <td>
                                            <tr>{"id" in eachaction["content"] ? `變數 : ${this.findObjectByValue(eachaction["content"]["id"]).name}`:``}</tr>
                                            <tr>{"value" in eachaction["content"] ? `變數值 : ${eachaction["content"]["value"]}`:``}</tr>
                                            <tr>{"log" in eachaction["content"] ? `${eachaction["content"]["log"]}`:``}</tr>
                                        </td>
                                    </tr> 
                                );
                            } ) : <td></td> }
                        </tbody> 
                    </table>
                </td>
                <td>
                    <button className="btn btn-danger mr-2" onClick={() => this.onDelete(eachCard)}>
                        Delete
                    </button>
                </td>
            </tr>
        ));
    };


    //render html
    render(){
        return(
            <div>
                <div>This is Rule Set All!</div>
                <div>
                    <a href="/" className="btn btn-secondary mr-2">
                        Home
                    </a>
                    <a href="/RuleSetLibrary" className="btn btn-secondary mr-2">
                        Back
                    </a>
                </div>

                <div className="container py-3">
                    <table className="table mt-4">
                        <thead>
                            <tr>
                                <th>Rule</th>
                                <th>Action</th>
                                <th>Naction</th>
                                <th>編輯</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderRuleSet()}
                        </tbody>
                    </table>
                </div>
            </div>
            
        );
    }
}

export default RuleSetAll;