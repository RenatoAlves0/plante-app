import React, { Component } from 'react'
import { Container, Content, Text, Button, Row, Toast, View, Form } from 'native-base'
import { StatusBar, ScrollView } from 'react-native'
import estilo from '../../assets/Estilo'
import { Client, Message } from 'react-native-paho-mqtt'
import LinearGradient from 'react-native-linear-gradient'
import Card from '../../components/Card'
import FeatherIcon from 'react-native-vector-icons/Feather'
import weatherToday from '../../services/WeatherToday'
import weatherWeek from '../../services/WeatherWeek'

export default class Dash extends Component {
    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.state = {
            weather_today: [],
            weather_week: [],
            conectado: true,
            sensor_atuador_cor: this.estilo.cor.purple_vivid,
            sensor_atuador_atual: 0,
            tipo_previsao_tempo_cor: this.estilo.cor.purple,
            tipo_previsao_tempo_atual: 0,
            regar: false,
            tab_atual: 0,
            sensores: {
                t: undefined,
                u: undefined,
                uS: undefined,
                l: undefined,
                c: undefined
            },
            loaded: false,
        }
        this.sensor_atuador = [
            { index: 0, icon: 'activity', label: 'Sensores', cor: this.estilo.cor.purple_vivid },
            { index: 1, icon: 'command', label: 'Atuadores', cor: this.estilo.cor.blue },
        ]
        this.tipo_previsao_tempo = [
            { index: 0, icon: 'calendar', label: 'Semanal', cor: this.estilo.cor.purple },
            { index: 1, icon: 'clock', label: '12 horas', cor: this.estilo.cor.greenish_medium },
        ]
        this.topico_sensores = 'plante_box_sensores(renalves.oli@gmail.com)'
        this.topico_regador = 'plante_box_regador(renalves.oli@gmail.com)'
        this.uri = 'ws://iot.eclipse.org:80/ws'
        this.client_id = 'plante_app_id(renalves.oli@gmail.com)'
        this.myStorage = {
            setItem: (key, item) => {
                myStorage[key] = item
            },
            getItem: (key) => myStorage[key],
            removeItem: (key) => {
                delete myStorage[key]
            },
        }
        this.client = new Client({
            uri: this.uri, clientId: this.client_id, storage: this.myStorage
        })
    }

    async componentWillMount() {
        await this.setState({ weather_today: await weatherToday.get() })
        await this.setState({ weather_week: await weatherWeek.get() })
    }

    async load() {
        this.client.on('connectionLost', (responseObject) => {
            if (responseObject.errorCode !== 0) {
                this.setState({ conectado: false })
                Toast.show({
                    text: 'Conexão perdida!',
                    type: 'danger',
                    duration: 3000,
                    textStyle: { textAlign: 'center' },
                    position: 'top'
                })
            }
        })
        this.client.on('messageReceived', (message) => {
            this.setState({ sensores: JSON.parse(message.payloadString) })
        })
        this.conectar()
        this.setState({ loaded: true })
    }

    teste = async () => {
        if (this.state.conectado) {
            let message = new Message('{\"t\":25.36,\"u\":87.56,\"uS\":70.00,\"l\":68.14,\"c\":43.00}')
            message.destinationName = this.topico_sensores
            this.client.send(message)
        }
    }

    regar_change = () => {
        this.setState({ regar: !this.state.regar })
    }

    async conectar() {
        this.client.connect()
            .then(() => {
                this.setState({ conectado: true })
                Toast.show({
                    text: 'Conectado com sucesso!',
                    type: 'success',
                    duration: 3000,
                    textStyle: { textAlign: 'center' },
                    position: 'top'
                })
                return this.client.subscribe(this.topico_sensores)
            })
            .catch((responseObject) => {
                if (responseObject.errorCode !== 0) {
                    this.setState({ conectado: false })
                    Toast.show({
                        text: 'Não foi possível conectar!',
                        type: 'danger',
                        duration: 3000,
                        textStyle: { textAlign: 'center' },
                        position: 'top'
                    })
                }
            })
    }

    render() {
        const cards = [
            { id: 0, cor1: this.estilo.cor.red_vivid, cor2: this.estilo.cor.purple_vivid, method: this.teste, icon_name: 'thermometer', icon_type: 'MaterialCommunityIcons', value: this.state.sensores.t, value_sufix: ' ºC', sub_value: 'temperatura' },
            { id: 1, cor1: this.estilo.cor.brown_vivid, cor2: this.estilo.cor.brwon_light, method: this.teste, icon_name: 'water', icon_type: 'MaterialCommunityIcons', value: this.state.sensores.uS, value_sufix: ' %', sub_value: 'umidade do solo' },
            { id: 2, cor1: this.estilo.cor.orange_medium, cor2: this.estilo.cor.yellow, method: this.teste, icon_name: 'wb-sunny', icon_type: 'MaterialIcons', value: this.state.sensores.l, value_sufix: ' %', sub_value: 'luminosidade' },
            { id: 3, cor1: this.estilo.cor.greenish_solid, cor2: this.estilo.cor.greenish, method: this.teste, icon_name: 'water', icon_type: 'MaterialCommunityIcons', value: this.state.sensores.u, value_sufix: ' %', sub_value: 'umidade do ar' },
            { id: 4, cor1: this.estilo.cor.blue_dark, cor2: this.estilo.cor.blue_light, method: this.teste, icon_name: 'weather-pouring', icon_type: 'MaterialCommunityIcons', value: this.state.sensores.c, value_sufix: ' %', sub_value: 'chuva' },
        ]

        return (
            <Container>
                {/* 0 */}
                {this.state.tab_atual == 0 ?
                    <Content>
                        {this.state.conectado ? null :
                            <LinearGradient colors={[this.estilo.cor.greenish, this.estilo.cor.purple_vivid]}
                                useAngle={true} angle={45} angleCenter={{ x: 0.5, y: 0.5 }}
                                style={{
                                    width: 370, borderRadius: 20, marginTop: 20, alignSelf: 'center', elevation: 5
                                }}>
                                <Button rounded onPress={() => this.conectar()}
                                    style={{
                                        backgroundColor: '', width: 350, borderRadius: 20,
                                        elevation: 0, justifyContent: 'center'
                                    }}>
                                    <Text uppercase={false} style={{ color: this.estilo.cor.white + '77', fontSize: 18, paddingRight: 0, paddingLeft: 0 }} >Conectar ao  </Text>
                                    <Text uppercase={false} style={{ color: this.estilo.cor.white, fontSize: 20, paddingRight: 0, paddingLeft: 0 }} >Plante Box  </Text>
                                    <FeatherIcon style={{ color: this.estilo.cor.white, fontSize: 30 }} name='radio' />
                                </Button>
                            </LinearGradient>}
                        <StatusBar backgroundColor={this.estilo.cor.white} barStyle='dark-content' />

                        <Text style={{ marginLeft: 25, marginTop: 20, fontSize: 28, fontWeight: 'bold', color: this.estilo.cor.gray }}
                        >Plantação</Text>
                        <Form style={{ flexDirection: 'row', justifyContent: 'flex-start', backgroundColor: 'transparent', marginTop: 10, paddingLeft: 20 }}>
                            {this.sensor_atuador.map((item) => (
                                <Button key={item.icon} rounded style={{ backgroundColor: '', elevation: 0, marginHorizontal: 5 }}
                                    onPress={() => { this.setState({ sensor_atuador_atual: item.index, sensor_atuador_cor: item.cor, label: item.label }) }}>
                                    <FeatherIcon name={item.icon} style={{ fontSize: 22, color: this.state.sensor_atuador_atual == item.index ? this.estilo.cor.gray : this.estilo.cor.gray_medium }} />
                                    <Text uppercase={false} style={{
                                        color: this.state.sensor_atuador_atual == item.index ? this.estilo.cor.gray : this.estilo.cor.gray_medium, fontSize: 18, marginLeft: -10
                                    }}>  {item.label}</Text>
                                </Button>
                            ))}
                        </Form>
                        <ScrollView style={{ display: this.state.sensor_atuador_atual == 0 ? 'flex' : 'none' }}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            decelerationRate='fast'
                            snapToAlignment='start'
                            snapToInterval={170}>
                            <Row style={{ justifyContent: 'center', flexWrap: 'wrap' }} >
                                <Form style={{ width: 10, height: 200 }} />
                                {cards.map((item) => (<Card key={item.id} item={item} />))}
                                <Form style={{ width: 61, height: 200 }} />
                            </Row>
                        </ScrollView>

                        <ScrollView style={{ display: this.state.sensor_atuador_atual == 1 ? 'flex' : 'none' }}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            decelerationRate='fast'
                            snapToAlignment='start'
                            snapToInterval={170}>

                            <Row style={{ justifyContent: 'center', flexWrap: 'wrap' }} >
                                <Form style={{ width: 10, height: 200 }} />
                                <Card item={this.state.regar ?
                                    {
                                        cor1: this.estilo.cor.blue, cor2: this.estilo.cor.greenish_light, method: this.regar_change,
                                        icon_name: 'water-pump', icon_type: 'MaterialCommunityIcons', value: 'Desligar',
                                        sub_value_prefix: 'umidade ', sub_value: this.state.sensores.u, sub_value_sufix: ' %'
                                    }
                                    : {
                                        cor1: this.estilo.cor.gray, cor2: this.estilo.cor.gray_white, method: this.regar_change,
                                        icon_name: 'water-pump', icon_type: 'MaterialCommunityIcons', value: 'Ligar',
                                        sub_value_prefix: 'umidade ', sub_value: this.state.sensores.u, sub_value_sufix: ' %'
                                    }} />
                                <Form style={{ width: 61, height: 200 }} />
                            </Row>
                        </ScrollView>

                        {/* Previsão */}

                        <Text style={{ marginLeft: 25, marginTop: 20, fontSize: 28, fontWeight: 'bold', color: this.estilo.cor.gray }}
                        >Previsão do tempo</Text>
                        <Form style={{ flexDirection: 'row', justifyContent: 'flex-start', backgroundColor: 'transparent', marginTop: 10, paddingLeft: 20 }}>
                            {this.tipo_previsao_tempo.map((item) => (
                                <Button key={item.icon} rounded style={{ backgroundColor: '', elevation: 0, marginHorizontal: 5 }}
                                    onPress={() => { this.setState({ tipo_previsao_tempo_atual: item.index, tipo_previsao_tempo_cor: item.cor, label: item.label }) }}>
                                    <FeatherIcon name={item.icon} style={{ fontSize: 22, color: this.state.tipo_previsao_tempo_atual == item.index ? this.estilo.cor.gray : this.estilo.cor.gray_medium }} />
                                    <Text uppercase={false} style={{
                                        color: this.state.tipo_previsao_tempo_atual == item.index ? this.estilo.cor.gray : this.estilo.cor.gray_medium, fontSize: 18, marginLeft: -10
                                    }}>  {item.label}</Text>
                                </Button>
                            ))}
                        </Form>
                    </Content>
                    : null}

                {/* 1 */}
                {this.state.tab_atual == 1 ?
                    <Content>
                        <StatusBar backgroundColor={this.estilo.cor.white} barStyle='dark-content' />
                        <View style={{ paddingTop: 10, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', flex: 1 }} >
                            <Card item={this.state.regar ?
                                {
                                    cor1: this.estilo.cor.blue, cor2: this.estilo.cor.greenish_light, method: this.regar_change,
                                    icon_name: 'water-pump', icon_type: 'MaterialCommunityIcons', value: 'Desligar',
                                    sub_value_prefix: 'umidade ', sub_value: this.state.sensores.u, sub_value_sufix: ' %'
                                }
                                : {
                                    cor1: this.estilo.cor.gray, cor2: this.estilo.cor.gray_white, method: this.regar_change,
                                    icon_name: 'water-pump', icon_type: 'MaterialCommunityIcons', value: 'Ligar',
                                    sub_value_prefix: 'umidade ', sub_value: this.state.sensores.u, sub_value_sufix: ' %'
                                }} />
                        </View>
                    </Content> : null}

                {/* 2 */}
                {/* <Container style={this.state.tab_atual == 2 ? null : { display: 'none' }}>
                    {this.state.update_weater_week ? <WeatherWeek update={true} /> : <WeatherWeek />}
                </Container> */}

                {/* 3 */}
                {/* <Container style={this.state.tab_atual == 3 ? null : { display: 'none' }}>
                    {this.state.update_weater_today ? <WeatherToday update={true} /> : <WeatherToday />}
                </Container>*/}
            </Container>
        )
    }
}