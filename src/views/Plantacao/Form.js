import React, { Component } from 'react'
import { StatusBar, Dimensions } from 'react-native'
import { Container, Text, Button, Content, Row, Header, Body, Label, Picker, Icon, Item, Input, Form, Right } from 'native-base'
import { Actions } from 'react-native-router-flux'
import estilo from '../../assets/Estilo'
import http from '../../services/Http'
import Card from '../../components/Card'
import FeatherIcon from 'react-native-vector-icons/Feather'

export default class PlantacaoForm extends Component {

    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.http = new http()
        this.state = {
            validHorasPorDia: true,
            item: {
                nome: undefined,
                cultura: undefined,
                localizacao: undefined,
                estado: undefined,
                cidade: undefined,
                usuario: undefined
            },
            search: '',
            culturas: [],
            estados: [],
            cidades: []
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
        await this.plantas()
        await this.estados()
    }

    async plantas() {
        if (this.props.item) this.setState({ cultura: this.props.item.cultura })
        this.http.get('plantas', 1).then((data) => {
            this.setState({ culturas: data })
        })
    }

    async estados() {
        if (this.props.item) this.setState({ estado: this.props.item.estado })
        this.http.get('estados', 0).then((data) => {
            this.setState({ estados: data })
        })
    }

    async cidades() {
        this.setState({ cidade: undefined })
        if (this.props.item && this.props.item.cidade) this.setState({ cidade: this.props.item.cidade })
        if (this.state.item.estado && this.state.item.estado._id)
            this.http.cidadesByEstado(this.state.item.estado._id).then((data) => {
                this.setState({ cidades: data.cidades[0] })
            })
    }

    async save() { }

    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: this.estilo.cor.white, elevation: 0 }}>
                    <Button rounded transparent onPress={() => Actions.pop()}>
                        <FeatherIcon name='arrow-left' style={{ color: this.estilo.cor.gray_solid, fontSize: 22, marginHorizontal: 5 }} />
                    </Button>
                    <Body>
                        <Text style={{ color: this.estilo.cor.gray_solid, fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>Plantação</Text>
                    </Body>
                    <Button rounded transparent onPress={() => this.save()}>
                        <FeatherIcon name='check' style={{ color: this.estilo.cor.gray_solid, fontSize: 22, marginHorizontal: 5 }} />
                    </Button>
                </Header>
                <StatusBar backgroundColor={this.estilo.cor.white} barStyle="dark-content" />
                <Content>
                    <Form style={this.estilo.form}>
                        <Label>Nome</Label>
                        <Row>
                            <Input keyboardType='default' autoFocus={true} value={this.state.item.nome}
                                onChangeText={(value) => {
                                    this.setState({ item: { ...this.state.item, nome: value } })
                                }} />
                        </Row>
                    </Form>

                    <Form style={this.estilo.form}>
                        <Label>Cultura</Label>
                        <Row>
                            <Row style={this.estilo.subrow}>
                                <Picker
                                    mode='dialog'
                                    iosIcon={<Icon name='arrow-down' />}
                                    selectedValue={this.state.item.cultura}
                                    onValueChange={async (value) => {
                                        await this.setState({ item: { ...this.state.item, cultura: value } });
                                        await this.cidades()
                                    }}>
                                    {this.state.culturas.map((item) => { return <Item key={item.nome} label={item.nome + ' (' + item.especie.nome + ' - ' + item.genero.nome + ' - ' + item.familia.nome + ')'} value={item.nome} /> })}
                                </Picker>
                            </Row>
                        </Row>
                    </Form>

                    <Form style={this.estilo.form}>
                        <Label>Localização</Label>
                        <Row>
                            <Input keyboardType='numeric' value={this.state.item.localizacao}
                                onChangeText={(value) => {
                                    this.setState({ item: { ...this.state.item, localizacao: value + '' } })
                                }} />
                        </Row>
                    </Form>

                    <Form style={this.estilo.form}>
                        <Label>Estado</Label>
                        <Row>
                            <Row style={this.estilo.subrow}>
                                <Picker
                                    mode='dialog'
                                    iosIcon={<Icon name='arrow-down' />}
                                    selectedValue={this.state.item.estado}
                                    onValueChange={async (value) => {
                                        await this.setState({ item: { ...this.state.item, estado: value } })
                                        await this.cidades()
                                    }}>
                                    {this.state.estados.map((item) => { return <Item key={item._id} label={item.nome + ' (' + item.sigla + ')'} value={item} /> })}
                                </Picker>
                            </Row>
                        </Row>
                    </Form>

                    {this.state.cidades && this.state.cidades[0] ?
                        <Form style={this.estilo.form}>
                            <Label>Cidade</Label>
                            <Row>
                                <Row style={this.estilo.subrow}>
                                    <Picker
                                        mode='dialog'
                                        iosIcon={<Icon name='arrow-down' />}
                                        selectedValue={this.state.item.cidade}
                                        onValueChange={(value) => {
                                            this.setState({ item: { ...this.state.item, cidade: value } })
                                        }}>
                                        {this.state.cidades.map((item) => { return <Item key={item._id} label={item.nome} value={item} /> })}
                                    </Picker>
                                </Row>
                            </Row>
                        </Form> : null}
                    <Form style={this.estilo.form_vazio} />
                </Content>
            </Container>
        )
    }
}

