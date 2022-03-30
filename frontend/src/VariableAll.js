import React from "react";
import { Link,useLocation } from "react-router-dom";
import ScoreModal from "./components/ScoreModal";
import AddScoreModal from "./components/AddScoreModal";
import axios from "axios";

class VariableAll extends React.Component{
    
    //constructor
    constructor(props){
        super(props);
        //console.log(this.case_info);
        this.case_info = -1;
        this.state = {  
            vList: [],
            modal: false,
            new_modal: false,
            activeCard:[],

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
    };

    onDelete = (item) => {
        axios
            .delete(`/api/VariablePool/${item["id"]}/`,
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
            .get(`/api/VariablePool/`)
            .then((res => {
                this.setState( { vList:res.data } );
            }))
            .catch((err) => console.log(err));
    };

    toggle = () => {
        this.setState({ modal: !this.state.modal });
        this.refreshList();
    };

    edit = (item,id) => {
        //console.log(item)
        //etype=1(edit varaible); etype=2(edit score)
        if(this.case_info!==-1)
        {
            this.setState( { activeCard: item, case_id: id, modal: !this.state.modal } );
        }
        else
        {
            alert("View All Variable Page Cannot Edit Variable (Need fk)")
        }
        
    };

    datatypeStr = (type) => {
        let dType = this.state.allDType[type]
        if (dType==="Bool") return '布林值'
        else if (dType==="Float") return '浮點數'
        else if (dType==="Integer") return '整數'
        else return dType
    }

    renderVariable = () => {
        const variables = this.state.vList;

        return variables.map((eachVariable)=>(
            <tr key = {eachVariable["id"]}>
                <td> {eachVariable["name"]} </td>
                <td> {this.datatypeStr(eachVariable["datatype"])} </td>
                <td>
                    <button className="btn btn-danger mr-2" onClick={() => this.onDelete(eachVariable)}>
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
                <div>This is View All Variable Pool!</div>
                <div>
                    <Link to="/" className="btn btn-secondary mr-2">
                        Home
                    </Link>
                    <Link to="/VariableLibrary" className="btn btn-secondary mr-2">
                        Back
                    </Link>
                </div>

                <div className="container py-3">
                    <table className="table mt-4">
                        <thead>
                            <tr>
                                <th>變數名稱</th>
                                <th>資料型別</th>
                                <th>編輯</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderVariable()}
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

export default VariableAll;