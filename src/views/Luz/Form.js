import React, { Component } from 'react'
import { Container, Text, Right, Icon, Left, Button, Body, Form, Item, Label, Input, Picker, Header, Content, Row } from 'native-base'
import { StatusBar } from 'react-native'
import { Actions } from 'react-native-router-flux'
import http from '../../services/Http'
import estilo from '../../assets/Estilo'

export default class FormLuz extends Component {
    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.http = new http()
        this.state = {
            item: {
                intensidade: 'Forte',
                horasPorDia: '0'
            },
            intensidades: [
                { nome: 'Forte' },
                { nome: 'Média' },
                { nome: 'Fraca' },
                { nome: 'Sombra' },
            ]
        }
    }

    componentWillMount() {
        this.load()
    }

    componentWillReceiveProps() {
        this.load()
    }

    async load() {
        if (this.props.item) {
            this.setState({
                item: {
                    ...this.props.item,
                    horasPorDia: this.props.item.horasPorDia + ''
                }
            })
        }
    }

    async save() {
        await this.http.post('luz', this.state.item)
            .then((data) => { return data })
        Actions.luzList()
    }

    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: this.estilo.cor.orange }}>
                    <Left>
                        <Button rounded transparent onPress={() => Actions.pop()}>
                            <Icon style={{ color: 'white' }} name='x' type='Feather' />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={this.estilo.title}>Luz</Text>
                    </Body>
                    <Right>
                        <Button rounded transparent onPress={() => this.save()}>
                            <Icon style={{ color: 'white' }} name='check' type='Feather' />
                        </Button>
                    </Right>
                </Header>
                <StatusBar backgroundColor={this.estilo.cor.orange} barStyle="light-content" />
                <Content>
                    <Form style={this.estilo.form}>
                        <Label>Intensidade</Label>
                        <Row>
                            <Row style={this.estilo.subrow}>
                                <Picker
                                    mode='dialog'
                                    iosIcon={<Icon name='arrow-down' />}
                                    selectedValue={this.state.item.intensidade}
                                    onValueChange={(value) => { this.setState({ item: { ...this.state.item, intensidade: value } }) }}>
                                    {this.state.intensidades.map((item) => { return <Item key={item.nome} label={item.nome} value={item.nome} /> })}
                                </Picker>
                            </Row>
                        </Row>
                    </Form>
                    {this.state.item.intensidade == 'Sombra' ? null : <Form style={this.estilo.form}>
                        <Label>Horas por dia</Label>
                        <Input keyboardType='numeric' autoFocus={true} value={this.state.item.horasPorDia}
                            onChangeText={(value) => { this.setState({ item: { ...this.state.item, horasPorDia: value + '' } }) }} />
                    </Form>}
                    <Form style={this.estilo.form_vazio} />
                </Content>
            </Container>
        )
    }
}

