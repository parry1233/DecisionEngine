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
            past_node:[],
            now_q_id:0,
            now_r_id:0,
            ans_type:null,
        }
    }

    componentDidMount() {
        //this.getParams();
        this.getTree(this.case_info.id);
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
        var jm = undefined;  
        var mind = undefined; 
        var id =undefined;       
        if (this.state._jm != undefined){
            mind = jsMind.util.json.string2json(this.state.nowmind);
            jm = this.state._jm
            if (this.state.now_q_id == 0 ){
                this.next_question('');
            }else{
                this.next_question(this.state.now_r_id);
            }
            jm.enable_edit();
            
            
            this.state.past_node.forEach(function(e,i){
                jm.select_node(mind["data"][e]['id']);
                
                id = jm.get_selected_node();
                console.log (id);
                jm.set_node_color(id.id , "#DAA520", null);
            })
            jm.disable_edit();
            jm.show();
            this.setState({_jm: jm});
        }
        
    };
    compare_num = (rule, ans)=>{
        var r = rule.split(' ');
        var o = [">",">=","=>","<","<=","=<","=","=="]
        var num = [];
        var state = [];
        var pass = false;
        r.forEach(function(e,i){
            num.push(Number(e));
            if (Number.isNaN(Number(e)) ){
                if (o.indexOf(r[i])>=0){
                    state.push(1);
                }else{
                    state.push(10);
                }
            }else {
                state.push(0);
            }
        });
        var o_temp = -1;
        var n_temp = -1;
        state.forEach(function(e,i){

            if (e == 0){
                n_temp = i;
            }else if (e == 1){
                o_temp = i;
            }
            if (o_temp >= 0 && n_temp >= 0){
                if (o_temp > n_temp){
                    pass = this.count_num(ans,num[n_temp],r[o_temp]);
                    n_temp = -1;
                    o_temp = -1;
                }else if (o_temp < n_temp){
                    pass = this.count_num(num[n_temp],ans,r[o_temp]);
                    n_temp = -1;
                    o_temp = -1;
                }else {
                    alert('error');
                }
            }
            
        });
        return pass ;
    }

    count_num=(a,b,o)=>{
        switch (o) {
            case ">":
                if (a>b){
                    return true;
                }else{
                    return false;
                };
                break;
            case ">=" || "=>":
                if (a>=b){
                    return true;
                }else{
                    return false;
                };
                break;
            case "<":
                if (a<b){
                    return true;
                }else{
                    return false;
                };
                break;
            case "<="||"=<":
                if (a<=b){
                    return true;
                }else{
                    return false;
                };
                break;
            case "="||"==":
                if (a==b){
                    return true;
                }else{
                    return false;
                };
                break;
            default:
                alert('沒有符合的條件');
                return undefined;
        }
    }

    judge = ()=>{
        var done = true;
        var mind = jsMind.util.json.string2json(this.state.nowmind);
        var pos = 1; 
        var ans = undefined;
        var rule = undefined;
        var past = this.state.past_node;
        var parentid=undefined;
        while( done ) {
            parentid = mind["data"][pos]["parentid"];
            if (mind["data"][pos]["parentid"] == String(this.state.now_q_id) && mind["data"][pos]["nodetype"] == "rule"){
                rule = mind["data"][pos]["topic"];
                if (this.state.ans_type == "number"){
                    ans =  document.getElementById('ans_input');
                    if (this.compare_num(rule,ans)){
                        this.setState({now_r_id:Number(mind["data"][pos]['id'])});
                        past.push(pos);
                        this.setState({past_node:past});
                        done = false;
                    }
                }else if (this.state.ans_type == "boolean"){
                    ans = document.querySelector('input[name="ans"]:checked').value;
                    if (rule.indexOf('True')>=0 && ans == "true"){
                        this.setState({now_r_id:Number(mind["data"][pos]['id'])});
                        past.push(pos);
                        this.setState({past_node:past});
                        done = false;
                    }else if (rule.indexOf('False')>=0 && ans == "false"){
                        this.setState({now_r_id:Number(mind["data"][pos]['id'])});
                        past.push(pos);
                        this.setState({past_node:past});
                        done = false;
                    }
                };
            }
            pos++;
        }
        this.refreshList() ;

    }
    next_question = (q_id) =>{
        var done = true;
        var mind = jsMind.util.json.string2json(this.state.nowmind);
        var pos = this.state.now_r_id; 
        var past = this.state.past_node;
        console.log(mind["data"][pos]["parentid"]);
        var question="";
        while( done ) {
            if (pos==0){
                console.log("try root");
                question = mind["data"][pos]["topic"];
                this.setState({now_q_id:Number(mind["data"][pos]["id"])});
                past.push(pos);
                this.setState({past_node:past});
                if ( mind["data"][pos]["retype"] == "I" || mind["data"][pos]["retype"] == "F"){
                    this.setState({ans_type:"number"});
                    return (
                        <div >
                            <table>
                                <tr>
                                    <td>{question}</td>
                                    <td>
                                        <input id = "ans_input" className = "file_input" type = "number"></input>
                                        <button className = "sub" onClick = {() => this.judge() } > next </button>
                                    </td>
                                </tr>
                            </table>
                        </div>  
                    );
                }else if ( mind["data"][pos]["retype"] == "b"){
                    this.setState({ans_type:"boolean"});
                    return (
                        <div >
                            <table>
                                <tr>
                                    <td>{question}</td>
                                    <td>
                                        <input  type="radio" name="ans" value="true"> true</input>
                                        <input  type="radio" name="ans" value="false">false</input>
                                        <button className = "sub" onClick = {() => this.judge() } > next </button>
                                    </td>
                                </tr>
                            </table>
                        </div> 
                    );
                }; 
                break;  
            }else if (mind["data"][pos]["parentid"] == String(q_id) && mind["data"][pos]["nodetype"] == "question"){
                question = mind["data"][pos]["topic"];
                this.setState({now_q_id:Number(mind["data"][pos]["id"])});
                past.push(pos);
                this.setState({past_node:past});
                if ( mind["data"][pos]["retype"] == "I" || mind["data"][pos]["retype"] == "F"){
                    this.setState({ans_type:"number"});
                    return (
                        <div >
                            <table>
                                <tr>
                                    <td>{question}</td>
                                    <td>
                                        <input id = "ans_input" className = "file_input" type = "number"></input>
                                        <button className = "sub" onClick = {() => this.judge() } > next </button>
                                    </td>
                                </tr>
                            </table>
                        </div>  
                    );
                }else if ( mind["data"][pos]["retype"] == "b"){
                    this.setState({ans_type:"boolean"});
                    return (
                        <div >
                            <table>
                                <tr>
                                    <td>{question}</td>
                                    <td>
                                        <input  type="radio" name="ans" value="true"> true</input>
                                        <input  type="radio" name="ans" value="false">false</input>
                                        <button className = "sub" onClick = {() => this.judge() } > next </button>
                                    </td>
                                </tr>
                            </table>
                        </div> 
                    );
                }; 
            } 
            pos++;
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
                    this.refreshList();
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
                <div> {this.refreshList()} </div>
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