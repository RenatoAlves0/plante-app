import React, { Component } from 'react'
import { StatusBar } from 'react-native'
import { Container, Text, Right, Icon, Left, Button, Body, Form, Item, Label, Input, Picker, Header, Content, Row } from 'native-base'
import { Actions } from 'react-native-router-flux'
import http from '../../services/Http'
import estilo from '../../assets/Estilo'
import FeatherIcon from 'react-native-vector-icons/Feather'

export default class FormNutriente extends Component {
    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.http = new http()
        this.state = {
            validNitrogenio: true,
            validFosforo: true,
            validPotassio: true,
            validMagnesio: true,
            validCalcio: true,
            validEnxofre: true,
            validFerro: true,
            validManganes: true,
            validBoro: true,
            validCobre: true,
            validZinco: true,
            validCloro: true,
            validMolibdenio: true,

            item: {
                nitrogenio: undefined,
                fosforo: undefined,
                potassio: undefined,
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

    componentDidMount() {
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
                    nitrogenio: this.props.item.nitrogenio + '',
                    fosforo: this.props.item.fosforo + '',
                    potassio: this.props.item.potassio + '',
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
        if (this.state.item._id)
            await this.http.put('nutrientes', this.state.item._id, this.state.item, 1)
                .then((data) => { return data })
        else
            await this.http.post('nutrientes', this.state.item, 1)
                .then((data) => { return data })
        this.props.pop ? Actions.plantaForm({ item: this.props.item }) : Actions.nutrienteList()
    }

    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: this.estilo.cor.purple }}>
                    <Left>
                        <Button rounded transparent onPress={() => Actions.pop()}>
                            <FeatherIcon name='x' style={{ color: this.estilo.cor.white, fontSize: 22, marginHorizontal: 5 }} />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={this.estilo.title}>Nutriente</Text>
                    </Body>
                    <Right>
                        {this.state.item.nitrogenio && this.state.item.fosforo && this.state.item.potassio
                            && this.state.validNitrogenio && this.state.validFosforo && this.state.validPotassio
                            && this.state.validMagnesio && this.state.validCalcio && this.state.validEnxofre
                            && this.state.validFerro && this.state.validManganes && this.state.validBoro
                            && this.state.validCobre && this.state.validZinco && this.state.validCloro
                            && this.state.validMolibdenio ?
                            <Button rounded transparent onPress={() => this.save()}>
                                <FeatherIcon name='check' style={{ color: this.estilo.cor.white, fontSize: 22 }} />
                            </Button> : null}
                    </Right>
                </Header>
                <StatusBar backgroundColor={this.estilo.cor.purple} barStyle="light-content" />
                <Content>
                    <Form style={this.estilo.form}>
                        <Label>Porção de Nitrogênio</Label>
                        <Row>
                            <Input keyboardType='numeric' autoFocus={true} value={this.state.item.nitrogenio}
                                onChangeText={(value) => {
                                    this.setState({ item: { ...this.state.item, nitrogenio: value } }),
                                        value > 100 || value < 0 ? this.setState({ validNitrogenio: false }) :
                                            this.setState({ validNitrogenio: true })
                                }} />
                            {!this.state.validNitrogenio ? <Row style={this.estilo.subrow}>
                                <Text style={{ margin: 7 }} >{'Nitrogênio deve estar entre 0 e 100'}</Text>
                            </Row> : null}
                        </Row>
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Porção de Fósforo</Label>
                        <Row>
                            <Input keyboardType='numeric' value={this.state.item.fosforo}
                                onChangeText={(value) => {
                                    this.setState({ item: { ...this.state.item, fosforo: value } }),
                                        value > 100 || value < 0 ? this.setState({ validFosforo: false }) :
                                            this.setState({ validFosforo: true })
                                }} />
                            {!this.state.validFosforo ? <Row style={this.estilo.subrow}>
                                <Text style={{ margin: 7 }} >{'Fósforo deve estar entre 0 e 100'}</Text>
                            </Row> : null}
                        </Row>
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Porção de Potássio</Label>
                        <Row>
                            <Input keyboardType='numeric' value={this.state.item.potassio}
                                onChangeText={(value) => {
                                    this.setState({ item: { ...this.state.item, potassio: value } }),
                                        value > 100 || value < 0 ? this.setState({ validPotassio: false }) :
                                            this.setState({ validPotassio: true })
                                }} />
                            {!this.state.validPotassio ? <Row style={this.estilo.subrow}>
                                <Text style={{ margin: 7 }} >{'Potássio deve estar entre 0 e 100'}</Text>
                            </Row> : null}
                        </Row>
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Porção de Magnésio</Label>
                        <Row>
                            <Input keyboardType='numeric' value={this.state.item.magnesio}
                                onChangeText={(value) => {
                                    this.setState({ item: { ...this.state.item, magnesio: value } }),
                                        value > 100 || value < 0 ? this.setState({ validMagnesio: false }) :
                                            this.setState({ validMagnesio: true })
                                }} />
                            {!this.state.validMagnesio ? <Row style={this.estilo.subrow}>
                                <Text style={{ margin: 7 }} >{'Magnésio deve estar entre 0 e 100'}</Text>
                            </Row> : null}
                        </Row>
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Porção de Cálcio</Label>
                        <Row>
                            <Input keyboardType='numeric' value={this.state.item.calcio}
                                onChangeText={(value) => {
                                    this.setState({ item: { ...this.state.item, calcio: value } }),
                                        value > 100 || value < 0 ? this.setState({ validCalcio: false }) :
                                            this.setState({ validCalcio: true })
                                }} />
                            {!this.state.validCalcio ? <Row style={this.estilo.subrow}>
                                <Text style={{ margin: 7 }} >{'Cálcio deve estar entre 0 e 100'}</Text>
                            </Row> : null}
                        </Row>
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Porção de Enxôfre</Label>
                        <Row>
                            <Input keyboardType='numeric' value={this.state.item.enxofre}
                                onChangeText={(value) => {
                                    this.setState({ item: { ...this.state.item, enxofre: value } }),
                                        value > 100 || value < 0 ? this.setState({ validEnxofre: false }) :
                                            this.setState({ validEnxofre: true })
                                }} />
                            {!this.state.validEnxofre ? <Row style={this.estilo.subrow}>
                                <Text style={{ margin: 7 }} >{'Enxôfre deve estar entre 0 e 100'}</Text>
                            </Row> : null}
                        </Row>
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Porção de Ferro</Label>
                        <Row>
                            <Input keyboardType='numeric' value={this.state.item.ferro}
                                onChangeText={(value) => {
                                    this.setState({ item: { ...this.state.item, ferro: value } }),
                                        value > 100 || value < 0 ? this.setState({ validFerro: false }) :
                                            this.setState({ validFerro: true })
                                }} />
                            {!this.state.validFerro ? <Row style={this.estilo.subrow}>
                                <Text style={{ margin: 7 }} >{'Ferro deve estar entre 0 e 100'}</Text>
                            </Row> : null}
                        </Row>
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Porção de Manganês</Label>
                        <Row>
                            <Input keyboardType='numeric' value={this.state.item.manganes}
                                onChangeText={(value) => {
                                    this.setState({ item: { ...this.state.item, manganes: value } }),
                                        value > 100 || value < 0 ? this.setState({ validManganes: false }) :
                                            this.setState({ validManganes: true })
                                }} />
                            {!this.state.validManganes ? <Row style={this.estilo.subrow}>
                                <Text style={{ margin: 7 }} >{'Manganês deve estar entre 0 e 100'}</Text>
                            </Row> : null}
                        </Row>
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Porção de Boro</Label>
                        <Row>
                            <Input keyboardType='numeric' value={this.state.item.boro}
                                onChangeText={(value) => {
                                    this.setState({ item: { ...this.state.item, boro: value } }),
                                        value > 100 || value < 0 ? this.setState({ validBoro: false }) :
                                            this.setState({ validBoro: true })
                                }} />
                            {!this.state.validBoro ? <Row style={this.estilo.subrow}>
                                <Text style={{ margin: 7 }} >{'Boro deve estar entre 0 e 100'}</Text>
                            </Row> : null}
                        </Row>
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Porção de Cobre</Label>
                        <Row>
                            <Input keyboardType='numeric' value={this.state.item.cobre}
                                onChangeText={(value) => {
                                    this.setState({ item: { ...this.state.item, cobre: value } }),
                                        value > 100 || value < 0 ? this.setState({ validCobre: false }) :
                                            this.setState({ validCobre: true })
                                }} />
                            {!this.state.validCobre ? <Row style={this.estilo.subrow}>
                                <Text style={{ margin: 7 }} >{'Cobre deve estar entre 0 e 100'}</Text>
                            </Row> : null}
                        </Row>
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Porção de Zinco</Label>
                        <Row>
                            <Input keyboardType='numeric' value={this.state.item.zinco}
                                onChangeText={(value) => {
                                    this.setState({ item: { ...this.state.item, zinco: value } }),
                                        value > 100 || value < 0 ? this.setState({ validZinco: false }) :
                                            this.setState({ validZinco: true })
                                }} />
                            {!this.state.validZinco ? <Row style={this.estilo.subrow}>
                                <Text style={{ margin: 7 }} >{'Zinco deve estar entre 0 e 100'}</Text>
                            </Row> : null}
                        </Row>
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Porção de Cloro</Label>
                        <Row>
                            <Input keyboardType='numeric' value={this.state.item.cloro}
                                onChangeText={(value) => {
                                    this.setState({ item: { ...this.state.item, cloro: value } }),
                                        value > 100 || value < 0 ? this.setState({ validCloro: false }) :
                                            this.setState({ validCloro: true })
                                }} />
                            {!this.state.validCloro ? <Row style={this.estilo.subrow}>
                                <Text style={{ margin: 7 }} >{'Cloro deve estar entre 0 e 100'}</Text>
                            </Row> : null}
                        </Row>
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Porção de Molibdenio</Label>
                        <Row>
                            <Input keyboardType='numeric' value={this.state.item.molibdenio}
                                onChangeText={(value) => {
                                    this.setState({ item: { ...this.state.item, molibdenio: value } }),
                                        value > 100 || value < 0 ? this.setState({ validMolibdenio: false }) :
                                            this.setState({ validMolibdenio: true })
                                }} />
                            {!this.state.validMolibdenio ? <Row style={this.estilo.subrow}>
                                <Text style={{ margin: 7 }} >{'Molibdenio deve estar entre 0 e 100'}</Text>
                            </Row> : null}
                        </Row>
                    </Form>
                    <Form style={this.estilo.form_vazio} />
                </Content>
            </Container>
        )
    }
}