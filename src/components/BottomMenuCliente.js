import React, { Component } from 'react'
import { Icon } from 'native-base'
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
      <BottomNavigation
        style={{ height: 60, elevation: 0 }}
        onTabPress={(newTab) => { this.setState({ ativa: newTab.key }); this.props.method(newTab.key) }}
        renderTab={this.renderTab(this.state.ativa)}
        tabs={this.tabs}
      />
    )
  }
}