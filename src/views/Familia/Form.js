import React, { Component } from 'react'
import { Container, Text, Right, Icon, Left, Button, Body, Form, Item, Label, Input, Picker } from 'native-base'
import { Appbar } from 'react-native-paper'
import { Actions } from 'react-native-router-flux'
import axios from 'axios'
import http from '../../services/Http'

styles = {
    colors: {
        red: '#d32f2f',
        purple: '#7b1fa2',
        blue: '#1976d2',
        blue_solid: '#1f65ff',
        greenish: '#00bfa5',
        green: '#4cda64',
        green_solid: '#388e3c',
        lemon: '#c2da4c',
        orange: '#ffa000',
        brown: '#5d4037',
        gray_white: '#cecece',
        gray: '#999999'
    },
    title: {
        color: 'white',
        fontSize: 20
    }
}

export default class FormFamilia extends Component {
    constructor(props) {
        super(props)
        this.service = { http: new http() }
        this.state = {
            item: {
                filo: 'Filo',
                classe: "Classe",
                ordem: "Ordem",
            }
        }
    }

    componentWillMount() {
        this.load()
    }

    componentWillReceiveProps() {
        this.load()
    }

    async load() {
        if (this.props.item) this.setState({ item: { nome: this.props.item } })
    }

    async save() {
        this.service.http.post('familia', this.state.item)
    }

    render() {
        return (
            <Container>
                <Appbar style={{ backgroundColor: styles.colors.green_solid }}>
                    <Left style={{ marginLeft: 5 }}>
                        <Button rounded transparent onPress={() => Actions.pop()}>
                            <Icon style={{ color: 'white', fontSize: 25 }} name='x' type='Feather' />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={styles.title}>Família</Text>
                        {/* <Text style={styles.title}>{this.props.title}</Text> */}
                    </Body>
                    <Right>
                        <Button rounded transparent onPress={() => { this.save(), Actions.plantaForm() }}>
                            <Icon style={{ color: 'white', fontSize: 25 }} name='check' type='Feather' />
                        </Button>
                    </Right>
                </Appbar>
                <Form>
                    <Item floatingLabel>
                        <Label>Nome</Label>
                        <Input value={this.state.item.nome}
                            onChangeText={(value) => { this.setState({ item: { ...this.state.item, nome: value } }) }} />
                    </Item>
                </Form>
            </Container >
        )
    }
}

