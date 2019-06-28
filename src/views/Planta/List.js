import React, { Component } from 'react'
import { Dimensions, StatusBar, Modal } from 'react-native'
import { Container, Content, ListItem, Text, SwipeRow, Button, Icon, Fab, Col, Form } from 'native-base'
import Loader from '../../components/Loader'
import { Actions } from 'react-native-router-flux'
import BottomMenu from '../../components/BottomMenu'
import http from '../../services/Http'
import estilo from '../../assets/Estilo'
import ViewInfos from './View'

export default class ListPlanta extends Component {
  constructor(props) {
    super(props)
    this.estilo = new estilo()
    this.http = new http()
    this.state = {
      loaded: false,
      lista: [],
      modal: false,
      itemModal: {}
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
        <StatusBar backgroundColor={this.estilo.cor.white} barStyle="dark-content" />
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
                  <Col style={{ marginLeft: 80 }}>
                    <Text>{item.nome}</Text>
                    <Text style={{ color: this.estilo.cor.gray }}>
                      {item.familia.nome + ' . ' + item.genero.nome + ' . ' + item.especie.nome}</Text>
                  </Col>
                  <Button transparent style={{ marginHorizontal: 10 }}
                    onPress={() => this.setState({ modal: true, itemModal: item })} >
                    <Icon name='eye' type='Feather' style={{ color: this.estilo.cor.gray, fontSize: 22 }} />
                  </Button>
                </ListItem>
              }
            />))}
          {this.state.modal ?
            <Modal
              transparent
              animationType='fade'
              visible={this.state.modal}
              onRequestClose={() => this.setState({ modal: false })}>

              <Container style={{ backgroundColor: this.estilo.cor.gray_translucid }}>

                <ViewInfos item={this.state.itemModal} />

                <Form style={{ flexDirection: 'row', alignSelf: 'flex-end' }} >
                  <Fab containerStyle={{ position: 'relative' }}
                    style={{ backgroundColor: this.estilo.cor.red }}
                    onPress={() => { this.setState({ modal: false }) }}>
                    <Icon name='x' type='Feather' />
                  </Fab>
                </Form>

              </Container>
            </Modal> : null}

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

