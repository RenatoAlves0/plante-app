import React, { Component } from 'react'
import { Container, Content, Text, Button, Icon, Row, Form, Toast } from 'native-base'
import { StatusBar } from 'react-native'
import Loader from '../../components/Loader'
import estilo from '../../assets/Estilo'
import { Client, Message } from 'react-native-paho-mqtt'
import LinearGradient from 'react-native-linear-gradient'
import Card from '../../components/Card'
import WeatherWeek from '../../components/WeatherWeek'
import WeatherToday from '../../components/WeatherToday'
import FeatherIcon from 'react-native-vector-icons/Feather'
import BottomMenuCliente from '../../components/BottomMenuCliente'

export default class Dash extends Component {
    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.state = {
            update_weater_week: true,
            update_weater_today: true,
            conectado: true,
            plantacao_status: true,
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

    componentWillMount() {
        this.load()
    }

    componentWillReceiveProps() {
        this.load()
    }

    componentDidMount() {
        this.setState({ update_weater_week: false })
        this.setState({ update_weater_today: false })
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
                    position: 'bottom'
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

    plantacao_status_change = () => {
        this.setState({ plantacao_status: !this.state.plantacao_status })
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
                    position: 'bottom'
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
                        position: 'bottom'
                    })
                }
            })
    }

    sleep = (delay) => {
        var start = new Date().getTime()
        while (new Date().getTime() < start + delay);
    }

    setTabAtual = async (ativa) => {
        await this.setState({ tab_atual: ativa })
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
                <StatusBar backgroundColor={this.estilo.cor.white} barStyle='dark-content' />
                {this.state.loaded ? null : <Loader />}
                <BottomMenuCliente method={this.setTabAtual} />

                {/* 0 */}
                <Content style={this.state.tab_atual == 0 ? null : { display: 'none' }}>
                    {this.state.conectado ? null :
                        <LinearGradient colors={[this.estilo.cor.greenish, this.estilo.cor.purple_vivid]}
                            useAngle={true} angle={45} angleCenter={{ x: 0.5, y: 0.5 }}
                            style={{
                                width: 370, borderRadius: 10, marginTop: 25, alignSelf: 'center', elevation: 10
                            }}>
                            <Button rounded onPress={() => this.conectar()}
                                style={{
                                    backgroundColor: '', width: 350, borderRadius: 10,
                                    elevation: 0, justifyContent: 'center'
                                }}>
                                <Text uppercase={false} style={{ color: this.estilo.cor.white + '77', fontSize: 18, paddingRight: 0, paddingLeft: 0 }} >Conectar  </Text>
                                <Text uppercase={false} style={{ color: this.estilo.cor.white, fontSize: 20, paddingRight: 0, paddingLeft: 0 }} >Plante Box  </Text>
                                <FeatherIcon style={{ color: this.estilo.cor.white, fontSize: 30 }} name='radio' />
                            </Button>
                        </LinearGradient>}
                    <Row style={{ justifyContent: 'center', paddingTop: 10, flexWrap: 'wrap' }} >
                        {cards.map((item) => (<Card key={item.id} item={item} />))}

                        <Card item={this.state.plantacao_status ?
                            { cor1: this.estilo.cor.green_solid, cor2: this.estilo.cor.green, method: this.plantacao_status_change, icon_name: 'check-circle', icon_type: 'MaterialCommunityIcons', value: 'Tudo certo' }
                            : { cor1: this.estilo.cor.red_solid, cor2: this.estilo.cor.red_vivid, method: this.plantacao_status_change, icon_name: 'alert-circle', icon_type: 'MaterialCommunityIcons', value: 'Algo errado' }} />

                    </Row>
                </Content>

                {/* 1 */}
                <Content style={[this.state.tab_atual == 1 ? null : { display: 'none' },
                { paddingTop: 10, flexDirection: 'row' }]} >
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
                </Content>

                {/* 2 */}
                <Content style={this.state.tab_atual == 2 ? null : { display: 'none' }}>
                    {this.state.update_weater_week ? <WeatherWeek update={true} /> : <WeatherWeek />}
                </Content>

                {/* 3 */}
                <Content style={this.state.tab_atual == 3 ? null : { display: 'none' }}>
                    {this.state.update_weater_today ? <WeatherToday update={true} /> : <WeatherToday />}
                </Content>
            </Container >
        )
    }
}