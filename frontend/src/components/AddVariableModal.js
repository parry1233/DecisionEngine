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
      dType: this.props.existDType,
      activeItem: {
        "fk" : this.props.fk,
        "name" : "",
        "datatype": ""
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
    const datatype = this.state.dType
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
              <option key={-1} value = {""}></option>
              {this.renderKeys()}
          </select>
        </FormGroup>
      </Form>
    );
  }

  render() {
    const { toggle } = this.props;
    const { onAdd } = this.props;

    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>Varaible View</ModalHeader>
        <ModalBody>
          {this.renderVariable()}
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