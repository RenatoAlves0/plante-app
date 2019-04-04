import * as React from 'react'
import { Icon } from 'native-base'
import BottomNavigation, {
  ShiftingTab
} from 'react-native-material-bottom-navigation'

colors = {
  red: '#d32f2f',
  purple: '#7b1fa2',
  blue: '#1976d2',
  blue_solid: '#1f65ff',
  greenish: '#00bfa5',
  green: '#4cda64',
  green_solid: '#388e3c',
  lemon: '#c2da4c',
  orange: '#ffa000',
  brown: '#5d4037',
  gray_white: '#cecece',
  gray: '#999999'
}

export default class BottomMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ativa: 'luz' //receber por props
    }
  }

  componentWillMount() {
    this.renderTab(this.state.ativa)
  }

  tabs = [
    { key: 'planta', label: 'Planta', icon: 'flower', type: 'Entypo', size: 21, color: colors.green_solid, pressColor: colors.gray_white + 'cc' },
    { key: 'clima', label: 'Clima', icon: 'cloud', type: 'Entypo', size: 24, color: colors.blue_solid, pressColor: colors.gray_white + 'cc' },
    { key: 'solo', label: 'Solo', icon: 'grain', type: 'MaterialIcons', size: 24, color: colors.brown, pressColor: colors.gray_white + 'cc' },
    { key: 'luz', label: 'Luz', icon: 'wb-sunny', type: 'MaterialIcons', size: 24, color: colors.orange, pressColor: colors.gray_white + 'cc' },
    { key: 'nutriente', label: 'Nutriente', icon: 'lab-flask', type: 'Entypo', size: 20, color: colors.purple, pressColor: colors.gray_white + 'cc' },
  ]

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