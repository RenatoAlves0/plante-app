import React, { Component } from 'react'
import { Container, Text, Button, Form } from 'native-base'
import { StatusBar } from 'react-native'
import estilo from '../assets/Estilo'

export default class Delete extends Component {
    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.state = {}
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
            <Container style={{
                backgroundColor: this.estilo.cor.gray_translucid,
                justifyContent: 'center', paddingBottom: 50, alignItems: 'center'
            }}>
                <StatusBar backgroundColor={this.estilo.cor.gray_translucid} barStyle="dark-content" />
                <Form style={{
                    padding: 10, borderRadius: 20, width: '70%', flexDirection: 'column',
                    alignContent: 'center', backgroundColor: this.estilo.cor.red
                }} >
                    <Button full style={{ backgroundColor: this.estilo.cor.red, borderRadius: 20, elevation: 0 }}
                        onPress={() => this.props.delete(true)}>
                        <Text style={{ color: this.estilo.cor.white, fontWeight: 'bold' }} >
                            Apagar</Text>
                    </Button>

                    <Form style={this.estilo.form_vazio}></Form>

                    <Button full style={{ backgroundColor: this.estilo.cor.white, borderRadius: 20, elevation: 0 }}
                        onPress={() => this.props.delete(false)}>
                        <Text style={{ color: this.estilo.cor.red, fontWeight: 'bold' }} >
                            Cancelar</Text>
                    </Button>
                </Form>
            </Container>
        )
    }
}

