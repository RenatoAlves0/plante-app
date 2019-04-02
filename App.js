import React, { Component } from 'react'
import BottomMenu from './src/components/BottomMenu'
import Lista from './src/components/Lista'
import { Container } from 'native-base';

export default class App extends Component {
  render() {
    return (
      <Container>
        <Lista entidade={'planta'} />
        <BottomMenu />
      </Container>
    )
  }
}

