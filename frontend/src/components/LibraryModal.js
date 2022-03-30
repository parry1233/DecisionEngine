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
    //console.log(this.props.libInfo);
    this.state = {
      lib_name: this.props.libInfo["name"],
      id : this.props.libInfo["id"],
      type: this.props.type
    };
  }

  handleChange = (e) => {
    let { name, value } = e.target;

    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }

    //console.log(name,value);
    
    this.setState({ lib_name: value });
  };

  render() {
    const { toggle } = this.props;
    const { onAdd } = this.props;
    const name = this.state.lib_name;

    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>Library View</ModalHeader>
        <ModalBody>
            <Label for="library-name">Library Name</Label>
            <Input
                type="text"
                id="library-name"
                name="lib_name"
                value={name}
                readOnly={false}
                onChange={(event) => this.handleChange(event)}
                placeholder="Enter Name"
            />
        </ModalBody>
        <ModalFooter>
          <Button
            color="success"
            onClick={() => onAdd(this.state.id,this.state.lib_name,(this.state.id===-1 ? 1: 2))}
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