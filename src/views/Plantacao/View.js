import React, { Component } from 'react'
import { StatusBar, Dimensions, ScrollView } from 'react-native'
import { Container, Text, Button, Content, Row, Header, Body, Item, Form, Col, Icon, View, Left } from 'native-base'
import { Actions } from 'react-native-router-flux'
import estilo from '../../assets/Estilo'
import http from '../../services/Http'
import Card from '../../components/Card'
import FeatherIcon from 'react-native-vector-icons/Feather'
import LinearGradient from 'react-native-linear-gradient'
import loginService from '../../services/Login'

export default class PlantacaoView extends Component {

    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.http = new http()
        this.state = {
            plantacoes: [],
            usuario: undefined
        }
    }
    componentWillMount() {
        this.load()
    }

    async load() {
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
                <Header style={{ backgroundColor: this.estilo.cor.white, elevation: 0 }}>
                    <Left>
                        <Button rounded transparent onPress={() => Actions.pop()}>
                            <FeatherIcon name='arrow-left' style={{ color: this.estilo.cor.gray_solid, fontSize: 22, marginHorizontal: 5 }} />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={{ color: this.estilo.cor.gray_solid, fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>{this.props.item.nome}</Text>
                    </Body>
                    <Left style={{ alignItems: 'flex-end' }}>
                    </Left>
                </Header>
                <StatusBar backgroundColor={this.estilo.cor.white} barStyle="dark-content" />
                <Content>

                    {/* Clima */}
                    <LinearGradient colors={[this.estilo.cor.blue_light, this.estilo.cor.blue_solid]}
                        useAngle={true} angle={45} angleCenter={{ x: 0.3, y: 0.5 }}
                        style={{
                            width: Dimensions.get('screen').width * .9, borderRadius: 20, marginTop: 20,
                            alignSelf: 'center', elevation: 10, padding: 20, alignItems: 'flex-end', flexWrap: 'wrap'
                        }}>
                        <Text style={{ fontSize: 18, color: this.estilo.cor.white, fontWeight: 'bold' }} >{'Clima ' + this.props.item.cultura.clima.tipo}</Text>
                        <Row style={{ alignItems: 'flex-end' }}>
                            <Text style={{ fontSize: 16, color: this.estilo.cor.white }}>Temperatura  </Text>
                            <Text style={{ fontSize: 18, color: this.estilo.cor.white, fontWeight: 'bold' }} >
                                {this.props.item.cultura.clima.temperaturaMinima + ' | ' + this.props.item.cultura.clima.temperaturaMaxima + ' ºC'}
                            </Text>
                        </Row>
                        <Row style={{ alignItems: 'flex-end' }}>
                            <Text style={{ fontSize: 16, color: this.estilo.cor.white }}>Umidade do ar  </Text>
                            <Text style={{ fontSize: 18, color: this.estilo.cor.white, fontWeight: 'bold' }} >
                                {this.props.item.cultura.clima.umidadeMinima + ' | ' + this.props.item.cultura.clima.umidadeMaxima + ' %'}
                            </Text>
                        </Row>
                    </LinearGradient>

                    {/* Solo */}
                    <LinearGradient colors={[this.estilo.cor.brown, this.estilo.cor.brwon_light]}
                        useAngle={true} angle={45} angleCenter={{ x: 0.8, y: 0.5 }}
                        style={{
                            width: Dimensions.get('screen').width * .9, borderRadius: 20, marginTop: 20,
                            alignSelf: 'center', elevation: 10, padding: 20, flexWrap: 'wrap'
                        }}>
                        <Text style={{ fontSize: 18, color: this.estilo.cor.white, fontWeight: 'bold' }} >Solo</Text>
                        <Row style={{ alignItems: 'flex-end' }}>
                            <Text style={{ fontSize: 16, color: this.estilo.cor.white }}>Acidez  </Text>
                            <Text style={{ fontSize: 18, color: this.estilo.cor.white, fontWeight: 'bold' }} >
                                {this.props.item.cultura.solo.phMinimo + ' | ' + this.props.item.cultura.solo.phMaximo + ' ph'}
                            </Text>
                        </Row>
                        <Row style={{ alignItems: 'flex-end' }}>
                            <Text style={{ fontSize: 16, color: this.estilo.cor.white }}>Umidade  </Text>
                            <Text style={{ fontSize: 18, color: this.estilo.cor.white, fontWeight: 'bold' }} >
                                {this.props.item.cultura.solo.umidadeMinima + ' | ' + this.props.item.cultura.solo.umidadeMaxima + ' %'}
                            </Text>
                        </Row>
                        <Row style={{ alignItems: 'flex-end', flexWrap: 'wrap' }}>
                            <Text style={{ fontSize: 16, color: this.estilo.cor.white }}>{this.props.item.cultura.solo.quantidadeAreia > 0 ? 'Areia (' + this.props.item.cultura.solo.quantidadeAreia + ') ' : null}
                                {this.props.item.cultura.solo.quantidadeArgila > 0 ? 'Argila (' + this.props.item.cultura.solo.quantidadeArgila + ') ' : null}
                                {this.props.item.cultura.solo.quantidadeHumus > 0 ? 'Húmus (' + this.props.item.cultura.solo.quantidadeHumus + ') ' : null}
                                {this.props.item.cultura.solo.quantidadeMusgoSphagnum > 0 ? 'Sphagnum (' + this.props.item.cultura.solo.quantidadeMusgoSphagnum + ') ' : null}
                                {this.props.item.cultura.solo.quantidadeTerraVegetal > 0 ? 'Terra (' + this.props.item.cultura.solo.quantidadeTerraVegetal + ') ' : null}
                                {this.props.item.cultura.solo.quantidadeTurfa > 0 ? 'Turfa (' + this.props.item.cultura.solo.quantidadeTurfa + ') ' : null}</Text>
                        </Row>
                    </LinearGradient>

                    {/* Luz */}
                    <LinearGradient colors={[this.estilo.cor.orange, this.estilo.cor.orange_medium]}
                        useAngle={true} angle={45} angleCenter={{ x: 0.5, y: 0.5 }}
                        style={{
                            width: Dimensions.get('screen').width * .9, borderRadius: 20, marginTop: 20,
                            alignSelf: 'center', elevation: 10, padding: 20, alignItems: 'flex-end', flexWrap: 'wrap'
                        }}>
                        {this.props.item.cultura.luz.intensidade == 'Sombra' || !this.props.item.cultura.luz.horasPorDia ?
                            <Row style={{ alignItems: 'flex-end' }}>
                                <Text style={{ fontSize: 18, color: this.estilo.cor.white, fontWeight: 'bold' }}>Sombra</Text>
                            </Row>
                            : <Row style={{ alignItems: 'flex-end' }}>
                                <Text style={{ fontSize: 18, color: this.estilo.cor.white, fontWeight: 'bold' }}>Luz </Text>
                                <Text style={{ fontSize: 18, color: this.estilo.cor.white, fontWeight: 'bold' }}>
                                    {this.props.item.cultura.luz.intensidade}
                                </Text>
                            </Row>}
                        {this.props.item.cultura.luz.intensidade == 'Sombra' || !this.props.item.cultura.luz.horasPorDia ? null :
                            <Row style={{ alignItems: 'flex-end' }}>
                                <Text style={{ fontSize: 18, color: this.estilo.cor.white, fontWeight: 'bold' }}>{this.props.item.cultura.luz.horasPorDia}</Text>
                                <Text style={{ fontSize: 16, color: this.estilo.cor.white }}>{this.props.item.cultura.luz.horasPorDia > 1 ? ' horas' : ' hora'} {'por dia'}</Text>
                            </Row>}
                    </LinearGradient>

                    {/* Nutrientes */}
                    <LinearGradient colors={[this.estilo.cor.purple, this.estilo.cor.purple_vivid]}
                        useAngle={true} angle={45} angleCenter={{ x: 0.8, y: 0.5 }}
                        style={{
                            width: Dimensions.get('screen').width * .9, borderRadius: 20, marginVertical: 20,
                            alignSelf: 'center', elevation: 10, padding: 20, flexWrap: 'wrap'
                        }}>
                        <Text style={{ fontSize: 18, color: this.estilo.cor.white, fontWeight: 'bold' }} >Nutrientes</Text>
                        <Row style={{ flexWrap: 'wrap' }}>
                            <Text style={{ fontSize: 16, color: this.estilo.cor.white }}>
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
                                <Text style={{ fontSize: 16, color: this.estilo.cor.white }}>
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
                    </LinearGradient>
                </Content>
            </Container>
        )
    }
}