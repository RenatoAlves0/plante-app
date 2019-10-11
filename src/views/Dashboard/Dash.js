import React, { Component } from 'react'
import { Container, Content, Text, Button, Row, Toast, Form } from 'native-base'
import { StatusBar, ScrollView, Animated, Easing, Dimensions } from 'react-native'
import { Actions } from 'react-native-router-flux'
import estilo from '../../assets/Estilo'
import { Client, Message } from 'react-native-paho-mqtt'
import LinearGradient from 'react-native-linear-gradient'
import Card from '../../components/Card'
import FeatherIcon from 'react-native-vector-icons/Feather'
import weatherToday from '../../services/WeatherToday'
import weatherWeek from '../../services/WeatherWeek'
import ChartToday from '../../components/ChartToday'
import ChartWeek from '../../components/ChartWeek'

export default class Dash extends Component {
    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.state = {
            weather_today: {},
            weather_week: {},
            weather_updated: true,
            conectado: true,
            sensor_atuador_cor: this.estilo.cor.purple_vivid,
            sensor_atuador_atual: 0,
            tipo_previsao_tempo_cor: this.estilo.cor.purple,
            tipo_previsao_tempo_atual: 0,
            regar: false,
            tab_atual: 0,
            sensores: { t: undefined, u: undefined, uS: undefined, l: undefined, c: undefined },
            alertas: { t: undefined, u: undefined, uS: undefined, l: undefined, c: undefined },
            loaded: false,
        }
        this.sensor_atuador = [
            { index: 0, icon: 'activity', label: 'Sensores', cor: this.estilo.cor.purple_vivid },
            { index: 1, icon: 'command', label: 'Regador', cor: this.estilo.cor.blue },
        ]
        this.tipo_previsao_tempo = [
            { index: 0, icon: 'clock', label: '12 horas', cor: this.estilo.cor.greenish_medium },
            { index: 1, icon: 'calendar', label: '5 dias', cor: this.estilo.cor.purple },
        ]
        this.topico_sensores = 'plante_sensores.5d699b7e0762797037d35801'
        this.topico_regador = 'plante_regador.5d699b7e0762797037d35801'
        this.topico_alertas = 'plante_alertas.5d699b7e0762797037d35801'
        this.uri = 'ws://test.mosquitto.org:8080/ws'
        this.client_id = 'plante_app.5d699b7e0762797037d35801'
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

    componentWillMount() {
        this.load()
    }

    async load() {
        await this.setState({ weather_today: await weatherToday.get() })
        await this.setState({ weather_week: await weatherWeek.get() })
        this.client.on('connectionLost', (responseObject) => {
            console.log(responseObject)
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
            if (message._destinationName == this.topico_sensores)
                this.setState({ sensores: JSON.parse(message.payloadString) })
            if (message._destinationName == this.topico_alertas)
                this.setState({ alertas: JSON.parse(message.payloadString) })
        })
        this.conectar()
        this.setState({ loaded: true })
    }

    regar_change = () => {
        this.setState({ regar: !this.state.regar })
        if (this.state.conectado) {
            let message = this.state.regar ? new Message('0') : new Message('1')
            message.destinationName = this.topico_regador
            this.client.send(message)
        }
    }

    async conectar() {
        this.client.connect()
            .then(() => {
                this.setState({ conectado: true })
                Toast.show({
                    text: 'Conectado ao Plante Box!',
                    type: 'success',
                    duration: 3000,
                    textStyle: { textAlign: 'center' },
                    position: 'top'
                })
                this.client.subscribe(this.topico_sensores)
                this.client.subscribe(this.topico_alertas)
            })
            .catch((responseObject) => {
                console.log('...')
                console.log(responseObject)
                console.log(this.uri)

                if (responseObject.errorCode !== 0) {
                    this.setState({ conectado: false })
                    Toast.show({
                        text: 'Falha ao conectar com o Plante Box!',
                        type: 'danger',
                        duration: 3000,
                        textStyle: { textAlign: 'center' },
                        position: 'top'
                    })
                }
            })
    }

