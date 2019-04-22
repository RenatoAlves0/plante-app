import React, { Component } from 'react'
import { Container, Content, ListItem, Text, SwipeRow, Button, Icon, Fab, Col } from 'native-base'
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

  async delete(item) {
    await this.http.delete('planta', item.id)
      .then(async (data) => {
        if (data == 'Ok') {
          await this.state.lista.splice(this.state.lista.indexOf(item), 1)
          this.setState({ lista: this.state.lista })
        }
        else { alert(data) }
      })
  }

  render() {
    return (
      <Container>
        <Content>
          {this.state.loaded ? null : <Loader />}
          {this.state.lista.map((item) => (
            <SwipeRow key={item.id} leftOpenValue={80} disableLeftSwipe={true}
              style={this.estilo.swiperow}
              onRowOpen={() => this.delete(item)}
              left={
                <Button full style={this.estilo.swiperow_deletbuttom}>
                  <Icon active name='trash' type='Feather' />
                </Button>
              }
              body={
                <ListItem onPress={() => Actions.plantaForm({ item: item, title: item.nome })}
                  style={{
                    paddingRight: 0, width: Dimensions.get('window').width, borderBottomWidth: 0, marginLeft: 0,
                    backgroundColor: this.state.lista.indexOf(item) % 2 == 0 ? 'white' : this.estilo.cor.gray_white_light
                  }}>
                  <Col>
                    <Text>{item.nome}</Text>
                    <Text style={{ color: this.estilo.cor.gray }}>
                      {item.familia.nome + '  ' + item.genero.nome + '  ' + item.especie.nome}</Text>
                  </Col>
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
        <BottomMenu ativa='planta' />
      </Container>
    )
  }
}

