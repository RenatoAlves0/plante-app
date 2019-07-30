import React, { Component } from 'react'
import { ScrollView } from 'react-native'
import { Icon, Form, Button, Text, Row } from 'native-base'
import BottomNavigation, { ShiftingTab } from 'react-native-material-bottom-navigation'
import estilo from '../assets/Estilo'
import FeatherIcon from 'react-native-vector-icons/Feather'

export default class BottomMenuCliente extends Component {
  constructor(props) {
    super(props)
    this.estilo = new estilo()
    this.state = {
      ativa: 0
    }
    this.tabs = [
      { key: 0, label: 'Sensores', icon: 'gauge', type: 'MaterialCommunityIcons', size: 24, color: this.estilo.cor.green_solid, pressColor: this.estilo.cor.gray_white + 'cc' },
      { key: 1, label: 'Atuadores', icon: 'robot-industrial', type: 'MaterialCommunityIcons', size: 24, color: this.estilo.cor.greenish_solid, pressColor: this.estilo.cor.gray_white + 'cc' },
      { key: 2, label: 'Clima semanal', icon: 'cloud', type: 'Entypo', size: 24, color: this.estilo.cor.blue_solid, pressColor: this.estilo.cor.gray_white + 'cc' },
      { key: 3, label: 'Clima 12h', icon: 'clock', type: 'Feather', size: 24, color: this.estilo.cor.purple, pressColor: this.estilo.cor.gray_white + 'cc' },
    ]
  }

  componentWillMount() {
    this.load()
  }

  componentWillReceiveProps() {
    this.load()
  }

  async load() {
    this.renderTab(this.state.ativa)
  }

  renderIcon = (icon, color, type, size) => ({ isActive }) => (
    type == 'Feather' ?
      <FeatherIcon style={{ color: color, fontSize: size }} name={icon} /> :
      <Icon style={{ color: color, fontSize: size }} name={icon} type={type} />
  )

  renderTab = (ativa) => ({ tab, isActive }) => (
    <ShiftingTab
      style={{ maxWidth: isActive ? 100 : 96 }}
      labelStyle={{ fontSize: 13, color: tab.color, fontWeight: 'bold' }}
      isActive={tab.key == ativa}
      key={tab.key}
      label={tab.label}
      renderIcon={this.renderIcon(tab.icon, tab.color, tab.type, tab.size)}
    />
  )

  render() {
    return (
      // <BottomNavigation
      //   style={{ height: 60, elevation: 10, backgroundColor: this.estilo.cor.white }}
      //   onTabPress={(newTab) => { this.setState({ ativa: newTab.key }); this.props.method(newTab.key) }}
      //   renderTab={this.renderTab(this.state.ativa)}
      //   tabs={this.tabs}
      // />
      <ScrollView showsHorizontalScrollIndicator={false}
        horizontal={true} style={{
          backgroundColor: this.estilo.cor.white + '00', position: 'absolute',
          bottom: 0, alignSelf: 'center'
        }}>
        <Row style={{ paddingHorizontal: 10 }}>
          {this.tabs.map((item) => (
            <Button rounded key={item.icon}
              onPress={() => { this.setState({ ativa: item.key }); this.props.method(item.key) }}
              style={{
                marginVertical: 10, marginHorizontal: 5, elevation: 10,
                backgroundColor: item.color, height: 50, minWidth: 55, justifyContent: 'center'
              }}>
              {item.type == 'Feather' ?
                <FeatherIcon style={{ color: this.estilo.cor.white, fontSize: item.size, marginHorizontal: 15 }} name={item.icon} /> :
                <Icon style={{ color: this.estilo.cor.white, fontSize: item.size }} name={item.icon} type={item.type} />
              }
              <Text uppercase={false} style={{
                display: this.state.ativa == item.key ? 'flex' : 'none',
                fontSize: 15
              }}>{item.label}</Text>
            </Button>
          ))}
        </Row>
      </ScrollView>
    )
  }
}