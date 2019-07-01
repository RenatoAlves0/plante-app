import React, { Component } from 'react'
import { StatusBar } from 'react-native'
import { Content, Text, Icon, Col, Form, View, Row } from 'native-base'
import estilo from '../../assets/Estilo'

export default class ViewPlanta extends Component {
    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.state = {}
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
            <Content style={this.estilo.contentmodal}>
                <StatusBar backgroundColor={this.estilo.cor.gray_translucid} barStyle="light-content" />

                <Col>
                    <Col style={{ alignItems: 'center', marginVertical: 20 }}>
                        <Text>{this.props.item.nome}</Text>
                        <Text style={{ color: this.estilo.cor.gray }}>
                            {this.props.item.familia.nome + ' . ' + this.props.item.genero.nome + ' . ' + this.props.item.especie.nome}</Text>
                    </Col>

                    {/* Clima */}
                    <Col style={{ alignItems: 'center', marginVertical: 20 }}>
                        <Text>{'Clima ' + this.props.item.clima.tipo}</Text>
                        <Row style={{ justifyContent: 'center', marginTop: 10 }} >
                            <View style={this.estilo.listitemview}>
                                <Icon name='thermometer' type='MaterialCommunityIcons' style={{ color: this.estilo.cor.orange + 'aa' }} />
                                <Text style={{ color: this.estilo.cor.gray }} >
                                    {
                                        ' min: ' + this.props.item.clima.temperaturaMinima + ' ºC\n'
                                        + ' max: ' + this.props.item.clima.temperaturaMaxima + ' ºC\n'
                                        + ' ideal: ' + (this.props.item.clima.temperaturaMinima + this.props.item.clima.temperaturaMaxima) / 2 + ' ºC'
                                    }
                                </Text>
                            </View>
                            <View style={this.estilo.listitemview}>
                                <Icon name='water' type='MaterialCommunityIcons' style={{ marginLeft: 10, color: this.estilo.cor.blue + 'aa' }} />
                                <Text style={{ color: this.estilo.cor.gray }} >
                                    {
                                        ' min: ' + this.props.item.clima.umidadeMinima + ' %\n'
                                        + ' max: ' + this.props.item.clima.umidadeMaxima + ' %\n '
                                        + 'ideal: ' + this.calc_tipo_umidade((this.props.item.clima.umidadeMinima + this.props.item.clima.umidadeMaxima) / 2)
                                    }
                                </Text>
                            </View>
                        </Row>
                    </Col>

                    {/* Solo */}
                    <Col style={{ alignItems: 'center', marginVertical: 20 }}>
                        <Row style={{ justifyContent: 'center' }} >
                            <Text style={{ textAlign: 'center' }}>
                                {'Porções: '}
                                {this.props.item.solo.quantidadeAreia > 0 ? 'Areia (' + this.props.item.solo.quantidadeAreia + ') ' : null}
                                {this.props.item.solo.quantidadeArgila > 0 ? 'Argila (' + this.props.item.solo.quantidadeArgila + ') ' : null}
                                {this.props.item.solo.quantidadeHumus > 0 ? 'Húmus (' + this.props.item.solo.quantidadeHumus + ') ' : null}
                                {this.props.item.solo.quantidadeMusgoSphagnum > 0 ? 'Sphagnum (' + this.props.item.solo.quantidadeMusgoSphagnum + ') ' : null}
                                {this.props.item.solo.quantidadeTerraVegetal > 0 ? 'Terra (' + this.props.item.solo.quantidadeTerraVegetal + ') ' : null}
                                {this.props.item.solo.quantidadeTurfa > 0 ? 'Turfa (' + this.props.item.solo.quantidadeTurfa + ') ' : null}
                            </Text>
                        </Row>
                        <Row style={{ justifyContent: 'center', marginTop: 10 }} >
                            <View style={this.estilo.listitemview}>
                                <Icon name='test-tube' type='MaterialCommunityIcons' style={{ color: this.estilo.cor.orange + 'aa' }} />
                                <Text style={{ color: this.estilo.cor.gray }} >
                                    {
                                        ' min: ' + this.props.item.solo.phMinimo + ' Ph\n'
                                        + ' max: ' + this.props.item.solo.phMaximo + ' Ph\n '
                                        + 'ideal: ' + this.calc_tipo_ph((this.props.item.solo.phMinimo + this.props.item.solo.phMaximo) / 2)
                                    }
                                </Text>
                            </View>
                            <View style={this.estilo.listitemview}>
                                <Icon name='water' type='MaterialCommunityIcons' style={{ marginLeft: 10, color: this.estilo.cor.blue + 'aa' }} />
                                <Text style={{ color: this.estilo.cor.gray }} >
                                    {
                                        ' min: ' + this.props.item.solo.umidadeMinima + ' %\n'
                                        + ' max: ' + this.props.item.solo.umidadeMaxima + ' %\n '
                                        + 'ideal: ' + this.calc_tipo_umidade((this.props.item.solo.umidadeMinima + this.props.item.solo.umidadeMaxima) / 2)
                                    }
                                </Text>
                            </View>
                        </Row>
                    </Col>

