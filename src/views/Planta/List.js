import React, { Component } from 'react'
import { Container, Content, ListItem, Text, SwipeRow, Button, Icon, Row, Fab } from 'native-base'
import { Dimensions } from 'react-native'
import Loader from '../../components/Loader'
import { Actions } from 'react-native-router-flux'
import BottomMenu from '../../components/BottomMenu'
import http from '../../services/Http'
import estilo from '../../assets/Estilo'

export default class ListPlanta extends Component {
  constructor(props) {
    super(props)
    this.estilo = new estilo()
    this.http = new http()
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
    await this.http.get('planta').then((data) => {
      this.setState({ lista: data, loaded: true })
    })
  }

  render() {
    return (
      <Container>
        <Content scrollEnabled={false} >
          {this.state.loaded ? null : <Loader />}
          {this.state.lista.map((item) => (
            <SwipeRow key={item.id} leftOpenValue={80} disableLeftSwipe={true}
              style={{ paddingTop: 0, paddingBottom: 0, paddingRight: 0, backgroundColor: this.estilo.cor.red }}
              onRowOpen={() => alert('Excluir')}
              left={
                <Button block full style={{ backgroundColor: this.estilo.cor.red, paddingBottom: 6, elevation: 0 }}>
                  <Icon active name='trash' type='Feather' />
                </Button>
              }
              body={
                <ListItem onPress={() => Actions.plantaForm({ item: item, title: item.nome })}
                  style={{ width: Dimensions.get('window').width, borderBottomWidth: 0, marginLeft: 0, backgroundColor: 'white' }}>
                  <Row style={{ justifyContent: 'center', flexDirection: 'column' }}>
                    <Text style={{ display: 'flex' }} >{item.nome}</Text>
                    <Text style={{ color: this.estilo.cor.gray }}>
                      {item.familia.nome + '  ' + item.genero.nome + '  ' + item.especie.nome}</Text>
                  </Row>
                </ListItem>
              }
            />))}

        </Content>
        <Fab
          active={false}
          containerStyle={{ marginBottom: 54 }}
          style={{ backgroundColor: this.estilo.cor.green_solid }}
          position="bottomRight"
          onPress={() => Actions.plantaForm({ title: 'Nova Planta' })}>
          <Icon name="add" />
        </Fab>
        <BottomMenu />
      </Container>
    )
  }
}

