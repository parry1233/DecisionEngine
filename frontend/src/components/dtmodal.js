import React, { Component } from "react";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Input,
    Label,
} from "reactstrap";

export default class CustomModal extends Component {
    constructor(props) {
        super(props);
        //console.log(props);
        //console.log(props)

        this.state = {
            parentnode: this.props.parentnode,
            Ntype:{},
            Qtype:{},
            nowstate:this.props.nowstate,
            addItem: { 
                "topic": "",
                "nodetype": "",
                "respondtype": "",
                "intmax": "",
                "intmin": "",
                "other": "",
            }
        };
        //console.log(this.state.activeItem)
    }

    handleChange = (e) => {
        //console.log(e.target);
        let { name, value } = e.target;

        if (e.target.type === "checkbox") {
            value = e.target.checked;
            
        }
        if(name ==="question"){
            if (value ==="Integer" || value ==="Float"){
                return ( 
                <Form key = { "variable_add" } >
                    <FormGroup >
                        <Label for = "node-nodetype" > Rule </Label> 
                        < Input type = "text"
                        id = "vpool-name"
                        name = "name"
                        value = { variable["name"] }
                        readOnly = { false }
                        onChange = {(event) => this.handleChange(event) }
                        placeholder = "Enter Name"/>
                    </FormGroup> 
                    <FormGroup >
                    <Label for = "vpool-dType" > Variable Data Type </Label> 
                    <select id = "vpool-dType"
                    name = "datatype"
                    value = { variable["datatype"] }
                    onChange = {
                        (event) => this.handleChange(event) } >
                    <option key = {-1 } value = { "" } > </option> 
                    { this.renderKeys() } 
                    </select> 
                    </FormGroup> 
                </Form>
            );
            }
        }


        const activeItem = this.state.activeItem;
        activeItem[name] = value

        this.setState({ activeItem });
    };

    renderKeys = (datatype) => {
        const keys = Object.keys(datatype)

        return keys.map((key, index) => ( 
            <option key = { key }
            value = { key } > { datatype[key] } </option>
        ));
    }

    renderQuestion() {
        const variable = this.state.activeItem
        const datatype = this.state.dType
            //console.log(rule);
        return ( <Form key = { "variable_add" } >
            <FormGroup >
                <Label for = "node-nodetype" > Question </Label> 
                < Input type = "text"
                id = "vpool-name"
                name = "name"
                value = { variable["name"] }
                readOnly = { false }
                onChange = {(event) => this.handleChange(event) }
                placeholder = "Enter Name"/>
            </FormGroup> 
            <FormGroup >
            <Label for = "vpool-dType" > Variable Data Type </Label> 
            <select id = "vpool-dType"
            name = "datatype"
            value = { variable["datatype"] }
            onChange = {
                (event) => this.handleChange(event) } >
            <option key = {-1 } value = { "" } > </option> 
            { this.renderKeys() } 
            </select> 
            </FormGroup> 
            </Form>
        );
    }
    renderOpt=()=>{

        <Button color = "success" onClick = { () => onAdd(this.state.activeItem) } >Add </Button>
    } 
    render() {
        const { toggle } = this.props;
        const { onAdd } = this.props;

        return ( 
            <Modal isOpen = { true } toggle = { toggle } >
                <ModalHeader toggle = { toggle } > Varaible View </ModalHeader> 
                <ModalBody > { this.renderVariable() } </ModalBody> 
                <ModalFooter >
                    <Button color = "success" onClick = { () => onAdd(this.state.activeItem) } >Add </Button> 
                    <Button color = "secondary" onClick = { () => toggle() } > Close </Button> 
                </ModalFooter> 
            </Modal>
        );
    }
}