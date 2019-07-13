import React, { Component } from 'react'
import { Container, Content, Text, Button, Icon, Fab, Col, Row, View, Form, Body } from 'native-base'
import { StatusBar, TouchableHighlight, Dimensions } from 'react-native'
import Loader from '../../components/Loader'
import BottomMenu from '../../components/BottomMenu'
import estilo from '../../assets/Estilo'
import { Client, Message } from 'react-native-paho-mqtt'
import LinearGradient from 'react-native-linear-gradient'

export default class Dash extends Component {
    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.state = {
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
            if (responseObject.errorCode !== 0) {
                console.log(responseObject.errorMessage)
            }
        })

        this.client.on('messageReceived', (message) => {
            this.setState({ sensores: JSON.parse(message.payloadString) })
            console.log(this.state.sensores)
        })

        this.client.connect()
            .then(() => {
                console.log('Conexão estabelecida!')
                return this.client.subscribe(this.topico_sensores)
            })
            .catch((responseObject) => {
                if (responseObject.errorCode !== 0) {
                    console.log('Conexão perdida!:' + responseObject.errorMessage)
                }
            })

        this.setState({ loaded: true })
    }

    async teste() {
        if (!this.client.isConnected()) {
            this.client.connect()
                .then(() => {
                    let message = new Message('{\"t\":25.36, \"u\":87.56, \"uS\":4095.00, \"l\":312.14, \"c\":4095.00}')
                    message.destinationName = this.topico_sensores
                    this.client.send(message)
                })
        }
        else {
            let message = new Message('{\"t\":25.36, \"u\":87.56, \"uS\":4095.00, \"l\":312.14, \"c\":4095.00}')
            message.destinationName = this.topico_sensores
            this.client.send(message)
        }
    }

    render() {
        return (
            <Container>
                <StatusBar backgroundColor={this.estilo.cor.white} barStyle="dark-content" />
                <Content>
                    {this.state.loaded ? null : <Loader />}
                    <Row style={{ justifyContent: 'center', paddingTop: 10 }} >
                        <LinearGradient colors={['#ff104f', '#c100b7']} useAngle={true}
                            angle={45} angleCenter={{ x: 0.5, y: 0.5 }} style={this.estilo.item_dash}>
                            <Button style={this.estilo.buttom_item_dash} onPress={() => this.teste()}>
                                <Icon name='thermometer' type='MaterialCommunityIcons' style={this.estilo.icon_item_dash} />
                                <Text style={{ fontSize: 23, color: 'white' }} >{this.state.sensores.t} ºC</Text>
                                <Text uppercase={false} style={{ color: 'white' }} >temperatura</Text>
                            </Button>
                        </LinearGradient>

                        <LinearGradient colors={['#3376ff', '#07f1f4']} useAngle={true}
                            angle={45} angleCenter={{ x: 0.5, y: 0.5 }} style={this.estilo.item_dash}>
                            <Button style={this.estilo.buttom_item_dash} onPress={() => this.teste()}>
                                <Icon name='water' type='MaterialCommunityIcons' style={this.estilo.icon_item_dash} />
                                <Text style={{ fontSize: 23, color: 'white' }} >{this.state.sensores.u} %</Text>
                                <Text uppercase={false} style={{ color: 'white' }} >umidade do ar</Text>
                            </Button>
                        </LinearGradient>
                    </Row>

                    <Row style={{ justifyContent: 'center' }} >
                        <LinearGradient colors={['#ff8d33', '#f1f407']} useAngle={true}
                            angle={45} angleCenter={{ x: 0.5, y: 0.5 }} style={this.estilo.item_dash}>
                            <Button style={this.estilo.buttom_item_dash} onPress={() => this.teste()}>
                                <Icon name='wb-sunny' type='MaterialIcons' style={this.estilo.icon_item_dash} />
                                <Text style={{ fontSize: 23, color: 'white' }} >{this.state.sensores.l} %</Text>
                                <Text uppercase={false} style={{ color: 'white' }} >luminosidade</Text>
                            </Button>
                        </LinearGradient>

                        <LinearGradient colors={['#00e770', '#03c8e2']} useAngle={true}
                            angle={45} angleCenter={{ x: 0.5, y: 0.5 }} style={this.estilo.item_dash}>
                            <Button style={this.estilo.buttom_item_dash} onPress={() => this.teste()}>
                                <Icon name='grain' type='MaterialIcons' style={this.estilo.icon_item_dash} />
                                <Text style={{ fontSize: 23, color: 'white' }} >{this.state.sensores.uS} %</Text>
                                <Text uppercase={false} style={{ color: 'white' }} >umidade do solo</Text>
                            </Button>
                        </LinearGradient>
                    </Row>

                    <Row style={{ justifyContent: 'center' }} >
                        <LinearGradient colors={['#07f1f4', '#3376ff']} useAngle={true}
                            angle={0} angleCenter={{ x: 0, y: 1 }} style={this.estilo.item_dash}>
                            <Button style={this.estilo.buttom_item_dash} onPress={() => this.teste()}>
                                <Icon name='weather-pouring' type='MaterialCommunityIcons' style={this.estilo.icon_item_dash} />
                                <Text style={{ fontSize: 23, color: 'white' }} >{this.state.sensores.c} %</Text>
                                <Text uppercase={false} style={{ color: 'white' }} >chuva</Text>
                            </Button>
                        </LinearGradient>
                    </Row>

                </Content>
                <BottomMenu ativa='planta' />
            </Container >
        )
    }
}

