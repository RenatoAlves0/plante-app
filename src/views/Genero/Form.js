import React, { Component } from 'react'
import { Form, Label, Input, Content, Row, Picker, Icon, Item, Col, Text } from 'native-base'
import http from '../../services/Http'
import estilo from '../../assets/Estilo'

export default class FormGenero extends Component {
    constructor(props) {
        super(props)
        this.http = new http()
        this.estilo = new estilo()
        this.state = {
            item: {
                _id: undefined,
                nome: undefined
            },
            familias: [],
            familia: {}
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
        this.familia()
    }

    async familia() {
        if (this.props.item) this.setState({ familia: this.props.item.familia })
        this.http.get('familias').then((data) => {
            this.setState({ familias: data })
        })
    }

    async save() {
        await this.http.post('generos', this.state.item)
            .then((data) => { return data })
    }

    render() {
        return (
            <Content style={this.estilo.contentmodal} >
                <Col>
                    <Text style={this.estilo.head_contentmodal}>
                        Gênero</Text>
                </Col>
                <Form style={this.estilo.form}>
                    <Label>Nome</Label>
                    <Input autoFocus={true} value={this.state.item.nome} onChangeText={(value) => { this.setState({ item: { ...this.state.item, nome: value } }) }} />
                </Form>
                <Form style={this.estilo.form}>
                    <Label>Família</Label>
                    <Row>
                        <Row style={this.estilo.subrow}>
                            <Picker
                                mode='dialog'
                                iosIcon={<Icon name='arrow-down' />}
                                selectedValue={this.state.familia}
                                onValueChange={(value) => { this.setState({ familia: value, item: { ...this.state.item, _id: value } }) }}>
                                {this.state.familias.map((item) => { return <Item key={item._id} label={item.nome} value={item._id} /> })}
                            </Picker>
                        </Row>
                    </Row>
                </Form>
                <Form style={this.estilo.form_vazio} />
            </Content>
        )
    }
}

