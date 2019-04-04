import React, { Component } from 'react'
import { Icon } from 'native-base'
import BottomNavigation, {
  ShiftingTab
} from 'react-native-material-bottom-navigation'
import estilo from '../assets/Estilo'

export default class BottomMenu extends Component {
  constructor(props) {
    super(props)
    this.estilo = new estilo()
    this.state = {
      ativa: 'luz' //receber por props
    }
    this.tabs = [
      { key: 'planta', label: 'Planta', icon: 'flower', type: 'Entypo', size: 21, color: this.estilo.cor.green_solid, pressColor: this.estilo.cor.gray_white + 'cc' },
      { key: 'clima', label: 'Clima', icon: 'cloud', type: 'Entypo', size: 24, color: this.estilo.cor.blue_solid, pressColor: this.estilo.cor.gray_white + 'cc' },
      { key: 'solo', label: 'Solo', icon: 'grain', type: 'MaterialIcons', size: 24, color: this.estilo.cor.brown, pressColor: this.estilo.cor.gray_white + 'cc' },
      { key: 'luz', label: 'Luz', icon: 'wb-sunny', type: 'MaterialIcons', size: 24, color: this.estilo.cor.orange, pressColor: this.estilo.cor.gray_white + 'cc' },
      { key: 'nutriente', label: 'Nutriente', icon: 'lab-flask', type: 'Entypo', size: 20, color: this.estilo.cor.purple, pressColor: this.estilo.cor.gray_white + 'cc' },
    ]
  }

  componentWillMount() {
    this.renderTab(this.state.ativa)
  }


  renderIcon = (icon, color, type, size) => ({ isActive }) => (
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
        style={{ height: 60 }}
        onTabPress={newTab => this.setState({ ativa: newTab.key })}
        renderTab={this.renderTab(this.state.ativa)}
        tabs={this.tabs}
      />
    )
  }
}