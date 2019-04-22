import React, { Component } from 'react'
import { Container, Text, Right, Icon, Left, Button, Body, Form, Item, Label, Input, Picker, Header, Content, Row } from 'native-base'
import { Actions } from 'react-native-router-flux'
import http from '../../services/Http'
import estilo from '../../assets/Estilo'

export default class FormNutriente extends Component {
    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.http = new http()
        this.state = {
            item: {
                nitrogenio: undefined,
                potassio: undefined,
                fosforo: undefined,
                magnesio: undefined,
                calcio: undefined,
                enxofre: undefined,
                ferro: undefined,
                manganes: undefined,
                boro: undefined,
                cobre: undefined,
                zinco: undefined,
                cloro: undefined,
                molibdenio: undefined,
            },
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
                    nitrogenio: this.props.item.nitrogenio + '',
                    potassio: this.props.item.potassio + '',
                    fosforo: this.props.item.fosforo + '',
                    magnesio: this.props.item.magnesio + '',
                    calcio: this.props.item.calcio + '',
                    enxofre: this.props.item.enxofre + '',
                    ferro: this.props.item.ferro + '',
                    manganes: this.props.item.manganes + '',
                    boro: this.props.item.boro + '',
                    cobre: this.props.item.cobre + '',
                    zinco: this.props.item.zinco + '',
                    cloro: this.props.item.cloro + '',
                    molibdenio: this.props.item.molibdenio + '',
                }
            })
        }
    }

    async save() {
        await this.http.post('nutriente', this.state.item)
            .then((data) => { return data })
        Actions.nutrienteList()
    }

    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: this.estilo.cor.purple }}>
                    <Left>
                        <Button rounded transparent onPress={() => Actions.pop()}>
                            <Icon style={{ color: 'white' }} name='x' type='Feather' />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={this.estilo.title}>Nutriente</Text>
                    </Body>
                    <Right>
                        <Button rounded transparent onPress={() => this.save()}>
                            <Icon style={{ color: 'white' }} name='check' type='Feather' />
                        </Button>
                    </Right>
                </Header>
                <Content>
                    <Form style={this.estilo.form}>
                        <Label>Porção de Nitrogênio</Label>
                        <Input keyboardType='numeric' autoFocus={true} value={this.state.item.nitrogenio}
                            onChangeText={(value) => { this.setState({ item: { ...this.state.item, nitrogenio: value } }) }} />
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Porção de Potássio</Label>
                        <Input keyboardType='numeric' value={this.state.item.potassio}
                            onChangeText={(value) => { this.setState({ item: { ...this.state.item, potassio: value } }) }} />
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Porção de Fósforo</Label>
                        <Input keyboardType='numeric' value={this.state.item.fosforo}
                            onChangeText={(value) => { this.setState({ item: { ...this.state.item, fosforo: value } }) }} />
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Porção de Magnésio</Label>
                        <Input keyboardType='numeric' value={this.state.item.magnesio}
                            onChangeText={(value) => { this.setState({ item: { ...this.state.item, magnesio: value } }) }} />
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Porção de Cálcio</Label>
                        <Input keyboardType='numeric' value={this.state.item.calcio}
                            onChangeText={(value) => { this.setState({ item: { ...this.state.item, calcio: value } }) }} />
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Porção de Enxôfre</Label>
                        <Input keyboardType='numeric' value={this.state.item.enxofre}
                            onChangeText={(value) => { this.setState({ item: { ...this.state.item, enxofre: value } }) }} />
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Porção de Ferro</Label>
                        <Input keyboardType='numeric' value={this.state.item.ferro}
                            onChangeText={(value) => { this.setState({ item: { ...this.state.item, ferro: value } }) }} />
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Porção de Manganês</Label>
                        <Input keyboardType='numeric' value={this.state.item.manganes}
                            onChangeText={(value) => { this.setState({ item: { ...this.state.item, manganes: value } }) }} />
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Porção de Boro</Label>
                        <Input keyboardType='numeric' value={this.state.item.boro}
                            onChangeText={(value) => { this.setState({ item: { ...this.state.item, boro: value } }) }} />
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Porção de Cobre</Label>
                        <Input keyboardType='numeric' value={this.state.item.cobre}
                            onChangeText={(value) => { this.setState({ item: { ...this.state.item, cobre: value } }) }} />
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Porção de Zinco</Label>
                        <Input keyboardType='numeric' value={this.state.item.zinco}
                            onChangeText={(value) => { this.setState({ item: { ...this.state.item, zinco: value } }) }} />
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Porção de Cloro</Label>
                        <Input keyboardType='numeric' value={this.state.item.cloro}
                            onChangeText={(value) => { this.setState({ item: { ...this.state.item, cloro: value } }) }} />
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Porção de Molibdenio</Label>
                        <Input keyboardType='numeric' value={this.state.item.molibdenio}
                            onChangeText={(value) => { this.setState({ item: { ...this.state.item, molibdenio: value } }) }} />
                    </Form>
                </Content>
            </Container>
        )
    }
}

