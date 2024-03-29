import React, { Component } from 'react'
import { Container, Text, Button, Form, Content, Row } from 'native-base'
import { Actions } from 'react-native-router-flux'
import { StatusBar } from 'react-native'
import estilo from '../assets/Estilo'
import FeatherIcon from 'react-native-vector-icons/Feather'

export default class Menu extends Component {
    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.state = {
            actions: [
                { label: 'Conta', icon: 'user', method: this.conta },
                { label: 'Sair', icon: 'log-out', method: this.sair },
            ]
        }
    }

    sair = () => {
        Actions.login({ nao_logar: true })
    }

    conta = () => {
        Actions.conta({ editar: true })
    }

    componentDidMount() {
        this.load()
    }

    async load() { }

    render() {
        return (
            <Container>
                <StatusBar backgroundColor={this.estilo.cor.black} barStyle="light-content" />
                <Form style={{ flexDirection: 'row', marginTop: 20 }}>
                    <Form style={{ width: '70%' }}>
                        <Text style={{ marginLeft: 25, fontSize: 28, fontWeight: 'bold', color: this.estilo.cor.gray_solid }}>Menu</Text>
                    </Form>
                    <Form style={{ width: '30%' }}>
                        <Button transparent style={{ elevation: 0, marginRight: 25, alignSelf: 'flex-end' }}
                            onPress={() => this.props.modal(false)}>
                            <FeatherIcon name='x' style={{ fontSize: 22, color: this.estilo.cor.gray_solid }} />
                        </Button>
                    </Form>
                </Form>
                <Content style={{ paddingTop: 10 }}>
                    {this.state.actions.map((item, index) => (
                        <Button key={index} rounded style={this.estilo.button}
                            onPress={() => { item.method(), this.props.modal(false) }}>
                            <Form style={{ flexDirection: 'row' }}>
                                <FeatherIcon name={item.icon} style={{ fontSize: 22, color: this.estilo.cor.gray_solid }} />
                                <Text uppercase={false} style={{
                                    color: this.estilo.cor.gray_solid, fontSize: 18, paddingLeft: 20, paddingRight: 0
                                }}>{item.label}</Text>
                            </Form>
                        </Button>
                    ))}
                </Content>
            </Container >
        )
    }
}

