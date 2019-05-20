import React, { Component } from 'react'
import { Container, Text, Right, Icon, Left, Button, Body, Form, Item, Label, Input, Picker, Header, Content, Row } from 'native-base'
import { Actions } from 'react-native-router-flux'
import http from '../../services/Http'
import estilo from '../../assets/Estilo'

export default class FormSolo extends Component {
    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.http = new http()
        this.state = {
            item: {
                phMinimo: undefined,
                phMaximo: undefined,
                umidadeMinima: undefined,
                umidadeMaxima: undefined,
                quantidadeAreia: undefined,
                quantidadeArgila: undefined,
                quantidadeHumus: undefined,
                quantidadeMusgoSphagnum: undefined,
                quantidadeTerraVegetal: undefined,
                quantidadeTurfa: undefined,
            },

            descricoes: {
                areia: 'Material mineral com grãos médios e/ou grossos',
                argila: 'Material mineral com grãos finos',
                humus_de_minhoca: 'Matéria orgânica decomposta por minhocas',
                musgo_sphagnum: 'Tipo de musgo',
                terra_vegetal: 'Mistura de solo \'in natura\' com restos de vegetação decomposta',
                turfa: 'Matéria orgânica depositada em várzeas de rios',
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
                    phMinimo: this.props.item.phMinimo + '',
                    phMaximo: this.props.item.phMaximo + '',
                    umidadeMinima: this.props.item.umidadeMinima + '',
                    umidadeMaxima: this.props.item.umidadeMaxima + '',
                    quantidadeAreia: this.props.item.quantidadeAreia + '',
                    quantidadeArgila: this.props.item.quantidadeArgila + '',
                    quantidadeHumus: this.props.item.quantidadeHumus + '',
                    quantidadeMusgoSphagnum: this.props.item.quantidadeMusgoSphagnum + '',
                    quantidadeTerraVegetal: this.props.item.quantidadeTerraVegetal + '',
                    quantidadeTurfa: this.props.item.quantidadeTurfa + '',
                }
            })
        }
    }

    async save() {
        await this.http.post('solo', this.state.item)
            .then((data) => { return data })
        Actions.soloList()
    }

    calc_tipo_ph(value) {
        if (value == undefined || value == null) return ''
        if (value >= 7 && value <= 14) return 'Base'
        if (value >= 5 && value < 7) return 'Pouco Ácido'
        if (value >= 3 && value < 5) return 'Ácido'
        if (value >= 1.5 && value < 3) return 'Muito Ácido'
        if (value >= 0 && value < 1.5) return 'Extremamente Ácido'
        else return 'Ph deve estar entre 0 e 7'
    }

    calc_tipo_umidade(value) {
        if (value == undefined || value == null) return ''
        if (value >= 80 && value <= 100) return 'Alagado'
        if (value >= 60 && value < 80) return 'Muito Úmido'
        if (value >= 40 && value < 60) return 'Úmido'
        if (value >= 20 && value < 40) return 'Pouco Úmido'
        if (value >= 0 && value < 20) return 'Seco'
        else return 'Umidade deve estar entre 0 e 100'
    }

    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: this.estilo.cor.brown }}>
                    <Left>
                        <Button rounded transparent onPress={() => Actions.pop()}>
                            <Icon style={{ color: 'white' }} name='x' type='Feather' />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={this.estilo.title}>Solo</Text>
                    </Body>
                    <Right>
                        <Button rounded transparent onPress={() => this.save()}>
                            <Icon style={{ color: 'white' }} name='check' type='Feather' />
                        </Button>
                    </Right>
                </Header>
                <Content>
                    <Form style={this.estilo.form}>
                        <Label>Ph Mínimo</Label>
                        <Row>
                            <Input keyboardType='numeric' autoFocus={true} value={this.state.item.phMinimo}
                                onChangeText={(value) => { this.setState({ item: { ...this.state.item, phMinimo: value } }) }} />
                            <Row style={this.estilo.subrow}>
                                <Text style={{ margin: 7 }} >{this.calc_tipo_ph(this.state.item.phMinimo)}</Text>
                            </Row>
                        </Row>
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Ph Máximo</Label>
                        <Row>
                            <Input keyboardType='numeric' value={this.state.item.phMaximo}
                                onChangeText={(value) => { this.setState({ item: { ...this.state.item, phMaximo: value } }) }} />
                            <Row style={this.estilo.subrow}>
                                <Text style={{ margin: 7 }}> {this.calc_tipo_ph(this.state.item.phMaximo)} </Text>
                            </Row>
                        </Row>
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Umidade Mínima %</Label>
                        <Row>
                            <Input keyboardType='numeric' value={this.state.item.umidadeMinima}
                                onChangeText={(value) => { this.setState({ item: { ...this.state.item, umidadeMinima: value } }) }} />
                            <Row style={this.estilo.subrow}>
                                <Text style={{ margin: 7 }} >{this.calc_tipo_umidade(this.state.item.umidadeMinima)}</Text>
                            </Row>
                        </Row>
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Umidade Máxima %</Label>
                        <Row>
                            <Input keyboardType='numeric' value={this.state.item.umidadeMaxima}
                                onChangeText={(value) => { this.setState({ item: { ...this.state.item, umidadeMaxima: value } }) }} />
                            <Row style={this.estilo.subrow}>
                                <Text style={{ margin: 7 }} >{this.calc_tipo_umidade(this.state.item.umidadeMaxima)}</Text>
                            </Row>
                        </Row>
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Porção de Areia</Label>
                        <Input keyboardType='numeric' value={this.state.item.quantidadeAreia}
                            onChangeText={(value) => { this.setState({ item: { ...this.state.item, quantidadeAreia: value } }) }} />
                        {!this.state.item.quantidadeAreia ?
                            <Row style={this.estilo.subrow}>
                                <Text style={{ margin: 7 }} >{!this.state.item.quantidadeAreia ? this.state.descricoes.areia : null}</Text>
                            </Row> : null}
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Porção de Argila</Label>
                        <Input keyboardType='numeric' value={this.state.item.quantidadeArgila}
                            onChangeText={(value) => { this.setState({ item: { ...this.state.item, quantidadeArgila: value } }) }} />
                        {!this.state.item.quantidadeArgila ?
                            <Row style={this.estilo.subrow}>
                                <Text style={{ margin: 7 }} >{!this.state.item.quantidadeArgila ? this.state.descricoes.argila : null}</Text>
                            </Row> : null}
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Porção de Terra Vegetal</Label>
                        <Input keyboardType='numeric' value={this.state.item.quantidadeTerraVegetal}
                            onChangeText={(value) => { this.setState({ item: { ...this.state.item, quantidadeTerraVegetal: value } }) }} />
                        {!this.state.item.quantidadeTerraVegetal ?
                            <Row style={this.estilo.subrow}>
                                <Text style={{ margin: 7 }} >{!this.state.item.quantidadeTerraVegetal ? this.state.descricoes.terra_vegetal : null}</Text>
                            </Row> : null}
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Porção de Húmus de Minhoca / Terra Preta</Label>
                        <Input keyboardType='numeric' value={this.state.item.quantidadeHumus}
                            onChangeText={(value) => { this.setState({ item: { ...this.state.item, quantidadeHumus: value } }) }} />
                        {!this.state.item.quantidadeHumus ?
                            <Row style={this.estilo.subrow}>
                                <Text style={{ margin: 7 }} >{!this.state.item.quantidadeHumus ? this.state.descricoes.humus_de_minhoca : null}</Text>
                            </Row> : null}
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Porção de Turfa</Label>
                        <Input keyboardType='numeric' value={this.state.item.quantidadeTurfa}
                            onChangeText={(value) => { this.setState({ item: { ...this.state.item, quantidadeTurfa: value } }) }} />
                        {!this.state.item.quantidadeTurfa ?
                            <Row style={this.estilo.subrow}>
                                <Text style={{ margin: 7 }} >{!this.state.item.quantidadeTurfa ? this.state.descricoes.turfa : null}</Text>
                            </Row> : null}
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Porção de Musgo Sphagnum</Label>
                        <Input keyboardType='numeric' value={this.state.item.quantidadeMusgoSphagnum}
                            onChangeText={(value) => { this.setState({ item: { ...this.state.item, quantidadeMusgoSphagnum: value } }) }} />
                        {!this.state.item.quantidadeMusgoSphagnum ?
                            <Row style={this.estilo.subrow}>
                                <Text style={{ margin: 7 }} >{!this.state.item.quantidadeMusgoSphagnum ? this.state.descricoes.musgo_sphagnum : null}</Text>
                            </Row> : null}
                    </Form>
                    <Form style={this.estilo.form_vazio} />
                </Content>
            </Container>
        )
    }
}

