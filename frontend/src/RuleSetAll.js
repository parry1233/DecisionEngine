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
            modal: false,
            new_modal: false,
            activeCard:[],
            type: -1

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
            .get(`/api/RuleSetPool/`)
            .then((res => {
                this.setState( { cardList:res.data } );
            }))
            .catch((err) => console.log(err));
    };

    toggle = () => {
        this.setState({ modal: !this.state.modal });
        this.refreshList();
    };

    edit = (item,etype,id) => {
        //console.log(item)
        //etype=1(edit varaible); etype=2(edit score)
        this.setState( { activeCard: item, type: etype, case_id: id, modal: !this.state.modal } );
    };

    renderRuleSet = () => {
        const cards = this.state.cardList;

        return cards.map((eachCard)=>(
            <tr key = {eachCard["id"]}>
                <td> {eachCard["id"]} </td>
                <td>
                    {eachCard["rule"].map((eachrule) => {return (
                        <table key= {eachCard["id"]}>
                            <thead>
                                <th>variable</th>
                                <th>name</th>
                                <th>datatype</th>
                                <th>operator</th>
                                <th>value</th>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{eachrule["variable"]}</td>
                                    <td>{eachrule["name"]}</td>
                                    <td>{eachrule["datatype"]}</td>
                                    <td>{eachrule["operator"]}</td>
                                    <td>{eachrule["value"].toString()}</td>
                                </tr>
                            </tbody> 
                        </table>
                    ); })}
                </td>
                <td>
                    {eachCard["action"] ? eachCard["action"].map((eachaction) => {
                        return (
                            <table key={eachCard["id"]}>
                                <thead>
                                    <th>method</th>
                                    <th>content</th>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{eachaction["method"]}</td>
                                        <td>
                                            {eachaction["content"]["id"] ? ` id = ${eachaction["content"]["id"]}\n`:``}
                                            {eachaction["content"]["value"] ? ` val = ${eachaction["content"]["value"]}\n`:``}
                                            {eachaction["content"]["log"] ? ` log = ${eachaction["content"]["log"]}\n`:``}
                                        </td>
                                    </tr>
                                </tbody> 
                            </table>
                        );
                    } ) : <td>(null)</td> }
                </td>
                <td>
                    {eachCard["naction"] ? eachCard["naction"].map((eachaction) => {
                        return (
                            <table key={eachCard["id"]}>
                                <thead>
                                    <th>method</th>
                                    <th>content</th>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{eachaction["method"]}</td>
                                        <td>
                                            {eachaction["content"]["id"] ? ` id = ${eachaction["content"]["id"]}\n`:``}<br/>
                                            {eachaction["content"]["value"] ? ` val = ${eachaction["content"]["value"]}\n`:``}
                                            {eachaction["content"]["log"] ? ` log = ${eachaction["content"]["log"]}\n`:``}
                                        </td>
                                    </tr>
                                </tbody> 
                            </table>
                        );
                    } ) : <td>(null)</td> }
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
                    <Link to="/" className="btn btn-secondary mr-2">
                        Home
                    </Link>
                    <Link to="/ScoreLibrary" className="btn btn-secondary mr-2">
                        Score Library
                    </Link>
                    <Link to="/VariableLibrary" className="btn btn-secondary mr-2">
                        Variable Library
                    </Link>
                    <Link to="/RuleSetLibrary" className="btn btn-secondary mr-2">
                        Rule Set Library
                    </Link>
                </div>

                <div className="container py-3">
                    <table className="table mt-4">
                        <thead>
                            <tr>
                                <th>ID</th>
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
                {this.state.modal ? (
                        <ScoreModal
                            activeCard={this.state.activeCard}
                            active = {this.state.type}
                            toggle={this.toggle}
                            onSave={this.onSave}
                        />
                    ) : null}
                {this.state.new_modal ? (
                        <AddScoreModal
                            existVariable={this.state.activeCard}
                            toggle={this.toggle}
                            onAdd={this.onAdd}
                        />
                    ) : null}
            </div>
            
        );
    }
}

export default RuleSetAll;