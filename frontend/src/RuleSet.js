import React from "react";
import { Link,useLocation } from "react-router-dom";
import RuleSetModal from "./components/RuleSetModal";
import axios from "axios";

class RuleSet extends React.Component{
    
    //constructor
    constructor(props){
        super(props);
        this.case_info = this.props.case_info;
        //console.log(this.case_info);
        this.state = {  
            cardList: [],
            modal: false,
            activeCard:{},
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

    openNew = (id) => {
        axios
            .get(`/api/VariablePool/`,
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
                this.setState({
                    allCardPool: res.data,
                    activeCard: {
                        "id":-1,
                        "rule":[
                            {
                                "variable" : "",
                                "name" : "",
                                "datatype" : "",
                                "operator" : "",
                                "value" : ""
                            }
                        ],
                        "action":"",
                        "naction":""
                    },
                    type:1,
                    modal: !this.state.modal });
            })
            .catch((err) => console.log(err));

        //this.setState( { case_id: id, modal: !this.state.modal } );
    };

    ruleParse = (item) => {
        //console.log(item);
        let rule = `[`
        for(var i = 0; i<item.length;i++)
        {
            //console.log(item[i]);
            rule+=(`{`
                +`\"variable\":\"${item[i]["variable"]}\", `
                +`\"operator\":\"${item[i]["operator"]}\", `
                +`\"value\":\"${item[i]["value"]}\"`
                +`}`)
            
            if(i+1<item.length) rule+=`,`
        }
        rule += `]`;

        let ruleArr = []
        item.forEach((element) => {
            ruleArr.push(element)
        });
        //console.log(rule);
        return rule
    };

    actionParse = (item) => {
        //console.log(item);
        
        if(item.length>0)
        {
            try
            {
                let action = item;
                //console.log(action);
                //action = JSON.stringify(item);
                //action = JSON.stringify(JSON.stringify(item));
                //console.log(action);
                return action;
            }
            catch(e)
            {
                alert(e.message);
            }
        }
        else
        {
            return "";
        }
    };

    onAdd = (item) => {
        axios
            .post(`/api/RuleSetPool/`,
            {
                //here is body(data)
                'fk': this.case_info.id,
                'rule': this.ruleParse(item["rule"]),
                'action': this.actionParse(item["action"]),
                'naction': this.actionParse(item["naction"])
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
                if(res.data)
                {
                    if(res.data["error"])
                    {
                        alert(res.data["error"])
                    }
                }
                this.toggle();
                //this.setState({
                //    activeCase: res.data,
                //    modal: !this.state.modal });
                //console.log(this.state.activeCase)
            })
            .catch((err) => console.log(err));
    };

    onSave = (item) => {
        axios
            .put(`/api/RuleSetPool/${item["id"]}/`,
            {
                //here is body(data)
                'fk': this.case_info.id,
                'rule': this.ruleParse(item["rule"]),
                'action': this.actionParse(item["action"]),
                'naction': this.actionParse(item["naction"])
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
                if(res.data)
                {
                    if(res.data["error"])
                    {
                        alert(res.data["error"])
                    }
                }
                this.toggle();
            })
            .catch((err) => console.log(err));
    };

    onDelete = (item) => {
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
            .get(`/api/RuleSetPool/link/${this.props.case_info.id}`)
            .then((res => {
                this.setState( { cardList:res.data } );
            }))
            .catch((err) => console.log(err));      
    };

    toggle = () => {
        this.setState({ modal: !this.state.modal });
        this.refreshList();
    };

    edit = (item) => {
        axios
            .get(`/api/VariablePool/`,
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
                //console.log(res.data["names"])
                //console.log(res.data)

                let activeItem = {...item}
                //console.log(activeItem);
                activeItem["action"] = activeItem["action"]===null? "" : JSON.stringify(item["action"]);
                activeItem["naction"] = activeItem["naction"]===null? "" : JSON.stringify(item["naction"]);
                //console.log(activeItem);
    
                this.setState({
                    allCardPool: res.data,
                    activeCard: activeItem,
                    type: 2,
                    modal: !this.state.modal
                });
                //console.log(this.state.activeCase)
            })
            .catch((err) => console.log(err));
        //console.log(item)
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
                    <table key={`naction`+eachCard["id"]}>
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
                    <button className="btn btn-warning mr-2" onClick={() => this.edit(eachCard)}>
                        Edit
                    </button>
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
                        </li>
                        <li>
                            <Link to="/DecisionTreeLibrary">Decision Tree</Link>
                        </li>
                        <li>
                            <Link to="/VariableLibrary">Variable</Link>
                        </li>
                        <li>
                            <Link to="/RuleSetLibrary">Rule Set</Link>
                        </li>
                        <li>
                            <Link to="/Engine">Engine</Link>
                        </li>
                    </ul>
                </div>

                <div className="container py-3">
                    <h1 className="text-black text-uppercase text-center my-4">{this.case_info.name}</h1>
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
                    <button
                        className="btn btn-primary"
                        onClick={() => this.openNew()}
                        >
                         Add
                    </button>
                </div>
                {this.state.modal ? (
                        <RuleSetModal
                            activeCard={this.state.activeCard }
                            existVariable={this.state.allCardPool}
                            toggle={this.toggle}
                            onSave={this.state.type === 2 ? this.onSave : this.onAdd}
                        />
                    ) : null}
            </div>
            
        );
    }
}

export default function(props){
    const {state} = useLocation();
    //console.log(state);

    return <RuleSet {...props} case_info = {state} />;
};