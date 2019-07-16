import React, { Component } from 'react'
import { Container, Content, Text, Button, Icon, Fab, Col, Row, View, Form, Body, Tabs, Tab, ScrollableTab, TabHeading, Header, Toast, Item, Left, Right, ListItem } from 'native-base'
import { StatusBar } from 'react-native'
import Loader from '../../components/Loader'
import estilo from '../../assets/Estilo'
import { Client, Message } from 'react-native-paho-mqtt'
import LinearGradient from 'react-native-linear-gradient'
import FeatherIcon from 'react-native-vector-icons/Feather'

export default class Dash extends Component {
    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.state = {
            conectado: true,
            plantacao_status: true,
            regar: false,
            tab_atual: 0,
            card_weather_atual: 0,
            lista_weather: [],
            sensores: {
                t: undefined,
                u: undefined,
                uS: undefined,
                l: undefined,
                c: undefined
            },
            loaded: false,
        }
        this.card_weather = [
            { icon: 'thermometer', cor1: this.estilo.cor.red_vivid, cor2: this.estilo.cor.purple_vivid },
            { icon: 'sun', cor1: this.estilo.cor.orange, cor2: this.estilo.cor.orange_light },
            { icon: 'droplet', cor1: this.estilo.cor.blue_solid, cor2: this.estilo.cor.greenish },
            { icon: 'wind', cor1: this.estilo.cor.green_solid, cor2: this.estilo.cor.greenish }
        ]

        this.topico_sensores = 'plante_iot_sensores(renalves.oli@gmail.com)'
        this.topico_regador = 'plante_iot_regador(renalves.oli@gmail.com)'
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

