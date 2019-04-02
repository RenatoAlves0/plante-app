import React from 'react'
import { Icon, Button, Text, Container, Footer, Content } from 'native-base'

styles = {
  botao: {
    backgroundColor: 'transparent',
    flexDirection: 'column',
    elevation: 0,
    width: '25%',
    alignContent: 'center',
    alignItems: 'center'
  },
  colors: {
    red: '#d32f2f',
    purple: '#7b1fa2',
    blue: '#1976d2',
    greenish: '#00bfa5',
    green: '#4cda64',
    green_solid: '#388e3c',
    lemon: '#c2da4c',
    orange: '#ffa000',
    brown: '#5d4037',
    gray_white: '#cecece',
    gray: '#999'
  }
}

export default class BottomMenu extends React.Component {
  constructor() {
    super()
    this.state = {
      selected: 0
    }
  }

  changeItem(index) {
    this.setState({
      selected: index
    })
  }

  render() {
    return (
      <Footer style={{ backgroundColor: 'transparent', elevation: 0 }}>
        <Button style={styles.botao} onPress={() => this.changeItem(0)} >
          <Icon style={[this.state.selected != 0 ? { margin: 10 } : {}, { color: styles.colors.green_solid }]} size={20} name='spa' type='MaterialIcons'></Icon>
          {this.state.selected == 0 ? <Text style={{ color: styles.colors.green_solid }} uppercase={false}>Planta</Text> : null}
        </Button>
        <Button style={styles.botao} onPress={() => this.changeItem(1)}>
          <Icon style={[this.state.selected != 1 ? { margin: 10 } : {}, { color: styles.colors.blue }]} size={20} name='cloud' type='MaterialIcons'></Icon>
          {this.state.selected == 1 ? <Text style={{ color: styles.colors.blue }} uppercase={false}>Clima</Text> : null}
        </Button>
        <Button style={styles.botao} onPress={() => this.changeItem(2)}>
          <Icon style={[this.state.selected != 2 ? { margin: 10 } : {}, { color: styles.colors.brown }]} size={20} name='grain' type='MaterialIcons'></Icon>
          {this.state.selected == 2 ? <Text style={{ color: styles.colors.brown }} uppercase={false}>Solo</Text> : null}
        </Button>
        <Button style={styles.botao} onPress={() => this.changeItem(3)}>
          <Icon style={[this.state.selected != 3 ? { margin: 10 } : {}, { color: styles.colors.orange }]} size={20} name='wb-sunny' type='MaterialIcons'></Icon>
          {this.state.selected == 3 ? <Text style={{ color: styles.colors.orange }} uppercase={false}>Luz</Text> : null}
        </Button>
      </Footer>
    )
  }
}