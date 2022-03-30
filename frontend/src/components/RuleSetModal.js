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

  handleActionChange = (e) => {
    let {name,value} = e.target;

    let activeItem = this.state.activeItem;
    activeItem[name] = value;

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
  
  renderRuleSet() {
    const item = this.state.activeItem
    const varaible = this.state.variable
    //const etype = this.state.edit_type
    console.log(item);
    return(
      <Form key={item["id"]}>
        <FormGroup>
          <Label for="pool-id">ID</Label>
          <Input
            type="text"
            id="pool-id"
            name="id"
            value={item["id"]}
            readOnly={true}
            //onChange={this.handleChange}
            placeholder="Enter ID"
          />
        </FormGroup>

        {item["rule"].map((eachrule,index) => {return (
          <FormGroup key={index}>
            <Label for="pool-ruleId">Rule</Label>
            <select id="pool-ruleId" name="variable" value={eachrule["variable"]} onChange={(event) => this.handleRuleChange(index, event)}>
              <option key={-1} value = {""}></option>
              {varaible.map((element) => { return (
                <option key={element["id"]} value = {element["id"]}>{element["name"]} (Dtype: {element["datatype"]})</option>
              ); })}
            </select>
            <Label for="pool-ruleOperator">Rule Operator</Label>
            <Input
              type="text"
              id="pool-ruleOperator"
              name="operator"
              value={eachrule["operator"]}
              onChange={(event) => this.handleRuleChange(index, event)}
              placeholder="Enter Operator"
            />
            <Label for="pool-ruleValue">Rule Value</Label>
            <Input
              type="text"
              id="pool-ruleValue"
              name="value"
              value={eachrule["value"]}
              onChange={(event) => this.handleRuleChange(index, event)}
              placeholder="Enter Value"
            />
          </FormGroup>
        ); })}

          <FormGroup>
            <Label for="pool-action">Action</Label>
            <Input
              type="text"
              id="pool-action"
              name="action"
              value={item["action"]}
              onChange={(event) => this.handleActionChange(event)}
              placeholder="Enter Action in JSON type"
            />
          </FormGroup>

          <FormGroup>
            <Label for="pool-naction">N-Action</Label>
            <Input
              type="text"
              id="pool-naction"
              name="naction"
              value={item["naction"]}
              onChange={(event) => this.handleActionChange(event)}
              placeholder="Enter Action in JSON type"
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
        <ModalHeader toggle={toggle}>Add Score Card</ModalHeader>
        <ModalBody>
          {this.renderRuleSet()}
        </ModalBody>
        <ModalFooter>
          <Button
            color="success"
            onClick={() => onSave(this.state.activeItem)}
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