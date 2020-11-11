import React, { Component } from 'react'
import { Container, Content, ListItem, Text, SwipeRow, Button, Icon, Fab, Col, Row, Form, View } from 'native-base'
import { Dimensions, StatusBar, Modal } from 'react-native'
import Loader from '../../components/Loader'
import { Actions } from 'react-native-router-flux'
import BottomMenu from '../../components/BottomMenu'
import http from '../../services/Http'
import estilo from '../../assets/Estilo'
import ListEmpty from '../../components/ListEmpty'
import Delete from '../../components/Delete'
import FeatherIcon from 'react-native-vector-icons/Feather'

export default class ListNutriente extends Component {
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
    await this.http.get('nutrientes', 1).then((data) => {
      this.setState({ lista: data, loaded: true })
    })
  }

  delete = async (confirm) => {
    await this.setState({ modal: false })
    confirm ? await this.http.delete('nutrientes', this.state.item_delete._id, 1)
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
        {!this.state.lista[0] && this.state.loaded ? <ListEmpty _id={'nutriente'} /> : null}
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
                <ListItem onPress={() => Actions.nutrienteForm({ item: item, title: item.nome })}
                  style={{
                    paddingRight: 0, width: Dimensions.get('window').width, borderBottomWidth: 0, marginLeft: 0,
                    backgroundColor: this.state.lista.indexOf(item) % 2 == 0 ? 'white' : this.estilo.cor.gray_white_light
                  }}>
                  <Col style={{ paddingHorizontal: 10 }}>
                    <Row style={{ justifyContent: 'center' }} >
                      <Text style={{ textAlign: 'center' }}>
                        {'Macronutrientes: '}
                        {item.nitrogenio > 0 ? 'Nitrogênio (' + item.nitrogenio + ') ' : null}
                        {item.fosforo > 0 ? 'Fósforo (' + item.fosforo + ') ' : null}
                        {item.potassio > 0 ? 'Potássio (' + item.potassio + ') ' : null}
                      </Text>
                    </Row>

                    {item.magnesio || item.calcio || item.enxofre || item.ferro || item.manganes
                      || item.boro || item.cobre || item.zinco || item.cloro || item.molibdenio ?
                      <Row style={{ justifyContent: 'center' }}>
                        <Text style={{
                          textAlign: 'center', color: this.estilo.cor.gray, marginHorizontal: 10,
                          marginTop: item.nitrogenio || item.fosforo || item.potassio ? 10 : 0
                        }}>
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
                      </Row> : null}
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

