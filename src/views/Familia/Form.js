import React, { Component } from 'react'
import { Form, Item, Label, Input, Content } from 'native-base'
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
        await this.service.http.post('familia', this.state.item)
            .then((data) => { return data })
    }

    render() {
        return (
            <Content style={{ backgroundColor: 'white', borderRadius: 10, marginHorizontal: 10, marginTop: 10 }} >
                <Form style={{ paddingVertical: 20 }}>
                    <Item floatingLabel>
                        <Label>Nome</Label>
                        <Input value={this.state.item.nome} autoFocus={true}
                            onChangeText={(value) => { this.setState({ item: { ...this.state.item, nome: value } }) }} />
                    </Item>
                </Form>
            </Content>
        )
    }
}

