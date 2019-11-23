import React, { Component } from 'react'
import { StatusBar, Dimensions, Animated, Easing, ScrollView } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { Text, Form, Container, View, Button, Header, Body, Row, Content } from 'native-base'
import estilo from '../../assets/Estilo'
import FeatherIcon from 'react-native-vector-icons/Feather'
import alertasService from '../../services/Alertas'
import { translate } from '../../i18n/locales'

export default class AlertaList extends Component {
    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.state = {
            alertas_updated: true,
            loaded: false,
            alertas: {
                temperatura: {},
                umidade_solo: {},
                umidade_ar: {}
            },
        }

        this.alertas = [
            { tipo_variavel: ' ºC', variavel_ambiental: translate('temperatura'), cor: this.estilo.cor.purple },
            { tipo_variavel: ' %', variavel_ambiental: translate('umidade_do_solo'), cor: this.estilo.cor.brown },
            { tipo_variavel: ' %', variavel_ambiental: translate('umidade_do_ar'), cor: this.estilo.cor.blue_light },
        ]
    }

    async componentWillMount() {
        this.setState({ alertas: await alertasService.get() })
    }

    spinValue = new Animated.Value(0)

    componentDidMount() {
        this.spin()
    }

    spin = () => {
        this.spinValue.setValue(0)
        Animated.timing(
            this.spinValue,
            {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true
            }
        ).start(() => this.spin())

    }

    async updateAlertas() {
        await this.setState({ alertas_updated: false })
        await alertasService.update()
        await this.setState({ alertas: await alertasService.get() })
        await this.setState({ alertas_updated: true })
    }

    render() {
        const rotate = this.spinValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] })
        return (
            <Container>
                <Header style={{ backgroundColor: this.estilo.cor.white, elevation: 0 }}>
                    <Button rounded transparent onPress={() => Actions.popTo('dash')}>
                        <FeatherIcon name='chevron-left' style={{ color: this.estilo.cor.gray_solid, fontSize: 22, marginHorizontal: 5 }} />
                    </Button>
                    <Body>
                        <Text style={{ color: this.estilo.cor.gray_solid, fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>{translate('alertas')}</Text>
                    </Body>
                    <Button disabled={!this.state.alertas_updated} rounded transparent onPress={() => this.updateAlertas()}>
                        <Animated.View style={this.state.alertas_updated ? null : { transform: [{ rotate }] }}>
                            <FeatherIcon name='refresh-cw' style={{ color: this.estilo.cor.gray_solid, fontSize: 22, marginHorizontal: 5 }} />
                        </Animated.View>
                    </Button>
                </Header>
                <StatusBar backgroundColor={this.estilo.cor.white} barStyle='dark-content' />

                <Content>
                    {/* {this.alertas.map((item, index) => {
                        <Form key={item.variavel_ambiental}>
                            {item.dados.valor ?
                                <Form style={{
                                    backgroundColor: this.alertas[index].cor, width: Dimensions.get('screen').width * .9,
                                    borderRadius: 20, marginTop: 20, alignSelf: 'center', elevation: 10, minHeight: 150, paddingVertical: 20
                                }}>
                                    <Text style={{ color: this.estilo.cor.white, fontSize: 18, marginLeft: 20 }} uppercase={false}>
                                        {this.alertas[index].variavel_ambiental}</Text>
                                    <Text uppercase={false} style={{ color: this.estilo.cor.white + '99', fontSize: 18, marginLeft: 20 }}>
                                        {'Ideal entre ' + item.dados.minIdeal + ' e ' +
                                            item.dados.maxIdeal + item.tipo_variavel}</Text>

                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        <Form style={{ width: 10 }} />
                                        {item.dados.valor.map((itemDados, indexDados) => (
                                            <Form key={indexDados} style={{ borderRadius: 15, padding: 20, marginLeft: 10, marginTop: 20, alignItems: 'center', backgroundColor: this.estilo.cor.white }}>

                                                {itemDados > 0 ? <Text style={{ color: this.alertas[indexDados].cor, fontSize: 20, fontWeight: 'bold' }} uppercase={false}>
                                                    {item.dados.maxIdeal + itemDados + item.tipo_variavel}
                                                </Text>
                                                    :
                                                    <Text style={{ color: this.alertas[indexDados].cor, fontSize: 20, fontWeight: 'bold' }} uppercase={false}>
                                                        {(item.dados.minIdeal + itemDados).toFixed(2) + item.tipo_variavel} </Text>}

                                                {itemDados > 0 ? <Text style={{ color: this.estilo.cor.red, fontSize: 20, fontWeight: 'bold' }} uppercase={false}>
                                                    {itemDados}<FeatherIcon name='arrow-up' style={{ color: this.estilo.cor.red, fontSize: 22, marginHorizontal: 5 }} />
                                                </Text>
                                                    :
                                                    <Text style={{ color: this.estilo.cor.green, fontSize: 20, fontWeight: 'bold' }} uppercase={false}>
                                                        {itemDados * -1}<FeatherIcon name='arrow-down' style={{ color: this.estilo.cor.green, fontSize: 22, marginHorizontal: 5 }} />
                                                    </Text>}

                                                <Text style={{ color: this.estilo.cor.gray, fontSize: 18 }} uppercase={false}>
                                                    {item.dados.data[indexDados].split('T')[1].substring(0, 5) + 'h'}
                                                </Text>
                                            </Form>))}
                                        <Form style={{ width: 20 }} />
                                    </ScrollView>
                                </Form> : null}
                        </Form>
                    })} */}

                    {/* Temperatura */}
                    <Form>
                        {this.state.alertas.temperatura.valor ?
                            <Form style={{
                                backgroundColor: this.alertas[0].cor, width: Dimensions.get('screen').width * .9,
                                borderRadius: 20, marginTop: 20, alignSelf: 'center', elevation: 10, minHeight: 150, paddingVertical: 20
                            }}>
                                <Text style={{ color: this.estilo.cor.white, fontSize: 18, marginLeft: 20 }} uppercase={false}>
                                    {this.alertas[0].variavel_ambiental}</Text>
                                <Text uppercase={false} style={{ color: this.estilo.cor.white + '99', fontSize: 18, marginLeft: 20 }}>
                                    {'Ideal entre ' + this.state.alertas.temperatura.minIdeal + ' e ' +
                                        this.state.alertas.temperatura.maxIdeal + ' ºC'}</Text>

                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <Form style={{ width: 10 }} />
                                    {this.state.alertas.temperatura.valor.map((item, index) => (
                                        <Form key={index} style={{ borderRadius: 15, padding: 20, marginLeft: 10, marginTop: 20, alignItems: 'center', backgroundColor: this.estilo.cor.white }}>

                                            {item > 0 ? <Text style={{ color: this.alertas[0].cor, fontSize: 20, fontWeight: 'bold' }} uppercase={false}>
                                                {this.state.alertas.temperatura.maxIdeal + item + ' ºC'}
                                            </Text>
                                                :
                                                <Text style={{ color: this.alertas[0].cor, fontSize: 20, fontWeight: 'bold' }} uppercase={false}>
                                                    {(this.state.alertas.temperatura.minIdeal + item).toFixed(2) + ' ºC'} </Text>}

                                            {item > 0 ? <Text style={{ color: this.estilo.cor.red, fontSize: 20, fontWeight: 'bold' }} uppercase={false}>
                                                {item}<FeatherIcon name='arrow-up' style={{ color: this.estilo.cor.red, fontSize: 22, marginHorizontal: 5 }} />
                                            </Text>
                                                :
                                                <Text style={{ color: this.estilo.cor.green, fontSize: 20, fontWeight: 'bold' }} uppercase={false}>
                                                    {item * -1}<FeatherIcon name='arrow-down' style={{ color: this.estilo.cor.green, fontSize: 22, marginHorizontal: 5 }} />
                                                </Text>}

                                            <Text style={{ color: this.estilo.cor.gray, fontSize: 18 }} uppercase={false}>
                                                {this.state.alertas.temperatura.data[index].split('T')[1].substring(0, 5) + 'h'}
                                            </Text>
                                        </Form>))}
                                    <Form style={{ width: 20 }} />
                                </ScrollView>
                            </Form> : null}
                    </Form>

                    {/* Umidade do Solo */}
                    <Form>
                        {this.state.alertas.umidade_solo.valor ?
                            <Form style={{
                                backgroundColor: this.alertas[1].cor, width: Dimensions.get('screen').width * .9,
                                borderRadius: 20, marginTop: 20, alignSelf: 'center', elevation: 10, minHeight: 150, paddingVertical: 20
                            }}>
                                <Text style={{ color: this.estilo.cor.white, fontSize: 18, marginLeft: 20 }} uppercase={false}>
                                    {this.alertas[1].variavel_ambiental}</Text>
                                <Text uppercase={false} style={{ color: this.estilo.cor.white + '99', fontSize: 18, marginLeft: 20 }}>
                                    {'Ideal entre ' + this.state.alertas.umidade_solo.minIdeal + ' e ' +
                                        this.state.alertas.umidade_solo.maxIdeal + ' %'}</Text>

                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <Form style={{ width: 10 }} />
                                    {this.state.alertas.umidade_solo.valor.map((item, index) => (
                                        <Form key={index} style={{ borderRadius: 15, padding: 20, marginLeft: 10, marginTop: 20, alignItems: 'center', backgroundColor: this.estilo.cor.white }}>

                                            {item > 0 ? <Text style={{ color: this.alertas[1].cor, fontSize: 20, fontWeight: 'bold' }} uppercase={false}>
                                                {this.state.alertas.umidade_solo.maxIdeal + item + ' %'}
                                            </Text>
                                                :
                                                <Text style={{ color: this.alertas[1].cor, fontSize: 20, fontWeight: 'bold' }} uppercase={false}>
                                                    {(this.state.alertas.umidade_solo.minIdeal + item).toFixed(2) + ' %'} </Text>}

                                            {item > 0 ? <Text style={{ color: this.estilo.cor.red, fontSize: 20, fontWeight: 'bold' }} uppercase={false}>
                                                {item}<FeatherIcon name='arrow-up' style={{ color: this.estilo.cor.red, fontSize: 22, marginHorizontal: 5 }} />
                                            </Text>
                                                :
                                                <Text style={{ color: this.estilo.cor.green, fontSize: 20, fontWeight: 'bold' }} uppercase={false}>
                                                    {item * -1}<FeatherIcon name='arrow-down' style={{ color: this.estilo.cor.green, fontSize: 22, marginHorizontal: 5 }} />
                                                </Text>}

                                            <Text style={{ color: this.estilo.cor.gray, fontSize: 18 }} uppercase={false}>
                                                {this.state.alertas.umidade_solo.data[index].split('T')[1].substring(0, 5) + 'h'}
                                            </Text>
                                        </Form>))}
                                    <Form style={{ width: 20 }} />
                                </ScrollView>
                            </Form> : null}
                    </Form>

                    {/* Umidade do Ar */}
                    <Form>
                        {this.state.alertas.umidade_ar.valor ?
                            <Form style={{
                                backgroundColor: this.alertas[2].cor, width: Dimensions.get('screen').width * .9,
                                borderRadius: 20, marginVertical: 20, alignSelf: 'center', elevation: 10, minHeight: 150, paddingVertical: 20
                            }}>
                                <Text style={{ color: this.estilo.cor.white, fontSize: 18, marginLeft: 20 }} uppercase={false}>
                                    {this.alertas[2].variavel_ambiental}</Text>
                                <Text uppercase={false} style={{ color: this.estilo.cor.white + '99', fontSize: 18, marginLeft: 20 }}>
                                    {'Ideal entre ' + this.state.alertas.umidade_ar.minIdeal + ' e ' +
                                        this.state.alertas.umidade_ar.maxIdeal + ' %'}</Text>

                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <Form style={{ width: 10 }} />
                                    {this.state.alertas.umidade_ar.valor.map((item, index) => (
                                        <Form key={index} style={{ borderRadius: 15, padding: 20, marginLeft: 10, marginTop: 20, alignItems: 'center', backgroundColor: this.estilo.cor.white }}>

                                            {item > 0 ? <Text style={{ color: this.alertas[2].cor, fontSize: 20, fontWeight: 'bold' }} uppercase={false}>
                                                {this.state.alertas.umidade_ar.maxIdeal + item + ' %'}
                                            </Text>
                                                :
                                                <Text style={{ color: this.alertas[2].cor, fontSize: 20, fontWeight: 'bold' }} uppercase={false}>
                                                    {(this.state.alertas.umidade_ar.minIdeal + item).toFixed(2) + ' %'} </Text>}

                                            {item > 0 ? <Text style={{ color: this.estilo.cor.red, fontSize: 20, fontWeight: 'bold' }} uppercase={false}>
                                                {item}<FeatherIcon name='arrow-up' style={{ color: this.estilo.cor.red, fontSize: 22, marginHorizontal: 5 }} />
                                            </Text>
                                                :
                                                <Text style={{ color: this.estilo.cor.green, fontSize: 20, fontWeight: 'bold' }} uppercase={false}>
                                                    {item * -1}<FeatherIcon name='arrow-down' style={{ color: this.estilo.cor.green, fontSize: 22, marginHorizontal: 5 }} />
                                                </Text>}

                                            <Text style={{ color: this.estilo.cor.gray, fontSize: 18 }} uppercase={false}>
                                                {this.state.alertas.umidade_ar.data[index].split('T')[1].substring(0, 5) + 'h'}
                                            </Text>
                                        </Form>))}
                                    <Form style={{ width: 20 }} />
                                </ScrollView>
                            </Form> : null}
                    </Form>
                </Content>
            </Container>
        )
    }
}