import React, { Component } from 'react'
import { StatusBar, Dimensions } from 'react-native'
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
            loaded: false,
            ideal: {
                temperatura: { max: undefined, min: undefined },
                umidade_solo: { max: undefined, min: undefined },
                umidade_ar: { max: undefined, min: undefined },
                luminosidade: { max: undefined, min: undefined },
            },
            buscar: false,
            alertas: {
                temperatura: { data: [], valor: [] },
                umidade_solo: { data: [], valor: [] },
                umidade_ar: { data: [], valor: [] },
                luminosidade: { data: [], valor: [] },
            },
        }
        this.entidades = [
            { cor: this.estilo.cor.purple, tipo: ' ºC', label: 'Temperatura', value: 'alertaTemperaturas', icon: 'thermometer' },
            { cor: this.estilo.cor.brown, tipo: ' %', label: 'Umidade do Solo', value: 'alertaUmidadeSolos', icon: 'droplet' },
            { cor: this.estilo.cor.blue_light, tipo: ' %', label: 'Umidade do Ar', value: 'alertaUmidades', icon: 'droplet' },
            { cor: this.estilo.cor.orange, tipo: ' %', label: 'Luminosidade', value: 'alertaLuminosidades', icon: 'sun' }
        ]
    }

    componentWillMount() {
        this.load()
    }

    async load() {
        let aux = await loginService.get()
        this.setState({ plantacao_principal: await this.http.plantacoesPrincipaisByUsuario(aux.usuario) })
        this.setState({ ideal: await alertasService.caracteristicasIdeais(this.state.plantacao_principal[0].plantacao) })
        await this.anos()
        this.setState({ loaded: true })
    }

    anos = async () => {
        this.setState({ loaded: false })
        let anos = await this.http.anosAlertas(dados = {
            usuarioId: this.state.plantacao_principal[0].usuario,
            plantacaoId: this.state.plantacao_principal[0].plantacao
        },
            entidade = this.entidades[this.state.entidade].value)
        this.setState({ anos: await anos })
        if (!this.state.buscar) await this.meses(this.state.anos[this.state.anos.length - 1])
    }

    meses = async (value) => {
        this.setState({ loaded: false })
        this.setState({ ano: await value })
        let meses = await this.http.mesesAlertas(dados = {
            usuarioId: this.state.plantacao_principal[0].usuario,
            plantacaoId: this.state.plantacao_principal[0].plantacao,
            ano: value
        }, entidade = this.entidades[this.state.entidade].value)
        this.setState({ meses: await meses })
        if (!this.state.buscar) await this.dias(this.state.meses[this.state.meses.length - 1])
    }

    dias = async (value) => {
        this.setState({ loaded: false })
        this.setState({ mes: await value })
        let dias = await this.http.diasAlertas(dados = {
            usuarioId: this.state.plantacao_principal[0].usuario,
            plantacaoId: this.state.plantacao_principal[0].plantacao,
            ano: this.state.ano,
            mes: value
        }, entidade = this.entidades[this.state.entidade].value)
        this.setState({ dias: await dias })
        if (!this.state.buscar) await this.alertas(this.state.dias[this.state.dias.length - 1])
    }

    alertas = async (dia) => {
        this.setState({ loaded: false })
        this.setState({ dia: await dia })
        let alerta = await alertasService.get(this.state.plantacao_principal[0].usuario,
            this.state.plantacao_principal[0].plantacao, dia,
            this.entidades[this.state.entidade].value)
        if (this.state.entidade == 0) this.setState({ alertas: { ...this.state.alertas, temperatura: alerta } })
        else if (this.state.entidade == 1) this.setState({ alertas: { ...this.state.alertas, umidade_solo: alerta } })
        else if (this.state.entidade == 2) this.setState({ alertas: { ...this.state.alertas, umidade_ar: alerta } })
        else if (this.state.entidade == 3) this.setState({ alertas: { ...this.state.alertas, luminosidade: alerta } })
        this.setState({ loaded: true })
        if (dia != 0) this.setState({ buscar: false })
    }

    getStringDayOfWeek(day) {
        return isNaN(day) ? null : ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][day]
    }

    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: this.estilo.cor.white, elevation: 0 }}>
                    <Button rounded transparent onPress={() => Actions.popTo('dash')}>
                        <FeatherIcon name='chevron-left' style={{ color: this.estilo.cor.gray_solid, fontSize: 22, marginHorizontal: 5 }} />
                    </Button>
                    <Body>
                        <Text style={{ color: this.estilo.cor.gray_solid, fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>{translate('alertas')}</Text>
                    </Body>
                    {this.state.buscar ?
                        <Button rounded transparent disabled>
                            <FeatherIcon name='x' style={{ color: 'transparent', fontSize: 22, marginHorizontal: 5 }} />
                        </Button>
                        :
                        <Button rounded transparent onPress={() => this.setState({ buscar: true })}>
                            <FeatherIcon name='search' style={{ color: this.estilo.cor.gray_solid, fontSize: 22, marginHorizontal: 5 }} />
                        </Button>}
                </Header>
                <StatusBar backgroundColor={this.estilo.cor.white} barStyle='dark-content' />
                {this.state.buscar ?
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
                                        <Item disabled={true} key={0} label={'...'} value={0} />
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
                                        <Item disabled={true} key={0} label={'...'} value={0} />
                                        {this.state.dias.map(item => { return <Item key={item} label={item.split(' ')[2]} value={item} /> })}
                                    </Picker>
                                </Row>
                            </Row>
                        </Form> : null}
                    </Content>
                    :

                    <View style={{
                        flex: 1, width: Dimensions.get('screen').width,
                        alignItems: 'center', justifyContent: 'flex-end', paddingTop: 20
                    }}>
                        {this.state.loaded ?
                            <Text uppercase={false} style={{
                                fontSize: 18, color: this.estilo.cor.gray, paddingLeft: 30,
                                paddingRight: 30, alignSelf: 'center', fontWeight: 'bold'
                            }}>{'Ideal '}
                                {this.state.entidade == 0 && this.state.ideal.temperatura.min ? 'entre ' + this.state.ideal.temperatura.min + ' e ' + this.state.ideal.temperatura.max + ' ºC' : ''}
                                {this.state.entidade == 1 && this.state.ideal.umidade_solo.min ? 'entre ' + this.state.ideal.umidade_solo.min + ' e ' + this.state.ideal.umidade_solo.max + ' %' : ''}
                                {this.state.entidade == 2 && this.state.ideal.umidade_ar.min ? 'entre ' + this.state.ideal.umidade_ar.min + ' e ' + this.state.ideal.umidade_ar.max + ' %' : ''}
                                {this.state.entidade == 3 && this.state.ideal.luminosidade.min ? 'entre ' + this.state.ideal.luminosidade.min + ' e ' + this.state.ideal.luminosidade.max + ' %' : ''}
                            </Text>
                            : <Loader />
                        }
                        {!this.state.buscar && this.state.loaded && this.state.entidade == 0 && this.state.alertas.temperatura.data[0] ?
                            <Chart data={this.state.alertas.temperatura.data}
                                valor={this.state.alertas.temperatura.valor} tipo={this.entidades[this.state.entidade].tipo}
                                color={this.entidades[this.state.entidade].cor} ideal={this.state.ideal.temperatura} />
                            : null}

                        {!this.state.buscar && this.state.loaded && this.state.entidade == 1 && this.state.alertas.umidade_solo.data[0] ?
                            <Chart data={this.state.alertas.umidade_solo.data}
                                valor={this.state.alertas.umidade_solo.valor} tipo={this.entidades[this.state.entidade].tipo}
                                color={this.entidades[this.state.entidade].cor} ideal={this.state.ideal.umidade_solo} />
                            : null}

                        {!this.state.buscar && this.state.loaded && this.state.entidade == 2 && this.state.alertas.umidade_ar.data[0] ?
                            <Chart data={this.state.alertas.umidade_ar.data}
                                valor={this.state.alertas.umidade_ar.valor} tipo={this.entidades[this.state.entidade].tipo}
                                color={this.entidades[this.state.entidade].cor} ideal={this.state.ideal.umidade_ar} />
                            : null}

                        {!this.state.buscar && this.state.loaded && this.state.entidade == 3 && this.state.alertas.luminosidade.data[0] ?
                            <Chart data={this.state.alertas.luminosidade.data}
                                valor={this.state.alertas.luminosidade.valor} tipo={this.entidades[this.state.entidade].tipo}
                                color={this.entidades[this.state.entidade].cor} ideal={this.state.ideal.luminosidade} />
                            : null}
                    </View>
                }

                <Form style={{ justifyContent: 'center', paddingTop: 30 }}>
                    <Button rounded style={{
                        backgroundColor: this.entidades[this.state.entidade].cor, borderRadius: 20,
                        paddingVertical: 10, alignSelf: 'center', elevation: 0, marginBottom: 20
                    }}>
                        <Text uppercase={false} style={{
                            fontSize: 17, color: this.estilo.cor.white, fontWeight: 'bold',
                            paddingLeft: 30, paddingRight: 30
                        }}
                        >{this.entidades[this.state.entidade].label}{this.state.ano && !this.state.buscar ? '  ' + new Date(this.state.dia).toLocaleDateString() : ''}</Text>
                    </Button>
                    {this.state.buscar ? null : <Form style={{
                        flexDirection: 'row', justifyContent: 'center',
                        borderBottomColor: 10,
                    }}>
                        {this.entidades.map((item, index) => (
                            <Button large transparent key={item.value} rounded style={{ paddingHorizontal: 20 }}
                                onPress={async () => { this.setState({ entidade: index }), await this.anos() }}>
                                <FeatherIcon name={item.icon} style={[{ fontSize: 25, color: this.estilo.cor.gray },
                                this.state.entidade == index ? { color: this.entidades[this.state.entidade].cor } : null]} />
                            </Button>
                        ))}
                    </Form>}
                </Form>
            </Container>
        )
    }
}