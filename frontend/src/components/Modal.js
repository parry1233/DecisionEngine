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
    //console.log(props)
    this.state = {
      activeItem: this.props.activeItem,
    };
    //console.log(this.state.activeItem)
  }

  handleRuleChange = (id,e) => {
    let { name, value } = e.target;

    //if (e.target.type === "checkbox") {
    //  value = e.target.checked;
    //}

    
    const activeItem = this.state.activeItem;
    const changeIndex = activeItem.findIndex((rule) => rule["id"] === id);
    activeItem[changeIndex]["rule"][0][name] = value

    this.setState({ activeItem });
  };

  handleChange = (id,e) => {
    let { name, value } = e.target;

    //if (e.target.type === "checkbox") {
    //  value = e.target.checked;
    //}

    
    const activeItem = this.state.activeItem;
    const changeIndex = activeItem.findIndex((rule) => rule["id"] === id);
    activeItem[changeIndex][name] = value

    this.setState({ activeItem });
  };

  onSave = (dataIn) => {
    console.log(dataIn)
  };

  renderRule() {
    const rules = this.state.activeItem
    return rules.map((eachRule) => (
      <Form key={eachRule["id"]}>
        <FormGroup>
          <Label for="scpool-id">ID</Label>
          <Input
            type="text"
            id="scpool-id"
            name="id"
            value={eachRule["id"]}
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
            value={eachRule["rule"][0]["variable"]}
            //readOnly={true}
            onChange={(event) => this.handleRuleChange(eachRule["id"],event)}
            placeholder="Enter Variable"
          />
        </FormGroup>
        <FormGroup>
          <Label for="scpool-ruleName">Name</Label>
          <Input
            type="text"
            id="scpool-ruleName"
            name="name"
            value={eachRule["rule"][0]["name"]}
            //readOnly={true}
            onChange={(event) => this.handleRuleChange(eachRule["id"],event)}
            placeholder="Enter Name"
          />
        </FormGroup>
        <FormGroup>
          <Label for="scpool-ruleDtype">Data type</Label>
          <Input
            type="text"
            id="scpool-ruleDtype"
            name="datatype"
            value={eachRule["rule"][0]["datatype"]}
            //readOnly={true}
            onChange={(event) => this.handleRuleChange(eachRule["id"],event)}
            placeholder="Enter Data Type"
          />
        </FormGroup>
        <FormGroup>
          <Label for="scpool-ruleOperator">Operator</Label>
          <Input
            type="text"
            id="scpool-ruleOperator"
            name="operator"
            value={eachRule["rule"][0]["operator"]}
            //readOnly={true}
            onChange={(event) => this.handleRuleChange(eachRule["id"],event)}
            placeholder="Enter Operator"
          />
        </FormGroup>
        <FormGroup>
          <Label for="scpool-ruleValue">value</Label>
          <Input
            type="text"
            id="scpool-ruleValue"
            name="value"
            value={eachRule["rule"][0]["value"]}
            //readOnly={true}
            onChange={(event) => this.handleRuleChange(eachRule["id"],event)}
            placeholder="Enter Value"
          />
        </FormGroup>
        <FormGroup>
          <Label for="scpool-weight">weight</Label>
          <Input
            type="text"
            id="scpool-weight"
            name="weight"
            value={eachRule["weight"]}
            //readOnly={true}
            onChange={(event) => this.handleChange(eachRule["id"],event)}
            placeholder="Enter Weight"
          />
        </FormGroup>
        <FormGroup>
          <Label for="scpool-score">score</Label>
          <Input
            type="text"
            id="scpool-score"
            name="score"
            value={eachRule["score"]}
            //readOnly={true}
            onChange={(event) => this.handleChange(eachRule["id"],event)}
            placeholder="Enter Score"
          />
        </FormGroup>
        <Button
          color="success"
          onClick={() => this.onSave(eachRule)}
        >
          Save (Currently unavailable)
        </Button>
      </Form>
    ));
  }

  render() {
    const { toggle, onSave } = this.props;

    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>Case Score Card View</ModalHeader>
        <ModalBody>
          {this.renderRule()}
        </ModalBody>
        <ModalFooter>
          <Button
            color="success"
            //onClick={() => onSave(this.state.activeItem)}
          >
            All Save (Currently unavailable)
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}