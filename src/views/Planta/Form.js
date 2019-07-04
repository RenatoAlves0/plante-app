import React, { Component } from 'react'
import { Modal, StatusBar } from 'react-native'
import { Container, Text, Right, Icon, Left, Button, Body, Form, Item, Label, Input, Picker, Fab, Header, Content, View, Row } from 'native-base'
import { Actions } from 'react-native-router-flux'
import http from '../../services/Http'
import FormFamilia from '../Familia/Form'
import FormGenero from '../Genero/Form'
import FormEspecie from '../Especie/Form'
import estilo from '../../assets/Estilo'

export default class FormPlanta extends Component {
    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.http = new http()
        this.state = {
            modal: false,
            addFamilia: false,
            addGenero: false,
            addEspecie: false,

            item: {
                familia: { _id: undefined },
                genero: { _id: undefined },
                especie: { _id: undefined },
                clima: { _id: undefined },
                solo: { _id: undefined },
                luz: { _id: undefined },
                nutriente: { _id: undefined },
                cliente: 1,
                nome: undefined
            },

            familia: {},
            genero: {},
            especie: {},
            clima: {},
            solo: {},
            luz: {},
            nutriente: {},

            familias: [],
            generos: [],
            especies: [],
            climas: [],
            solos: [],
            luzs: [],
            nutrientes: [],
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
        await this.climas()
        await this.solos()
        await this.luzs()
        await this.nutrientes()
    }

    async familia() {
        if (this.props.item) this.setState({ familia: this.props.item.familia })
        this.http.get('familias').then((data) => {
            this.setState({ familias: data })
        })
    }

    async genero() {
        if (this.props.item) this.setState({ genero: this.props.item.genero })
        this.http.get('generos').then((data) => {
            this.setState({ generos: data })
        })
    }

    async especie() {
        if (this.props.item) this.setState({ especie: this.props.item.especie })
        this.http.get('especies').then((data) => {
            this.setState({ especies: data })
        })
    }

    async climas() {
        if (this.props.item) this.setState({ clima: this.props.item.clima })
        this.http.get('climas').then((data) => {
            this.setState({ climas: data })
        })
    }

    async solos() {
        if (this.props.item) this.setState({ solo: this.props.item.solo })
        this.http.get('solos').then((data) => {
            this.setState({ solos: data })
        })
    }

    async luzs() {
        if (this.props.item) this.setState({ luz: this.props.item.luz })
        this.http.get('luzs').then((data) => {
            this.setState({ luzs: data })
        })
    }

    async nutrientes() {
        if (this.props.item) this.setState({ nutriente: this.props.item.nutriente })
        this.http.get('nutrientes').then((data) => {
            this.setState({ nutrientes: data })
        })
    }

    corrigir_json(objeto) {
        return {
            _id: objeto._id,
            familia: objeto.familia,
            genero: objeto.genero,
            especie: objeto.especie,
            cliente: objeto.cliente,
            clima: objeto.clima,
            solo: objeto.solo,
            luz: objeto.luz,
            nutriente: objeto.nutriente,
            nome: objeto.nome
        }
    }

    async save() {
        this.state.item._id ?
            await this.http.put('plantas', this.state.item._id, this.corrigir_json(this.state.item))
                .then((data) => { return data }) :
            await this.http.post('plantas', this.state.item)
                .then((data) => { return data })
        Actions.plantaList()
    }

