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
      activeItem: this.props.activeCard,
      edit_type: this.props.active,
    };
    //console.log(this.state.activeItem)
  }

  handleRuleChange = (e) => {
    let { name, value } = e.target;

    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }

    
    const activeItem = this.state.activeItem;
    activeItem["rule"][0][name] = value

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
    const etype = this.state.edit_type
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
        <FormGroup>
          <Label for="scpool-ruleVariable">Rule Variable</Label>
          <Input
            type="text"
            id="scpool-ruleVariable"
            name="variable"
            value={rule["rule"][0]["variable"]}
            readOnly={etype===1 ? true : false}
            onChange={(event) => this.handleRuleChange(event)}
            placeholder="Enter Variable"
          />
        </FormGroup>
        <FormGroup>
          <Label for="scpool-ruleName">Name</Label>
          <Input
            type="text"
            id="scpool-ruleName"
            name="name"
            value={rule["rule"][0]["name"]}
            readOnly={etype===1 ? false : true}
            onChange={(event) => this.handleRuleChange(event)}
            placeholder="Enter Name"
          />
        </FormGroup>
        <FormGroup>
          <Label for="scpool-ruleDtype">Data type</Label>
          <Input
            type="text"
            id="scpool-ruleDtype"
            name="datatype"
            value={rule["rule"][0]["datatype"]}
            readOnly={etype===1 ? false : true}
            onChange={(event) => this.handleRuleChange(event)}
            placeholder="Enter Data Type"
          />
        </FormGroup>
        <FormGroup>
          <Label for="scpool-ruleOperator">Operator</Label>
          <Input
            type="text"
            id="scpool-ruleOperator"
            name="operator"
            value={rule["rule"][0]["operator"]}
            readOnly={etype===1 ? true : false}
            onChange={(event) => this.handleRuleChange(event)}
            placeholder="Enter Operator"
          />
        </FormGroup>
        <FormGroup>
          <Label for="scpool-ruleValue">value</Label>
          <Input
            type="text"
            id="scpool-ruleValue"
            name="value"
            value={rule["rule"][0]["value"]}
            readOnly={etype===1 ? true : false}
            onChange={(event) => this.handleRuleChange(event)}
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
            readOnly={etype===1 ? true : false}
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
            readOnly={etype===1 ? true : false}
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
        <ModalHeader toggle={toggle}>Score Card View</ModalHeader>
        <ModalBody>
          {this.renderRule()}
        </ModalBody>
        <ModalFooter>
          <Button
            color="success"
            onClick={() => onSave(this.state.activeItem,this.state.edit_type)}
          >
            Save (Currently unavailable)
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