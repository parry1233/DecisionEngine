import React from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import Modal from "./components/Modal";
import axios from "axios";

class Page1 extends React.Component{

    //constructor
    constructor(props) {
        super(props);
        this.state = {
          systemList: [],
          modal: false,
          activeCase: [],
        };
    }

    componentDidMount() {
        this.refreshList();
    }


    //function
    refreshList = () => {
        axios
          .get("/api/ScoreCardLibrary/")
          .then((res) => {
              //console.log(res.data["names"])
              this.setState({ systemList: res.data });
              
          })
          .catch((err) => console.log(err));
    };

    toggle = () => {
        this.setState({ modal: !this.state.modal });
    };

    Detail = (item) => {
        //console.log(item)
        axios
          .get(`/api/ScoreCardPool/link/${item["id"]}`,
          //{
          //    //here is body(data)
          //    'action':'get',
          //    'name':item
          //},
          //{
              //headers:{
                  //here is headers for token and cookies
                  //'token':'try4sdgsdsafsd232a84sd'
              //}
          //}
          )
          .then((res) => {
              //console.log(res.data["names"])
              //console.log(res.data)
              
              this.setState({
                  activeCase: res.data,
                  modal: !this.state.modal });
              //console.log(this.state.activeCase)
          })
          .catch((err) => console.log(err));
    };

    handleSubmit = (item) => {
        console.log(item)
        //console.log(dataIn.id)
        //console.log(item["id"])
        //console.log(dataIn.rule[0].name)
        //console.log(item["rule"][0]["name"])
    
        //this part is currently a test version for specific id api, should be POST func
        axios
          .get(`/api/ScoreCardPool/${item["id"]}`,
          //{
          //    //here is body(data)
          //    'action':'get',
          //    'name':item
          //},
          //{
              //headers:{
                  //here is headers for token and cookies
                  //'token':'try4sdgsdsafsd232a84sd'
              //}
          //}
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
      };


    renderCase = () => {
        const cases = this.state.systemList;
        //console.log(cases)
    
        return cases.map((eachCase) => (
          <li key={eachCase["id"]} className="list-group-item d-flex justify-content-between align-items-center">
            <span className={`todo-title mr-2`} title={eachCase["name"]}>
              {eachCase["name"]}
            </span>
            <span>
              <button className="btn btn-secondary mr-2" onClick={() => this.Detail(eachCase)}>
                Score Card Detail
              </button>
              <button className="btn btn-danger">
                Tree Detail
              </button>
            </span>
          </li>
        ));
    };


    //render html
    render(){
        return(
            <div>
                <div>This is Page1!</div>
                <div>
                    <Link to="/" className="btn btn-secondary mr-2">
                        Home
                    </Link>
                    <Link to="/Page1" className="btn btn-secondary mr-2">
                        Page 1
                    </Link>
                    <Link to="/Page2" className="btn btn-secondary mr-2">
                        Page 2
                    </Link>
                </div>
                <main className="container">
                    <h1 className="text-black text-uppercase text-center my-4">Score Card</h1>
                    <div className="row">
                        <div className="col-md-6 col-sm-10 mx-auto p-0">
                            <div className="card p-3">
                                <div className="mb-4">
                                    <button
                                        className="btn btn-primary"
                                        //onClick={this.createItem}
                                    >
                                        Add task
                                    </button>
                                </div>
                                <ul className="list-group list-group-flush border-top-0">
                                    {this.renderCase()}
                                </ul>
                            </div>
                        </div>
                    </div>
                    {this.state.modal ? (
                        <Modal
                            activeItem={this.state.activeCase}
                            toggle={this.toggle}
                            onSave={this.handleSubmit}
                        />
                    ) : null}
                </main>
            </div>
            
        );
    }
}

export default Page1;