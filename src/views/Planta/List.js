import React, { Component } from 'react'
import { Container, Content, ListItem, Text, SwipeRow, Button, Icon, Row, Fab } from 'native-base'
import { Dimensions } from 'react-native'
import Loader from '../../components/Loader'
import { Actions } from 'react-native-router-flux'
import BottomMenu from '../../components/BottomMenu'
import http from '../../services/Http'

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
  }
}

export default class ListPlanta extends Component {
  constructor(props) {
    super(props)
    this.service = { http: new http() }
    this.state = {
      loaded: false,
      lista: [],
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
    await this.service.http.get('planta').then((data) => {
      this.setState({ lista: data, loaded: true })
    })
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
              onRowOpen={() => alert('Excluir')}
              left={
                <Button block full style={{ backgroundColor: styles.colors.red, paddingBottom: 12 }}>
                  <Icon active name='trash' type='Feather' />
                </Button>
              }
              body={
                <ListItem onPress={() => Actions.plantaForm({ item: item, title: item.nome })} style={{ width: Dimensions.get('window').width, borderBottomWidth: 0, marginLeft: 0 }}>
                  <Row style={{ justifyContent: 'center', flexDirection: 'column' }}>
                    <Text style={{ display: 'flex' }} >{item.nome}</Text>
                    <Text style={{ color: styles.colors.gray }}>
                      {item.familia.nome + '  ' + item.genero.nome + '  ' + item.especie.nome}</Text>
                  </Row>
                </ListItem>
              }
            />))}

        </Content>
        <Fab
          active={false}
          containerStyle={{ marginBottom: 54 }}
          style={{ backgroundColor: styles.colors.green_solid }}
          position="bottomRight"
          onPress={() => Actions.plantaForm({ title: 'Nova Planta' })}>
          <Icon name="add" />
        </Fab>
        <BottomMenu />
      </Container>
    )
  }
}

