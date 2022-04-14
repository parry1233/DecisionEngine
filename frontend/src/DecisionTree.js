import React from "react";
import { Link,useLocation } from "react-router-dom";

import * as jsMind from "./jsmind/js/jsmind.js";
import * as jsMind_draggable from "./jsmind/js/jsmind.draggable.js"
import axios from "axios";
import "./jsmind/js/jsmind.css"
import './template/title.css'
import DTModal from "./components/dtmodal";


//this page need more modify

class DecisionTree extends React.Component{
    
    //constructor
    constructor(props){
        super(props);
        this.case_info = this.props.case_info;
        //console.log(this.case_info.name);
        this.state = {  
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
            _jm: null,
            nowmind: null,
            treelist:null,
            past_node: [],
            now_q_id:-1,
            now_r_id:-1,
            ans_type:null,
            debug:0,
            Question_list:[],
            now_Question:{},
            finish:false,
            answerValue:"",
            is_pass:false,
            has_next:false,
            bottom_show:"next",
            
    
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);

    }
    handleChange(event) {
        this.setState({answerValue: event.target.value});
    };
    handleRadioChange(event) {
        // set the new value of checked radion button to state using setState function which is async funtion
      this.setState({
        answerValue: event.target.value
      });
    };
    handleSubmit = (event) => {
        this.setState({answerValue: String(this.value)});
        event.preventDefault();
    };
    componentDidMount() {
        this.getTree(this.case_info.id);
        this.refreshTree();
    }

