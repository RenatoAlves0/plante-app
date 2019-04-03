import React, { Component } from 'react'
import { Modal } from 'react-native'
import { Container, Text, Right, Icon, Left, Button, Body, Form, Item, Label, Input, Picker, View, Fab, Content, Textarea } from 'native-base'
import { Appbar } from 'react-native-paper'
import { Actions } from 'react-native-router-flux'
import axios from 'axios'

styles = {
    colors: {
        red: '#d32f2f',
        purple: '#7b1fa2',
        blue: '#1976d2',
        blue_solid: '#1f65ff',
        greenish: '#00bfa5',
        green: '#4cda64',
        green_solid: '#388e3c',
        lemon: '#c2da4c',
        orange: '#ffa000',
        brown: '#5d4037',
        gray_white: '#cecece',
        gray: '#999999'
    },
    title: {
        color: 'white',
        fontSize: 20
    }
}

export default class FormPlanta extends Component {
    constructor(props) {
        super(props)
        this.state = {
            item: {},
            familia: {},
            novaFamilia: {
                visible: false,
            },
            familias: [],
            genero: {},
            novoGenero: {
                visible: false,
            },
            generos: [],
            especie: {},
            novaEspecie: {
                visible: false,
            },
            especies: [],
            prefix: 'http://10.0.3.2:5000/api/'
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
        await this.familia()
        await this.genero()
        await this.especie()
    }

    async familia() {
        if (this.props.item) this.setState({ familia: this.props.item.familia })
        await axios.get(this.state.prefix + 'familia')
            .then((data) => { this.setState({ familias: data.data }) })
            .catch((erro) => { console.error(erro) })
    }

    async genero() {
        if (this.props.item) this.setState({ genero: this.props.item.genero })
        await axios.get(this.state.prefix + 'genero')
            .then((data) => { this.setState({ generos: data.data }) })
            .catch((erro) => { console.error(erro) })
    }

    async especie() {
        if (this.props.item) this.setState({ especie: this.props.item.especie })
        await axios.get(this.state.prefix + 'especie')
            .then((data) => { this.setState({ especies: data.data }) })
            .catch((erro) => { console.error(erro) })
    }

    render() {
        return (
            <Container>
                <Appbar style={{ backgroundColor: styles.colors.green_solid }}>
                    <Left style={{ marginLeft: 5 }}>
                        <Button rounded transparent onPress={() => Actions.pop()}>
                            <Icon style={{ color: 'white', fontSize: 25 }} name='x' type='Feather' />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={styles.title}>{this.props.title}</Text>
                    </Body>
                    <Right>
                        <Button rounded transparent onPress={() => alert('Salvar')}>
                            <Icon style={{ color: 'white', fontSize: 25 }} name='check' type='Feather' />
                        </Button>
                    </Right>
                </Appbar>
                <Form>
                    <Item floatingLabel>
                        <Label>Nome</Label>
                        <Input value={this.state.item.nome} />
                    </Item>
                    <Item>
                        <Picker
                            mode='dialog'
                            iosIcon={<Icon name='arrow-down' />}
                            selectedValue={this.state.familia}
                            onValueChange={(value) => { this.setState({ familia: value }) }}>
                            {this.state.familias.map((item) => { return <Picker.Item key={item.id} label={item.nome} value={item.id} /> })}
                        </Picker>
                        <Button small icon style={{ backgroundColor: styles.colors.green_solid, alignSelf: 'center', margin: 5, borderRadius: 7 }}
                            onPress={() => { this.setState({ novaFamilia: { visible: !this.state.novaFamilia.visible } }) }}>
                            <Icon name='plus' type='Feather' style={{ fontSize: 20, marginHorizontal: 0 }} />
                        </Button>
                    </Item>
                    <Item>
                        <Picker
                            mode='dialog'
                            iosIcon={<Icon name='arrow-down' />}
                            selectedValue={this.state.genero}
                            onValueChange={(value) => { this.setState({ genero: value }) }}>
                            {this.state.generos.map((item) => { return <Picker.Item key={item.id} label={item.nome} value={item.id} /> })}
                        </Picker>
                        <Button small icon style={{ backgroundColor: styles.colors.blue_solid, alignSelf: 'center', margin: 5, borderRadius: 7 }} onPress={() => { }}>
                            <Icon name='plus' type='Feather' style={{ fontSize: 20, marginHorizontal: 0 }} />
                        </Button>
                    </Item>
                    <Item>
                        <Picker
                            mode='dialog'
                            iosIcon={<Icon name='arrow-down' />}
                            selectedValue={this.state.especie}
                            onValueChange={(value) => { this.setState({ especie: value }) }}>
                            {this.state.especies.map((item) => { return <Picker.Item key={item.id} label={item.nome} value={item.id} /> })}
                        </Picker>
                        <Button small icon style={{ backgroundColor: styles.colors.purple, alignSelf: 'center', margin: 5, borderRadius: 7 }} onPress={() => { }}>
                            <Icon name='plus' type='Feather' style={{ fontSize: 20, marginHorizontal: 0 }} />
                        </Button>
                    </Item>
                </Form>

                <Modal //Comentário
                    transparent
                    animationType='fade'
                    visible={this.state.novaFamilia.visible}
                    onRequestClose={() => this.setState({ novaFamilia: { visible: !this.state.novaFamilia.visible } })}>

                    <Container style={{ backgroundColor: '#00000099' }}>

                        <Content style={{ backgroundColor: 'white', borderRadius: 10, marginHorizontal: 10, marginTop: 10 }} >
                            <Form style={{ paddingVertical: 20 }}>
                                <Textarea style={{ backgroundColor: styles.colors.gray + '44', borderRadius: 7, marginHorizontal: 10 }} rowSpan={10}
                                    onChangeText={descricao => { return this.setState({ novaFamilia: { nome: descricao } }) }}
                                    value={this.state.novaFamilia.nome}
                                />
                            </Form>
                        </Content>


                        <Form style={{ flexDirection: 'row', alignSelf: 'flex-end' }} >
                            <Fab containerStyle={{ position: 'relative' }}
                                style={{ backgroundColor: styles.colors.red }}
                                onPress={() => { this.setState({ novaFamilia: { visible: !this.state.novaFamilia.visible } }) }}>
                                <Icon name='x' type='Feather' />
                            </Fab>
                            <Fab containerStyle={{ position: 'relative' }}
                                style={{ backgroundColor: styles.colors.greenish }}
                                onPress={() => { }}>
                                <Icon name='check' type='Feather' />
                            </Fab>
                        </Form>
                    </Container>
                </Modal>
            </Container>
        )
    }
}

