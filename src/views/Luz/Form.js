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
            validHorasPorDia: true,
            item: {
                intensidade: 'Forte',
                horasPorDia: undefined
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
        if (this.props.item && !this.props.pop) {
            this.setState({
                item: {
                    ...this.props.item,
                    horasPorDia: this.props.item.horasPorDia + ''
                }
            })
        }
    }

    async save() {
        if (this.state.item._id)
            await this.http.put('luzs', this.state.item._id, this.state.item)
                .then((data) => { return data })
        else
            await this.http.post('luzs', this.state.item)
                .then((data) => { return data })
        this.props.pop ? Actions.plantaForm({ item: this.props.item }) : Actions.luzList()
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
                        {(this.state.item.horasPorDia || this.state.item.intensidade == 'Sombra')
                            && this.state.validHorasPorDia ?
                            <Button rounded transparent onPress={() => this.save()}>
                                <Icon style={{ color: 'white' }} name='check' type='Feather' />
                            </Button> : null}
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
                                    onValueChange={(value) => {
                                        this.setState({ item: { ...this.state.item, intensidade: value } }),
                                            value == 'Sombra' ? this.setState({ validHorasPorDia: true }) : null
                                    }}>
                                    {this.state.intensidades.map((item) => { return <Item key={item.nome} label={item.nome} value={item.nome} /> })}
                                </Picker>
                            </Row>
                        </Row>
                    </Form>
                    {this.state.item.intensidade == 'Sombra' ? null : <Form style={this.estilo.form}>
                        <Label>Horas por dia</Label>
                        <Row>
                            <Input keyboardType='numeric' autoFocus={true} value={this.state.item.horasPorDia}
                                onChangeText={(value) => {
                                    this.setState({ item: { ...this.state.item, horasPorDia: value + '' } }),
                                        value > 12 || value < 1 ? this.setState({ validHorasPorDia: false }) :
                                            this.setState({ validHorasPorDia: true })
                                }} />
                            {!this.state.validHorasPorDia ? <Row style={this.estilo.subrow}>
                                <Text style={{ margin: 7 }} >{'Horas por dia deve estar entre 1 e 12'}</Text>
                            </Row> : null}
                        </Row>
                    </Form>}
                    <Form style={this.estilo.form_vazio} />
                </Content>
            </Container>
        )
    }
}

