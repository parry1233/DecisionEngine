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
        "rule" : [{"variable": "", "operator": "", "value": ""}],
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
  
  renderRule() {
    const rule = this.state.activeItem
    const varaible = this.state.variable
    //console.log(rule);
    return(
      <Form key={rule["id"]}>
        <FormGroup>
          <Label for="scpool-ruleId">Rule Variable</Label>
          <select name="variable" value={this.state.activeItem["rule"][0]["variable"]} onChange={(event) => this.handleRuleChange(0,event)}>
              <option key={-1} value = {""}></option>
            {varaible.map((element) => { return (
              <option key={element["id"]} value = {element["id"]}>{element["name"]} (Dtype: {element["datatype"]})</option>
            ); })}
          </select>
        </FormGroup>
        <FormGroup>
          <Label for="scpool-ruleOperator">Rule Operator</Label>
          <Input
            type="text"
            id="scpool-ruleOperator"
            name="operator"
            value={rule["rule"][0]["operator"]}
            readOnly={false}
            onChange={(event) => this.handleRuleChange(0,event)}
            placeholder="Enter Operator"
          />
        </FormGroup>
        <FormGroup>
          <Label for="scpool-ruleValue">Rule Value</Label>
          <Input
            type="text"
            id="scpool-ruleValue"
            name="value"
            value={rule["rule"][0]["value"]}
            readOnly={false}
            onChange={(event) => this.handleRuleChange(0,event)}
            placeholder="Enter Value"
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
        <ModalHeader toggle={toggle}>Score Card View</ModalHeader>
        <ModalBody>
          {this.renderRule()}
        </ModalBody>
        <ModalFooter>
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