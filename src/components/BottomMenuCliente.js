import React, { Component } from 'react'
import { ScrollView, Dimensions } from 'react-native'
import { Icon, Button, Text, Row, Item } from 'native-base'
import estilo from '../assets/Estilo'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { Actions } from 'react-native-router-flux';

export default class BottomMenuCliente extends Component {
  constructor(props) {
    super(props)
    this.estilo = new estilo()
    this.state = {
      ativa: 0
    }
    this.tabs = [
      { key: 0, label: 'Sensores', icon: 'gauge', type: 'MaterialCommunityIcons', size: 24, color: this.estilo.cor.green_solid },
      { key: 1, label: 'Atuadores', icon: 'robot-industrial', type: 'MaterialCommunityIcons', size: 24, color: this.estilo.cor.greenish_solid },
      { key: 2, label: 'Clima semanal', icon: 'cloud', type: 'Entypo', size: 24, color: this.estilo.cor.blue_solid },
      { key: 3, label: 'Clima 12h', icon: 'clock', type: 'Feather', size: 24, color: this.estilo.cor.purple },
      { key: 4, label: 'Sair', icon: 'x', type: 'Feather', size: 24, color: this.estilo.cor.red, method: () => Actions.init() },
    ]
  }

  render() {
    return (
      <ScrollView showsHorizontalScrollIndicator={false}
        horizontal={true} style={{
          position: 'absolute', bottom: 0, left: 0, alignSelf: 'center',
          minWidth: Dimensions.get('window').width, paddingLeft: 10
        }}>
        <Row style={{ minWidth: Dimensions.get('window').width, justifyContent: 'center', paddingVertical: 10, paddingRight: 20 }}>
          {this.tabs.map((item) => (
            <Button key={item.icon}
              onPress={() => {
                this.setState({ ativa: item.key }); this.props.method(item.key);
                if (item.method) item.method()
              }}
              style={{
                marginHorizontal: 5, elevation: 10, height: 50, borderRadius: 10,
                minWidth: 55, justifyContent: 'center', backgroundColor: item.color
              }}>
              {item.type == 'Feather' ?
                <FeatherIcon style={{ color: this.estilo.cor.white, fontSize: item.size, marginHorizontal: 15 }} name={item.icon} /> :
                <Icon style={{ color: this.estilo.cor.white, fontSize: item.size }} name={item.icon} type={item.type} />
              }
              <Text uppercase={false} style={{
                display: this.state.ativa == item.key ? 'flex' : 'none',
                fontSize: 15, color: this.estilo.cor.white, marginLeft: -20
              }}>{item.label}</Text>
            </Button>
          ))}
        </Row>
      </ScrollView>
    )
  }
}