import React, { Component } from 'react'
import { StatusBar, Dimensions, ScrollView } from 'react-native'
import { Container, Text, Button, Content, Row, Header, Body, Item, Form, Col, Icon, View } from 'native-base'
import { Actions } from 'react-native-router-flux'
import estilo from '../../assets/Estilo'
import http from '../../services/Http'
import Card from '../../components/Card'
import FeatherIcon from 'react-native-vector-icons/Feather'
import LinearGradient from 'react-native-linear-gradient'

export default class PlantacaoList extends Component {

    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.http = new http()
        this.state = {
            plantacoes: []
        }
    }
    componentWillMount() {
        this.load()
    }

    async load() {
        await this.plantacoes()
    }

    async plantacoes() {
        let aux = [], obj = {}
        this.http.get('plantacaos', 0).then(async (data) => {
            await data.forEach(async plantacao => {
                await this.http.get('plantas/' + plantacao.cultura, 1).then(async (_data) => {
                    obj = plantacao
                    obj.cultura = _data
                    await aux.push(obj)
                })
                await this.setState({ plantacoes: aux })
            })
        })
    }

    nova_plantacao = () => {
        Actions.plantacaoForm()
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
                    <Button rounded transparent onPress={() => Actions.pop()}>
                        <FeatherIcon name='arrow-left' style={{ color: this.estilo.cor.gray_solid, fontSize: 22, marginHorizontal: 5 }} />
                    </Button>
                    <Body>
                        <Text style={{ color: this.estilo.cor.gray_solid, fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>Plantações</Text>
                    </Body>
                    <Button rounded transparent onPress={() => this.nova_plantacao()}>
                        <FeatherIcon name='plus' style={{ color: this.estilo.cor.gray_solid, fontSize: 22, marginHorizontal: 10 }} />
                    </Button>
                </Header>
                <StatusBar backgroundColor={this.estilo.cor.white} barStyle="dark-content" />
                <Content>
                    <ScrollView style={[this.state.plantacoes && this.state.plantacoes[0] ? {} : this.estilo.hide]}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        decelerationRate='fast'
                        snapToAlignment='center'
                        snapToInterval={20 + Dimensions.get('screen').width * .8}>
                        <Row style={{ justifyContent: 'center', flexWrap: 'wrap' }} >
                            <Form style={{ width: Dimensions.get('screen').width * .05, height: 200 }} />
                            {this.state.plantacoes.map((item) => (
                                <View key={item._id} style={{ width: Dimensions.get('screen').width * .8, marginLeft: Dimensions.get('screen').width * .05 }} >
                                    <LinearGradient colors={[this.estilo.cor.greenish_solid, this.estilo.cor.greenish_medium]}
                                        useAngle={true} angle={45} angleCenter={{ x: 0.5, y: 0.5 }}
                                        style={{
                                            width: '100%', borderRadius: 20, marginTop: 20,
                                            alignSelf: 'center', elevation: 5, minHeight: 150, padding: 20
                                        }}>
                                        <Text uppercase={false} style={{ color: this.estilo.cor.white, fontSize: 18, paddingRight: 0, paddingLeft: 0, alignSelf: 'flex-end' }} >{item.nome}</Text>
                                        <Text uppercase={false} style={{ color: this.estilo.cor.white + '99', fontSize: 18, paddingRight: 0, paddingLeft: 0, alignSelf: 'flex-end' }} >{item.localizacao + ', ' + item.cidade.nome}</Text>
                                        <Form style={{ borderBottomWidth: 1, borderBottomColor: this.estilo.cor.white + '99', marginVertical: 10 }} />
                                        <Text uppercase={false} style={{ color: this.estilo.cor.white, fontSize: 18, paddingRight: 0, paddingLeft: 0 }} >{item.cultura.nome}</Text>
                                        <Text uppercase={false} style={{ color: this.estilo.cor.white + '99', fontSize: 15, paddingRight: 0, paddingLeft: 0 }} >{item.cultura.especie.nome + ' - ' + item.cultura.genero.nome + ' - ' + item.cultura.familia.nome}</Text>
                                    </LinearGradient>

                                    <Content>

                                        {/* Clima */}
                                        <Col style={{ alignItems: 'flex-end', marginTop: 20, backgroundColor: this.estilo.cor.gray_white, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10, elevation: 10 }}>
                                            <Text style={{ fontSize: 18, color: this.estilo.cor.gray_solid, fontWeight: 'bold' }} >{'Clima ' + item.cultura.clima.tipo}</Text>
                                            <Row style={{ alignItems: 'flex-end' }}>
                                                <Text style={{ fontSize: 16, color: this.estilo.cor.gray_solid }}>Temperatura  </Text>
                                                <Text style={{ fontSize: 18, color: this.estilo.cor.gray_solid, fontWeight: 'bold' }} >
                                                    {item.cultura.clima.temperaturaMinima + ' | ' + item.cultura.clima.temperaturaMaxima + ' ºC'}
                                                </Text>
                                            </Row>
                                            <Row style={{ alignItems: 'flex-end' }}>
                                                <Text style={{ fontSize: 16, color: this.estilo.cor.gray_solid }}>Umidade do ar  </Text>
                                                <Text style={{ fontSize: 18, color: this.estilo.cor.gray_solid, fontWeight: 'bold' }} >
                                                    {item.cultura.clima.umidadeMinima + ' | ' + item.cultura.clima.umidadeMaxima + ' %'}
                                                </Text>
                                            </Row>
                                        </Col>

                                        {/* Solo */}
                                        <Col style={{ marginTop: 20, backgroundColor: this.estilo.cor.gray_white, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10, elevation: 10 }}>
                                            <Text style={{ fontSize: 18, color: this.estilo.cor.gray_solid, fontWeight: 'bold' }} >Solo</Text>
                                            <Row style={{ alignItems: 'flex-end' }}>
                                                <Text style={{ fontSize: 16, color: this.estilo.cor.gray_solid }}>Acidez  </Text>
                                                <Text style={{ fontSize: 18, color: this.estilo.cor.gray_solid, fontWeight: 'bold' }} >
                                                    {item.cultura.solo.phMinimo + ' | ' + item.cultura.solo.phMaximo + ' ph'}
                                                </Text>
                                            </Row>
                                            <Row style={{ alignItems: 'flex-end' }}>
                                                <Text style={{ fontSize: 16, color: this.estilo.cor.gray_solid }}>Umidade  </Text>
                                                <Text style={{ fontSize: 18, color: this.estilo.cor.gray_solid, fontWeight: 'bold' }} >
                                                    {item.cultura.solo.umidadeMinima + ' | ' + item.cultura.solo.umidadeMaxima + ' %'}
                                                </Text>
                                            </Row>
                                            <Row style={{ alignItems: 'flex-end', flexWrap: 'wrap' }}>
                                                <Text style={{ fontSize: 16, color: this.estilo.cor.gray_solid }}>{item.cultura.solo.quantidadeAreia > 0 ? 'Areia (' + item.cultura.solo.quantidadeAreia + ') ' : null}
                                                    {item.cultura.solo.quantidadeArgila > 0 ? 'Argila (' + item.cultura.solo.quantidadeArgila + ') ' : null}
                                                    {item.cultura.solo.quantidadeHumus > 0 ? 'Húmus (' + item.cultura.solo.quantidadeHumus + ') ' : null}
                                                    {item.cultura.solo.quantidadeMusgoSphagnum > 0 ? 'Sphagnum (' + item.cultura.solo.quantidadeMusgoSphagnum + ') ' : null}
                                                    {item.cultura.solo.quantidadeTerraVegetal > 0 ? 'Terra (' + item.cultura.solo.quantidadeTerraVegetal + ') ' : null}
                                                    {item.cultura.solo.quantidadeTurfa > 0 ? 'Turfa (' + item.cultura.solo.quantidadeTurfa + ') ' : null}</Text>
                                            </Row>
                                        </Col>

                                        {/* Luz */}
                                        <Col style={{ alignItems: 'flex-end', marginTop: 20, backgroundColor: this.estilo.cor.gray_white, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10, elevation: 10 }}>
                                            {item.cultura.luz.intensidade == 'Sombra' || !item.cultura.luz.horasPorDia ?
                                                <Row style={{ alignItems: 'flex-end' }}>
                                                    <Text style={{ fontSize: 18, color: this.estilo.cor.gray_solid, fontWeight: 'bold' }}>Sombra</Text>
                                                </Row>
                                                : <Row style={{ alignItems: 'flex-end' }}>
                                                    <Text style={{ fontSize: 18, color: this.estilo.cor.gray_solid, fontWeight: 'bold' }}>Luz </Text>
                                                    <Text style={{ fontSize: 18, color: this.estilo.cor.gray_solid, fontWeight: 'bold' }}>
                                                        {item.cultura.luz.intensidade}
                                                    </Text>
                                                </Row>}
                                            {item.cultura.luz.intensidade == 'Sombra' || !item.cultura.luz.horasPorDia ? null :
                                                <Row style={{ alignItems: 'flex-end' }}>
                                                    <Text style={{ fontSize: 18, color: this.estilo.cor.gray_solid, fontWeight: 'bold' }}>{item.cultura.luz.horasPorDia}</Text>
                                                    <Text style={{ fontSize: 16, color: this.estilo.cor.gray_solid }}>{item.cultura.luz.horasPorDia > 1 ? ' horas' : ' hora'} {'por dia'}</Text>
                                                </Row>}
                                        </Col>

                                        {/* Nutrientes */}
                                        <Col style={{ marginTop: 20, marginBottom: 30, backgroundColor: this.estilo.cor.gray_white, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10, elevation: 10 }}>
                                            <Text style={{ fontSize: 18, color: this.estilo.cor.gray_solid, fontWeight: 'bold' }} >Nutrientes</Text>
                                            <Row style={{ flexWrap: 'wrap' }}>
                                                <Text style={{ fontSize: 16, color: this.estilo.cor.gray_solid }}>
                                                    {item.cultura.nutriente.nitrogenio > 0 ? 'Nitrogênio (' + item.cultura.nutriente.nitrogenio + ') ' : null}
                                                    {item.cultura.nutriente.fosforo > 0 ? 'Fósforo (' + item.cultura.nutriente.fosforo + ') ' : null}
                                                    {item.cultura.nutriente.potassio > 0 ? 'Potássio (' + item.cultura.nutriente.potassio + ') ' : null}</Text>
                                            </Row>
                                            {item.cultura.nutriente.magnesio || item.cultura.nutriente.calcio
                                                || item.cultura.nutriente.enxofre || item.cultura.nutriente.ferro
                                                || item.cultura.nutriente.manganes || item.cultura.nutriente.boro
                                                || item.cultura.nutriente.cobre || item.cultura.nutriente.zinco
                                                || item.cultura.nutriente.cloro || item.cultura.nutriente.molibdenio ?
                                                <Row style={{ flexWrap: 'wrap' }}>
                                                    <Text style={{ fontSize: 16, color: this.estilo.cor.gray_solid }}>
                                                        {item.cultura.nutriente.magnesio > 0 ? 'Magnésio (' + item.cultura.nutriente.magnesio + ') ' : null}
                                                        {item.cultura.nutriente.calcio > 0 ? 'Cálcio (' + item.cultura.nutriente.calcio + ') ' : null}
                                                        {item.cultura.nutriente.enxofre > 0 ? 'Enxôfre (' + item.cultura.nutriente.enxofre + ') ' : null}
                                                        {item.cultura.nutriente.ferro > 0 ? 'Ferro (' + item.cultura.nutriente.ferro + ') ' : null}
                                                        {item.cultura.nutriente.manganes > 0 ? 'Manganês (' + item.cultura.nutriente.manganes + ') ' : null}
                                                        {item.cultura.nutriente.boro > 0 ? 'Boro (' + item.cultura.nutriente.boro + ') ' : null}
                                                        {item.cultura.nutriente.cobre > 0 ? 'Cobre (' + item.cultura.nutriente.cobre + ') ' : null}
                                                        {item.cultura.nutriente.zinco > 0 ? 'Zinco (' + item.cultura.nutriente.zinco + ') ' : null}
                                                        {item.cultura.nutriente.cloro > 0 ? 'Cloro (' + item.cultura.nutriente.cloro + ') ' : null}
                                                        {item.cultura.nutriente.molibdenio > 0 ? 'Molibdenio (' + item.cultura.nutriente.molibdenio + ') ' : null}</Text>
                                                </Row> : null}
                                        </Col>
                                    </Content>
                                </View>
                            ))}
                            <Form style={{ width: Dimensions.get('screen').width * .1, height: 200 }} />
                        </Row>
                    </ScrollView>
                </Content>
            </Container>
        )
    }
}