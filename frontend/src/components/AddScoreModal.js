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
    //console.log(props);
    //console.log(props)
    this.state = {
      variable: this.props.existVariable,
      activeItem: {
        "fk" : this.props.fk,
        "rule" : [{"variable": -1, "operator": "", "value": ""}],
        "description":"",
        "weight" : 0,
        "score": 0
      }
    };
    //console.log(this.state.activeItem)
  }

  handleRuleChange = (key,e) => {
    let { name, value } = e.target;
    //console.log(name);
    //console.log(value);

    if (e.target.type === "select") {
      //const index = this.state.variable.findIndex((variable) => variable["name"] === e.target.value);
      //value = this.state.variable[index]["id"];
    }

    
    const activeItem = this.state.activeItem;
    activeItem["rule"][key][name] = value

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
    //console.log(rule);
    return(
      <Form key={rule["id"]}>
        {rule["rule"].map((eachrule,index) => {return (
          <FormGroup key={index}>
            <Label for="scpool-ruleId">Rule Variable</Label>
            <select name="variable" value={eachrule["variable"]} onChange={(event) => this.handleRuleChange(index, event)}>
              <option key={-1} value = {""}/>
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
            readOnly={false}
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
            readOnly={false}
            onChange={(event) => this.handleChange(event)}
            placeholder="Enter Score"
          />
        </FormGroup>
      </Form>
    );
  }

  render() {
    const { toggle } = this.props;
    const { onAdd } = this.props;

    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>Add Score Card</ModalHeader>
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
            onClick={() => onAdd(this.state.activeItem)}
          >
            Add
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