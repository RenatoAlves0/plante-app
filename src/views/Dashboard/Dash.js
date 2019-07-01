import React, { Component } from 'react'
import { Container, Content, ListItem, Text, SwipeRow, Button, Icon, Fab, Col, Row, View, Form, Body } from 'native-base'
import { Dimensions, StatusBar, TouchableHighlight } from 'react-native'
import Loader from '../../components/Loader'
import BottomMenu from '../../components/BottomMenu'
import estilo from '../../assets/Estilo'

export default class ListLuz extends Component {
    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.state = {
            loaded: false,
        }
    }

    componentWillMount() {
        this.load()
    }

    componentWillReceiveProps() {
        this.load()
    }

    async load() {
        this.setState({ loaded: true })
    }

    render() {
        return (
            <Container style={{ backgroundColor: this.estilo.cor.greenish_solid }}>
                <StatusBar backgroundColor={this.estilo.cor.greenish_solid} barStyle="light-content" />
                <Content>
                    {this.state.loaded ? null : <Loader />}
                    <Row style={{ justifyContent: 'center' }} >
                        <TouchableHighlight style={this.estilo.item_dash}>
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

