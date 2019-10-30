import React from 'react';
import {
    Button,
    Form
  } from 'semantic-ui-react'

class TicketForm extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            firstName: "",
            lastName: "",
            email: ""
        }
       
    }

    onChangeFirstName = (event) => {
        this.setState({"firstName": event.target.value})
    }

    onChangeLastName = (event) => {
        this.setState({"lastName": event.target.value})
    }

    onChangeEmail = (event) => {
        this.setState({"email": event.target.value})
    }

    purchaseTicket = () => {
        let url = "https://koozfvz4t0.execute-api.us-west-2.amazonaws.com/api/purchase"

        let data  = {
            "firstName": this.state.firstName,
            "lastName": this.state.lastName,
            "email": this.state.email
        }

        fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type" : "application/json"
            }
        }).then(result => result.json)
        .then(data => {
            console.log(data);
        })
    }
    render() {
        return (
            <Form>
            <Form.Field>
            <label>First Name</label>
            <input value={this.state.firstName} onChange={this.onChangeFirstName} placeholder='First Name' />
            </Form.Field>
            <Form.Field>
            <label>Last Name</label>
            <input value={this.state.lastName} onChange={this.onChangeLastName} placeholder='Last Name' />
            </Form.Field>
            <Form.Field>
            <label>Email</label>
            <input value={this.state.email} onChange={this.onChangeEmail} placeholder="Email"/>
            </Form.Field>
            <Button type='button' onClick={this.purchaseTicket}>Submit</Button>
        </Form>
        )
    }
}

export default TicketForm;