    async saveSubentidade() {
        if (this.state.addFamilia) {
            await this.refs.formFamilia.save()
            this.setState({ modal: false, addFamilia: false })
            await this.familia()
        }
        else if (this.state.addGenero) {
            await this.refs.formGenero.save()
            this.setState({ modal: false, addGenero: false })
            await this.genero()
        }
        else if (this.state.addEspecie) {
            await this.refs.formEspecie.save()
            this.setState({ modal: false, addEspecie: false })
            await this.especie()
        }
    }

    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: this.estilo.cor.green_solid }}>
                    <Left>
                        <Button rounded transparent onPress={() => Actions.plantaList()}>
                            <Icon style={{ color: 'white' }} name='x' type='Feather' />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={this.estilo.title}>Planta</Text>
                    </Body>
                    <Right>
                        {this.state.item.nome && this.state.item.familia._id
                            && this.state.item.genero._id && this.state.item.especie._id
                            && this.state.item.clima._id && this.state.item.solo._id
                            && this.state.item.luz._id && this.state.item.nutriente._id ?
                            <Button rounded transparent onPress={() => this.save()}>
                                <Icon style={{ color: 'white' }} name='check' type='Feather' />
                            </Button> : null}
                    </Right>
                </Header>
                <StatusBar backgroundColor={this.estilo.cor.green_solid} barStyle="light-content" />
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
                                    selectedValue={this.state.item.familia._id}
                                    onValueChange={(value) => { this.setState({ item: { ...this.state.item, familia: { ...this.state.item.familia, _id: value } } }) }}>
                                    {this.state.familias.map((item) => { return <Item key={item._id} label={item.nome} value={item._id} /> })}
                                </Picker>
                            </Row>
                            <Icon style={this.estilo.buttomadd} name='plus' type='Feather' onPress={() => { this.setState({ modal: true, addFamilia: true }) }} />
                        </Row>
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Gênero</Label>
                        <Row>
                            <Row style={this.estilo.subrow}>
                                <Picker
                                    mode='dialog'
                                    iosIcon={<Icon name='arrow-down' />}
                                    selectedValue={this.state.item.genero._id}
                                    onValueChange={(value) => { this.setState({ item: { ...this.state.item, genero: { ...this.state.item.genero, _id: value } } }) }}>
                                    {this.state.generos.map((item) => { return <Item key={item._id} label={item.nome} value={item._id} /> })}
                                </Picker>
                            </Row>
                            <Icon style={this.estilo.buttomadd} name='plus' type='Feather' onPress={() => { this.setState({ modal: true, addGenero: true }) }} />
                        </Row>
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Espécie</Label>
                        <Row>
                            <Row style={this.estilo.subrow}>
                                <Picker
                                    mode='dialog'
                                    iosIcon={<Icon name='arrow-down' />}
                                    selectedValue={this.state.item.especie._id}
                                    onValueChange={(value) => { this.setState({ item: { ...this.state.item, especie: { ...this.state.item.especie, _id: value } } }) }}>
                                    {this.state.especies.map((item) => { return <Item key={item._id} label={item.nome} value={item._id} /> })}
                                </Picker>
                            </Row>
                            <Icon style={this.estilo.buttomadd} name='plus' type='Feather' onPress={() => { this.setState({ modal: true, addEspecie: true }) }} />
                        </Row>
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Clima</Label>
                        <Row>
                            <Row style={this.estilo.subrow}>
                                <Picker
                                    mode='dialog'
                                    iosIcon={<Icon name='arrow-down' />}
                                    selectedValue={this.state.item.clima._id}
                                    onValueChange={(value) => { this.setState({ item: { ...this.state.item, clima: { ...this.state.item.clima, _id: value } } }) }}>
                                    {this.state.climas.map((item) => {
                                        return <Item key={item._id} label={item.tipo
                                            + '    ' + (item.temperaturaMaxima + item.temperaturaMinima) / 2 + ' Cº'
                                            + '    ' + (item.umidadeMaxima + item.umidadeMinima) / 2 + ' %'} value={item._id} />
                                    })}
                                </Picker>
                            </Row>
                            <Icon style={this.estilo.buttomadd} name='plus' type='Feather' onPress={() => { Actions.climaForm({ pop: true, item: this.state.item }) }} />
                        </Row>
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Solo</Label>
                        <Row>
                            <Row style={this.estilo.subrow}>
                                <Picker
                                    mode='dialog'
                                    iosIcon={<Icon name='arrow-down' />}
                                    selectedValue={this.state.item.solo._id}
                                    onValueChange={(value) => { this.setState({ item: { ...this.state.item, solo: { ...this.state.item.solo, _id: value } } }) }}>
                                    {this.state.solos.map((item) => {
                                        return <Item key={item._id} label={
                                            (item.phMaximo + item.phMinimo) / 2 + ' Ph'
                                            + '    ' + (item.umidadeMaxima + item.umidadeMinima) / 2 + ' %    '
                                            + (item.quantidadeAreia > 0 ? 'Are (' + item.quantidadeAreia + ') ' : '')
                                            + (item.quantidadeArgila > 0 ? 'Arg (' + item.quantidadeArgila + ') ' : '')
                                            + (item.quantidadeHumus > 0 ? 'Húm (' + item.quantidadeHumus + ') ' : '')
                                            + (item.quantidadeMusgoSphagnum > 0 ? 'Sph (' + item.quantidadeMusgoSphagnum + ') ' : '')
                                            + (item.quantidadeTerraVegetal > 0 ? 'Ter (' + item.quantidadeTerraVegetal + ') ' : '')
                                            + (item.quantidadeTurfa > 0 ? 'Tur (' + item.quantidadeTurfa + ') ' : '')
                                        } value={item._id} />
                                    })}
                                </Picker>
                            </Row>
                            <Icon style={this.estilo.buttomadd} name='plus' type='Feather' onPress={() => { Actions.soloForm({ pop: true, item: this.state.item }) }} />
                        </Row>
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Luz</Label>
                        <Row>
                            <Row style={this.estilo.subrow}>
                                <Picker
                                    mode='dialog'
                                    iosIcon={<Icon name='arrow-down' />}
                                    selectedValue={this.state.item.luz._id}
                                    onValueChange={(value) => { this.setState({ item: { ...this.state.item, luz: { ...this.state.item.luz, _id: value } } }) }}>
                                    {this.state.luzs.map((item) => {
                                        return <Item key={item._id} label={
                                            item.intensidade + '   ' + (item.horasPorDia > 0 ? item.horasPorDia : '') + (item.horasPorDia > 1 ? ' horas diárias' : '') + (item.horasPorDia == 1 ? ' hora diária' : '')
                                        } value={item._id} />
                                    })}
                                </Picker>
                            </Row>
                            <Icon style={this.estilo.buttomadd} name='plus' type='Feather' onPress={() => { Actions.luzForm({ pop: true, item: this.state.item }) }} />
                        </Row>
                    </Form>
                    <Form style={this.estilo.form}>
                        <Label>Nutriente</Label>
                        <Row>
                            <Row style={this.estilo.subrow}>
                                <Picker
                                    mode='dialog'
                                    iosIcon={<Icon name='arrow-down' />}
                                    selectedValue={this.state.item.nutriente._id}
                                    onValueChange={(value) => { this.setState({ item: { ...this.state.item, nutriente: { ...this.state.item.nutriente, _id: value } } }) }}>
                                    {this.state.nutrientes.map((item) => {
                                        return <Item key={item._id} label={
                                            (item.nitrogenio > 0 ? 'N (' + item.nitrogenio + ') ' : '')
                                            + (item.fosforo > 0 ? 'P (' + item.fosforo + ') ' : '')
                                            + (item.potassio > 0 ? 'K (' + item.potassio + ') ' : '')
                                            + (item.magnesio > 0 ? 'Mg (' + item.magnesio + ') ' : '')
                                            + (item.calcio > 0 ? 'Ca (' + item.calcio + ') ' : '')
                                            + (item.enxofre > 0 ? 'S (' + item.enxofre + ') ' : '')
                                            + (item.ferro > 0 ? 'Fe (' + item.ferro + ') ' : '')
                                            + (item.manganes > 0 ? 'Mn (' + item.manganes + ') ' : '')
                                            + (item.boro > 0 ? 'B (' + item.boro + ') ' : '')
                                            + (item.cobre > 0 ? 'Cu (' + item.cobre + ') ' : '')
                                            + (item.zinco > 0 ? 'Zn (' + item.zinco + ') ' : '')
                                            + (item.cloro > 0 ? 'Cl (' + item.cloro + ') ' : '')
                                            + (item.molibdenio > 0 ? 'Mo (' + item.molibdenio + ') ' : '')
                                        } value={item._id} />
                                    })}
                                </Picker>
                            </Row>
                            <Icon style={this.estilo.buttomadd} name='plus' type='Feather' onPress={() => { Actions.nutrienteForm({ pop: true, item: this.state.item }) }} />
                        </Row>
                    </Form>
                    <Form style={this.estilo.form_vazio} />
                </Content>
                <Modal
                    transparent
                    animationType='fade'
                    visible={this.state.modal}
                    onRequestClose={() => this.setState({ modal: false })}>
                    <Container style={{ backgroundColor: this.estilo.cor.gray_translucid }}>

                        {this.state.addFamilia ? <FormFamilia ref='formFamilia' /> : null}
                        {this.state.addGenero ? <FormGenero ref='formGenero' /> : null}
                        {this.state.addEspecie ? <FormEspecie ref='formEspecie' /> : null}

                        <Form style={{ flexDirection: 'row', alignSelf: 'flex-end' }} >
                            <Fab containerStyle={{ position: 'relative' }}
                                style={{ backgroundColor: this.estilo.cor.red }}
                                onPress={() => { this.setState({ modal: false, addFamilia: false, addGenero: false, addEspecie: false }) }}>
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

