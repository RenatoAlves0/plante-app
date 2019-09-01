import React, { Component } from 'react'
import { StatusBar } from 'react-native'
import { Container, Text, Right, Icon, Left, Button, Body, Form, Item, Label, Input, Picker, Header, Content, Row } from 'native-base'
import { Actions } from 'react-native-router-flux'
import http from '../../services/Http'
import estilo from '../../assets/Estilo'
import FeatherIcon from 'react-native-vector-icons/Feather'

export default class FormClima extends Component {
    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.http = new http()
        this.state = {
            validTemperaturaMinima: true,
            validTemperaturaMaxima: true,
            validUmidadeMinima: true,
            validUmidadeMaxima: true,
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
        if (this.state.item._id)
            await this.http.put('climas', this.state.item._id, this.state.item, 1)
                .then((data) => { return data })
        else
            await this.http.post('climas', this.state.item, 1)
                .then((data) => { return data })
        this.props.pop ? Actions.plantaForm({ item: this.props.item }) : Actions.climaList()
    }

    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: this.estilo.cor.blue_solid }}>
                    <Left>
                        <Button rounded transparent onPress={() => Actions.pop()}>
                            <FeatherIcon name='x' style={{ color: this.estilo.cor.white, fontSize: 22, marginHorizontal: 5 }} />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={this.estilo.title}>Clima</Text>
                    </Body>
                    <Right>
                        {this.state.item.temperaturaMinima && this.state.item.temperaturaMaxima
                            && this.state.item.umidadeMinima && this.state.item.umidadeMaxima
                            && this.state.validTemperaturaMinima && this.state.validTemperaturaMaxima
                            && this.state.validUmidadeMinima && this.state.validUmidadeMaxima ?
                            <Button rounded transparent onPress={() => this.save()}>
                                <FeatherIcon name='check' style={{ color: this.estilo.cor.white, fontSize: 22 }} />
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
                        <Row>
                            <Input keyboardType='numeric' autoFocus={true} value={this.state.item.temperaturaMinima}
                                onChangeText={(value) => {
                                    this.setState({ item: { ...this.state.item, temperaturaMinima: value } }),
                                        value < -50 || value > 50 ? this.setState({ validTemperaturaMinima: false }) :
                                            this.setState({ validTemperaturaMinima: true })
                                }} />
                            {!this.state.validTemperaturaMinima ? <Row style={this.estilo.subrow}>
                                <Text style={{ margin: 7 }} >{'Temperatura deve estar entre -50 e 50'}</Text>
                            </Row> : null}
                        </Row>
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Temperatura Máxima ºC</Label>
                        <Row>
                            <Input keyboardType='numeric' value={this.state.item.temperaturaMaxima}
                                onChangeText={(value) => {
                                    this.setState({ item: { ...this.state.item, temperaturaMaxima: value } }),
                                        value < -50 || value > 50 ? this.setState({ validTemperaturaMaxima: false }) :
                                            this.setState({ validTemperaturaMaxima: true })
                                }} />
                            {!this.state.validTemperaturaMaxima ? <Row style={this.estilo.subrow}>
                                <Text style={{ margin: 7 }} >{'Temperatura deve estar entre -50 e 50'}</Text>
                            </Row> : null}
                        </Row>
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Umidade Mínima %</Label>
                        <Row>
                            <Input keyboardType='numeric' value={this.state.item.umidadeMinima}
                                onChangeText={(value) => {
                                    this.setState({ item: { ...this.state.item, umidadeMinima: value } }),
                                        value < 0 || value > 100 ? this.setState({ validUmidadeMinima: false }) :
                                            this.setState({ validUmidadeMinima: true })
                                }} />
                            {!this.state.validUmidadeMinima ? <Row style={this.estilo.subrow}>
                                <Text style={{ margin: 7 }} >{'Umidade deve estar entre 0 e 100'}</Text>
                            </Row> : null}
                        </Row>
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Umidade Máxima %</Label>
                        <Row>
                            <Input keyboardType='numeric' value={this.state.item.umidadeMaxima}
                                onChangeText={(value) => {
                                    this.setState({ item: { ...this.state.item, umidadeMaxima: value } }),
                                        value < 0 || value > 100 ? this.setState({ validUmidadeMaxima: false }) :
                                            this.setState({ validUmidadeMaxima: true })
                                }} />
                            {!this.state.validUmidadeMaxima ? <Row style={this.estilo.subrow}>
                                <Text style={{ margin: 7 }} >{'Umidade deve estar entre 0 e 100'}</Text>
                            </Row> : null}
                        </Row>
                    </Form>
                    <Form style={this.estilo.form_vazio} />
                </Content>
            </Container>
        )
    }
}

