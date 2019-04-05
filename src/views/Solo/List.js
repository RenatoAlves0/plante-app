import React, { Component } from 'react'
import { Container, Content, ListItem, Text, SwipeRow, Button, Icon, Fab, Col, Row, View } from 'native-base'
import { Dimensions } from 'react-native'
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

  calc_percentual(value) {
    let total = parseFloat(this.state.item.quantidadeAreia) +
      parseFloat(this.state.item.quantidadeArgila) +
      parseFloat(this.state.item.quantidadeHumus) +
      parseFloat(this.state.item.quantidadeMusgoSphagnum) +
      parseFloat(this.state.item.quantidadeTerraVegetal) +
      parseFloat(this.state.item.quantidadeTurfa)
    return ((value * 100) / total).toPrecision(4)
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
                        <Text style={{ color: this.estilo.cor.gray }} > {' min. ' + item.phMinimo + ' Ph       \n  max. ' + item.phMaximo + ' Ph'}</Text>
                      </View>
                      <View style={this.estilo.listitemview}>
                        <Icon name='water' type='MaterialCommunityIcons' style={{ color: this.estilo.cor.blue + 'aa' }} />
                        <Text style={{ color: this.estilo.cor.gray }} > {' min. ' + item.umidadeMinima + ' %       \n  max. ' + item.umidadeMaxima + ' %'}</Text>
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

