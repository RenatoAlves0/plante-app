import React, { Component } from 'react'
import { StatusBar, Image, Dimensions } from 'react-native'
import { Container, Text, Button, Label, View, Content, Input, Item, Form } from 'native-base'
import { Actions } from 'react-native-router-flux'
import estilo from '../assets/Estilo'
import http from '../services/Http'
import LinearGradient from 'react-native-linear-gradient';

export default class Init extends Component {

    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.http = new http()
        this.state = {
            login: {
                login: '',
                senha: ''
            },
            label: {
                alignSelf: 'center',
                fontSize: 22,
                marginBottom: 80,
                marginTop: -80
            }
        }
    }

    async logar() {
        let login = {}
        login = await this.http.logar(this.state.login)
        if (login && login._id && login.usuario) {
            Actions.dash()
        }
    }

    render() {
        return (
            <Container>
                <StatusBar backgroundColor={this.estilo.cor.white} barStyle="dark-content" />
                <Content>
                    <View>
                        <Image
                            resizeMode='contain'
                            style={{
                                height: Dimensions.get('screen').width * 0.2, width: '100%',
                                marginTop: '15%'
                            }}
                            source={require('../assets/images/plante.png')}
                        />
                        <Text style={{
                            alignSelf: 'center', fontSize: 25, marginTop: 20, marginBottom: '12%',
                            color: this.estilo.cor.gray_solid, fontWeight: '700'
                        }}>Plante</Text>
                    </View>

                    <Form
                        style={{
                            marginLeft: '5%', marginRight: '5%', marginTop: '20%',
                            borderColor: this.estilo.cor.gray, borderWidth: 2, borderRadius: 20
                        }}>
                        <Input autoFocus={true} value={this.state.login.login}
                            placeholder='Login' style={{ textAlign: 'center' }}
                            onChangeText={(value) => { this.setState({ login: { ...this.state.login, login: value } }) }} />
                    </Form>

                    <Form
                        style={{
                            marginLeft: '5%', marginRight: '5%', marginTop: '7%',
                            borderColor: this.estilo.cor.gray, borderWidth: 2, borderRadius: 20
                        }}>
                        <Input value={this.state.login.senha}
                            textContentType='password' placeholder='Senha' style={{ textAlign: 'center' }}
                            onChangeText={(value) => { this.setState({ login: { ...this.state.login, senha: value } }) }} />
                    </Form>

                    <LinearGradient colors={[this.estilo.cor.green, this.estilo.cor.green_solid]}
                        useAngle={true} angle={90} angleCenter={{ x: 0.3, y: 0.5 }}
                        style={{
                            width: '90%', alignSelf: 'center', borderRadius: 20, marginTop: 40, elevation: 3,
                        }}>
                        <Button onPress={() => this.logar()}
                            style={{
                                backgroundColor: 'transparent', width: '100%', borderRadius: 20,
                                elevation: 0, justifyContent: 'center', height: 50
                            }}>
                            <Text uppercase={false} style={{ color: this.estilo.cor.white, fontSize: 18 }} >Logar</Text>
                        </Button>
                    </LinearGradient>

                    {/* <Label style={this.state.label}>
                        Login</Label> */}
                    {/* <Button full rounded style={{
                        height: 100, margin: 20, elevation: 10,
                        backgroundColor: this.estilo.cor.blue_solid
                    }} onPress={() => Actions.plantaList()} >
                        <Text uppercase={false} style={{ fontSize: 25 }}>Administrador</Text>
                    </Button>
                    <Button full rounded style={{
                        height: 100, margin: 20, elevation: 10,
                        backgroundColor: this.estilo.cor.greenish_solid
                    }} onPress={() => Actions.dash()} >
                        <Text uppercase={false} style={{ fontSize: 25 }}>Cliente</Text>

                    </Button> */}
                </Content>
            </Container>
        )
    }
}

