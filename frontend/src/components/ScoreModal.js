import React, { Component } from "react";
import axios from "axios";
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
    //console.log(props)
    this.state = {
      variable : this.props.existVariable,
      activeItem: this.props.activeCard,
      edit_type: this.props.active,
    };
    //console.log(this.state.activeItem)
  }

  handleRuleChange = (key,e) => {
    let { name, value } = e.target;

    //console.log(e.target);
    //console.log(key);

    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }

    
    const activeItem = this.state.activeItem;
    activeItem["rule"][key][name] = value;

    this.setState({ activeItem });
  };

  handleChange = (e) => {
    let { name, value } = e.target;

    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }

    
    const activeItem = this.state.activeItem;
    activeItem[name] = value

    this.setState({ activeItem });
  };

  onAddRule = () => {
    let newRule = this.state.activeItem;
    newRule["rule"].push({"variable":-1,"name":"","datatype":"","operaotr":"","value":""})
    this.setState({ activeItem: newRule});
  };

  onDelRule = (index) => {
    let newRule = this.state.activeItem;
    if(newRule["rule"].length-1>0) newRule["rule"].splice(index,1);
    else alert("不能再刪除了!");
    this.setState({ activeItem: newRule});
  };
  
  renderRule() {
    const rule = this.state.activeItem
    const varaible = this.state.variable
    //const etype = this.state.edit_type
    //console.log(rule);
    return(
      <Form key={rule["id"]}>
        <FormGroup>
          <Label for="scpool-id">ID</Label>
          <Input
            type="text"
            id="scpool-id"
            name="id"
            value={rule["id"]}
            readOnly={true}
            //onChange={this.handleChange}
            placeholder="Enter ID"
          />
        </FormGroup>
        <hr/>
        {rule["rule"].map((eachrule,index) => {return (
          <FormGroup key={index}>
            <Label for="scpool-ruleId">Rule Variable</Label>
            <select name="variable" value={eachrule["variable"]} onChange={(event) => this.handleRuleChange(index, event)}>
              {varaible.map((element) => { return (
                <option key={element["id"]} value = {element["id"]}>{element["name"]} (Dtype: {element["datatype"]})</option>
              ); })}
            </select>
            <br/>
            <Label for="scpool-ruleOperator">Rule Operator</Label>
            <Input
              type="text"
              id="scpool-ruleOperator"
              name="operator"
              value={eachrule["operator"]}
              readOnly={this.state.edit_type===1 ? true : false}
              onChange={(event) => this.handleRuleChange(index, event)}
              placeholder="Enter Operator"
            />
            <Label for="scpool-ruleValue">Rule Value</Label>
            <Input
              type="text"
              id="scpool-ruleValue"
              name="value"
              value={eachrule["value"]}
              readOnly={this.state.edit_type===1 ? true : false}
              onChange={(event) => this.handleRuleChange(index, event)}
              placeholder="Enter Value"
            />
            <br/>
            <Button
              color="secondary"
              onClick={() => this.onDelRule(index)}
            >
              Delete
            </Button>
          </FormGroup>
          
        ); })}
        <hr/>
        <FormGroup>
          <Label for="scpool-description">Description</Label>
          <Input
            type="text"
            id="scpool-description"
            name="description"
            value={rule["description"]}
            readOnly={this.state.edit_type===1 ? true : false}
            onChange={(event) => this.handleChange(event)}
            placeholder="Enter Description"
          />
        </FormGroup>
        <FormGroup>
          <Label for="scpool-weight">weight</Label>
          <Input
            type="number"
            id="scpool-weight"
            name="weight"
            value={rule["weight"]}
            readOnly={this.state.edit_type===1 ? true : false}
            onChange={(event) => this.handleChange(event)}
            placeholder="Enter Weight"
          />
        </FormGroup>
        <FormGroup>
          <Label for="scpool-score">score</Label>
          <Input
            type="number"
            id="scpool-score"
            name="score"
            value={rule["score"]}
            readOnly={this.state.edit_type===1 ? true : false}
            onChange={(event) => this.handleChange(event)}
            placeholder="Enter Score"
          />
        </FormGroup>
      </Form>
    );
  }

  render() {
    const { toggle } = this.props;
    const { onSave } = this.props;

    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>Edit Score Card</ModalHeader>
        <ModalBody>
          {this.renderRule()}
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => this.onAddRule()}
          >
            New Variable
          </Button>
          <Button
            color="success"
            onClick={() => onSave(this.state.activeItem,this.state.edit_type)}
          >
            Save
          </Button>
          <Button
            color="secondary"
            onClick={() => toggle()}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}