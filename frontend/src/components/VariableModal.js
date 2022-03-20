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
      activeItem: this.props.activeCard,
      dType: this.props.existDType,
    };
    //console.log(this.state.activeItem)
  }

  handleChange = (e) => {
    let { name, value } = e.target;

    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }

    
    const activeItem = this.state.activeItem;
    activeItem[name] = value

    this.setState({ activeItem });
  };

  renderKeys = () =>{
    const datatype = this.state.dType
    const keys = Object.keys(datatype)

    return keys.map((key,index) => (
      <option key={key} value={key}>{datatype[key]}</option>
    ));
  }

  renderVariable() {
    const variable = this.state.activeItem
    //console.log(rule);
    return(
      <Form key={"variable_add"}>
        <FormGroup>
          <Label for="vpool-name">Varaible Name</Label>
          <Input
            type="text"
            id="vpool-name"
            name="name"
            value={variable["name"]}
            readOnly={false}
            onChange={(event) => this.handleChange(event)}
            placeholder="Enter Name"
          />
        </FormGroup>
        <FormGroup>
          <Label for="vpool-dType">Variable Data Type</Label>
          <select id="vpool-dType" name="datatype" value={variable["datatype"]} onChange={(event) => this.handleChange(event)}>
              {this.renderKeys()}
          </select>
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
          {this.renderVariable()}
        </ModalBody>
        <ModalFooter>
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