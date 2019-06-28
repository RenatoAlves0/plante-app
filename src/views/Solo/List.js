import React, { Component } from 'react'
import { Container, Content, ListItem, Text, SwipeRow, Button, Icon, Fab, Col, Row, View } from 'native-base'
import { Dimensions, StatusBar } from 'react-native'
import Loader from '../../components/Loader'
import { Actions } from 'react-native-router-flux'
import BottomMenu from '../../components/BottomMenu'
import http from '../../services/Http'
import estilo from '../../assets/Estilo'

export default class ListSolo extends Component {
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
    await this.http.get('solo').then((data) => {
      this.setState({ lista: data, loaded: true })
    })
  }

  async delete(item) {
    await this.http.delete('solo', item.id)
      .then(async (data) => {
        if (data == 'Ok') {
          await this.state.lista.splice(this.state.lista.indexOf(item), 1)
          this.setState({ lista: this.state.lista })
        }
        else { alert(data) }
      })
  }

  calc_tipo_ph(value) {
    if (value == undefined || value == null) return ''
    if (value >= 7 && value <= 14) return 'Base'
    if (value >= 5 && value < 7) return 'Pouco Ácido'
    if (value >= 3 && value < 5) return 'Ácido'
    if (value >= 1.5 && value < 3) return 'Muito Ácido'
    if (value >= 0 && value < 1.5) return 'Extremamente Ácido'
    else return 'Ph deve estar entre 0 e 7'
  }

  calc_tipo_umidade(value) {
    if (value == undefined || value == null) return ''
    if (value >= 80 && value <= 100) return 'Alagado'
    if (value >= 60 && value < 80) return 'Muito Úmido'
    if (value >= 40 && value < 60) return 'Úmido'
    if (value >= 20 && value < 40) return 'Pouco Úmido'
    if (value >= 0 && value < 20) return 'Seco'
    else return 'Umidade deve estar entre 0 e 100'
  }

  render() {
    return (
      <Container>
        <StatusBar backgroundColor={this.estilo.cor.brown} barStyle="light-content" />
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
                <ListItem onPress={() => Actions.soloForm({ item: item, title: item.nome })}
                  style={{
                    paddingRight: 0, width: Dimensions.get('window').width, borderBottomWidth: 0, marginLeft: 0,
                    backgroundColor: this.state.lista.indexOf(item) % 2 == 0 ? 'white' : this.estilo.cor.gray_white_light
                  }}>
                  <Col>
                    <Row style={{ justifyContent: 'center' }} >
                      <Text style={{ textAlign: 'center' }}>
                        {'Porções: '}
                        {item.quantidadeAreia > 0 ? 'Areia (' + item.quantidadeAreia + ') ' : null}
                        {item.quantidadeArgila > 0 ? 'Argila (' + item.quantidadeArgila + ') ' : null}
                        {item.quantidadeHumus > 0 ? 'Húmus (' + item.quantidadeHumus + ') ' : null}
                        {item.quantidadeMusgoSphagnum > 0 ? 'Sphagnum (' + item.quantidadeMusgoSphagnum + ') ' : null}
                        {item.quantidadeTerraVegetal > 0 ? 'Terra (' + item.quantidadeTerraVegetal + ') ' : null}
                        {item.quantidadeTurfa > 0 ? 'Turfa (' + item.quantidadeTurfa + ') ' : null}
                      </Text>
                    </Row>
                    <Row style={{ justifyContent: 'center', marginTop: 10 }} >
                      <View style={this.estilo.listitemview}>
                        <Icon name='test-tube' type='MaterialCommunityIcons' style={{ color: this.estilo.cor.orange + 'aa' }} />
                        <Text style={{ color: this.estilo.cor.gray }} >
                          {
                            ' min: ' + item.phMinimo + ' Ph\n'
                            + ' max: ' + item.phMaximo + ' Ph\n '
                            + 'ideal: ' + this.calc_tipo_ph((item.phMinimo + item.phMaximo) / 2)
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
          style={{ backgroundColor: this.estilo.cor.brown }}
          position='bottomRight'
          onPress={() => Actions.soloForm({ title: 'Novo Solo' })}>
          <Icon name='add' />
        </Fab>
        <BottomMenu ativa='solo' />
      </Container>
    )
  }
}
