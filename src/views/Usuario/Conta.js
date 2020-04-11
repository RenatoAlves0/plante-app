import React, { Component } from 'react'
import { StatusBar, ScrollView } from 'react-native'
import { Container, Text, Button, Content, Row, Header, Body, Label, Picker, Icon, Item, Input, Form, Left } from 'native-base'
import { Actions } from 'react-native-router-flux'
import estilo from '../../assets/Estilo'
import http from '../../services/Http'
import FeatherIcon from 'react-native-vector-icons/Feather'
import loginService from '../../services/Login'
import { translate } from '../../i18n/locales'

export default class PlantacaoForm extends Component {
    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.http = new http()
        this.state = {
            usuario: {
                nome: undefined,
                sobrenome: undefined,
                cidade: { _id: undefined }
            },
            login: {
                login: undefined,
                senha: undefined,
                usuario: { _id: undefined }
            },
            confirmacao_senha: undefined,
            estado: { _id: undefined },
            estados: [],
            cidades: [],
        }
    }

    componentDidMount() {
        this.load()
    }

    async load() {
        await this.estados()
    }

    async estados() {
        await this.http.get('estados', 0).then(async (data) => {
            await this.setState({ estados: data })
        })
        if (this.props.usuario && this.props.usuario.cidade) {
            await this.http.get('estados/' + this.props.usuario.cidade.estado, 0).then(async (data) => {
                await this.setState({ estado: data })
            })
        }
    }

    async cidades() {
        if (this.state.estado && this.state.estado._id)
            await this.http.cidadesByEstado(this.state.estado._id).then(async (data) => {
                await this.setState({ cidades: data.cidades })
                if (this.props.usuario && this.props.usuario.cidade) {
                    await this.cidades().then(() =>
                        this.setState({ usuario: { ...this.state.usuario, cidade: { ...this.props.usuario.cidade, _id: this.props.usuario.cidade._id } } })
                    )
                    this.props.usuario.cidade = undefined
                } else
                    this.state.cidades[0] && this.state.cidades[0]._id ? this.setState({ usuario: { ...this.state.usuario, cidade: this.state.cidades[0]._id } }) : null
            })
    }

    async save() {
        await this.http.post('usuarios', this.state.usuario, 0)
            .then(async usuario => {
                if (usuario._id) {
                    await this.setState({
                        login: {
                            ...this.state.login,
                            usuario: { ...this.state.login.usuario, _id: usuario._id }
                        }
                    })
                    await this.http.post('logins', this.state.login, 0)
                        .then(() => {
                            this.logar()
                        })
                }
            })
    }

    logar = async () => {
        let login = undefined
        if (this.state.login && this.state.login.login && this.state.login.senha) {
            login = await this.http.logar(this.state.login)
            if (login && login._id && login.usuario) {
                loginService.update(login)
                Actions.dash()
            }
        }
    }

    senha_valida() {
        return this.state.login.senha && this.state.confirmacao_senha &&
            this.state.login.senha == this.state.confirmacao_senha
    }

    validacao() {
        return this.state.usuario.nome && this.state.usuario.sobrenome
            && this.state.usuario.cidade._id && this.state.login.login && this.senha_valida()
    }

    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: this.estilo.cor.greenish_medium, elevation: 0 }}>
                    <Left>
                        <Button rounded transparent onPress={() => Actions.pop()}>
                            <FeatherIcon name='chevron-left' style={{ color: this.estilo.cor.white, fontSize: 22, marginHorizontal: 5 }} />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={{ color: this.estilo.cor.white, fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>{translate('plantacao')}</Text>
                    </Body>
                    <Left style={{ alignItems: 'flex-end', paddingRight: 2 }}>
                        {this.validacao() ?
                            <Button rounded transparent onPress={() => this.save()}>
                                <FeatherIcon name='check' style={{ color: this.estilo.cor.white, fontSize: 22, marginHorizontal: 5 }} />
                            </Button> : null}
                    </Left>
                </Header>
                <StatusBar backgroundColor={this.estilo.cor.greenish_medium} barStyle="light-content" />
                <Content>
                    <Form style={{ flexDirection: 'row', backgroundColor: this.estilo.cor.greenish_medium, paddingBottom: 60 }}>
                    </Form>
                    <Form style={[this.estilo.form_user, { marginTop: -45 }]}>
                        <Label>{translate('nome')}</Label>
                        <Input autoFocus={true} value={this.state.usuario.nome}
                            onChangeText={(value) => {
                                this.setState({ usuario: { ...this.state.usuario, nome: value } })
                            }} />
                    </Form>
                    <Form style={this.estilo.form_user}>
                        <Label>{translate('sobrenome')}</Label>
                        <Input value={this.state.usuario.sobrenome}
                            onChangeText={(value) => {
                                this.setState({ usuario: { ...this.state.usuario, sobrenome: value } })
                            }} />
                    </Form>
                    <Form style={this.estilo.form_user}>
                        <Label>{translate('estado')}</Label>
                        <Row style={this.estilo.subrow}>
                            <Picker
                                mode='dialog'
                                iosIcon={<Icon name='arrow-down' />}
                                selectedValue={this.state.estado._id}
                                onValueChange={async (value) => {
                                    await this.setState({ estado: { ...this.state.estado, _id: value } })
                                    await this.cidades()
                                }}>
                                {this.state.estados.map((usuario) => { return <Item key={usuario._id} label={usuario.nome + ' (' + usuario.sigla + ')'} value={usuario._id} /> })}
                            </Picker>
                        </Row>
                    </Form>

                    <Form style={this.estilo.form_user}>
                        <Label>{translate('cidade')}</Label>
                        {this.state.cidades && this.state.cidades[0] ?
                            <Row style={this.estilo.subrow}>
                                <Picker
                                    mode='dialog'
                                    iosIcon={<Icon name='arrow-down' />}
                                    selectedValue={this.state.usuario.cidade._id}
                                    onValueChange={(value) => {
                                        this.setState({ usuario: { ...this.state.usuario, cidade: { ...this.state.usuario.cidade, _id: value } } })
                                    }}>
                                    {this.state.cidades.map((usuario) => { return <Item key={usuario._id} label={usuario.nome} value={usuario._id} /> })}
                                </Picker>
                            </Row>
                            : null}
                    </Form>
                    <Form style={this.estilo.form_user}>
                        <Label>Login</Label>
                        <Input value={this.state.login.login}
                            onChangeText={(value) => {
                                this.setState({ login: { ...this.state.login, login: value } })
                            }} />
                    </Form>
                    <Form style={this.estilo.form_user}>
                        <Label>{translate('senha')}</Label>
                        <Input secureTextEntry={true} value={this.state.login.senha}
                            onChangeText={(value) => {
                                this.setState({ login: { ...this.state.login, senha: value } })
                            }} />
                    </Form>
                    <Form style={[this.estilo.form_user, { borderWidth: 3 }, this.senha_valida() ?
                        { borderColor: this.estilo.cor.green } :
                        { borderColor: this.estilo.cor.red_vivid }]}>
                        <Label>{translate('confirmacao_senha')}</Label>
                        <Input secureTextEntry={true} value={this.state.confirmacao_senha}
                            onChangeText={(value) => {
                                this.setState({ confirmacao_senha: value })
                            }} />
                    </Form>
                    <Form style={this.estilo.form_vazio} />
                </Content>
            </Container>
        )
    }
}