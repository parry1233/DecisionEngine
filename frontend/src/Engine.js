import React from "react";
import { Link } from "react-router-dom";
import { Badge, Button, Input, Label, Row } from "reactstrap";
import './template/title.css'
import axios from "axios";

class Engine extends React.Component{
    
    //constructor
    constructor(props) {
        super(props);
        this.state = {
          libList: [],
          variables: [],
          circular: false,
          var_in: {},
          varmap: {},
          results:{},
          activeLib: {"fk": -1, "type": ""},
        };
    }
    
    componentDidMount() {
        this.getVariable();
    }


    //function
    getVariable = (t) => {
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
                let varIN = {};
                res.data.map((variable) => {
                    varIN[variable["id"]] = "";
                })
                this.setState({ 
                    variables: res.data,
                    var_in : varIN
                });
            })
            .catch((err) => console.log(err));
    };

    getLib = (t) => {
        let api = ""
        if(t==="sc") { api = "ScoreCardLibrary/" }
        else if(t==="dt") { api = "DecisionTreeLibrary/" }
        else if(t==="rs") { api = "RuleSetLibrary/" }
        if(api!=="")
        {
            axios
                .get("/api/"+api)
                .then((res) => {
                    this.setState({ libList: res.data });
                })
                .catch((err) => console.log(err));
        }
        else
        {
            this.setState({ libList: [] })
        }
        
    };

    handleChange = (e) => {
        let { name, value } = e.target;
        
        if(name==="type")
        {
            let activeLib = this.state.activeLib;
            activeLib[name] = value;
            activeLib["fk"] = -1;
            let results = {};
            this.setState({ 
                activeLib,
                results
            });
            this.getLib(value);
        }
        else if(name==="fk")
        {
            let activeLib = this.state.activeLib;
            let results = {};
            activeLib[name] = value;
            this.setState({ 
                activeLib,
                results 
            });
        }
        else if(name==="circular")
        {
            let circular = this.state.circular;
            circular = value;
            this.setState({ circular });
        }
    };

    handleVarChange = (e) => {
        let { name, value } = e.target;
        
        let var_in = this.state.var_in;
        var_in[name] = value;
        this.setState({ var_in });
    };

    renderLib = () => {
        return this.state.libList.map((lib)=>(
            <option key={lib["id"]} value = {lib["id"]}>{lib["name"]}</option>
        ));
    }

    renderVar = () => {
        return this.state.variables.map((eachVariable,index)=>(
            <tr key = {eachVariable["id"]}>
                <td> {eachVariable["id"]} </td>
                <td> {eachVariable["name"]} </td>
                <td> {eachVariable["datatype"]} </td>
                <td>
                    <Input
                        type="text"
                        id={"VAR"+eachVariable["id"]}
                        name={eachVariable["id"]}
                        value={eachVariable["operator"]}
                        onChange={(event) => this.handleVarChange(event)}
                        placeholder="Enter Variable Data"
                    />
                </td>
            </tr>
        ));
    };
    renderResult = () => {
        if(this.state.activeLib.type==="sc")
        {
            return (
                <table className="table mt-4">
                    <thead>
                        <tr>
                            <th>Total</th>
                            <th>Satisfy</th>
                            <th>Varmap</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                {this.state.results.total}
                            </td>
                            <td>
                                <div className="d-flex flex-column align-items-start">{this.state.results.satisfy?.map((s,index) => <span key={`sat_`+index} className={`badge mb-2 text-white ${s? `bg-success`:`bg-danger`}`}>{s.toString()}</span>)}</div>
                            </td>
                            <td>
                                <div className="d-flex flex-column align-items-start">{this.state.results.varmap?.map((v) => <span key={`varmap_`+v.id} className={"badge mb-2 text-white bg-secondary"}>{v.name} : {v.value.toString()}</span>)}</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            );
        }
        else if(this.state.activeLib.type==="dt")
        {
            return (
                <table className="table mt-4">
                    <thead>
                        <tr>
                            <th>Log</th>
                            <th>Varmap</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                {this.state.results.log}
                            </td>
                            <td>
                                <div className="d-flex flex-column align-items-start">{this.state.results.varmap?.map((v) => <span key={`varmap_`+v.id} className={"badge mb-2 text-white bg-secondary"}>{v.name} : {v.value.toString()}</span>)}</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            );
        }
        else if(this.state.activeLib.type==="rs")
        {
            return (
                <table className="table mt-4">
                    <thead>
                        <tr>
                            <th>Log</th>
                            <th>Varmap</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div className="d-flex flex-column align-items-start">{this.state.results.log?.map((l,index) => <span key={`rs_log_`+index} className={`badge mb-2 text-white ${l.split(' ')[1]==='fire'? `bg-danger`:`bg-success`}`}>{l.toString()}</span>)}</div>
                            </td>
                            <td>
                                <div className="d-flex flex-column align-items-start">{this.state.results.varmap?.map((v) => <span key={`varmap_`+v.id} className={"badge mb-2 text-white bg-secondary"}>{v.name} : {v.value.toString()}</span>)}</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            );
        }
        else
        {
            return
        }
    }

    result = () => {
        let api = ""
        const type = this.state.activeLib.type;
        const fk = this.state.activeLib.fk
        if(type==="sc") { api = "/ScoreCardEngine/" }
        else if(type==="dt") { api = "/DecisionTreeEngine/" }
        else if(type==="rs") { api = "/RuleSetEngine/" }

        let varmap = {};
        const varIn = this.state.var_in;
        const varKeys = Object.keys(varIn);
        varKeys.map((key,index) => {
            if(varIn[key]!=="")
            {
                varmap[key] = varIn[key];
            }
        })

        if((api==="/ScoreCardEngine/" || api ==="/DecisionTreeEngine/") && fk !== -1)
        {
            axios
            .post(`${api}`,
            {
                //here is body(data)
                'fk': fk,
                'varmap': varmap
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
                        alert(res.data["error"]);
                    }
                }
                const results = res.data;
                this.setState({ results });
            })
            .catch((err) => console.log(err));
        }
        else if(api==="/RuleSetEngine/" && fk !== -1)
        {
            axios
            .post(`${api}`,
            {
                //here is body(data)
                "fk": fk,
                "circular": this.state.circular,
                "varmap": varmap
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
                        alert(res.data["error"]);
                    }
                }
                const results = res.data;
                this.setState({ results });
            })
            .catch((err) => console.log(err));
        }
    }


    //render html
    render(){
        return(
            <div>
                <div className="header">
                    <h2>Business Enginess</h2>
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
                    <Label for="libSelect">Choose Library</Label>
                    <select id="libSelect" name="type" value={this.state.type} onChange={(event) => this.handleChange(event)}>
                        <option key={-1} value = {""}></option>
                        <option key={0} value = {"sc"}>Score Card</option>
                        <option key={1} value = {"dt"}>Decision Tree</option>
                        <option key={2} value = {"rs"}>Rule Set</option>
                    </select>
                    <select id="libListSelect" name="fk" value={this.state.activeLib["fk"]} onChange={(event) => this.handleChange(event)}>
                        <option key={-1} value = {-1}></option>
                        {this.renderLib()}
                    </select>
                </div>

                <div className="container py-3">
                    <table className="table mt-4">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Data Type</th>
                                <th>參數</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderVar()}
                        </tbody>
                    </table>
                    <Label for="rs_circular">Rule Set Circular (For Rule Set Engine)</Label>
                    <select id="rs_circular" name="circular" value={this.state.circular} onChange={(event) => this.handleChange(event)}>
                        <option key={-1} value = {""}></option>
                        <option key={0} value = {true}>TRUE</option>
                        <option key={1} value = {false}>FALSE</option>
                    </select>
                </div>
                <div className="container py-3">
                    <button
                        className="btn btn-primary"
                        onClick={() => this.result()}
                        >
                         Result
                    </button>
                </div>
                <div className="container py-3">
                    {this.renderResult()}
                </div>
            </div>
            
        );
    }
}

export default Engine;