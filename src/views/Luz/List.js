import React, { Component } from 'react'
import { Container, Content, ListItem, Text, SwipeRow, Button, Icon, Fab, Col, Row, View } from 'native-base'
import { Dimensions, StatusBar, Modal } from 'react-native'
import Loader from '../../components/Loader'
import { Actions } from 'react-native-router-flux'
import BottomMenu from '../../components/BottomMenu'
import http from '../../services/Http'
import estilo from '../../assets/Estilo'
import ListEmpty from '../../components/ListEmpty'
import Delete from '../../components/Delete'
import FeatherIcon from 'react-native-vector-icons/Feather'

export default class ListLuz extends Component {
  constructor(props) {
    super(props)
    this.estilo = new estilo()
    this.http = new http()
    this.state = {
      modal: false,
      loaded: false,
      item_delete: undefined,
      lista: []
    }
  }

  componentDidMount() {
    this.load()
  }

  componentWillReceiveProps() {
    this.load()
  }

  async load() {
    await this.http.get('luzs', 1).then((data) => {
      this.setState({ lista: data, loaded: true })
    })
  }

  delete = async (confirm) => {
    await this.setState({ modal: false })
    confirm ? await this.http.delete('luzs', this.state.item_delete._id, 1)
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
        {!this.state.lista[0] && this.state.loaded ? <ListEmpty _id={'luz'} /> : null}
        <Content>
          {this.state.lista.map((item) => (
            <SwipeRow key={item._id} leftOpenValue={80} disableLeftSwipe={true}
              style={this.estilo.swiperow}
              onRowOpen={() => this.setState({ modal: true, item_delete: item })}
              left={
                <Button full style={this.estilo.swiperow_deletbuttom}>
                  <FeatherIcon active name='trash' style={{ color: this.estilo.cor.white, fontSize: 22, marginHorizontal: 10 }} />
                </Button>
              }
              body={
                <ListItem onPress={() => Actions.luzForm({ item: item, title: item.nome })}
                  style={{
                    paddingRight: 0, width: Dimensions.get('window').width, borderBottomWidth: 0, marginLeft: 0,
                    backgroundColor: this.state.lista.indexOf(item) % 2 == 0 ? 'white' : this.estilo.cor.gray_white_light
                  }}>
                  <Col>
                    <Row style={{ justifyContent: 'center' }}>
                      {item.intensidade == 'Forte' ? <Icon style={{ fontSize: 30, color: this.estilo.cor.orange }} name='wb-sunny' type='MaterialIcons' /> : null}
                      {item.intensidade == 'Média' ? <Icon style={{ fontSize: 26, color: this.estilo.cor.orange + 'aa' }} name='wb-sunny' type='MaterialIcons' /> : null}
                      {item.intensidade == 'Fraca' ? <Icon style={{ fontSize: 22, color: this.estilo.cor.orange + '77' }} name='wb-sunny' type='MaterialIcons' /> : null}
                      {item.intensidade == 'Sombra' ? <Icon style={{ fontSize: 22, color: this.estilo.cor.gray_white }} name='cloud' type='MaterialIcons' /> : null}
                      <Text>{'  ' + item.intensidade}</Text>
                    </Row>
                    {item.intensidade == 'Sombra' || !item.horasPorDia ? null :
                      <Text style={{ color: this.estilo.cor.gray }}>  {item.horasPorDia} {item.horasPorDia > 1 ? ' horas' : ' hora'} {'por dia'} </Text>}
                  </Col>
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

        </Content>
        <Fab
          active={false}
          containerStyle={{ marginBottom: 54 }}
          style={{ backgroundColor: this.estilo.cor.orange }}
          position='bottomRight'
          onPress={() => Actions.luzForm({ title: 'Novo Luz' })}>
          <Icon name='add' />
        </Fab>
        <BottomMenu ativa='luz' />
      </Container>
    )
  }
}

