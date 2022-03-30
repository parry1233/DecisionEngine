import React from "react";
import { Link,useLocation } from "react-router-dom";

import * as jsMind from "./jsmind/js/jsmind.js";
import * as jsMind_draggable from "./jsmind/js/jsmind.draggable.js"
import axios from "axios";
import "./jsmind/js/jsmind.css"
import './template/title.css'


//this page need more modify

class DecisionTree extends React.Component{
    
    //constructor
    constructor(props){
        super(props);
        this.case_info = this.props.case_info;
        //console.log(this.case_info.name);
        this.state = {  
            cardList: [],
            modal: false,
            new_modal: false,
            activeCard:[],
            type: -1,
            allCardPool :[],
            options: { // options 将在下一章中详细介绍
                container: 'jsmind_container', // [必选] 容器的ID，或者为容器的对象
                editable: false, // [可选] 是否启用编辑
                theme: 'orange' // [可选] 主题
            },
            _jm:undefined,
            nowmind:null,
            treelist:null,
            answer:null,
        }
    }

    componentDidMount() {
        //this.getParams();
        this.getTree(this.case_info.id);
//        this.refreshList();
    }

    //function

/*    openNew = (id) => {
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
                    new_modal: !this.state.new_modal });
                //console.log(this.state.activeCase)
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

    onAdd = (item) => {
        axios
            .post(`/api/ScoreCardPool/`,
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
          *//*
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
        }
    };

    onDelete = (item) => {
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
    }*/

    refreshList = () => {
        if (this.state._jm === undefined){
        //    console.log(treedata["link_list"]) 
            var jm = new jsMind(this.state.options);  
            var mind = this.state.nowmind;     
            console.log(mind);
            if (!!mind) {
                jm.show(mind);
                this.setState({_jm: jm});
            } else {
                alert('can not open this file as mindmap');
            }    
        }
    };

/*    toggle = () => {
        this.setState({ modal: !this.state.modal });
        this.refreshList();
    };

    new_toggle = () => {
        this.setState({ new_modal: !this.state.new_modal });
        this.refreshList();
    };

    edit = (item,etype) => {
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
        //console.log(item)
        //etype=1(edit varaible); etype=2(edit score)
        //this.setState( { activeCard: item, type: etype, modal: !this.state.modal } );
    };*/

    getTree = (id) =>{
        axios
          .post(`/DecisionTreeJsmind/`,{
            'fk': id,
          })
          .then((res) => {              
            this.setState({nowmind: res.data["link_list"]});
            console.log(this.state.nowmind);
            if (this.state._jm === undefined){
                //    console.log(treedata["link_list"]) 
                    var jm = new jsMind(this.state.options);  
                    var mind = jsMind.util.json.string2json(this.state.nowmind);   
                    jm.show(mind);  
                    this.setState({_jm: jm});
   
                }
          })
          .catch((err) => {
              console.log(err)
              return;
            });
    }


    //render html
    render(){
        const style = {display:"none"};
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

                <div id = "jsmind_container" >    
                </div>
                <div style={style}>
                    <input className="file" type="file" id="image-chooser" accept="image/*"/>
                </div>
            </div>
            
        );
        
    }
}

export default function(props){
    const {state} = useLocation();
    //console.log(state);

    return <DecisionTree {...props} case_info = {state} />;
};