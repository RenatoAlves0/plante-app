import React, { Component } from 'react'
import { Form, Item, Label, Input, Content, Textarea } from 'native-base'
import http from '../../services/Http'
import estilo from '../../assets/Estilo'

export default class FormFamilia extends Component {
    constructor(props) {
        super(props)
        this.http = new http()
        this.estilo = new estilo()
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
        await this.http.post('familia', this.state.item)
            .then((data) => { return data })
    }

    render() {
        return (
            <Content style={{ backgroundColor: 'white', borderRadius: 10, marginHorizontal: 10, marginTop: 10 }} >
                <Form style={this.estilo.form_cadastroFamilia}>
                    <Label>Nome</Label>
                    <Input autoFocus={true} value={this.state.item.nome} onChangeText={(value) => { this.setState({ item: { ...this.state.item, nome: value } }) }} />
                </Form>
            </Content>
        )
    }
}

