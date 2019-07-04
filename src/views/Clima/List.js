import React, { Component } from 'react'
import { Container, Content, ListItem, Text, SwipeRow, Button, Icon, Fab, Col, Row, View } from 'native-base'
import { Dimensions, StatusBar } from 'react-native'
import Loader from '../../components/Loader'
import { Actions } from 'react-native-router-flux'
import BottomMenu from '../../components/BottomMenu'
import http from '../../services/Http'
import estilo from '../../assets/Estilo'
import ListEmpty from '../../components/ListEmpty'

export default class ListClima extends Component {
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
    await this.http.get('climas').then((data) => {
      this.setState({ lista: data, loaded: true })
    })
  }

  async delete(item) {
    await this.http.delete('climas', item._id)
      .then(async (data) => {
        if (data == 'Ok') {
          await this.state.lista.splice(this.state.lista.indexOf(item), 1)
          this.setState({ lista: this.state.lista })
        }
        else { alert(data) }
      })
  }

  calc_tipo_umidade(value) {
    if (value == undefined || value == null) return ''
    if (value >= 80 && value <= 100) return 'Alagado'
    if (value >= 60 && value < 80) return 'Muito Ùmido'
    if (value >= 40 && value < 60) return 'Ùmido'
    if (value >= 20 && value < 40) return 'Pouco Úmido'
    if (value >= 0 && value < 20) return 'Seco'
    else return 'Umidade deve estar entre 0 e 100'
  }

  render() {
    return (
      <Container>
        <StatusBar backgroundColor={this.estilo.cor.white} barStyle="dark-content" />
        {this.state.loaded ? null : <Loader />}
        {!this.state.lista[0] && this.state.loaded ? <ListEmpty _id={'clima'} /> : null}
        <Content>
          {this.state.lista.map((item) => (
            <SwipeRow key={item._id} leftOpenValue={80} disableLeftSwipe={true}
              style={this.estilo.swiperow}
              onRowOpen={() => this.delete(item)}
              left={
                <Button full style={this.estilo.swiperow_deletbuttom}>
                  <Icon active name='trash' type='Feather' />
                </Button>
              }
              body={
                <ListItem onPress={() => Actions.climaForm({ item: item, title: item.nome })}
                  style={{
                    paddingRight: 0, width: Dimensions.get('window').width, borderBottomWidth: 0, marginLeft: 0,
                    backgroundColor: this.state.lista.indexOf(item) % 2 == 0 ? 'white' : this.estilo.cor.gray_white_light
                  }}>
                  <Col>
                    <Text>{'Clima ' + item.tipo}</Text>
                    <Row style={{ justifyContent: 'center', marginTop: 10 }} >
                      <View style={this.estilo.listitemview}>
                        <Icon name='thermometer' type='MaterialCommunityIcons' style={{ color: this.estilo.cor.orange + 'aa' }} />
                        <Text style={{ color: this.estilo.cor.gray }} >
                          {
                            ' min: ' + item.temperaturaMinima + ' ºC\n'
                            + ' max: ' + item.temperaturaMaxima + ' ºC\n'
                            + ' ideal: ' + (item.temperaturaMinima + item.temperaturaMaxima) / 2 + ' ºC'
                          }
                        </Text>
                      </View>

                      <View style={this.estilo.listitemview}>
                        <Icon name='water' type='MaterialCommunityIcons' style={{ marginLeft: 10, color: this.estilo.cor.blue + 'aa' }} />
                        <Text style={{ color: this.estilo.cor.gray }} >
                          {
                            ' min: ' + item.umidadeMinima + ' %\n'
                            + ' max: ' + item.umidadeMaxima + ' %\n '
                            + 'ideal: ' + this.calc_tipo_umidade((item.umidadeMinima + item.umidadeMaxima) / 2)
                          }
                        </Text>
                      </View>
                    </Row>
                  </Col>
                </ListItem>
              }
            />))}

        </Content>
        <Fab
          active={false}
          containerStyle={{ marginBottom: 54 }}
          style={{ backgroundColor: this.estilo.cor.blue_solid }}
          position='bottomRight'
          onPress={() => Actions.climaForm({ title: 'Novo Clima' })}>
          <Icon name='add' />
        </Fab>
        <BottomMenu ativa='clima' />
      </Container>
    )
  }
}

