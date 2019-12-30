import React, { Component } from 'react'
import { StatusBar, Dimensions, Animated, Easing, ScrollView } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { Text, Form, Container, View, Button, Header, Body, Row, Content, Label, Picker, Icon, Item } from 'native-base'
import Loader from '../../components/Loader'
import estilo from '../../assets/Estilo'
import FeatherIcon from 'react-native-vector-icons/Feather'
import alertasService from '../../services/Alertas'
import loginService from '../../services/Login'
import http from '../../services/Http'
import { translate } from '../../i18n/locales'
import Chart from '../../components/ChartAlertas'

export default class AlertaList extends Component {
    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.http = new http()
        this.state = {
            plantacao_principal: undefined,
            ano: undefined,
            anos: undefined,
            mes: undefined,
            meses: undefined,
            dia: undefined,
            dias: undefined,
            entidade: 0,
            alertas_updated: true,
            loaded: false,
            ideal: undefined,
            alertas: {
                temperatura: { data: [], valor: [] },
                umidade_solo: { data: [], valor: [] },
                umidade_ar: { data: [], valor: [] },
                luminosidade: { data: [], valor: [] },
            },
        }
        this.entidades = [
            { label: 'Temperatura', value: 'alertaTemperaturas', icon: 'thermometer' },
            { label: 'Umidade do Solo', value: 'alertaUmidadeSolos', icon: 'droplet' },
            { label: 'Umidade do Ar', value: 'alertaUmidades', icon: 'droplet' },
            { label: 'Luminosidade', value: 'alertaLuminosidades', icon: 'sun' }
        ]
    }

    componentWillMount() {
        this.load()
    }

    componentDidMount() {
        this.spin()
        // this.updateAlertas()
    }

    async load() {
        let aux = await loginService.get()
        this.setState({ plantacao_principal: await this.http.plantacoesPrincipaisByUsuario(aux.usuario) })
        this.setState({ ideal: await alertasService.caracteristicasIdeais(this.state.plantacao_principal[0].plantacao) })
        console.log('this.state.ideal')
        console.log(this.state.ideal)
        await this.anos()
        // this.setState({ alertas: await alertasService.get() })
        this.setState({ loaded: true })
    }

    anos = async () => {
        let anos = await this.http.anosAlertas(dados = {
            usuarioId: this.state.plantacao_principal[0].usuario,
            plantacaoId: this.state.plantacao_principal[0].plantacao
        },
            entidade = this.entidades[this.state.entidade].value)
        this.setState({ anos: await anos })
        await this.meses(this.state.anos[0])
    }

    meses = async (value) => {
        this.setState({ ano: await value })
        let meses = await this.http.mesesAlertas(dados = {
            usuarioId: this.state.plantacao_principal[0].usuario,
            plantacaoId: this.state.plantacao_principal[0].plantacao,
            ano: value
        }, entidade = this.entidades[this.state.entidade].value)
        this.setState({ meses: await meses })
        await this.dias(this.state.meses[0])
    }

    dias = async (value) => {
        this.setState({ mes: await value })
        let dias = await this.http.diasAlertas(dados = {
            usuarioId: this.state.plantacao_principal[0].usuario,
            plantacaoId: this.state.plantacao_principal[0].plantacao,
            ano: this.state.ano,
            mes: value
        }, entidade = this.entidades[this.state.entidade].value)
        this.setState({ dias: await dias })
        this.setState({ dia: await this.state.dias[0] })
        await this.alertas(this.state.dia)
    }

    alertas = async (dia) => {
        this.setState({ dia: await dia })
        let alerta = await alertasService.get(this.state.plantacao_principal[0].usuario,
            this.state.plantacao_principal[0].plantacao, dia,
            this.entidades[this.state.entidade].value)

        if (this.state.entidade == 0) this.setState({ alertas: { ...this.state.alertas, temperatura: alerta } })
    }

    spinValue = new Animated.Value(0)

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

    // async updateAlertas() {
    //     this.setState({ alertas_updated: false })
    //     await alertasService.update().then(async () =>
    //         this.setState({ alertas: await alertasService.get() })
    //     )
    //     this.setState({ alertas_updated: true })
    // }

    getDayNumber(date) {
        var dayNumber = new Date(date).getUTCDate()
            + '/' + new Date(date).getMonth() + 1
        return dayNumber
    }

    getDayOfWeek(date) {
        var dayOfWeek = new Date(date).getDay()
        return this.getStringDayOfWeek(dayOfWeek)
    }

    getStringDayOfWeek(day) {
        return isNaN(day) ? null : ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][day]
    }

    render() {
        const alertas = [
            { tipo_variavel: ' ºC', variavel_ambiental: translate('temperatura'), cor: this.estilo.cor.purple },
            { tipo_variavel: ' %', variavel_ambiental: translate('umidade_do_solo'), cor: this.estilo.cor.brown },
            { tipo_variavel: ' %', variavel_ambiental: translate('umidade_do_ar'), cor: this.estilo.cor.blue_light },
        ]
        const dados = [
            this.state.alertas && this.state.alertas.temperatura ? this.state.alertas.temperatura : {},
            this.state.alertas && this.state.alertas.umidade_solo ? this.state.alertas.umidade_solo : {},
            this.state.alertas && this.state.alertas.umidade_ar ? this.state.alertas.umidade_ar : {},
        ]
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
                    {/* <Button disabled={!this.state.alertas_updated} rounded transparent onPress={() => this.updateAlertas()}>
                        <Animated.View style={this.state.alertas_updated ? null : { transform: [{ rotate }] }}>
                            <FeatherIcon name='refresh-cw' style={{ color: this.estilo.cor.gray_solid, fontSize: 22, marginHorizontal: 5 }} />
                        </Animated.View>
                    </Button> */}
                </Header>
                <StatusBar backgroundColor={this.estilo.cor.white} barStyle='dark-content' />
                {!this.state.loaded ? <Loader /> :
                    <Content style={this.estilo.contentmodal}>
                        {this.state.anos ? <Form style={this.estilo.form}>
                            <Label>Ano</Label>
                            <Row>
                                <Row style={this.estilo.subrow}>
                                    <Picker
                                        mode='dialog'
                                        iosIcon={<Icon name='arrow-down' />}
                                        selectedValue={this.state.ano}
                                        onValueChange={value => this.meses(value)}>
                                        {this.state.anos.map((item) => { return <Item key={item} label={item} value={item} /> })}
                                    </Picker>
                                </Row>
                            </Row>
                        </Form> : null}

                        {this.state.anos && this.state.meses ? <Form style={this.estilo.form}>
                            <Label>Mês</Label>
                            <Row>
                                <Row style={this.estilo.subrow}>
                                    <Picker
                                        mode='dialog'
                                        iosIcon={<Icon name='arrow-down' />}
                                        selectedValue={this.state.mes}
                                        onValueChange={value => this.dias(value)}>
                                        {this.state.meses.map((item) => { return <Item key={item} label={item} value={item} /> })}
                                    </Picker>
                                </Row>
                            </Row>
                        </Form> : null}

                        {this.state.anos && this.state.meses && this.state.dias ? <Form style={this.estilo.form}>
                            <Label>Dia</Label>
                            <Row>
                                <Row style={this.estilo.subrow}>
                                    <Picker
                                        mode='dialog'
                                        iosIcon={<Icon name='arrow-down' />}
                                        selectedValue={this.state.dia}
                                        onValueChange={value => this.alertas(value)}>
                                        {this.state.dias.map(item => { return <Item key={item} label={item.split(' ')[2]} value={item} /> })}
                                    </Picker>
                                </Row>
                            </Row>
                        </Form> : null}
                    </Content>}

                <Form style={this.state.entidade == 0 ? null : this.estilo.hide}>
                    {this.state.alertas.temperatura.data[0] ?
                        <Chart data={this.state.alertas.temperatura.data}
                            valor={this.state.alertas.temperatura.valor}
                            color={this.estilo.cor.purple} ideal={this.state.ideal.temperatura} /> : null}
                </Form>

                <Form style={{ flexDirection: 'row', justifyContent: 'center', paddingVertical: 5 }}>
                    {this.entidades.map((item, index) => (
                        <Button large transparent key={item.value} rounded style={{ paddingHorizontal: 20 }}
                            onPress={() => { this.setState({ entidade: index }) }}>
                            <FeatherIcon name={item.icon} style={[{ fontSize: 25, color: this.estilo.cor.gray_medium },
                            this.state.entidade == index ? { color: this.estilo.cor.gray_solid } : null]} />
                        </Button>
                    ))}
                </Form>

                {/* <Content style={{ marginBottom: 60 }}>
                    {alertas ? alertas.map((item, index) => (
                        <Form key={item.variavel_ambiental}>
                            {dados[index] && dados[index].valor ?
                                <Form style={{ width: Dimensions.get('screen').width, marginTop: 20, alignSelf: 'center' }}>
                                    <Text style={{ color: item.cor, fontSize: 18, marginLeft: 30, fontWeight: 'bold' }} uppercase={false}>
                                        {item.variavel_ambiental}</Text>
                                    <Text uppercase={false} style={{ color: item.cor + '99', fontSize: 18, marginLeft: 30, fontWeight: 'bold' }}>
                                        {'Ideal entre ' + dados[index].minIdeal + ' e ' +
                                            dados[index].maxIdeal + item.tipo_variavel}</Text>

                                    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                                        <Form style={{ width: 10 }} />
                                        {dados[index].valor.map((itemDados, indexDados) => (
                                            <Form key={indexDados} style={dados[index].dia[indexDados] == this.state.dia ?
                                                {
                                                    elevation: 10, borderRadius: 15, padding: 20, margin: 10, marginVertical: 20,
                                                    alignItems: 'center', backgroundColor: this.estilo.cor.white
                                                } : this.estilo.hide}>
                                                {itemDados > 0 ? <Text style={{ color: item.cor, fontSize: 20, fontWeight: 'bold' }} uppercase={false}>
                                                    {dados[index].maxIdeal + itemDados + item.tipo_variavel}
                                                </Text>
                                                    :
                                                    <Text style={{ color: item.cor, fontSize: 20, fontWeight: 'bold' }} uppercase={false}>
                                                        {(dados[index].minIdeal + itemDados).toFixed(2) + item.tipo_variavel} </Text>}

                                                {itemDados > 0 ? <Text style={{ color: this.estilo.cor.red, fontSize: 20, fontWeight: 'bold' }} uppercase={false}>
                                                    <FeatherIcon name='arrow-up' style={{ color: this.estilo.cor.red, fontSize: 20 }} />
                                                    {itemDados + item.tipo_variavel}
                                                </Text>
                                                    :
                                                    <Text style={{ color: this.estilo.cor.red, fontSize: 20, fontWeight: 'bold' }} uppercase={false}>
                                                        <FeatherIcon name='arrow-down' style={{ color: this.estilo.cor.red, fontSize: 20 }} />
                                                        {itemDados * -1 + item.tipo_variavel}
                                                    </Text>}

                                                <Text style={{ color: this.estilo.cor.gray, fontSize: 18 }} uppercase={false}>
                                                    {dados[index].hora[indexDados]}
                                                </Text>
                                            </Form>))}
                                        <Form style={{ width: 10 }} />
                                    </ScrollView>
                                </Form> : null}
                        </Form>
                    )) : null}
                </Content>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ position: 'absolute', bottom: 0, height: 60 }}>
                    <Form style={{ width: 10 }} />
                    {this.state.alertas && this.state.alertas.dias && this.state.alertas.dias[0] ?
                        this.state.alertas.dias.map((dia, index) => (
                            <Button key={index} transparent onPress={() => this.setState({ dia: dia })}>
                                <Text style={{ color: dia == this.state.dia ? this.estilo.cor.gray_solid : this.estilo.cor.gray_medium, fontWeight: 'bold', fontSize: 18, textAlign: 'center' }} uppercase={false}
                                >{this.getDayOfWeek(dia) + '\n' + this.getDayNumber(dia)}</Text></Button>
                        )) : null}
                    <Form style={{ width: 10 }} />
                </ScrollView> */}
            </Container>
        )
    }
}