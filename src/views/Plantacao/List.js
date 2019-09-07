import React, { Component } from 'react'
import { StatusBar, Dimensions, ScrollView } from 'react-native'
import { Container, Text, Button, Content, Row, Header, Body, Item, Form, Col, Icon, View } from 'native-base'
import { Actions } from 'react-native-router-flux'
import estilo from '../../assets/Estilo'
import http from '../../services/Http'
import FeatherIcon from 'react-native-vector-icons/Feather'
import LinearGradient from 'react-native-linear-gradient'
import loginService from '../../services/Login'

export default class PlantacaoList extends Component {

    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.http = new http()
        this.state = {
            plantacoes: [],
            usuario: undefined
        }
    }
    componentWillMount() {
        this.load()
    }

    async load() {
        await this.login()
        await this.plantacoes()
    }

    async login() {
        await loginService.get().then(async (data) => {
            await this.setState({ usuario: data.usuario })
        })
    }

    async plantacoes() {
        let aux = [], obj = {}
        this.http.plantacoesByUsuario(this.state.usuario).then(async (data) => {
            await data.forEach(async plantacao => {
                await this.http.get('plantas/' + plantacao.cultura, 1).then(async (_data) => {
                    obj = plantacao
                    obj.cultura = _data
                    await aux.push(obj)
                })
                await this.setState({ plantacoes: aux })
            })
        })
    }

    nova_plantacao = () => {
        Actions.plantacaoForm()
    }

    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: this.estilo.cor.white, elevation: 0 }}>
                    <Button rounded transparent onPress={() => Actions.pop()}>
                        <FeatherIcon name='chevron-left' style={{ color: this.estilo.cor.gray_solid, fontSize: 22, marginHorizontal: 5 }} />
                    </Button>
                    <Body>
                        <Text style={{ color: this.estilo.cor.gray_solid, fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>Plantações</Text>
                    </Body>
                    <Button rounded transparent onPress={() => this.nova_plantacao()}>
                        <FeatherIcon name='plus' style={{ color: this.estilo.cor.gray_solid, fontSize: 22, marginHorizontal: 10 }} />
                    </Button>
                </Header>
                <StatusBar backgroundColor={this.estilo.cor.white} barStyle="dark-content" />
                <Content>
                    {this.state.plantacoes.map((item) => (
                        <LinearGradient key={item._id} colors={[this.estilo.cor.greenish_solid, this.estilo.cor.greenish_medium]}
                            useAngle={true} angle={45} angleCenter={{ x: 0.5, y: 0.5 }}
                            style={{
                                width: Dimensions.get('screen').width * .9, borderRadius: 20, marginTop: 10,
                                alignSelf: 'center', elevation: 10, minHeight: 150
                            }}>
                            <Button transparent style={{ minHeight: 150, borderRadius: 20 }}
                                onPress={() => Actions.plantacaoView({ item: item })}>
                                <View onPress style={{ width: '90%', margin: 20 }}>
                                    <Text uppercase={false} style={{ color: this.estilo.cor.white, fontSize: 18, paddingRight: 0, paddingLeft: 0, alignSelf: 'flex-end' }} >{item.nome}</Text>
                                    <Text uppercase={false} style={{ color: this.estilo.cor.white + '99', fontSize: 18, paddingRight: 0, paddingLeft: 0, alignSelf: 'flex-end' }} >{item.localizacao + ', ' + item.cidade.nome}</Text>
                                    <Form style={{ borderBottomWidth: 1, borderBottomColor: this.estilo.cor.white + '99', marginVertical: 10 }} />
                                    <Text uppercase={false} style={{ color: this.estilo.cor.white, fontSize: 18, paddingRight: 0, paddingLeft: 0 }} >{item.cultura.nome}</Text>
                                    <Text uppercase={false} style={{ color: this.estilo.cor.white + '99', fontSize: 15, paddingRight: 0, paddingLeft: 0 }} >{item.cultura.especie.nome + ' - ' + item.cultura.genero.nome + ' - ' + item.cultura.familia.nome}</Text>
                                </View>
                            </Button>
                        </LinearGradient>))}
                    <Form style={{ width: '100%', height: 20 }} />
                </Content>
            </Container>
        )
    }
}