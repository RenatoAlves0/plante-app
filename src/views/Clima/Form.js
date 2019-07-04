import React, { Component } from 'react'
import { StatusBar } from 'react-native'
import { Container, Text, Right, Icon, Left, Button, Body, Form, Item, Label, Input, Picker, Header, Content, Row } from 'native-base'
import { Actions } from 'react-native-router-flux'
import http from '../../services/Http'
import estilo from '../../assets/Estilo'

export default class FormClima extends Component {
    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.http = new http()
        this.state = {
            item: {
                tipo: 'Altitude / Frio de Montanha',
                temperaturaMinima: undefined,
                temperaturaMaxima: undefined,
                umidadeMinima: undefined,
                umidadeMaxima: undefined,
            },
            tipos: [
                { nome: 'Altitude / Frio de Montanha' },
                { nome: 'Continental Árido' },
                { nome: 'Desértico' },
                { nome: 'Equatorial' },
                { nome: 'Mediterrâneo' },
                { nome: 'Polar' },
                { nome: 'Semiárido' },
                { nome: 'Subtropical' },
                { nome: 'Temperado' },
                { nome: 'Tropical' },
                { nome: 'Tropical de Altitude' },
                { nome: 'Tropical Atlântico' },
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
                    temperaturaMaxima: this.props.item.temperaturaMaxima + '',
                    temperaturaMinima: this.props.item.temperaturaMinima + '',
                    umidadeMaxima: this.props.item.umidadeMaxima + '',
                    umidadeMinima: this.props.item.umidadeMinima + ''
                }
            })
        }
    }

    async save() {
        console.log(this.state.item)
        if (this.state.item._id)
            await this.http.put('climas', this.state.item._id, this.state.item)
                .then((data) => { return data })
        else
            await this.http.post('climas', this.state.item)
                .then((data) => { return data })
        this.props.pop ? Actions.plantaForm({ item: this.props.item }) : Actions.climaList()
    }

    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: this.estilo.cor.blue_solid }}>
                    <Left>
                        <Button rounded transparent onPress={() => Actions.pop()}>
                            <Icon style={{ color: 'white' }} name='x' type='Feather' />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={this.estilo.title}>Clima</Text>
                    </Body>
                    <Right>
                        {this.state.item.temperaturaMaxima && this.state.item.temperaturaMinima
                            && this.state.item.umidadeMaxima && this.state.item.umidadeMinima ?
                            <Button rounded transparent onPress={() => this.save()}>
                                <Icon style={{ color: 'white' }} name='check' type='Feather' />
                            </Button> : null}
                    </Right>
                </Header>
                <StatusBar backgroundColor={this.estilo.cor.blue_solid} barStyle="light-content" />
                <Content>
                    <Form style={this.estilo.form}>
                        <Label>Tipo</Label>
                        <Row>
                            <Row style={this.estilo.subrow}>
                                <Picker
                                    mode='dialog'
                                    iosIcon={<Icon name='arrow-down' />}
                                    selectedValue={this.state.item.tipo}
                                    onValueChange={(value) => { this.setState({ item: { ...this.state.item, tipo: value } }) }}>
                                    {this.state.tipos.map((item) => { return <Item key={item.nome} label={item.nome} value={item.nome} /> })}
                                </Picker>
                            </Row>
                        </Row>
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Temperatura Mínima ºC</Label>
                        <Input keyboardType='numeric' autoFocus={true} value={this.state.item.temperaturaMinima}
                            onChangeText={(value) => { this.setState({ item: { ...this.state.item, temperaturaMinima: value } }) }} />
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Temperatura Máxima ºC</Label>
                        <Input keyboardType='numeric' value={this.state.item.temperaturaMaxima}
                            onChangeText={(value) => { this.setState({ item: { ...this.state.item, temperaturaMaxima: value } }) }} />
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Umidade Mínima %</Label>
                        <Input keyboardType='numeric' value={this.state.item.umidadeMinima}
                            onChangeText={(value) => { this.setState({ item: { ...this.state.item, umidadeMinima: value } }) }} />
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Umidade Máxima %</Label>
                        <Input keyboardType='numeric' value={this.state.item.umidadeMaxima}
                            onChangeText={(value) => { this.setState({ item: { ...this.state.item, umidadeMaxima: value } }) }} />
                    </Form>
                    <Form style={this.estilo.form_vazio} />
                </Content>
            </Container>
        )
    }
}