    refreshquestion = ()=>{}
    refreshTree = ()=>{
        var jm = undefined;  
        var mind = undefined; 
        var node =undefined; 
        console.log(this.state.past_node.length);
        if (this.state.past_node.length > 0){
            mind = this.state.nowmind["data"];
            if (!!this.has_next){
                this.printlog();
            }
            jm = this.state._jm;
            jm.enable_edit();
            this.state.past_node.forEach(function(e){
                jm.select_node(mind[e]['id']);
                node = jm.get_selected_node();
                console.log (node);
                jm.set_node_color(node.id , "#20B2AA", null);
            })
            jm.disable_edit();

    //        this.setState({_jm: jm});
        }
    }

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
        var a = -1;
        var b = -1;
        var os = -1;
        state.forEach(function(e,i){

            if (e == 0){
                n_temp = i;
            }else if (e == 1){
                o_temp = i;
            }
            if (o_temp >= 0 && n_temp >= 0){
                if (o_temp > n_temp){
                    os = o.indexOf(r[o_temp]);
                    a = num[n_temp];
                    b = ans;
                    n_temp = -1;
                    o_temp = -1;
                }else if (o_temp < n_temp){
                    os = o.indexOf(r[o_temp]);
                    a = ans;
                    b = num[n_temp];
                    n_temp = -1;
                    o_temp = -1; 
                    
                }else {
                    alert('error');
                }
                console.log(a+"  "+os+" "+b);
                if (os == 0){
                        if (a>b){
                            pass = true;
                        }else{
                            pass = false;
                        };
                }else if (os == 1 || os == 2){
                        if (a>=b){
                            pass = true;
                        }else{
                            pass = false;
                        };
                }else if (os == 3 ){
                        if (a<b){
                            pass = true;
                        }else{
                            pass = false;
                        };
                }else if (os == 4 || os == 5){
                        if (a<=b){
                            pass = true;
                        }else{
                            pass = false;
                        };
                }else if (os == 6 || os == 7){
                        if (a==b){
                            pass = true;
                        }else{
                            pass = false;
                        };
                }else{
                        console.log('沒有符合的條件');
                }
            }
            
        });
        console.log(pass);
        this.setState({is_pass: pass});
        console.log(this.state.is_pass );
        return pass;
        
    }

    judge = ()=>{
        var done = this.state.has_next;
        var mind = this.state.nowmind;
        var pos = this.state.now_q_id ; 
        var ans = this.state.answerValue;
        var rule = undefined;
        var past = this.state.past_node;
        var question_list = this.state.Question_list;
        var q = this.state.now_Question;
        var r_id = -1;
        var h_next = true;
        var jm = this.state._jm;
        var question={};
        var node =undefined; 
        if (done){  
            //var mind = jsMind.util.json.string2json(this.state.nowmind);   
            jm.show(this.state.nowmind); 
            past = [] ;
            pos = 0;
            past.push(pos);
            question["question"] = mind["data"][pos]["topic"];
            if ( mind["data"][pos]["retype"] == "I" || mind["data"][pos]["retype"] == "F"){
                question["retype"] = "n";

                this.setState({_jm: jm,
                                ans_type:"number",
                                now_q_id:Number(mind["data"][pos]["id"]),
                                now_r_id:-1,
                                now_Question:question,
                                Question_list:[],
                                has_next:false,
                                bottom_show:"next",
                                past_node:past});
                
            }else if ( mind["data"][pos]["retype"] == "b"){
                question["retype"] = "b";
                this.setState({_jm: jm,
                                ans_type:"boolean",
                                now_q_id:Number(mind["data"][pos]["id"]),
                                now_r_id:-1,
                                now_Question:question,
                                Question_list:[],
                                has_next:false,
                                finish:false,
                                bottom_show:"next",
                                past_node:past});
            };                 
            jm.enable_edit();
            console.log (mind["data"][pos]['id']);
            jm.select_node(mind["data"][pos]['id']);
            node = jm.get_selected_node();
            console.log (node);
            jm.set_node_color(node.id , "#20B2AA", null);
            jm.disable_edit();
            console.log("restar" + past);
//            this.refreshTree();
        }else {
            console.log(this.state.past_node+"de 0");
            console.log(this.state.answerValue+" ans");
            //判斷結果
            for(var pos=this.state.now_q_id ;pos<mind["data"].length;pos++){
            
                if (mind["data"][pos]["parentid"] === String(this.state.now_q_id) && mind["data"][pos]["nodetype"] == "rule"){ 
                    console.log(mind["data"][pos]["parentid"]+" "+typeof(mind["data"][pos]["parentid"]));
                    rule = String(mind["data"][pos]["topic"]);
                    if (this.state.ans_type == "number"){
                        q["answer"]= ans;
                        ;
                        if (this.compare_num(rule,Number(ans)) == true){
                            
                            past.push(pos);
                            question_list.push(q);
                            r_id = Number(mind["data"][pos]['id']);
                            console.log(past);
                            break;
                        }
                    }else if (this.state.ans_type == "boolean"){
                        
                        q["answer"]= ans;
                        if (rule.indexOf('True')>=0 && ans == "true"){
                            past.push(pos);
                            question_list.push(q);
                            r_id = Number(mind["data"][pos]['id']);

                            break;
                        }else if (rule.indexOf('False')>=0 && ans == "false"){
                            past.push(pos);
                            question_list.push(q);
                            r_id = Number(mind["data"][pos]['id']);
                            break;
                        }
                    };
                }
            }
            console.log("判斷結果 "+r_id);
            //    console.log(mind["data"][pos]["parentid"]);
            question={};
            //下個問題
            for(var pos=r_id ;pos<mind["data"].length;pos++){

                if (mind["data"][pos]["parentid"] == String(r_id) && mind["data"][pos]["nodetype"] == "question"){
                    question["question"] = mind["data"][pos]["topic"];
                    past.push(pos);
                    console.log(past);
                    if ( mind["data"][pos]["retype"] == "I" || mind["data"][pos]["retype"] == "F"){
                        question["retype"] = "n";
                        h_next = false;
                        this.setState({ans_type:"number",
                                        now_q_id:Number(mind["data"][pos]["id"]),
                                        past_node:past,
                                        now_Question:question,
                                        now_r_id:r_id ,
                                        Question_list:question_list,
                                        has_next : h_next
                                    });

                        break;
                        
                    }else if ( mind["data"][pos]["retype"] == "b"){
                        question["retype"] = "b";
                        h_next = false;
                        this.setState({ans_type:"boolean",
                                    now_q_id:Number(mind["data"][pos]["id"]),
                                    past_node:past,
                                    now_Question:question,
                                    now_r_id:r_id ,
                                    Question_list:question_list,
                                    has_next : h_next
                                });
                        console.log(this.state.now_Question);        
                        break;
                    }; 
                } 
            }
            //是否到底
            if (h_next){
                console.log("到底啦");    
                q=  {};
                for(var pos=this.state.now_r_id ;pos<mind["data"].length;pos++){
                    if (mind["data"][pos]["parentid"] == String(r_id) && mind["data"][pos]["nodetype"] == "log"){
                        q["question"] = "輸出結果"
                        q["retype"] = "Log : ";
                        q["answer"] =mind["data"][pos]["topic"];
                        question_list.push(q)
                        past.push(pos);
                        this.setState({
                                        past_node:past,
                                        now_Question:q,
                                        Question_list:question_list,
                                        now_r_id:r_id ,
                                        has_next : h_next,
                                        finish : true,
                                        bottom_show:"try again",
                                    });
                        break;
                    } 
                    pos++;
                }
                console.log()
            }
            this.refreshTree();
        }
          
    }
    first_question = () =>{
    //    var mind = jsMind.util.json.string2json(this.state.nowmind);
        var mind = this.state.nowmind;
        var pos = 0;
        var question={};
        var past = this.state.past_node;
        past.push(pos);
        question["question"] = mind["data"][pos]["topic"];
        if ( mind["data"][pos]["retype"] == "I" || mind["data"][pos]["retype"] == "F"){
            question["retype"] = "n";
            this.setState({ans_type:"number",
                            now_q_id:Number(mind["data"][pos]["id"]),
                            now_Question:question,
                            past_node:past});
            
        }else if ( mind["data"][pos]["retype"] == "b"){
            question["retype"] = "b";
            this.setState({ans_type:"boolean",
                            now_q_id:Number(mind["data"][pos]["id"]),
                            now_Question:question,
                            past_node:past});
        }; 
        
        this.refreshTree();
            
    };
 /*   next_question = () =>{
        var done = true;
    //    var mind = jsMind.util.json.string2json(this.state.nowmind);
        var mind = this.state.nowmind;

        var past = this.state.past_node;
    //    console.log(mind["data"][pos]["parentid"]);
        var question={};
        for(var pos=this.state.now_r_id ;pos<mind["data"].length;pos++){

            if (mind["data"][pos]["parentid"] == String(this.state.now_r_id) && mind["data"][pos]["nodetype"] == "question"){
                question["question"] = mind["data"][pos]["topic"];
                past.push(pos);
                
                if ( mind["data"][pos]["retype"] == "I" || mind["data"][pos]["retype"] == "F"){
                    question["retype"] = "n";
                    this.setState({ans_type:"number",
                                    now_q_id:Number(mind["data"][pos]["id"]),
                                    past_node:past,
                                    now_Question:question});
                    break;
                    
                }else if ( mind["data"][pos]["retype"] == "b"){
                    question["retype"] = "b";
                    this.setState({ans_type:"boolean",
                                now_q_id:Number(mind["data"][pos]["id"]),
                                past_node:past,
                                now_Question:question
                            });
                    break;
                }; 
            } 
        }
        this.refreshTree();
    };*/
    printlog = () =>{
        var done = true;
        var question={};
        var past = this.state.past_node; 
        var mind = this.state.nowmind;
        var question_list = this.state.Question_list;
        for(var pos=this.state.now_r_id ;pos<mind["data"].length;pos++){
            if (mind["data"][pos]["parentid"] == String(this.state.now_r_id) && mind["data"][pos]["nodetype"] == "log"){
                question["question"] = "Log : ";
                question["retype"] = mind["data"][pos]["topic"];
                past.push(pos);
                this.setState({
                                past_node:past,
                                now_Question:question,
                                finish : true
                            });
                break;
            } 
            pos++;
        }
    }
    getTree = (id) =>{
            axios
            .post(`/DecisionTreeJsmind/`,{
                'fk': id,
            })
            .then((res) => {              
                this.setState({nowmind: res.data["link_list"]});
                console.log(this.state.nowmind);
                if (this.state._jm===null){
                    
                    var jm = new jsMind(this.state.options);  
                    //var mind = jsMind.util.json.string2json(this.state.nowmind);   
                    jm.show(this.state.nowmind);  
                    this.setState({_jm: jm});
                    this.first_question();
                }
            })
            .catch((err) => {
                console.log(err)
                return;
                });
    }
    renderQuestion=()=>{
        const Question = this.state.Question_list;
        
        return (Question.map((q)=>(
            <tr>
                <td> {q["question"]} </td>
                <td> {q["answer"]} </td>
            </tr>
            ))
        );
    }
    renderNextQuestion=()=>{
        const Question = this.state.now_Question;
        const Q_list = this.state.Question_list;

        if(this.state.has_next){
            return (

                    Q_list.map((q)=>(
                    <tr>
                        <td> {q["question"]} </td>
                        <td> </td>
                        <td> {q["answer"]} </td>
                    </tr>))
 
            );
        }else if (Question["retype"] == "n"){
            return (
                    <tr>
                        <td>{Question["question"]}</td>
                        <td>
                            <input name="answerValue" type="number" value={this.state.answerValue} onChange={this.handleChange}></input>
                        </td>
                    </tr>
            );
        }else if ( Question["retype"] == "b"){
            return (
                    <tr>
                        <td>{Question["question"]}</td>
                        <td>
                            <input name="answerValue" type="radio" value="true" onChange={this.handleChange} checked={this.state.answerValue === "true"}/>
                            <span style={{ marginLeft: "10px",marginRight: "10px" }}>true</span>
                            <input name="answerValue" type="radio" value="false" onChange={this.handleChange} checked={this.state.answerValue === "false"}/>
                            <span style={{ marginLeft: "10px",marginRight: "10px"  }}>false</span>
                        </td>
                    </tr>                
        )
        }; 
 
    }




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




    //render html
    render(){
        const style = {display:"none"};
        const bu_style = {}
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
                <div>
                    <center>
                        <table className="table mt-4">
                            <tbody>{this.renderNextQuestion()}</tbody>
                        </table>
                    </center>
                    <center><button className="btn btn-primary mr-2" onClick = {() => this.judge() } > {this.state.bottom_show} </button></center>
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
/* <div> 
                    <table className="table mt-4">
                        {this.renderQuestion()}
                    </table>
                </div>*/
export default function(props){
    const {state} = useLocation();
    //console.log(state);

    return <DecisionTree {...props} case_info = {state} />;
};