    async load() {
        let aux = [{
            dia: 'Segunda',
            data: '15 de jul',
            temperatura: 32,
            tipo_temperatura: 'quente'
        },
        {
            dia: 'Terça',
            data: '16 de jul',
            temperatura: 30,
            tipo_temperatura: 'quente'
        },
        {
            dia: 'Quarta',
            data: '17 de jul',
            temperatura: 28,
            tipo_temperatura: 'média'
        },
        {
            dia: 'Quinta',
            data: '18 de jul',
            temperatura: 25,
            tipo_temperatura: 'média'
        },
        {
            dia: 'Sexta',
            data: '19 de jul',
            temperatura: 30,
            tipo_temperatura: 'quente'
        }]
        await this.setState({ lista_weather: aux })
        this.client.on('connectionLost', (responseObject) => {
            if (responseObject.errorCode !== 0) {
                this.setState({ conectado: false })
                Toast.show({
                    text: 'Conecxão perdida!',
                    type: 'danger',
                    duration: 3000,
                    textStyle: { textAlign: 'center' }
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
            let message = new Message('{\"t\":25.36, \"u\":87.56, \"uS\":70.00, \"l\":68.14, \"c\":43.00}')
            message.destinationName = this.topico_sensores
            this.client.send(message)
        }
    }

    async conectar() {
        this.client.connect()
            .then(() => {
                this.setState({ conectado: true })
                Toast.show({
                    text: 'Conectado com sucesso!',
                    type: 'success',
                    duration: 3000,
                    textStyle: { textAlign: 'center' }
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
                        textStyle: { textAlign: 'center' }
                    })
                }
            })
    }

    render() {
        const cards = [
            { cor1: this.estilo.cor.red_vivid, cor2: this.estilo.cor.purple_vivid, method: this.teste, icon_name: 'thermometer', icon_type: 'MaterialCommunityIcons', value: this.state.sensores.t, value_sufix: ' ºC', value_type: 'temperatura' },
            { cor1: this.estilo.cor.brown_vivid, cor2: this.estilo.cor.brwon_light, method: this.teste, icon_name: 'water', icon_type: 'MaterialCommunityIcons', value: this.state.sensores.uS, value_sufix: ' %', value_type: 'umidade do solo' },
            { cor1: this.estilo.cor.orange_light, cor2: this.estilo.cor.yellow, method: this.teste, icon_name: 'wb-sunny', icon_type: 'MaterialIcons', value: this.state.sensores.l, value_sufix: ' %', value_type: 'luminosidade' },
            { cor1: this.estilo.cor.green, cor2: this.estilo.cor.blue_light, method: this.teste, icon_name: 'water', icon_type: 'MaterialCommunityIcons', value: this.state.sensores.u, value_sufix: ' %', value_type: 'umidade do ar' },
            { cor1: this.estilo.cor.blue, cor2: this.estilo.cor.green_ligth, method: this.teste, icon_name: 'weather-pouring', icon_type: 'MaterialCommunityIcons', value: this.state.sensores.c, value_sufix: ' %', value_type: 'chuva' },
        ]
        return (
            <Container>
                <StatusBar backgroundColor={this.estilo.cor.white} barStyle='dark-content' />
                <Tabs tabContainerStyle={{ backgroundColor: this.estilo.cor.white }}
                    tabBarUnderlineStyle={{ height: 0 }}
                    onChangeTab={({ i }) => this.setState({ tab_atual: i })}>
                    <Tab heading={<TabHeading style={{ backgroundColor: '' }}>
                        {this.state.loaded ? null : <Loader />}
                        <Text style={[{ fontWeight: 'normal', fontSize: 17 },
                        this.state.tab_atual == 0 ?
                            { color: this.estilo.cor.black } :
                            { color: this.estilo.cor.gray }]} >Sensores</Text>
                        <Icon style={[{ fontSize: 25 },
                        this.state.tab_atual == 0 ?
                            { color: this.estilo.cor.black } :
                            { color: this.estilo.cor.gray }]}
                            name='gauge' type='MaterialCommunityIcons' />
                    </TabHeading>}>
                        <Content>

                            {this.state.conectado ? null : <LinearGradient colors={[this.estilo.cor.greenish_light, this.estilo.cor.purple_vivid]}
                                useAngle={true} angle={45} angleCenter={{ x: 0.5, y: 0.5 }}
                                style={{ width: 350, borderRadius: 50, marginTop: 25, alignSelf: 'center' }}>
                                <Button rounded onPress={() => this.conectar()}
                                    style={{
                                        backgroundColor: '',
                                        width: 350, elevation: 0, justifyContent: 'center'
                                    }}>
                                    <Text uppercase={false} style={{ color: this.estilo.cor.white, fontSize: 17 }} >Conectar ao Plante IoT</Text>
                                </Button>
                            </LinearGradient>}

                            <Row style={{ justifyContent: 'center', paddingTop: 10, flexWrap: 'wrap' }} >
                                {cards.map((item) => (
                                    <LinearGradient key={item.value_type} colors={[item.cor1, item.cor2]} useAngle={true}
                                        angle={45} angleCenter={{ x: 0.5, y: 0.5 }} style={this.estilo.item_dash}>
                                        <Button style={this.estilo.buttom_item_dash} onPress={() => item.method()}>
                                            {item.icon_name && item.icon_type ? <Icon name={item.icon_name} type={item.icon_type} style={this.estilo.icon_item_dash} /> : null}
                                            {item.value ? <Text style={{ fontSize: 23, color: 'white' }} >{item.value}{item.value_sufix}</Text> : null}
                                            {item.value_type ? <Text uppercase={false} style={{ color: this.estilo.cor.white + '77', fontSize: 15 }} >{item.value_type}</Text> : null}
                                        </Button>
                                    </LinearGradient>
                                ))}

                                <LinearGradient colors={this.state.plantacao_status ? [this.estilo.cor.green_solid, this.estilo.cor.green] :
                                    [this.estilo.cor.red_solid, this.estilo.cor.red_vivid]} useAngle={true}
                                    angle={45} angleCenter={{ x: 0.5, y: 0.5 }} style={this.estilo.item_dash}>
                                    <Button style={this.estilo.buttom_item_dash} onPress={() => this.setState({ plantacao_status: !this.state.plantacao_status })}>
                                        <Icon name={this.state.plantacao_status ? 'check-circle' : 'alert-circle'} type='MaterialCommunityIcons' style={this.estilo.icon_item_dash} />
                                        <Text uppercase={false} style={{ fontSize: 23, color: 'white' }} >{this.state.plantacao_status ? 'Tudo certo' : 'Algo errado'}</Text>
                                    </Button>
                                </LinearGradient>

                                <LinearGradient colors={[this.card_weather[this.state.card_weather_atual].cor1,
                                this.card_weather[this.state.card_weather_atual].cor2]} useAngle={true}
                                    angle={45} angleCenter={{ x: 0.5, y: 0.5 }} style={[this.estilo.item_dash,
                                    { width: 350, height: 'auto', paddingBottom: 10 }]}>
                                    <View onPress={() => this.setState({ plantacao_status: !this.state.plantacao_status })}>
                                        <Text style={{ alignSelf: 'center', marginTop: 20, fontSize: 18, color: this.estilo.cor.white + '77' }}>Previsão</Text>
                                        <Form style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                            {this.card_weather.map((item) => (
                                                <Button key={item.icon} rounded style={this.estilo.button_item_weather}
                                                    onPress={() => this.setState({ card_weather_atual: this.card_weather.indexOf(item) })}>
                                                    <FeatherIcon name={item.icon} style={[this.estilo.icon_item_weather,
                                                    this.state.card_weather_atual == this.card_weather.indexOf(item) ?
                                                        { color: this.estilo.cor.white } : null]} />
                                                </Button>
                                            ))}
                                        </Form>
                                        {this.state.lista_weather.map((item) => (
                                            <ListItem key={item.dia} style={{ marginTop: -15, paddingRight: 0, marginLeft: 30, marginRight: 30, borderBottomWidth: 0 }}>
                                                <Row>
                                                    <Form style={{ flexDirection: 'column', width: '50%' }}>
                                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white, fontWeight: 'bold' }}> {item.dia} </Text>
                                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77' }}> {item.data} </Text>
                                                    </Form>
                                                    <Form style={{ flexDirection: 'column', width: '50%', alignItems: 'flex-end' }}>
                                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white, fontWeight: 'bold' }}> {item.temperatura} ºC </Text>
                                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77' }}> {item.tipo_temperatura} </Text>
                                                    </Form>
                                                </Row>
                                            </ListItem>
                                        ))}
                                    </View>
                                </LinearGradient>
                            </Row>
                            <Form style={this.estilo.form_vazio}></Form>
                        </Content>
                    </Tab>
                    <Tab heading={<TabHeading style={{ backgroundColor: '' }}>
                        <Text style={[{ fontWeight: 'normal', fontSize: 17 },
                        this.state.tab_atual == 1 ?
                            { color: this.estilo.cor.black } :
                            { color: this.estilo.cor.gray }]} >Atuadores</Text>
                        <Icon style={[{ fontSize: 22 },
                        this.state.tab_atual == 1 ?
                            { color: this.estilo.cor.black } :
                            { color: this.estilo.cor.gray }]}
                            name='robot-industrial' type='MaterialCommunityIcons' />
                    </TabHeading>}>
                        <Content>
                            <Row style={{ justifyContent: 'center', paddingTop: 10 }} >
                                <LinearGradient colors={this.state.regar ? [this.estilo.cor.blue, this.estilo.cor.greenish_light] :
                                    [this.estilo.cor.gray, this.estilo.cor.gray_white]} useAngle={true}
                                    angle={45} angleCenter={{ x: 0.5, y: 0.5 }} style={this.estilo.item_dash}>
                                    <Button style={this.estilo.buttom_item_dash} onPress={() => this.setState({ regar: !this.state.regar })}>
                                        <Icon name='water-pump' type='MaterialCommunityIcons' style={[this.estilo.icon_item_dash, { color: this.estilo.cor.white }]} />
                                        <Text uppercase={false} style={{ color: this.estilo.cor.white, fontWeight: 'bold', fontSize: 23 }} >{this.state.regar ? 'Desligar' : 'Ligar'}</Text>
                                        <Text uppercase={false} style={{ color: this.estilo.cor.white + '77', fontSize: 15 }} >umidade {this.state.sensores.u} %</Text>
                                    </Button>
                                </LinearGradient>
                            </Row>
                            <Form style={this.estilo.form_vazio}></Form>
                        </Content>
                    </Tab>
                </Tabs>
            </Container >
        )
    }
}

