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
            item: {
                nome: undefined,
                cultura: { _id: undefined },
                localizacao: undefined,
                cidade: { _id: undefined },
                usuario: undefined,
                cor: 5,
            },
            estado: { _id: undefined },
            login: undefined,
            culturas: [],
            estados: [],
            cidades: [],
            cor: false
        }
    }

    componentWillMount() {
        this.load()
    }

    componentWillReceiveProps() {
        this.load()
    }

    async load() {
        if (this.props.item) this.setState({ item: this.props.item })
        await this.login()
        await this.plantas()
        await this.estados()
        this.setState({ cor: true })
    }

    async login() {
        let login = undefined
        login = await loginService.get()
        if (login && login._id) {
            this.setState({ login: login })
            this.setState({ item: { ...this.state.item, usuario: this.state.login.usuario } })
        }
    }

    async plantas() {
        await this.http.get('plantas', 1).then((data) => {
            this.setState({ culturas: data })
        })
    }

    async estados() {
        await this.http.get('estados', 0).then(async (data) => {
            await this.setState({ estados: data })
        })
        if (this.props.item && this.props.item.cidade) {
            await this.http.get('estados/' + this.props.item.cidade.estado, 0).then(async (data) => {
                await this.setState({ estado: data })
            })
        }
    }

    async cidades() {
        if (this.state.estado && this.state.estado._id)
            await this.http.cidadesByEstado(this.state.estado._id).then(async (data) => {
                await this.setState({ cidades: data.cidades })
                if (this.props.item && this.props.item.cidade) {
                    await this.cidades().then(() =>
                        this.setState({ item: { ...this.state.item, cidade: { ...this.props.item.cidade, _id: this.props.item.cidade._id } } })
                    )
                    this.props.item.cidade = undefined
                } else
                    this.state.cidades[0] && this.state.cidades[0]._id ? this.setState({ item: { ...this.state.item, cidade: this.state.cidades[0]._id } }) : null
            })
    }

    async save() {
        this.state.item._id ?
            await this.http.put('plantacaos', this.state.item._id, this.state.item, 0)
                .then((data) => { return data }) :
            await this.http.post('plantacaos', this.state.item, 0)
                .then((data) => { return data })
        Actions.plantacaoList()
    }

    render() {
        return (
            <Container style={{}}>
                <Header style={{ backgroundColor: this.estilo.cor_platacao[this.state.item.cor], elevation: 0 }}>
                    <Left>
                        <Button rounded transparent onPress={() => Actions.pop()}>
                            <FeatherIcon name='chevron-left' style={{ color: this.estilo.cor.white, fontSize: 22, marginHorizontal: 5 }} />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={{ color: this.estilo.cor.white, fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>{translate('plantacao')}</Text>
                    </Body>
                    <Left style={{ alignItems: 'flex-end', paddingRight: 2 }}>
                        {this.state.item.nome && this.state.item.localizacao ?
                            <Button rounded transparent onPress={() => this.save()}>
                                <FeatherIcon name='check' style={{ color: this.estilo.cor.white, fontSize: 22, marginHorizontal: 5 }} />
                            </Button> : null}
                    </Left>
                </Header>
                <StatusBar backgroundColor={this.estilo.cor_platacao[this.state.item.cor]} barStyle="light-content" />
                <Content>
                    <Form style={{ flexDirection: 'row', backgroundColor: this.estilo.cor_platacao[this.state.item.cor], paddingBottom: 60 }}>
                        {this.state.cor ?
                            <ScrollView keyboardShouldPersistTaps={'handled'} showsHorizontalScrollIndicator={false} horizontal>
                                <Form style={{ marginLeft: 10 }} />
                                {this.estilo.cor_platacao.map((cor, index) => (
                                    <Button rounded small key={index} style={{
                                        backgroundColor: cor, marginVertical: 20,
                                        marginHorizontal: 10, width: 30, elevation: 10
                                    }} onPress={() => {
                                        this.setState({ item: { ...this.state.item, cor: index } })
                                    }}>
                                        <Text></Text>
                                    </Button>
                                ))}
                                <Form style={{ marginRight: 10 }} />
                            </ScrollView>
                            : null}
                    </Form>
                    <Form style={[this.estilo.form_user, { marginTop: -45 }]}>
                        <Label>{translate('nome')}</Label>
                        <Input autoFocus={true} value={this.state.item.nome}
                            onChangeText={(value) => {
                                this.setState({ item: { ...this.state.item, nome: value } })
                            }} />
                    </Form>

                    <Form style={this.estilo.form_user}>
                        <Label>{translate('cultura')}</Label>
                        <Row style={this.estilo.subrow}>
                            <Picker
                                mode='dialog'
                                iosIcon={<Icon name='arrow-down' />}
                                selectedValue={this.state.item.cultura._id}
                                onValueChange={(value) => { this.setState({ item: { ...this.state.item, cultura: { ...this.state.item.cultura, _id: value } } }) }}>
                                {this.state.culturas.map((item) => { return <Item key={item._id} label={item.nome + ' (' + item.especie.nome + ' - ' + item.genero.nome + ' - ' + item.familia.nome + ')'} value={item._id} /> })}
                            </Picker>
                        </Row>
                    </Form>

                    <Form style={this.estilo.form_user}>
                        <Label>{translate('localizacao')}</Label>
                        <Input value={this.state.item.localizacao}
                            onChangeText={(value) => {
                                this.setState({ item: { ...this.state.item, localizacao: value + '' } })
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
                                {this.state.estados.map((item) => { return <Item key={item._id} label={item.nome + ' (' + item.sigla + ')'} value={item._id} /> })}
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
                                    selectedValue={this.state.item.cidade._id}
                                    onValueChange={(value) => {
                                        this.setState({ item: { ...this.state.item, cidade: { ...this.state.item.cidade, _id: value } } })
                                    }}>
                                    {this.state.cidades.map((item) => { return <Item key={item._id} label={item.nome} value={item._id} /> })}
                                </Picker>
                            </Row>
                            : null}
                    </Form>
                    <Form style={this.estilo.form_vazio} />
                </Content>
            </Container>
        )
    }
}

