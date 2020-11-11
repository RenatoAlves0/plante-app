import React, { Component } from 'react'
import { Form, Label, Input, Content, Row, Picker, Icon, Item, Text, Col } from 'native-base'
import http from '../../services/Http'
import estilo from '../../assets/Estilo'

export default class FormEspecie extends Component {
    constructor(props) {
        super(props)
        this.http = new http()
        this.estilo = new estilo()
        this.state = {
            item: {
                _id: undefined,
                nome: undefined
            },
            generos: [],
            genero: {}
        }
    }

    componentDidMount() {
        this.load()
    }

    componentWillReceiveProps() {
        this.load()
    }

    async load() {
        if (this.props.item) this.setState({ item: { nome: this.props.item } })
        this.genero()
    }

    async genero() {
        if (this.props.item) this.setState({ genero: this.props.item.genero })
        this.http.get('generos', 1).then((data) => {
            this.setState({ generos: data })
        })
    }

    async save() {
        await this.http.post('especies', this.state.item, 1)
            .then((data) => { return data })
    }

    render() {
        return (
            <Content style={this.estilo.contentmodal} >
                <Col>
                    <Text style={this.estilo.head_contentmodal}>
                        Espécie</Text>
                </Col>
                <Form style={this.estilo.form}>
                    <Label>Nome</Label>
                    <Input autoFocus={true} value={this.state.item.nome} onChangeText={(value) => { this.setState({ item: { ...this.state.item, nome: value } }) }} />
                </Form>
                <Form style={this.estilo.form}>
                    <Label>Gênero</Label>
                    <Row>
                        <Row style={this.estilo.subrow}>
                            <Picker
                                mode='dialog'
                                iosIcon={<Icon name='arrow-down' />}
                                selectedValue={this.state.genero}
                                onValueChange={(value) => { this.setState({ genero: value, item: { ...this.state.item, _id: value } }) }}>
                                {this.state.generos.map((item) => { return <Item key={item._id} label={item.nome} value={item._id} /> })}
                            </Picker>
                        </Row>
                    </Row>
                </Form>
                <Form style={this.estilo.form_vazio} />
            </Content>
        )
    }
}

