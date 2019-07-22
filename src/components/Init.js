import React, { Component } from 'react'
import { StatusBar } from 'react-native'
import { Container, Text, Button, Label, View } from 'native-base'
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
                <StatusBar backgroundColor={this.estilo.cor.white} barStyle="dark-content" />
                <View style={{ height: '100%', justifyContent: 'center' }}>
                    <Label style={this.state.label}>
                        Login</Label>
                    <Button full rounded style={{
                        height: 100, margin: 20, elevation: 10,
                        backgroundColor: this.estilo.cor.blue_solid
                    }} onPress={() => Actions.plantaList()} >
                        <Text uppercase={false} style={{ fontSize: 25 }}>Administrador</Text>
                    </Button>
                    <Button full rounded style={{
                        height: 100, margin: 20, elevation: 10,
                        backgroundColor: this.estilo.cor.greenish_solid
                    }} onPress={() => Actions.dash()} >
                        <Text uppercase={false} style={{ fontSize: 25 }}>Usuário</Text>

                    </Button>
                </View>
            </Container>
        )
    }
}