                    {/* Luz */}
                    <Col style={{ alignItems: 'center', marginVertical: 20 }}>
                        <Row style={{ justifyContent: 'center' }}>
                            {this.props.item.luz.intensidade == 'Forte' ? <Icon style={{ fontSize: 30, color: this.estilo.cor.orange }} name='wb-sunny' type='MaterialIcons' /> : null}
                            {this.props.item.luz.intensidade == 'Média' ? <Icon style={{ fontSize: 26, color: this.estilo.cor.orange + 'aa' }} name='wb-sunny' type='MaterialIcons' /> : null}
                            {this.props.item.luz.intensidade == 'Fraca' ? <Icon style={{ fontSize: 22, color: this.estilo.cor.orange + '77' }} name='wb-sunny' type='MaterialIcons' /> : null}
                            {this.props.item.luz.intensidade == 'Sombra' ? <Icon style={{ fontSize: 22, color: this.estilo.cor.gray_white }} name='cloud' type='MaterialIcons' /> : null}
                            <Text>{'  ' + this.props.item.luz.intensidade}</Text>
                        </Row>
                        {this.props.item.luz.intensidade == 'Sombra' ? null : <Text style={{ color: this.estilo.cor.gray }}>  {this.props.item.luz.horasPorDia} {this.props.item.luz.horasPorDia > 1 ? ' horas' : ' hora'} {'por dia'} </Text>}
                    </Col>

                    {/* Nutrientes */}
                    <Col style={{ alignItems: 'center', marginVertical: 20 }}>
                        <Row style={{ justifyContent: 'center' }} >
                            <Text style={{ textAlign: 'center', marginHorizontal: 10 }}>
                                {'Macronutrientes: '}
                                {this.props.item.nutriente.nitrogenio > 0 ? 'Nitrogênio (' + this.props.item.nutriente.nitrogenio + ') ' : null}
                                {this.props.item.nutriente.fosforo > 0 ? 'Fósforo (' + this.props.item.nutriente.fosforo + ') ' : null}
                                {this.props.item.nutriente.potassio > 0 ? 'Potássio (' + this.props.item.nutriente.potassio + ') ' : null}
                            </Text>
                        </Row>
                        <Row style={{ justifyContent: 'center' }}>
                            <Text style={{
                                textAlign: 'center', color: this.estilo.cor.gray, marginHorizontal: 10,
                                marginTop: this.props.item.nutriente.nitrogenio || this.props.item.nutriente.fosforo || this.props.item.nutriente.potassio ? 10 : 0
                            }}>
                                {'Micronutrientes: '}
                                {this.props.item.nutriente.magnesio > 0 ? 'Magnésio (' + this.props.item.nutriente.magnesio + ') ' : null}
                                {this.props.item.nutriente.calcio > 0 ? 'Cálcio (' + this.props.item.nutriente.calcio + ') ' : null}
                                {this.props.item.nutriente.enxofre > 0 ? 'Enxôfre (' + this.props.item.nutriente.enxofre + ') ' : null}
                                {this.props.item.nutriente.ferro > 0 ? 'Ferro (' + this.props.item.nutriente.ferro + ') ' : null}
                                {this.props.item.nutriente.manganes > 0 ? 'Manganês (' + this.props.item.nutriente.manganes + ') ' : null}
                                {this.props.item.nutriente.boro > 0 ? 'Boro (' + this.props.item.nutriente.boro + ') ' : null}
                                {this.props.item.nutriente.cobre > 0 ? 'Cobre (' + this.props.item.nutriente.cobre + ') ' : null}
                                {this.props.item.nutriente.zinco > 0 ? 'Zinco (' + this.props.item.nutriente.zinco + ') ' : null}
                                {this.props.item.nutriente.cloro > 0 ? 'Cloro (' + this.props.item.nutriente.cloro + ') ' : null}
                                {this.props.item.nutriente.molibdenio > 0 ? 'Molibdenio (' + this.props.item.nutriente.molibdenio + ') ' : null}
                            </Text>
                        </Row>
                    </Col>
                </Col>

                <Form style={this.estilo.form_vazio} />
            </Content>
        )
    }
}

