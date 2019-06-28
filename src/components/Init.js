import React, { Component } from 'react'
import { Container, Text, Right, Icon, Left, Button, Body, Form, Item, Label, Input, Picker, Header, Content, Row, Col, View } from 'native-base'
import { Actions } from 'react-native-router-flux'
import estilo from '../assets/Estilo'

export default class Init extends Component {

    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.state = {
            label: {
                alignSelf: 'center',
                fontSize: 22,
                marginBottom: 80,
                marginTop: -80
            }
        }
    }

    componentWillMount() {
        this.load()
    }

    componentWillReceiveProps() {
        this.load()
    }

    async load() { }

    render() {
        return (
            <Container>
                <View style={{ height: '100%', justifyContent: 'center' }}>
                    <Label style={this.state.label}>
                        Login</Label>
                    <Button full rounded style={{
                        height: 100, margin: 20, elevation: 10, borderRadius: 25,
                        backgroundColor: this.estilo.cor.blue_solid
                    }} onPress={() => Actions.push('plantaList')} >
                        <Text uppercase={false} style={{ fontSize: 25 }}>Administrador</Text>
                    </Button>
                    <Button full style={{
                        height: 100, margin: 20, elevation: 10, borderRadius: 25,
                        backgroundColor: this.estilo.cor.greenish_solid
                    }}>
                        <Text uppercase={false} style={{ fontSize: 25 }}>Usuário</Text>

                    </Button>
                </View>
            </Container>
        )
    }
}

