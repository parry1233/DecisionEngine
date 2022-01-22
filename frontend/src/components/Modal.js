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
    console.log(this.state.activeItem)
  }

  handleChange = (e) => {
    let { name, value } = e.target;

    //if (e.target.type === "checkbox") {
    //  value = e.target.checked;
    //}

    const activeItem = { ...this.state.activeItem, [name]: value };

    this.setState({ activeItem });
  };

  render() {
    const { toggle, onSave } = this.props;

    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>System Item</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="sc-age">年齡</Label>
              <Input
                type="text"
                id="sc-age"
                name="age"
                value={this.state.activeItem.obj["年齡(int)"]}
                //onChange={this.handleChange}
                placeholder="Enter Age"
              />
            </FormGroup>
            <FormGroup>
              <Label for="sc-gender">性別</Label>
              <Input
                type="text"
                id="sc-gender"
                name="gender"
                value={this.state.activeItem.obj["性別(int)"]? "男":"女"}
                //onChange={this.handleChange}
                placeholder="Enter Gender"
              />
            </FormGroup>
            <FormGroup>
              <Label for="sc-cscore">信用分數</Label>
              <Input
                type="text"
                id="sc-cscore"
                name="credit score"
                value={this.state.activeItem.obj["信用分數(float)"]}
                //onChange={this.handleChange}
                placeholder="Enter Credit Score"
              />
            </FormGroup>
            <FormGroup>
              <Label for="sc-rules">Rules</Label>
              <textarea
                cols="60"
                rows="20"
                type="text"
                id="sc-rules"
                name="rules"
                value={this.state.activeItem.rules.map((x) => {
                  return (`[[Rule${x.Rule}]], [Rule Info] ${x.Ruleinfo}, [weight] ${x.w}, [score] ${x.s}, [weight*score] ${x.wxs}, [satisfy] ${x.satisfy}\n`)
                })}
                //onChange={this.handleChange}
                placeholder="Enter rules"
              />
            </FormGroup>
            <FormGroup>
              <Label for="sc-total">Total</Label>
              <Input
                type="text"
                id="sc-total"
                name="total"
                value={this.state.activeItem.total}
                //onChange={this.handleChange}
                placeholder="Enter Total"
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="success"
            //onClick={() => onSave(this.state.activeItem)}
          >
            Save (Currently unavailable)
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}