import React, { Component } from 'react'
import { Dimensions, StatusBar, Modal } from 'react-native'
import { Container, Content, ListItem, Text, SwipeRow, Button, Icon, Fab, Col, Form, View } from 'native-base'
import Loader from '../../components/Loader'
import { Actions } from 'react-native-router-flux'
import BottomMenu from '../../components/BottomMenu'
import http from '../../services/Http'
import estilo from '../../assets/Estilo'
import ViewInfos from './View'
import ListEmpty from '../../components/ListEmpty'
import Delete from '../../components/Delete'

export default class ListPlanta extends Component {
  constructor(props) {
    super(props)
    this.estilo = new estilo()
    this.http = new http()
    this.state = {
      modal: false,
      loaded: false,
      item_delete: undefined,
      lista: [],
      modal_view: false,
      item_modal_view: {}
    }
  }

  componentWillMount() {
    this.load()
  }

  componentWillReceiveProps() {
    this.load()
  }

  async load() {
    await this.http.get('plantas').then((data) => {
      this.setState({ lista: data, loaded: true })
    })
  }

  delete = async (confirm) => {
    await this.setState({ modal: false })
    confirm ? await this.http.delete('plantas', this.state.item_delete._id)
      .then(async (data) => {
        if (data == 'Ok') {
          await this.state.lista.splice(this.state.lista.indexOf(this.state.item_delete), 1)
          this.setState({ lista: this.state.lista })
        }
        else { alert(data) }
      }) : null
  }

  render() {
    return (
      <Container>
        <StatusBar backgroundColor={this.estilo.cor.white} barStyle="dark-content" />
        {this.state.loaded ? null : <Loader />}
        {!this.state.lista[0] && this.state.loaded ? <ListEmpty _id={'planta'} /> : null}
        <Content>
          {this.state.lista.map((item) => (
            <SwipeRow key={item._id} leftOpenValue={80} disableLeftSwipe={true}
              style={this.estilo.swiperow}
              onRowOpen={() => this.setState({ modal: true, item_delete: item })}
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
                    onPress={() => this.setState({ modal_view: true, item_modal_view: item })} >
                    <Icon name='eye' type='Feather' style={{ color: this.estilo.cor.gray, fontSize: 22 }} />
                  </Button>
                </ListItem>
              }
            />))}

          <Modal
            transparent
            animationType='fade'
            visible={this.state.modal}
            onRequestClose={() => this.setState({ modal: false })}>
            <Delete delete={this.delete} />
          </Modal>

          <Modal
            transparent
            animationType='fade'
            visible={this.state.modal_view}
            onRequestClose={() => this.setState({ modal_view: false })}>

            <Container style={{ backgroundColor: this.estilo.cor.gray_translucid }}>

              <ViewInfos item={this.state.item_modal_view} />

              <Form style={{ flexDirection: 'row', alignSelf: 'flex-end' }} >
                <Fab containerStyle={{ position: 'relative' }}
                  style={{ backgroundColor: this.estilo.cor.red }}
                  onPress={() => { this.setState({ modal_view: false }) }}>
                  <Icon name='x' type='Feather' />
                </Fab>
              </Form>

            </Container>
          </Modal>

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

