import React, { Component } from 'react'
import { Dimensions } from 'react-native'
import { Icon, Button, Row } from 'native-base'
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
      { key: 0, label: 'Sensores', icon: 'activity', type: 'Feather', size: 25, color: this.estilo.cor.green_solid },
      { key: 1, label: 'Atuadores', icon: 'command', type: 'Feather', size: 25, color: this.estilo.cor.greenish_solid },
      { key: 2, label: 'Clima semanal', icon: 'cloud', type: 'Feather', size: 25, color: this.estilo.cor.blue_solid },
      { key: 3, label: 'Clima 12h', icon: 'clock', type: 'Feather', size: 25, color: this.estilo.cor.purple },
      { key: 4, label: 'Sair', icon: 'log-out', type: 'Feather', size: 25, color: this.estilo.cor.red, method: () => Actions.init() },
    ]
  }

  render() {
    return (
      <Row style={{ width: Dimensions.get('window').width, justifyContent: 'center', paddingVertical: 10, height: 60 }}>
        {this.tabs.map((item) => (
          <Button transparent key={item.icon}
            onPress={() => {
              this.setState({ ativa: item.key }); this.props.method(item.key);
              if (item.method) item.method()
            }}
            style={{
              marginHorizontal: 5, elevation: 0, height: 50, borderRadius: 0,
              minWidth: 55, justifyContent: 'center', flexDirection: 'column'
            }}>
            {/* style={[{
              marginHorizontal: 5, elevation: 0, height: 50, borderRadius: 0,
              minWidth: 55, justifyContent: 'center', flexDirection: 'column',
            }, this.state.ativa == item.key ? {
              borderBottomWidth: 2, paddingBottom: 3, borderBottomColor: this.estilo.cor.gray_solid
            } : null]}> */}
            {item.type == 'Feather' ?
              <FeatherIcon style={{
                color: this.state.ativa == item.key ? this.estilo.cor.gray_solid : this.estilo.cor.gray_medium,
                fontSize: item.size, marginHorizontal: 15
              }} name={item.icon} /> :
              <Icon style={{
                color: this.state.ativa == item.key ? this.estilo.cor.gray_solid : this.estilo.cor.gray_medium,
                fontSize: item.size
              }} name={item.icon} type={item.type} />
            }
          </Button>
        ))}
      </Row>
    )
  }
}