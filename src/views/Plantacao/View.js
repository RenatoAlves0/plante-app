import React, { Component } from 'react'
import { StatusBar, Dimensions, ScrollView } from 'react-native'
import { Container, Text, Button, Content, Row, Header, Body, Form, Icon, View, Left } from 'native-base'
import { Actions } from 'react-native-router-flux'
import estilo from '../../assets/Estilo'
import http from '../../services/Http'
import FeatherIcon from 'react-native-vector-icons/Feather'
import loginService from '../../services/Login'

export default class PlantacaoView extends Component {
    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.http = new http()
        this.state = {
            item: {
                nome: undefined,
                cultura: { _id: undefined },
                localizacao: undefined,
                cidade: { _id: undefined },
                usuario: undefined,
                cor: 0,
            },
            plantacoes: [],
            usuario: undefined,
            principal: false,
        }
    }

    componentWillMount() {
        this.load()
    }

    async load() {
        if (this.props.item) await this.setState({ item: this.props.item })
    }

    async login() {
        await loginService.get().then(async (data) => {
            await this.setState({ usuario: data.usuario })
        })
    }

    calc_tipo_umidade(value) {
        if (value == undefined || value == null) return ''
        if (value >= 80 && value <= 100) return 'Alagado'
        if (value >= 60 && value < 80) return 'Muito Ùmido'
        if (value >= 40 && value < 60) return 'Ùmido'
        if (value >= 20 && value < 40) return 'Pouco Úmido'
        if (value >= 0 && value < 20) return 'Seco'
        else return 'Umidade deve estar entre 0 e 100'
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

    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: this.estilo.cor_platacao[this.state.item.cor], elevation: 0 }}>
                    <Left>
                        <Button rounded transparent onPress={() => Actions.pop()}>
                            <FeatherIcon name='chevron-left' style={{ color: this.estilo.cor.white, fontSize: 22, marginHorizontal: 5 }} />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={{ color: this.estilo.cor.white, fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>{this.props.item.nome}</Text>
                    </Body>
                    <Left style={{ alignItems: 'flex-end', paddingRight: 2 }}>
                    </Left>
                </Header>
                <StatusBar backgroundColor={this.estilo.cor_platacao[this.state.item.cor]} barStyle="light-content" />
                <Content>
                    <View style={{
                        backgroundColor: this.estilo.cor_platacao[this.state.item.cor], elevation: 10,
                        paddingTop: 20, paddingHorizontal: 30, paddingBottom: 70
                    }}>
                        <Text uppercase={false} style={{ color: this.estilo.cor.white + '99', fontSize: 18, paddingRight: 0, paddingLeft: 0, alignSelf: 'flex-end' }} >{this.props.item.localizacao + ', ' + this.props.item.cidade.nome}</Text>
                        <Form style={{ borderBottomWidth: 1, borderBottomColor: this.estilo.cor.white + '99', marginVertical: 10 }} />
                        <Text uppercase={false} style={{ color: this.estilo.cor.white, fontSize: 18, paddingRight: 0, paddingLeft: 0 }} >{this.props.item.cultura.nome}</Text>
                        <Text uppercase={false} style={{ color: this.estilo.cor.white + '99', fontSize: 16, paddingRight: 0, paddingLeft: 0 }} >{this.props.item.cultura.especie.nome + ' - ' + this.props.item.cultura.genero.nome + ' - ' + this.props.item.cultura.familia.nome}</Text>

                        <Row style={{ width: Dimensions.get('screen').width * .9, alignSelf: 'center', justifyContent: 'flex-end' }}>
                            <Button rounded style={{
                                backgroundColor: 'transparent', borderRadius: 20,
                                marginTop: 20, elevation: 0, paddingHorizontal: 10
                            }} onPress={() => Actions.plantacaoForm({ item: this.props.item })}>
                                <FeatherIcon name='edit-2' style={{ color: this.estilo.cor.white, fontSize: 24, marginHorizontal: 5 }} />
                            </Button>

                            <Button rounded style={{
                                backgroundColor: 'transparent', borderRadius: 20, marginRight: 10,
                                marginTop: 20, elevation: 0, paddingHorizontal: 10
                            }}>
                                <FeatherIcon name='trash-2' style={{ color: this.estilo.cor.white, fontSize: 24, marginHorizontal: 5 }} />
                            </Button>

                            <Button style={{
                                backgroundColor: this.state.principal ? this.estilo.cor.white + '11' : 'transparent',
                                borderRadius: 20, marginTop: 20, justifyContent: 'flex-end',
                                elevation: 0, paddingHorizontal: 10
                            }} onPress={() => this.setState({ principal: !this.state.principal })}>
                                <Text uppercase={false} style={{
                                    color: this.state.principal ? this.estilo.cor.white : this.estilo.cor.white + '77', fontSize: 18
                                }}>Principal</Text>
                            </Button>
                        </Row>

                    </View>

                    {/* Clima */}
                    <Form style={{
                        backgroundColor: this.estilo.cor.white,
                        width: Dimensions.get('screen').width * .9, borderRadius: 20, marginTop: -50,
                        alignSelf: 'center', elevation: 60, padding: 20, flexWrap: 'wrap'
                    }}>
                        <Row style={{ marginBottom: 10, flexWrap: 'wrap' }}>
                            <FeatherIcon name='thermometer' style={{ color: this.estilo.cor.gray_solid, fontSize: 24, marginLeft: -5 }} />
                            <Text style={{ fontSize: 18, color: this.estilo.cor.gray_solid, fontWeight: 'bold' }} >{'  Clima ' + this.props.item.cultura.clima.tipo}</Text>
                        </Row>
                        <Row style={{ alignItems: 'flex-end', flexWrap: 'wrap' }}>
                            <Text style={{ fontSize: 16, color: this.estilo.cor.gray_solid }}>Temperatura  </Text>
                            <Text style={{ fontSize: 18, color: this.estilo.cor.gray_solid, fontWeight: 'bold' }} >
                                {this.props.item.cultura.clima.temperaturaMinima + ' | ' + this.props.item.cultura.clima.temperaturaMaxima + ' ºC'}
                            </Text>
                        </Row>
                        <Row style={{ alignItems: 'flex-end', flexWrap: 'wrap' }}>
                            <Text style={{ fontSize: 16, color: this.estilo.cor.gray_solid }}>Umidade do ar  </Text>
                            <Text style={{ fontSize: 18, color: this.estilo.cor.gray_solid, fontWeight: 'bold' }} >
                                {this.props.item.cultura.clima.umidadeMinima + ' | ' + this.props.item.cultura.clima.umidadeMaxima + ' %'}
                            </Text>
                        </Row>
                    </Form>

                    {/* Solo */}
                    <Form style={{
                        backgroundColor: this.estilo.cor.white,
                        width: Dimensions.get('screen').width * .9, borderRadius: 20, marginTop: 20,
                        alignSelf: 'center', elevation: 60, padding: 20, flexWrap: 'wrap'
                    }}>
                        <Row style={{ marginBottom: 10 }}>
                            <Icon name='grain' type='MaterialIcons' style={{ color: this.estilo.cor.gray_solid, fontSize: 24, marginLeft: -5 }} />
                            <Text style={{ fontSize: 18, color: this.estilo.cor.gray_solid, fontWeight: 'bold' }}>  Solo</Text>
                        </Row>
                        <Row style={{ alignItems: 'flex-end', flexWrap: 'wrap' }}>
                            <Text style={{ fontSize: 16, color: this.estilo.cor.gray_solid }}>Acidez  </Text>
                            <Text style={{ fontSize: 18, color: this.estilo.cor.gray_solid, fontWeight: 'bold' }} >
                                {this.props.item.cultura.solo.phMinimo + ' | ' + this.props.item.cultura.solo.phMaximo + ' ph'}
                            </Text>
                        </Row>
                        <Row style={{ alignItems: 'flex-end', flexWrap: 'wrap' }}>
                            <Text style={{ fontSize: 16, color: this.estilo.cor.gray_solid }}>Umidade  </Text>
                            <Text style={{ fontSize: 18, color: this.estilo.cor.gray_solid, fontWeight: 'bold' }} >
                                {this.props.item.cultura.solo.umidadeMinima + ' | ' + this.props.item.cultura.solo.umidadeMaxima + ' %'}
                            </Text>
                        </Row>
                        <Row style={{ alignItems: 'flex-end', flexWrap: 'wrap' }}>
                            <Text style={{ fontSize: 16, color: this.estilo.cor.gray_solid }}>{this.props.item.cultura.solo.quantidadeAreia > 0 ? 'Areia (' + this.props.item.cultura.solo.quantidadeAreia + ') ' : null}
                                {this.props.item.cultura.solo.quantidadeArgila > 0 ? 'Argila (' + this.props.item.cultura.solo.quantidadeArgila + ') ' : null}
                                {this.props.item.cultura.solo.quantidadeHumus > 0 ? 'Húmus (' + this.props.item.cultura.solo.quantidadeHumus + ') ' : null}
                                {this.props.item.cultura.solo.quantidadeMusgoSphagnum > 0 ? 'Sphagnum (' + this.props.item.cultura.solo.quantidadeMusgoSphagnum + ') ' : null}
                                {this.props.item.cultura.solo.quantidadeTerraVegetal > 0 ? 'Terra (' + this.props.item.cultura.solo.quantidadeTerraVegetal + ') ' : null}
                                {this.props.item.cultura.solo.quantidadeTurfa > 0 ? 'Turfa (' + this.props.item.cultura.solo.quantidadeTurfa + ') ' : null}</Text>
                        </Row>
                    </Form>

                    {/* Luz */}
                    <Form style={{
                        backgroundColor: this.estilo.cor.white,
                        width: Dimensions.get('screen').width * .9, borderRadius: 20, marginTop: 20,
                        alignSelf: 'center', elevation: 60, padding: 20, flexWrap: 'wrap'
                    }}>
                        {this.props.item.cultura.luz.intensidade == 'Sombra' || !this.props.item.cultura.luz.horasPorDia ?
                            <Row style={{ marginBottom: 10, alignItems: 'flex-end' }}>
                                <FeatherIcon name='cloud' style={{ color: this.estilo.cor.gray_solid, fontSize: 24, marginLeft: -5 }} />
                                <Text style={{ fontSize: 18, color: this.estilo.cor.gray_solid, fontWeight: 'bold' }}>  Sombra</Text>
                            </Row>
                            : <Row style={{ marginBottom: 10, alignItems: 'flex-end' }}>
                                <FeatherIcon name='sun' style={{ color: this.estilo.cor.gray_solid, fontSize: 24, marginLeft: -5 }} />
                                <Text style={{ fontSize: 18, color: this.estilo.cor.gray_solid, fontWeight: 'bold' }}>  Luz </Text>
                                <Text style={{ fontSize: 18, color: this.estilo.cor.gray_solid, fontWeight: 'bold' }}>
                                    {this.props.item.cultura.luz.intensidade}
                                </Text>
                            </Row>}
                        {this.props.item.cultura.luz.intensidade == 'Sombra' || !this.props.item.cultura.luz.horasPorDia ? null :
                            <Row style={{ alignItems: 'flex-end', flexWrap: 'wrap' }}>
                                <Text style={{ fontSize: 18, color: this.estilo.cor.gray_solid, fontWeight: 'bold' }}>{this.props.item.cultura.luz.horasPorDia}</Text>
                                <Text style={{ fontSize: 16, color: this.estilo.cor.gray_solid }}>{this.props.item.cultura.luz.horasPorDia > 1 ? '  horas' : '  hora'} {'por dia'}</Text>
                            </Row>}
                    </Form>

                    {/* Nutrientes */}
                    <Form style={{
                        backgroundColor: this.estilo.cor.white,
                        width: Dimensions.get('screen').width * .9, borderRadius: 20, marginVertical: 20,
                        alignSelf: 'center', elevation: 60, padding: 20, flexWrap: 'wrap'
                    }}>
                        <Row style={{ marginBottom: 10 }}>
                            <Icon name='chemistry' type='SimpleLineIcons' style={{ color: this.estilo.cor.gray_solid, fontSize: 24, marginLeft: -5 }} />
                            <Text style={{ fontSize: 18, color: this.estilo.cor.gray_solid, fontWeight: 'bold' }}>  Nutrientes</Text>
                        </Row>
                        <Row style={{ flexWrap: 'wrap' }}>
                            <Text style={{ fontSize: 16, color: this.estilo.cor.gray_solid }}>
                                {this.props.item.cultura.nutriente.nitrogenio > 0 ? 'Nitrogênio (' + this.props.item.cultura.nutriente.nitrogenio + ') ' : null}
                                {this.props.item.cultura.nutriente.fosforo > 0 ? 'Fósforo (' + this.props.item.cultura.nutriente.fosforo + ') ' : null}
                                {this.props.item.cultura.nutriente.potassio > 0 ? 'Potássio (' + this.props.item.cultura.nutriente.potassio + ') ' : null}</Text>
                        </Row>
                        {this.props.item.cultura.nutriente.magnesio || this.props.item.cultura.nutriente.calcio
                            || this.props.item.cultura.nutriente.enxofre || this.props.item.cultura.nutriente.ferro
                            || this.props.item.cultura.nutriente.manganes || this.props.item.cultura.nutriente.boro
                            || this.props.item.cultura.nutriente.cobre || this.props.item.cultura.nutriente.zinco
                            || this.props.item.cultura.nutriente.cloro || this.props.item.cultura.nutriente.molibdenio ?
                            <Row style={{ flexWrap: 'wrap' }}>
                                <Text style={{ fontSize: 16, color: this.estilo.cor.gray_solid }}>
                                    {this.props.item.cultura.nutriente.magnesio > 0 ? 'Magnésio (' + this.props.item.cultura.nutriente.magnesio + ') ' : null}
                                    {this.props.item.cultura.nutriente.calcio > 0 ? 'Cálcio (' + this.props.item.cultura.nutriente.calcio + ') ' : null}
                                    {this.props.item.cultura.nutriente.enxofre > 0 ? 'Enxôfre (' + this.props.item.cultura.nutriente.enxofre + ') ' : null}
                                    {this.props.item.cultura.nutriente.ferro > 0 ? 'Ferro (' + this.props.item.cultura.nutriente.ferro + ') ' : null}
                                    {this.props.item.cultura.nutriente.manganes > 0 ? 'Manganês (' + this.props.item.cultura.nutriente.manganes + ') ' : null}
                                    {this.props.item.cultura.nutriente.boro > 0 ? 'Boro (' + this.props.item.cultura.nutriente.boro + ') ' : null}
                                    {this.props.item.cultura.nutriente.cobre > 0 ? 'Cobre (' + this.props.item.cultura.nutriente.cobre + ') ' : null}
                                    {this.props.item.cultura.nutriente.zinco > 0 ? 'Zinco (' + this.props.item.cultura.nutriente.zinco + ') ' : null}
                                    {this.props.item.cultura.nutriente.cloro > 0 ? 'Cloro (' + this.props.item.cultura.nutriente.cloro + ') ' : null}
                                    {this.props.item.cultura.nutriente.molibdenio > 0 ? 'Molibdenio (' + this.props.item.cultura.nutriente.molibdenio + ') ' : null}</Text>
                            </Row> : null}
                    </Form>
                </Content>
            </Container>
        )
    }
}