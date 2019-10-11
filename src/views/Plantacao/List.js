import React, { Component } from 'react'
import { StatusBar, Dimensions } from 'react-native'
import { Container, Text, Button, Content, Header, Body, Form, View, Left } from 'native-base'
import Loader from '../../components/Loader'
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
            loaded: false,
            usuario: undefined,
            principal: undefined
        }
    }
    componentWillMount() {
        this.load()
    }

    async load() {
        await this.login()
        await this.get_plantacao_principal()
        await this.plantacoes()
        this.setState({ loaded: true })
    }

    async get_plantacao_principal() {
        await this.http.plantacoesPrincipaisByUsuario(this.state.usuario).then(async (data) => {
            data == '' ? {} : this.setState({ principal: data[0] })
        })
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
                    <Left>
                        <Button rounded transparent onPress={() => Actions.pop()}>
                            <FeatherIcon name='chevron-left' style={{ color: this.estilo.cor.gray_solid, fontSize: 22, marginHorizontal: 5 }} />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={{ color: this.estilo.cor.gray_solid, fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>Plantações</Text>
                    </Body>
                    <Left style={{ alignItems: 'flex-end', paddingRight: 2 }}>
                        <Button rounded transparent onPress={() => this.nova_plantacao()}>
                            <FeatherIcon name='plus' style={{ color: this.estilo.cor.gray_solid, fontSize: 22, marginHorizontal: 10 }} />
                        </Button>
                    </Left>
                </Header>
                <StatusBar backgroundColor={this.estilo.cor.white} barStyle="dark-content" />
                {this.state.loaded ? null : <Loader />}
                <Content>
                    {this.state.plantacoes.map((item) => (
                        <Form key={item._id} style={{
                            backgroundColor: this.estilo.cor_platacao[item.cor],
                            width: Dimensions.get('screen').width * .9, borderRadius: 20, marginTop: 20,
                            alignSelf: 'center', elevation: 10, minHeight: 150
                        }}>
                            {this.state.principal.plantacao == item._id ? <Button style={{
                                position: 'absolute', top: 10, right: 10, height: 25,
                                backgroundColor: this.estilo.cor.white, width: 25,
                                borderRadius: 20, elevation: 10
                            }}><Text /></Button> : null}
                            <Button transparent style={{ minHeight: 150, borderRadius: 20 }}
                                onPress={() => Actions.plantacaoView({ item: item })}>
                                <View onPress style={{ width: '90%', margin: 20 }}>
                                    <Text uppercase={false} style={{ color: this.estilo.cor.white, fontSize: 18, paddingRight: 0, paddingLeft: 0 }} >{item.nome}</Text>
                                    <Text uppercase={false} style={{ color: this.estilo.cor.white + '99', fontSize: 18, paddingRight: 0, paddingLeft: 0 }} >{item.localizacao + ', ' + item.cidade.nome}</Text>
                                    <Form style={{ borderBottomWidth: 1, borderBottomColor: this.estilo.cor.white + '99', marginVertical: 10 }} />
                                    <Text uppercase={false} style={{ color: this.estilo.cor.white, fontSize: 18, paddingRight: 0, paddingLeft: 0, alignSelf: 'flex-end' }} >{item.cultura.nome}</Text>
                                    <Text uppercase={false} style={{ color: this.estilo.cor.white + '99', fontSize: 15, paddingRight: 0, paddingLeft: 0, alignSelf: 'flex-end' }} >{item.cultura.especie.nome + ' - ' + item.cultura.genero.nome + ' - ' + item.cultura.familia.nome}</Text>
                                </View>
                            </Button>
                        </Form>))}
                    <Form style={{ width: '100%', height: 20 }} />
                </Content>
            </Container>
        )
    }
}