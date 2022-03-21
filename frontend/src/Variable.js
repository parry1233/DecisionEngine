import React from "react";
import { Link,useLocation } from "react-router-dom";
import VariableModal from "./components/VariableModal";
import AddVariableModal from "./components/AddVariableModal";
import axios from "axios";

class Varaible extends React.Component{
    
    //constructor
    constructor(props){
        super(props);
        this.case_info = this.props.case_info;
        //console.log(this.case_info);
        this.state = {  
            vList: [],
            modal: false,
            new_modal: false,
            activeCard:[],
            allDType :[]
        }
    }

    componentDidMount() {
        //this.getParams();
        this.refreshList();
    }

    //function

    openNew = (id) => {
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
                //console.log(res.data["names"])
                //console.log(res.data)
    
                this.setState({
                    allDType: res.data,
                    new_modal: !this.state.new_modal });
                //console.log(this.state.activeCase)
            })
            .catch((err) => console.log(err));

        //this.setState( { case_id: id, modal: !this.state.modal } );
    };

    onAdd = (item) => {
        axios
            .post(`/api/VariablePool/`,
            {
                //here is body(data)
                'name': `${item["name"]}`,
                'datatype': `${item["datatype"]}`,
                'fk': this.case_info.id
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
                this.new_toggle();
                //this.setState({
                //    activeCase: res.data,
                //    modal: !this.state.modal });
                //console.log(this.state.activeCase)
            })
            .catch((err) => console.log(err));
    };

    onSave = (item) => {
        //console.log(item);
        axios
            .put(`/api/VariablePool/${item["id"]}/`,
            {
                //here is body(data)
                'fk': this.case_info.id,
                'name': `${item["name"]}`,
                'datatype': `${item["datatype"]}`
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
            .get(`/api/VariablePool/link/${this.props.case_info.id}`)
            .then((res => {
                this.setState( { vList:res.data } );
            }))
            .catch((err) => console.log(err));
    };

    toggle = () => {
        this.setState({ modal: !this.state.modal });
        this.refreshList();
    };

    new_toggle = () => {
        this.setState({ new_modal: !this.state.new_modal });
        this.refreshList();
    };

    edit = (item) => {
        /*
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
    
                this.setState({
                    allCardPool: res.data,
                    activeCard: item,
                    type: etype,
                    modal: !this.state.modal
                });
                //console.log(this.state.activeCase)
            })
            .catch((err) => console.log(err));
        */
        //console.log(item)
        //etype=1(edit varaible); etype=2(edit score)
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
                //console.log(res.data["names"])
                //console.log(res.data)
    
                this.setState({
                    allDType: res.data,
                    activeCard: item, 
                    modal: !this.state.modal
                });
                //console.log(this.state.activeCase)
            })
            .catch((err) => console.log(err));
    };

    renderVariable = () => {
        const variables = this.state.vList;

        return variables.map((eachVariable)=>(
            <tr key = {eachVariable["id"]}>
                <td> {eachVariable["id"]} </td>
                <td> {eachVariable["name"]} </td>
                <td> {eachVariable["datatype"]} </td>
                <td>
                    <button className="btn btn-warning mr-2" onClick={() => this.edit(eachVariable)}>
                        Edit
                    </button>
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
                <div>This is Varaible!</div>
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
                    <Link to="/DecisionTreeLibrary" className="btn btn-secondary mr-2">
                        Decision Tree Library
                    </Link>
                </div>

                <div className="container py-3">
                    <table className="table mt-4">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Data Type</th>
                                <th>編輯</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderVariable()}
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
                        <VariableModal
                            activeCard={this.state.activeCard}
                            existDType={this.state.allDType}
                            toggle={this.toggle}
                            onSave={this.onSave}
                        />
                    ) : null}
                {this.state.new_modal ? (
                        <AddVariableModal
                            fk = {this.props.case_info.id}
                            existDType={this.state.allDType}
                            toggle={this.new_toggle}
                            onAdd={this.onAdd}
                        />
                    ) : null}
            </div>
            
        );
    }
}

export default function(props){
    const {state} = useLocation();
    //console.log(state);

    return <Varaible {...props} case_info = {state} />;
};