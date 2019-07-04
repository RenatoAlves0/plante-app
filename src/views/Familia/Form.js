import React, { Component } from 'react'
import { Form, Label, Input, Content, Col, Text } from 'native-base'
import http from '../../services/Http'
import estilo from '../../assets/Estilo'

export default class FormFamilia extends Component {
    constructor(props) {
        super(props)
        this.http = new http()
        this.estilo = new estilo()
        this.state = {
            item: {
                filo: 'Generico',
                classe: 'Generico',
                ordem: 'Generico',
                nome: undefined
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
            <Content style={this.estilo.contentmodal} >
                <Col>
                    <Text style={this.estilo.head_contentmodal}>
                        Família</Text>
                </Col>
                <Form style={this.estilo.form}>
                    <Label>Nome</Label>
                    <Input autoFocus={true} value={this.state.item.nome} onChangeText={(value) => { this.setState({ item: { ...this.state.item, nome: value } }) }} />
                </Form>
                <Form style={this.estilo.form_vazio} />
            </Content>
        )
    }
}

