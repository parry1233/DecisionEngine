import React from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import LibraryModal from "./components/LibraryModal";
import './template/title.css'
import axios from "axios";

class RuleSetLibrary extends React.Component{
    
    //constructor
    constructor(props) {
        super(props);
        this.state = {
          systemList: [],
          libModal:false,
          activeCase: [],
          activeLib: {"id": -1, "name": ""},
        };
    }
    
    componentDidMount() {
        this.refreshList();
    }


    //function
    refreshList = () => {
        axios
          .get("/api/RuleSetLibrary/")
          .then((res) => {
              //console.log(res.data["names"])
              this.setState({ systemList: res.data });
              
          })
          .catch((err) => console.log(err));
    };

    new_Toggle = () => {
        this.setState({ libModal: !this.state.libModal });
        this.refreshList();
    };

    edit = (id,name) => {
        this.setState({
            activeLib: {"id":id, "name":name},
            libModal: !this.state.libModal,
        });
    };

    onAdd = (id,nameIn,type) => {
        //console.log(id+' '+nameIn+' '+type);
        if(type === 1) // this is add
        {
            axios
            .post(`/api/RuleSetLibrary/`,
            {
                //here is body(data)
                'name': nameIn,
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
                this.new_Toggle();
                //this.setState({
                //    activeCase: res.data,
                //    modal: !this.state.modal });
                //console.log(this.state.activeCase)
            })
            .catch((err) => console.log(err));
        }
        else if(type === 2) //this is edit
        {
            axios
            .put(`/api/RuleSetLibrary/${id}/`,
            {
                //here is body(data)
                'name': nameIn,
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
                this.new_Toggle();
                //this.setState({
                //    activeCase: res.data,
                //    modal: !this.state.modal });
                //console.log(this.state.activeCase)
            })
            .catch((err) => console.log(err));
        }
        
    };

    onDel = (id) => {
        axios
        .delete(`/api/RuleSetLibrary/${id}`,
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
            
            this.refreshList();
                
            //this.setState({
            //    activeCase: res.data,
            //    modal: !this.state.modal });
            //console.log(this.state.activeCase)
        })
        .catch((err) => console.log(err));
    }


    renderCase = () => {
        const cases = this.state.systemList;
        //console.log(cases)
    
        return cases.map((eachCase) => (
          <li key={eachCase["id"]} className="list-group-item d-flex justify-content-between align-items-center">
            <span className={`todo-title mr-2`} title={eachCase["name"]}>
              {eachCase["name"]}
            </span>
            <span>
              <Link className="btn btn-info mr-2" to={`/RuleSet`} state ={{id:eachCase["id"], name:eachCase["name"]}}>
                Rule Set
              </Link>
              <button className="btn btn-secondary mr-2" onClick={() => this.edit(eachCase["id"],eachCase["name"])}>
                Edit
              </button>
              <button className="btn btn-danger mr-2" onClick={() => this.onDel(eachCase["id"])}>
                Delete
              </button>
            </span>
          </li>
        ));
    };


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
                <main className="container">
                    <h1 className="text-black text-uppercase text-center my-4">Rule Set Library</h1>
                    <div className="row">
                        <div className="col-md-6 col-sm-10 mx-auto p-0">
                            <div className="card p-3">
                                <div className="mb-4">
                                    <button
                                        className="btn btn-primary mr-2"
                                        onClick={() => this.edit(-1,"")}
                                    >
                                        Add Library
                                    </button>
                                    <Link to ="/RuleSetAll"
                                        className="btn btn-warning mr-2"
                                        //onClick={this.createItem}
                                    >
                                        View All Rule Set
                                    </Link>
                                </div>
                                <ul className="list-group list-group-flush border-top-0">
                                    {this.renderCase()}
                                </ul>
                            </div>
                        </div>
                    </div>
                    {this.state.libModal ? (
                        <LibraryModal
                            libInfo={this.state.activeLib}
                            toggle={this.new_Toggle}
                            onAdd={this.onAdd}
                            type={this.state.EditLibType}
                        />
                    ) : null}
                </main>
            </div>
            
        );
    }
}

export default RuleSetLibrary;