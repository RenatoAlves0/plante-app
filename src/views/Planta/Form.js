import React, { Component } from 'react'
import { Modal } from 'react-native'
import { Container, Text, Right, Icon, Left, Button, Body, Form, Item, Label, Input, Picker, Fab, Header, Content, View, Row } from 'native-base'
import { Actions } from 'react-native-router-flux'
import http from '../../services/Http'
import FormFamilia from '../Familia/Form'
import estilo from '../../assets/Estilo'

export default class FormPlanta extends Component {
    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.http = new http()
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
        this.http.get('familia').then((data) => {
            this.setState({ familias: data })
        })
    }

    async genero() {
        if (this.props.item) this.setState({ genero: this.props.item.genero })
        this.http.get('genero').then((data) => {
            this.setState({ generos: data })
        })
    }

    async especie() {
        if (this.props.item) this.setState({ especie: this.props.item.especie })
        this.http.get('especie').then((data) => {
            this.setState({ especies: data })
        })
    }

    async saveSubentidade() {
        if (this.state.addFamilia) {
            await this.refs.formFamilia.save()
            await this.familia()
            // await http.getLast('familia')
            //     .then((data) => { this.setState({ familia: data.id }) })
            this.setState({ modal: false })
        }
    }

    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: this.estilo.cor.green_solid }}>
                    <Left>
                        <Button rounded transparent onPress={() => Actions.pop()}>
                            <Icon style={{ color: 'white' }} name='x' type='Feather' />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={this.estilo.title}>Planta</Text>
                    </Body>
                    <Right>
                        <Button rounded transparent onPress={() => alert('Salvar')}>
                            <Icon style={{ color: 'white' }} name='check' type='Feather' />
                        </Button>
                    </Right>
                </Header>
                <Content>
                    <Form style={this.estilo.form}>
                        <Label>Nome</Label>
                        <Input autoFocus={true} value={this.state.item.nome} onChangeText={(value) => { this.setState({ item: { ...this.state.item, nome: value } }) }} />
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Família</Label>
                        <Row>
                            <Row style={this.estilo.subrow}>
                                <Picker
                                    mode='dialog'
                                    iosIcon={<Icon name='arrow-down' />}
                                    selectedValue={this.state.familia}
                                    onValueChange={(value) => { this.setState({ familia: value }) }}>
                                    {this.state.familias.map((item) => { return <Item key={item.id} label={item.nome} value={item.id} /> })}
                                </Picker>
                            </Row>
                            <Icon name='plus' type='Feather' onPress={() => { this.setState({ modal: true, addFamilia: true }) }} style={this.estilo.buttomadd} />
                        </Row>
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Gênero</Label>
                        <Row>
                            <Row style={this.estilo.subrow}>
                                <Picker
                                    mode='dialog'
                                    iosIcon={<Icon name='arrow-down' />}
                                    selectedValue={this.state.genero}
                                    onValueChange={(value) => { this.setState({ genero: value }) }}>
                                    {this.state.generos.map((item) => { return <Item key={item.id} label={item.nome} value={item.id} /> })}
                                </Picker>
                            </Row>
                            <Icon name='plus' type='Feather' onPress={() => { }} style={this.estilo.buttomadd} />
                        </Row>
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Espécie</Label>
                        <Row>
                            <Row style={this.estilo.subrow}>
                                <Picker
                                    mode='dialog'
                                    iosIcon={<Icon name='arrow-down' />}
                                    selectedValue={this.state.especie}
                                    onValueChange={(value) => { this.setState({ especie: value }) }}>
                                    {this.state.especies.map((item) => { return <Item key={item.id} label={item.nome} value={item.id} /> })}
                                </Picker>
                            </Row>
                            <Icon name='plus' type='Feather' onPress={() => { }} style={this.estilo.buttomadd} />
                        </Row>
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
                                style={{ backgroundColor: this.estilo.cor.red }}
                                onPress={() => { this.setState({ modal: false }) }}>
                                <Icon name='x' type='Feather' />
                            </Fab>
                            <Fab containerStyle={{ position: 'relative' }}
                                style={{ backgroundColor: this.estilo.cor.greenish_solid }}
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

