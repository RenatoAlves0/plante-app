import React, { Component } from 'react'
import { Container, Content, ListItem, Text, SwipeRow, Button, Icon, Fab, Col, Row, View, Form, Body } from 'native-base'
import { Dimensions, StatusBar, TouchableHighlight } from 'react-native'
import Loader from '../../components/Loader'
import BottomMenu from '../../components/BottomMenu'
import estilo from '../../assets/Estilo'
import { Client, Message } from 'react-native-paho-mqtt'

export default class ListLuz extends Component {
    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.state = {
            loaded: false,
        }
        this.topico_sensores = 'plante_iot_sensores(renalves.oli@gmail.com)'
        this.topico_regador = 'plante_iot_regador(renalves.oli@gmail.com)'
        this.myStorage = {
            setItem: (key, item) => {
                myStorage[key] = item;
            },
            getItem: (key) => myStorage[key],
            removeItem: (key) => {
                delete myStorage[key];
            },
        }
        this.client = new Client({
            uri: 'ws://iot.eclipse.org:80/ws', clientId: 'plante_app_id(renalves.oli@gmail.com)',
            storage: this.myStorage
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
                console.log(responseObject.errorMessage);
            }
        })

        this.client.on('messageReceived', (message) => {
            console.log(message.payloadString);
        })

        this.client.connect()
            .then(() => {
                console.log('Conexão estabelecida!');
                return this.client.subscribe(this.topico_sensores);
            })
            .then(() => {
                let message = new Message('ture');
                message.destinationName = this.topico_regador;
                this.client.send(message);
            })
            .catch((responseObject) => {
                if (responseObject.errorCode !== 0) {
                    console.log('Conexão perdida!:' + responseObject.errorMessage);
                }
            })

        this.setState({ loaded: true })
    }

    teste() {
        let message = new Message('false')
        message.destinationName = this.topico_regador
        this.client.send(message)
    }

    render() {
        return (
            <Container style={{ backgroundColor: this.estilo.cor.greenish_solid }}>
                <StatusBar backgroundColor={this.estilo.cor.greenish_solid} barStyle="light-content" />
                <Content>
                    {this.state.loaded ? null : <Loader />}
                    <Row style={{ justifyContent: 'center' }} >
                        <TouchableHighlight style={this.estilo.item_dash} onPress={() => this.teste()}>
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                                <Icon name='water' type='MaterialCommunityIcons' style={{ color: this.estilo.cor.blue + 'aa', fontSize: 50 }} />
                                <Text style={{ fontSize: 20 }} >50 %</Text>
                            </View>
                        </TouchableHighlight>

                        <TouchableHighlight style={this.estilo.item_dash}>
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                                <Icon name='water' type='MaterialCommunityIcons' style={{ color: this.estilo.cor.blue + 'aa', fontSize: 50 }} />
                                <Text style={{ fontSize: 20 }} >50 %</Text>
                            </View>
                        </TouchableHighlight>
                    </Row>

                    <Row style={{ justifyContent: 'center' }} >
                        <TouchableHighlight style={this.estilo.item_dash}>
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >

                            </View>
                        </TouchableHighlight>

                        <TouchableHighlight style={this.estilo.item_dash}>
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >

                            </View>
                        </TouchableHighlight>
                    </Row>

                </Content>
                <BottomMenu ativa='planta' />
            </Container>
        )
    }
}

