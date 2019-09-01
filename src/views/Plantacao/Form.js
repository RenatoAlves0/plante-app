import React, { Component } from 'react'
import { StatusBar, Dimensions } from 'react-native'
import { Container, Text, Button, Content, Row, Header, Body, Label, Picker, Icon, Item, Input, Form } from 'native-base'
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
                cidade: undefined,
                usuario: undefined
            },
            culturas: [],
            cidades: []
        }
    }

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
                    <Button disabled rounded transparent onPress={() => Actions.pop()}>
                        <FeatherIcon name='arrow-left' style={{ color: 'transparent', fontSize: 22, marginHorizontal: 5 }} />
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
                                    onValueChange={(value) => {
                                        this.setState({ item: { ...this.state.item, cultura: value } })
                                    }}>
                                    {this.state.culturas.map((item) => { return <Item key={item.nome} label={item.nome} value={item.nome} /> })}
                                </Picker>
                            </Row>
                        </Row>
                    </Form>

                    <Form style={this.estilo.form}>
                        <Label>Localização</Label>
                        <Row>
                            <Input keyboardType='numeric' autoFocus={true} value={this.state.item.localizacao}
                                onChangeText={(value) => {
                                    this.setState({ item: { ...this.state.item, localizacao: value + '' } })
                                }} />
                        </Row>
                    </Form>

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
                                    {this.state.cidades.map((item) => { return <Item key={item.nome} label={item.nome} value={item.nome} /> })}
                                </Picker>
                            </Row>
                        </Row>
                    </Form>
                    <Form style={this.estilo.form_vazio} />
                </Content>
            </Container>
        )
    }
}

