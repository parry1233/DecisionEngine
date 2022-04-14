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
            answerValue:this.props.answerValue,
            nowstate:this.props.nowstate,
            now_Question:this.props.now_Question,
            mind: this.props.mind,

        };
        //console.log(this.state.activeItem)
    }

    renderNextQuestion=()=>{
        const Question = this.state.now_Question;

        if(this.state.finish){
            this.renderQuestion();
        }
        if (Question["retype"] == "n"){
            return (
                <div>
                    <table className="table mt-4">
                        <tbody>
                            <tr>
                                <td>{Question["question"]}</td>
                                <td>
                                    <input name="answerValue" type="number" value={this.state.answerValue} onChange={this.handleChange}></input>
                                </td>
                                <td>
                                    <button className="btn btn-primary mr-2" onClick = {() => this.judge() } > next </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            );
        }else if ( Question["retype"] == "b"){
            return (
                <div>
                    <table className="table mt-4">
                        <tbody>
                            <tr>
                                <td>{Question["question"]}</td>
                                <td>
                                <input name="answerValue" type="radio" value="true" onChange={this.handleChange} checked={this.state.answerValue === "true"}/>
                                <span style={{ marginLeft: "10px",marginRight: "10px" }}>true</span>
                                <input name="answerValue" type="radio" value="false" onChange={this.handleChange} checked={this.state.answerValue === "false"}/>
                                <span style={{ marginLeft: "10px",marginRight: "10px"  }}>false</span>
                                </td>
                                <td>
                                    <button className="btn btn-primary mr-2" onClick = {() => this.judge() } > next </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )
        }; 
 
    }
    render() {
        const { toggle } = this.props;
        const { onAdd } = this.props;

        return ( 
            <Modal isOpen = { true } toggle = { toggle } >
                <ModalHeader toggle = { toggle } > Varaible View </ModalHeader> 
                <ModalBody > { this.renderVariable() } </ModalBody> 
                <ModalFooter >
                    <Button color = "success" onClick = { () => onAdd(this.state.activeItem) } >Add </Button> 
                    <Button color = "secondary" onClick = { () => toggle() } > Close </Button> 
                </ModalFooter> 
            </Modal>
        );
    }
}