import React from "react";
import { Link,useLocation } from "react-router-dom";
import ScoreModal from "./components/ScoreModal";
import AddScoreModal from "./components/AddScoreModal";
import axios from "axios";

class ScoreCardAll extends React.Component{
    
    //constructor
    constructor(props){
        super(props);
        //console.log(this.case_info);
        this.state = {  
            cardList: [],
            modal: false,
            new_modal: false,
            activeCard:[],
            type: -1,
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

    openNew = () => {
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
                console.log(res.data)
    
                //this.setState({
                //    activeCase: res.data,
                //    modal: !this.state.modal });
                //console.log(this.state.activeCase)
            })
            .catch((err) => console.log(err));

        //this.setState( { case_id: id, modal: !this.state.modal } );
    };

    onAdd = () => {
        
    };

    ruleParse = (item) => {
        console.log(item);
        let rule = `[`
        for(var i = 0; i<item.length;i++)
        {
            console.log(item[i]);
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
        console.log(rule);
        return rule
    };

    onSave = (item,type) => {
        //console.log(item,type);
        if(type===1)
        {
          console.log("Edit Variable");
          console.log(item)
    
          /*
          //this part is currently a test version for specific id api, should be POST func
          axios
            .put(`/api/VariablePool/${item["id"]}`,
            {
                //here is body(data)
                'name':item["rule"][0]["name"]
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
                console.log(res.data)
    
                //this.setState({
                //    activeCase: res.data,
                //    modal: !this.state.modal });
                //console.log(this.state.activeCase)
            })
            .catch((err) => console.log(err));
          */
        }
        else if(type===2)
        {
          //console.log("Edit Score");
          //console.log(item)
    
          //this part is currently a test version for specific id api, should be POST func
          axios
            .put(`/api/ScoreCardPool/${item["id"]}/`,
            {
                //here is body(data)
                'fk': this.case_info.id,
                'rule': this.ruleParse(item["rule"]),
                'weight': `${item["weight"]}`,
                'score': `${item["score"]}`
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
                alert(res.message)
                this.toggle();
                //this.setState({
                //    activeCase: res.data,
                //    modal: !this.state.modal });
                //console.log(this.state.activeCase)
            })
            .catch((err) => console.log(err));
        }
    };

    onDelete = (item) => {
        if(!this.props.getToken()) window.location.reload();
        else
        {
            axios
            .delete(`/api/ScoreCardPool/${item["id"]}/`,
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
            .get(`/api/ScoreCardPool/`)
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

    renderScoreCard = () => {
        const cards = this.state.cardList;

        return cards.map((eachCard)=>(
            <tr key = {eachCard["id"]}>
                <tr>
                    <table>
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
                </tr>
                <td> {eachCard["description"]} </td>
                <td> {eachCard["weight"]} </td>
                <td> {eachCard["score"]} </td>
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
                <div>This is View  All ScoreCard Pool!</div>
                <div>
                    <a href="/" className="btn btn-secondary mr-2">
                        Home
                    </a>
                    <a href="/ScoreLibrary" className="btn btn-secondary mr-2">
                        Back
                    </a>
                </div>

                <div className="container py-3">
                    <table className="table mt-4">
                        <thead>
                            <tr>
                                <th>規則</th>
                                <th>描述</th>
                                <th>權重</th>
                                <th>分數</th>
                                <th>編輯</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderScoreCard()}
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

export default ScoreCardAll;