/* global ActiveXObject */
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import Modal from "./components/Modal";
import axios from "axios";
import * as jsMind from "./jsmind/js/jsmind.js";
import * as jsMind_draggable from "./jsmind/js/jsmind.draggable.js"
import "./jsmind/js/jsmind.css"


class DTCreact extends React.Component {
    constructor(props) {
            super(props);
            this.state = {
                options: { // options 将在下一章中详细介绍
                    container: 'jsmind_container', // [必选] 容器的ID，或者为容器的对象
                    editable: false, // [可选] 是否启用编辑
                    theme: 'orange' // [可选] 主题
                },
                _jm:null,
            };
            
        }
        //function
    componentDidMount(){
        const { mind, options } = this.props;
        const opt = {
            options:this.state.options,
            container: 'jsmind_container',
        }
        const jm = new jsMind(opt);
        this.setState({_jm: jm});
        this.state._jm.show(mind);
    }
    

    get_selected_nodeid = () => {
        var selected_node = this.state._jm.get_selected_node();
        if (!!selected_node) {
            return selected_node.id;
        } else {
            return null;
        }
    }
    open_ajax = () => {
        var mind_url = 'data_example.json';
        jsMind.util.ajax.get(mind_url, function(mind) {
            this.state._jm.show(mind);
        });
    }
    save_file = () => {
        var mind_data = this.state._jm.get_data();
        var mind_name = mind_data.meta.name;
        var mind_str = jsMind.util.json.json2string(mind_data);
        jsMind.util.file.save(mind_str, 'text/jsmind', mind_name + '.json');
    }
    open_file = () => {
        var file_input = document.getElementById('file_input');
        var files = file_input.files;
        if (files.length > 0) {
            var file_data = files[0];
            jsMind.util.file.read(file_data, function(jsmind_data, jsmind_name) {
                var mind = jsMind.util.json.string2json(jsmind_data);
                if (!!mind) {
                    this.state._jm.show(mind);
                } else {
                    alert('can not open this file as mindmap');
                }
            });
        } else {
            alert('please choose a file first')
        }
    }
    toggle_editable = (btn) => {
        var editable = this.state._jm.get_editable();
        if (editable) {
            this.state._jm.disable_edit();
            btn.innerHTML = 'enable editable';
        } else {
            this.state._jm.enable_edit();
            btn.innerHTML = 'disable editable';
        }
    }
    add_node = () => {
        var selected_node = this.state._jm.get_selected_node(); // as parent of new node
        if (!selected_node) { alert('please select a node first.'); return; }
        var nodeid = jsMind.util.uuid.newid();
        var topic = '* Node_' + nodeid.substr(nodeid.length - 6) + ' *';
        var node = this.state._jm.add_node(selected_node, nodeid, topic);
    }
    remove_node = () => {
            var selected_id = this.get_selected_nodeid();
            if (!selected_id) { alert('please select a node first.'); return; }
            this.state._jm.remove_node(selected_id);
        }
        //render heml
    render() {
        return ( 
            <div>
                <div id = "jsmind_nav" >
                    <br/>
                    <div> Open 
                        <div className = "flex_container" >
                            <div className = "flex_item" >
                                <button className = "sub" onclick = {() => this.save_file() } > save file </button>  
                            </div>  
                            <div className = "flex_item" >
                                <input id = "file_input" className = "file_input" type = "file"/>
                                <button className = "sub" onclick = {() => this.open_file() } > open file </button>  
                            </div >  
                        </div> 
                    </div>   
                    <div> Edit 
                        <div className = "flex_container" >
                            <div className = "flex_item" >
                                <button onclick = {() => this.toggle_editable(this) } > disable editable </button>  
                            </div>  
                            <div className = "flex_item" >
                                <button onclick = {() => this.add_node() } > add a node </button>  
                            </div >  
                            <div className = "flex_item" >
                                <button onclick = {() => this.remove_node() } > remove node </button>  
                            </div>  
                        </div>   
                    </div>   
                </div> 

                <div id = "jsmind_container" > 
                
                </div>
                
                <div style = "display:none">
                    <input classname = "file" type = "file" id = "image-chooser" accept = "image/*"/>
                </div> 
            </div>
        );
    }
}

export default DTCreact;