    async updateWeather() {
        await this.setState({ weather_updated: false })
        await weatherToday.update()
        await this.setState({ weather_today: await weatherToday.get() })
        await weatherWeek.update()
        await this.setState({ weather_week: await weatherWeek.get() })
        await this.setState({ weather_updated: true })
    }

    render() {
        const rotate = this.spinValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] })

        const cards = [
            { id: 0, action: false, cor1: this.estilo.cor.purple, cor2: this.estilo.cor.purple_vivid, icon_name: 'thermometer', icon_type: 'MaterialCommunityIcons', value: this.state.sensores.t, value_sufix: ' ºC', sub_value: 'temperatura', alerta: this.state.alertas.t },
            { id: 1, action: false, cor1: this.estilo.cor.brown, cor2: this.estilo.cor.brwon_light, icon_name: 'water', icon_type: 'MaterialCommunityIcons', value: this.state.sensores.uS, value_sufix: ' %', sub_value: 'umidade do solo', alerta: this.state.alertas.uS },
            { id: 2, action: false, cor1: this.estilo.cor.orange_medium, cor2: this.estilo.cor.yellow_light, icon_name: 'wb-sunny', icon_type: 'MaterialIcons', value: this.state.sensores.l, value_sufix: ' %', sub_value: 'luminosidade', alerta: this.state.alertas.l },
            { id: 3, action: false, cor1: this.estilo.cor.greenish_solid, cor2: this.estilo.cor.greenish, icon_name: 'water', icon_type: 'MaterialCommunityIcons', value: this.state.sensores.u, value_sufix: ' %', sub_value: 'umidade do ar', alerta: this.state.alertas.u },
            { id: 4, action: false, cor1: this.estilo.cor.blue_solid, cor2: this.estilo.cor.blue_light, icon_name: 'weather-pouring', icon_type: 'MaterialCommunityIcons', value: this.state.sensores.c, value_sufix: ' %', sub_value: 'chuva', alerta: this.state.alertas.c },
        ]

        return (
            <Container>
                {/* Botão de reconexão com o Plante Box */}
                <Content>
                    {this.state.conectado ? null :
                        <LinearGradient colors={[this.estilo.cor.purple_vivid, this.estilo.cor.greenish]}
                            useAngle={true} angle={45} angleCenter={{ x: 0.5, y: 0.5 }}
                            style={{
                                width: Dimensions.get('screen').width * .9, borderRadius: 20, marginTop: 20, alignSelf: 'center', elevation: 5
                            }}>
                            <Button full rounded onPress={() => this.conectar()}
                                style={{
                                    backgroundColor: '', width: '100%', borderRadius: 20,
                                    elevation: 0, justifyContent: 'center'
                                }}>
                                <Text uppercase={false} style={{ color: this.estilo.cor.white + '77', fontSize: 18, paddingRight: 0, paddingLeft: 0 }} >Conectar ao  </Text>
                                <Text uppercase={false} style={{ color: this.estilo.cor.white, fontSize: 20, paddingRight: 0, paddingLeft: 0 }} >Plante Box  </Text>
                                <FeatherIcon style={{ color: this.estilo.cor.white, fontSize: 30 }} name='radio' />
                            </Button>
                        </LinearGradient>}
                    <StatusBar backgroundColor={this.estilo.cor.white} barStyle='dark-content' />

                    {/* Plantação */}

                    <Form style={{ flexDirection: 'row', justifyContent: 'flex-start', backgroundColor: 'transparent', marginTop: 20 }}>
                        <Form style={{ width: '70%', flexDirection: 'row' }}>
                            <Text style={{ marginLeft: 25, fontSize: 28, fontWeight: 'bold', color: this.estilo.cor.gray_solid }}
                            >Plantação</Text>
                        </Form>
                        <Form style={{ width: '30%' }}>
                            <Button transparent rounded disabled={!this.state.weather_updated} style={{ elevation: 0, marginRight: 25, alignSelf: 'flex-end' }}
                                onPress={() => { Actions.plantacaoList() }}>
                                <FeatherIcon name='grid' style={{ fontSize: 22, color: this.estilo.cor.gray_solid }} />
                            </Button>
                        </Form>
                    </Form>

                    <Form style={{ flexDirection: 'row', justifyContent: 'flex-start', backgroundColor: 'transparent', marginTop: 10, paddingLeft: 20 }}>
                        {this.sensor_atuador.map((item) => (
                            <Button key={item.icon} rounded style={{ backgroundColor: '', elevation: 0, marginHorizontal: 5 }}
                                onPress={() => { this.setState({ sensor_atuador_atual: item.index, sensor_atuador_cor: item.cor, label: item.label }) }}>
                                <FeatherIcon name={item.icon} style={{ fontSize: 22, color: this.state.sensor_atuador_atual == item.index ? this.estilo.cor.gray_solid : this.estilo.cor.gray_medium }} />
                                <Text uppercase={false} style={{
                                    color: this.state.sensor_atuador_atual == item.index ? this.estilo.cor.gray_solid : this.estilo.cor.gray_medium, fontSize: 18, marginLeft: -10
                                }}>  {item.label}</Text>
                            </Button>
                        ))}
                    </Form>
                    <ScrollView style={[this.state.sensor_atuador_atual == 0 ? {} : this.estilo.hide]}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        decelerationRate='fast'
                        snapToAlignment='start'
                        snapToInterval={20 + 170}>
                        <Row style={{ justifyContent: 'center', flexWrap: 'wrap' }} >
                            <Form style={{ width: 10, height: 200 }} />
                            {cards.map((item) => (<Card key={item.id} item={item} />))}
                            <Form style={{ width: Dimensions.get('screen').width - 200 }} />
                        </Row>
                    </ScrollView>

                    <ScrollView style={[this.state.sensor_atuador_atual == 1 ? {} : this.estilo.hide]}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        decelerationRate='fast'
                        snapToAlignment='start'
                        snapToInterval={20 + 170}>

                        <Row style={{ justifyContent: 'center', flexWrap: 'wrap' }} >
                            <Form style={{ width: 10, height: 200 }} />
                            <Card item={this.state.regar ?
                                {
                                    action: true, cor1: this.estilo.cor.blue, cor2: this.estilo.cor.greenish_light, method: this.regar_change,
                                    icon_name: 'water-pump', icon_type: 'MaterialCommunityIcons', value: 'Desligar',
                                    sub_value_prefix: 'umidade ', sub_value: this.state.sensores.u, sub_value_sufix: ' %'
                                }
                                : {
                                    action: true, cor1: this.estilo.cor.gray_solid, cor2: this.estilo.cor.gray_white, method: this.regar_change,
                                    icon_name: 'water-pump', icon_type: 'MaterialCommunityIcons', value: 'Ligar',
                                    sub_value_prefix: 'umidade ', sub_value: this.state.sensores.u, sub_value_sufix: ' %'
                                }} />
                            <Form style={{ width: Dimensions.get('screen').width - 200 }} />
                        </Row>
                    </ScrollView>

                    {/* Previsão do tempo */}

                    <Row>
                        <Form style={{ width: '70%' }}>
                            <Text style={{ marginLeft: 25, marginTop: 20, fontSize: 28, fontWeight: 'bold', color: this.estilo.cor.gray_solid }}>Previsão do tempo</Text>
                        </Form>
                        <Form style={{ width: '30%' }}>
                            <Button transparent rounded disabled={!this.state.weather_updated} style={{ elevation: 0, marginTop: 20, marginRight: 25, alignSelf: 'flex-end' }}
                                onPress={async () => this.updateWeather()}>
                                <Animated.View style={this.state.weather_updated ? null : { transform: [{ rotate }] }}>
                                    <FeatherIcon name='refresh-cw' style={{ fontSize: 22, color: this.estilo.cor.gray_solid }} />
                                </Animated.View>
                            </Button>
                        </Form>
                    </Row>

                    <Form style={{ flexDirection: 'row', justifyContent: 'flex-start', backgroundColor: 'transparent', marginTop: 10, paddingLeft: 20 }}>
                        <Form style={{ width: '70%', flexDirection: 'row' }}>
                            {this.tipo_previsao_tempo.map((item) => (
                                <Button key={item.icon} transparent rounded style={{ elevation: 0, marginHorizontal: 5 }}
                                    onPress={() => { this.setState({ tipo_previsao_tempo_atual: item.index, tipo_previsao_tempo_cor: item.cor, label: item.label }) }}>
                                    <FeatherIcon name={item.icon} style={{ fontSize: 22, color: this.state.tipo_previsao_tempo_atual == item.index ? this.estilo.cor.gray_solid : this.estilo.cor.gray_medium }} />
                                    <Text uppercase={false} style={{
                                        color: this.state.tipo_previsao_tempo_atual == item.index ? this.estilo.cor.gray_solid : this.estilo.cor.gray_medium, fontSize: 18, marginLeft: -10
                                    }}>  {item.label}</Text>
                                </Button>
                            ))}
                        </Form>
                        <Form style={{ width: '30%' }}>
                            <LinearGradient colors={[this.estilo.cor.gray_solid, this.estilo.cor.gray_medium]}
                                useAngle={true} angle={this.state.tipo_previsao_tempo_atual == 0 ? 45 : 270} angleCenter={{ x: 0.5, y: 0.5 }}
                                style={{
                                    borderRadius: 20, alignSelf: 'flex-end', elevation: 5,
                                    borderTopRightRadius: 0, borderBottomRightRadius: 0
                                }}>
                                <Button transparent rounded style={{
                                    borderRadius: 20, alignSelf: 'flex-end',
                                    borderTopRightRadius: 0, borderBottomRightRadius: 0
                                }}
                                    onPress={async () => { this.state.tipo_previsao_tempo_atual == 0 ? Actions.today() : this.state.tipo_previsao_tempo_atual == 1 ? Actions.week() : null }}>
                                    <FeatherIcon name='chevron-right' style={{ fontSize: 22, color: this.estilo.cor.white, marginLeft: 15, marginRight: 25, }} />
                                </Button>
                            </LinearGradient>
                        </Form>
                    </Form>

                    {this.state.weather_today && this.state.weather_today.temperatura ?
                        <Form style={[this.state.tipo_previsao_tempo_atual != 0 ? this.estilo.hide : { marginTop: 20 }]}>
                            <ChartToday data_array={this.state.weather_today.temperatura}
                                label_array={this.state.weather_today.hora}
                                opacity={''}
                                color={this.estilo.cor.purple} label_data='º' />
                            <Form style={{ backgroundColor: this.estilo.cor.purple, paddingVertical: 20 }} >
                                <Button rounded style={{ backgroundColor: this.estilo.cor.white + '11', marginHorizontal: 10, elevation: 0, borderRadius: 20, alignSelf: 'center' }}>
                                    <Text uppercase={false} style={{
                                        color: this.estilo.cor.white,
                                        fontSize: 17, paddingLeft: 30, paddingRight: 30
                                    }}>Temperatura</Text>
                                </Button>
                            </Form>
                        </Form> : null}

                    {this.state.weather_week && this.state.weather_week.temperatura_maxima ?
                        <Form style={[this.state.tipo_previsao_tempo_atual != 1 ? this.estilo.hide : { marginTop: 50 }]}>
                            <ChartWeek data_array={this.state.weather_week.temperatura_maxima}
                                opacity={''}
                                color={this.estilo.cor.purple} label_data='º' />
                            <ChartWeek data_array={this.state.weather_week.temperatura_minima}
                                label_array={this.state.weather_week.dia_semana}
                                opacity={'77'} background={this.estilo.cor.purple}
                                color={this.estilo.cor.purple} label_data='º' />
                            <Form style={{ backgroundColor: this.estilo.cor.purple, paddingVertical: 20 }} >
                                <Button rounded style={{ backgroundColor: this.estilo.cor.white + '11', marginHorizontal: 10, elevation: 0, borderRadius: 20, alignSelf: 'center' }}>
                                    <Text uppercase={false} style={{
                                        color: this.estilo.cor.white,
                                        fontSize: 17, paddingLeft: 30, paddingRight: 30
                                    }}>Temperatura</Text>
                                </Button>
                            </Form>
                        </Form> : null}
                </Content>
            </Container>
        )
    }
}