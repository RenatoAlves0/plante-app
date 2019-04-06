import React, { Component } from 'react'
import { Container, Content, ListItem, Text, SwipeRow, Button, Icon, Fab, Col, Row, View } from 'native-base'
import { Dimensions } from 'react-native'
import Loader from '../../components/Loader'
import { Actions } from 'react-native-router-flux'
import BottomMenu from '../../components/BottomMenu'
import http from '../../services/Http'
import estilo from '../../assets/Estilo'

export default class ListLuz extends Component {
  constructor(props) {
    super(props)
    this.estilo = new estilo()
    this.http = new http()
    this.state = {
      loaded: false,
      lista: []
    }
  }

  componentWillMount() {
    this.load()
  }

  componentWillReceiveProps() {
    this.load()
  }

  async load() {
    await this.http.get('luz').then((data) => {
      this.setState({ lista: data, loaded: true })
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
              onRowOpen={() => alert('Excluir')}
              left={
                <Button full style={this.estilo.swiperow_deletbuttom}>
                  <Icon active name='trash' type='Feather' />
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
                    {item.intensidade == 'Sombra' ? null : <Text style={{ color: this.estilo.cor.gray }}>  {item.horasPorDia} {item.horasPorDia > 1 ? ' horas' : ' hora'} {'por dia'} </Text>}
                  </Col>
                </ListItem>
              }
            />))}

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

