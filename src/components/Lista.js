import React, { Component } from 'react'
import { Container, Content, ListItem, Text, SwipeRow, Button, Icon, Row } from 'native-base'
import { Dimensions } from 'react-native'
import Loader from './Loader'
import axios from 'axios'
// import Http from '../services/Http'

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
        gray: '#999'
    }
}

export default class Lista extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            lista: [],
            prefix: 'http://10.0.2.2:5000/api/'
        }
    }

    componentWillMount() {
        this.load()
    }

    componentWillReceiveProps() {
        this.load()
    }

    async load() {
        console.log(this.props.entidade)
        await axios.get(this.state.prefix + this.props.entidade)
            .then((data) => {
                this.setState({
                    lista: data.data,
                    loaded: true
                })
                console.log(data)
            })
            .catch((erro) => {
                console.error(erro)
            })
        // console.log(await Http.get('planta'))
    }

    render() {
        return (
            <Container>
                <Content scrollEnabled={false}>
                    {this.state.loaded ? null : <Loader />}
                    {this.state.lista.map((item) => (
                        <SwipeRow key={item.id} style={{ paddingTop: 0, paddingBottom: 0, paddingRight: 0 }}
                            leftOpenValue={80}
                            disableLeftSwipe={true}
                            onRowOpen={() => alert('Deletar')}
                            left={
                                <Button block full style={{ backgroundColor: styles.colors.red, paddingBottom: 12 }}>
                                    <Icon active name='trash' type='Feather' />
                                </Button>
                            }
                            body={
                                <ListItem onPress={() => alert('oi')} style={{ width: Dimensions.get('window').width, borderBottomWidth: 0, marginLeft: 0 }}>
                                    <Row style={{ justifyContent: 'center', flexDirection: 'column' }}>
                                        <Text style={{ display: 'flex' }} >{item.nome}</Text>
                                        <Text style={{ color: styles.colors.gray }}>
                                            {item.familia.nome + '  ' + item.genero.nome + '  ' + item.especie.nome}</Text>
                                    </Row>
                                </ListItem>
                            }
                        />))}

                </Content>
            </Container>
        )
    }
}