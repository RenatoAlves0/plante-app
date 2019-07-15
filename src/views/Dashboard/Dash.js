import React, { Component } from 'react'
import { Container, Content, Text, Button, Icon, Fab, Col, Row, View, Form, Body, Tabs, Tab, ScrollableTab, TabHeading, Header, Toast } from 'native-base'
import { StatusBar, TouchableHighlight, Dimensions } from 'react-native'
import Loader from '../../components/Loader'
import estilo from '../../assets/Estilo'
import { Client, Message } from 'react-native-paho-mqtt'
import LinearGradient from 'react-native-linear-gradient'

export default class Dash extends Component {
    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.state = {
            regar: false,
            conectado: true,
            tabAtual: 0,
            sensores: {
                t: undefined,
                u: undefined,
                uS: undefined,
                l: undefined,
                c: undefined
            },
            loaded: false,
        }
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
        this.client.on('connectionLost', (responseObject) => {
            if (responseObject.errorCode !== 0) this.setState({ conectado: false })
        })
        this.client.on('messageReceived', (message) => {
            this.setState({ sensores: JSON.parse(message.payloadString) })
        })
        this.conectar()
        this.setState({ loaded: true })
    }

    async teste() {
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
                        text: 'Não foi possível se conectar!',
                        type: 'danger',
                        duration: 3000,
                        textStyle: { textAlign: 'center' }
                    })
                }
            })
    }

    render() {
        return (
            <Container>
                <StatusBar backgroundColor={this.estilo.cor.white} barStyle='dark-content' />
                {this.state.loaded ? null : <Loader />}
                <Tabs tabContainerStyle={{ backgroundColor: this.estilo.cor.white }}
                    tabBarUnderlineStyle={{ height: 0 }}
                    initialPage={this.state.currentPage}
                    onChangeTab={({ i }) => this.setState({ tabAtual: i })}>
                    <Tab heading={<TabHeading style={{ backgroundColor: 'transparent' }}>
                        <Text style={[{ fontWeight: 'normal', fontSize: 17 },
                        this.state.tabAtual == 0 ?
                            { color: this.estilo.cor.black } :
                            { color: this.estilo.cor.gray }]} >Sensores</Text>
                        <Icon style={[{ fontSize: 25 },
                        this.state.tabAtual == 0 ?
                            { color: this.estilo.cor.black } :
                            { color: this.estilo.cor.gray }]}
                            name='gauge' type='MaterialCommunityIcons' />
                    </TabHeading>}>
                        <Content>

                            {this.state.conectado ? null : <LinearGradient colors={[this.estilo.cor.greenish_light, this.estilo.cor.purple_vivid]}
                                useAngle={true} angle={45} angleCenter={{ x: 0.5, y: 0.5 }}
                                style={{ width: 350, borderRadius: 50, marginTop: 25, alignSelf: 'center' }}>
                                <Button onPress={() => this.conectar()}
                                    style={{
                                        borderRadius: 10, backgroundColor: 'transparent',
                                        width: 350, elevation: 0, justifyContent: 'center'
                                    }}>
                                    <Text uppercase={false} style={{ color: 'white', fontSize: 17 }} >Conectar ao Plante IoT</Text>
                                </Button>
                            </LinearGradient>}

                            <Row style={{ justifyContent: 'center' }} >
                                <Text style={{
                                    fontSize: 17, color: this.estilo.cor.white, width: 350, textAlign: 'center',
                                    backgroundColor: this.estilo.cor.gray_white, paddingHorizontal: 20,
                                    paddingVertical: 7, marginTop: 20, borderRadius: 10, elevation: 3
                                }} >Dados da plantação</Text>
                            </Row>

                            <Row style={{ justifyContent: 'center', paddingTop: 10 }} >
                                <LinearGradient colors={[this.estilo.cor.red_vivid, this.estilo.cor.purple_vivid]} useAngle={true}
                                    angle={45} angleCenter={{ x: 0.5, y: 0.5 }} style={this.estilo.item_dash}>
                                    <Button style={this.estilo.buttom_item_dash} onPress={() => this.teste()}>
                                        <Icon name='thermometer' type='MaterialCommunityIcons' style={this.estilo.icon_item_dash} />
                                        <Text style={{ fontSize: 23, color: 'white' }} >{this.state.sensores.t} ºC</Text>
                                        <Text uppercase={false} style={{ color: 'white' }} >temperatura</Text>
                                    </Button>
                                </LinearGradient>

                                <LinearGradient colors={[this.estilo.cor.brown_vivid, this.estilo.cor.brwon_light]} useAngle={true}
                                    angle={45} angleCenter={{ x: 0.5, y: 0.5 }} style={this.estilo.item_dash}>
                                    <Button style={this.estilo.buttom_item_dash} onPress={() => this.teste()}>
                                        <Icon name='water' type='MaterialCommunityIcons' style={this.estilo.icon_item_dash} />
                                        <Text style={{ fontSize: 23, color: 'white' }} >{this.state.sensores.uS} %</Text>
                                        <Text uppercase={false} style={{ color: 'white' }} >umidade do solo</Text>
                                    </Button>
                                </LinearGradient>
                            </Row>

                            <Row style={{ justifyContent: 'center' }} >
                                <LinearGradient colors={[this.estilo.cor.orange_light, this.estilo.cor.yellow]} useAngle={true}
                                    angle={45} angleCenter={{ x: 0.5, y: 0.5 }} style={this.estilo.item_dash}>
                                    <Button style={this.estilo.buttom_item_dash} onPress={() => this.teste()}>
                                        <Icon name='wb-sunny' type='MaterialIcons' style={this.estilo.icon_item_dash} />
                                        <Text style={{ fontSize: 23, color: 'white' }} >{this.state.sensores.l} %</Text>
                                        <Text uppercase={false} style={{ color: 'white' }} >luminosidade</Text>
                                    </Button>
                                </LinearGradient>

                                <LinearGradient colors={[this.estilo.cor.green_ligth, this.estilo.cor.blue_light]} useAngle={true}
                                    angle={45} angleCenter={{ x: 0.5, y: 0.5 }} style={this.estilo.item_dash}>
                                    <Button style={this.estilo.buttom_item_dash} onPress={() => this.teste()}>
                                        <Icon name='water' type='MaterialCommunityIcons' style={this.estilo.icon_item_dash} />
                                        <Text style={{ fontSize: 23, color: 'white' }} >{this.state.sensores.u} %</Text>
                                        <Text uppercase={false} style={{ color: 'white' }} >umidade do ar</Text>
                                    </Button>
                                </LinearGradient>
                            </Row>

                            <Row style={{ justifyContent: 'center' }} >
                                <LinearGradient colors={[this.estilo.cor.blue, this.estilo.cor.greenish_light]} useAngle={true}
                                    angle={45} angleCenter={{ x: 0.5, y: 0.5 }} style={this.estilo.item_dash}>
                                    <Button style={this.estilo.buttom_item_dash} onPress={() => this.teste()}>
                                        <Icon name='weather-pouring' type='MaterialCommunityIcons' style={this.estilo.icon_item_dash} />
                                        <Text style={{ fontSize: 23, color: 'white' }} >{this.state.sensores.c} %</Text>
                                        <Text uppercase={false} style={{ color: 'white' }} >chuva</Text>
                                    </Button>
                                </LinearGradient>
                            </Row>

                            <Row style={{ justifyContent: 'center' }} >
                                <Text style={{
                                    fontSize: 17, color: this.estilo.cor.white, width: 350, textAlign: 'center',
                                    backgroundColor: this.estilo.cor.gray_medium, paddingHorizontal: 20,
                                    paddingVertical: 7, marginTop: 20, borderRadius: 10, elevation: 3
                                }} >Previsão do tempo</Text>
                            </Row>


                            <Form style={this.estilo.form_vazio}></Form>
                        </Content>
                    </Tab>
                    <Tab heading={<TabHeading style={{ backgroundColor: 'transparent' }}>
                        <Text style={[{ fontWeight: 'normal', fontSize: 17 },
                        this.state.tabAtual == 1 ?
                            { color: this.estilo.cor.black } :
                            { color: this.estilo.cor.gray }]} >Atuadores</Text>
                        <Icon style={[{ fontSize: 22 },
                        this.state.tabAtual == 1 ?
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
                                        <Text uppercase={false} style={{ color: this.estilo.cor.white, textAlign: 'center' }} >umidade {this.state.sensores.u} %</Text>
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

