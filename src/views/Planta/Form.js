import React, { Component } from 'react'
import { Modal } from 'react-native'
import { Container, Text, Right, Icon, Left, Button, Body, Form, Item, Label, Input, Picker, Fab, Header, Content } from 'native-base'
import { Actions } from 'react-native-router-flux'
import http from '../../services/Http'
import FormFamilia from '../Familia/Form'

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
        this.service = { http: new http() }
        this.state = {
            modal: false,
            addFamilia: false,

            item: {},

            familia: {},
            genero: {},
            especie: {},

            familias: [],
            generos: [],
            especies: [],
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
        this.service.http.get('familia').then((data) => {
            this.setState({ familias: data })
        })
    }

    async genero() {
        if (this.props.item) this.setState({ genero: this.props.item.genero })
        this.service.http.get('genero').then((data) => {
            this.setState({ generos: data })
        })
    }

    async especie() {
        if (this.props.item) this.setState({ especie: this.props.item.especie })
        this.service.http.get('especie').then((data) => {
            this.setState({ especies: data })
        })
    }

    async saveSubentidade() {
        if (this.state.addFamilia) {
            await this.refs.formFamilia.save()
            await this.familia()
            // await this.service.http.getLast('familia')
            //     .then((data) => { this.setState({ familia: data.id }) })
            this.setState({ modal: false })
        }
    }

    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: styles.colors.green_solid }}>
                    <Left>
                        <Button rounded transparent onPress={() => Actions.pop()}>
                            <Icon style={{ color: 'white' }} name='x' type='Feather' />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={styles.title}>Planta</Text>
                    </Body>
                    <Right>
                        <Button rounded transparent onPress={() => alert('Salvar')}>
                            <Icon style={{ color: 'white' }} name='check' type='Feather' />
                        </Button>
                    </Right>
                </Header>
                <Content>
                    <Form>
                        <Item floatingLabel>
                            <Label>Nome</Label>
                            <Input autoFocus={true} value={this.state.item.nome} />
                        </Item>
                        <Item style={{ flexDirection: 'column', borderBottomWidth: 0, alignItems: 'flex-start', marginTop: 10 }}>
                            <Label>Família</Label>
                            <Item>
                                <Picker
                                    mode='dialog'
                                    iosIcon={<Icon name='arrow-down' />}
                                    selectedValue={this.state.familia}
                                    onValueChange={(value) => { this.setState({ familia: value }) }}>
                                    {this.state.familias.map((item) => { return <Picker.Item key={item.id} label={item.nome} value={item.id} /> })}
                                </Picker>
                                <Button small icon style={{ backgroundColor: styles.colors.green_solid, alignSelf: 'center', margin: 5, borderRadius: 7 }}
                                    onPress={() => { this.setState({ modal: true, addFamilia: true }) }}>
                                    <Icon name='plus' type='Feather' style={{ fontSize: 20, marginHorizontal: 0 }} />
                                </Button>
                            </Item>
                        </Item>
                        <Item style={{ flexDirection: 'column', borderBottomWidth: 0, alignItems: 'flex-start', marginTop: 10 }}>
                            <Label>Gênero</Label>
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
                        </Item>
                        <Item style={{ flexDirection: 'column', borderBottomWidth: 0, alignItems: 'flex-start', marginTop: 10 }}>
                            <Label>Espécie</Label>
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
                        </Item>
                    </Form>
                </Content>
                <Modal
                    transparent
                    animationType='fade'
                    visible={this.state.modal}
                    onRequestClose={() => this.setState({ modal: false })}>
                    <Container style={{ backgroundColor: '#00000099' }}>

                        {this.state.addFamilia ? <FormFamilia ref='formFamilia' /> : null}

                        <Form style={{ flexDirection: 'row', alignSelf: 'flex-end' }} >
                            <Fab containerStyle={{ position: 'relative' }}
                                style={{ backgroundColor: styles.colors.red }}
                                onPress={() => { this.setState({ modal: false }) }}>
                                <Icon name='x' type='Feather' />
                            </Fab>
                            <Fab containerStyle={{ position: 'relative' }}
                                style={{ backgroundColor: styles.colors.blue }}
                                onPress={() => this.saveSubentidade()}>
                                <Icon name='check' type='Feather' />
                            </Fab>
                        </Form>

                    </Container>
                </Modal>
            </Container>
        )
    }
}

