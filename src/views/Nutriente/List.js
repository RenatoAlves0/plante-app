import React, { Component } from 'react'
import { Container, Content, ListItem, Text, SwipeRow, Button, Icon, Fab, Col, Row, View } from 'native-base'
import { Dimensions, StatusBar } from 'react-native'
import Loader from '../../components/Loader'
import { Actions } from 'react-native-router-flux'
import BottomMenu from '../../components/BottomMenu'
import http from '../../services/Http'
import estilo from '../../assets/Estilo'

export default class ListNutriente extends Component {
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
    await this.http.get('nutriente').then((data) => {
      this.setState({ lista: data, loaded: true })
    })
  }

  async delete(item) {
    await this.http.delete('nutriente', item.id)
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
                <ListItem onPress={() => Actions.nutrienteForm({ item: item, title: item.nome })}
                  style={{
                    paddingRight: 0, width: Dimensions.get('window').width, borderBottomWidth: 0, marginLeft: 0,
                    backgroundColor: this.state.lista.indexOf(item) % 2 == 0 ? 'white' : this.estilo.cor.gray_white_light
                  }}>
                  <Col>
                    <Row style={{ justifyContent: 'center' }} >
                      <Text style={{ textAlign: 'center', marginHorizontal: 10 }}>
                        {'Macronutrientes: '}
                        {item.nitrogenio > 0 ? 'Nitrogênio (' + item.nitrogenio + ') ' : null}
                        {item.fosforo > 0 ? 'Fósforo (' + item.fosforo + ') ' : null}
                        {item.potassio > 0 ? 'Potássio (' + item.potassio + ') ' : null}
                      </Text>
                    </Row>
                    <Row style={{ justifyContent: 'center' }}>
                      <Text style={{ textAlign: 'center', color: this.estilo.cor.gray, marginHorizontal: 10 }}>
                        {'Micronutrientes: '}
                        {item.magnesio > 0 ? 'Magnésio (' + item.magnesio + ') ' : null}
                        {item.calcio > 0 ? 'Cálcio (' + item.calcio + ') ' : null}
                        {item.enxofre > 0 ? 'Enxôfre (' + item.enxofre + ') ' : null}
                        {item.ferro > 0 ? 'Ferro (' + item.ferro + ') ' : null}
                        {item.manganes > 0 ? 'Manganês (' + item.manganes + ') ' : null}
                        {item.boro > 0 ? 'Boro (' + item.boro + ') ' : null}
                        {item.cobre > 0 ? 'Cobre (' + item.cobre + ') ' : null}
                        {item.zinco > 0 ? 'Zinco (' + item.zinco + ') ' : null}
                        {item.cloro > 0 ? 'Cloro (' + item.cloro + ') ' : null}
                        {item.molibdenio > 0 ? 'Molibdenio (' + item.molibdenio + ') ' : null}
                      </Text>
                    </Row>
                  </Col>
                </ListItem>
              }
            />))}

        </Content>
        <Fab
          active={false}
          containerStyle={{ marginBottom: 54 }}
          style={{ backgroundColor: this.estilo.cor.purple }}
          position='bottomRight'
          onPress={() => Actions.nutrienteForm({ title: 'Novo Nutriente' })}>
          <Icon name='add' />
        </Fab>
        <BottomMenu ativa='nutriente' />
      </Container>
    )
  }
}

