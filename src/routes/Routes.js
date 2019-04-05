import React, { Component } from 'react'
import { Router, Scene, Stack } from 'react-native-router-flux'
import { Container, Root } from 'native-base'
import plantaList from '../views/Planta/List'
import plantaForm from '../views/Planta/Form'
import familiaForm from '../views/Familia/Form'
import generoForm from '../views/Genero/Form'
import especieForm from '../views/Especie/Form'

export default class Routes extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <Container>
                <Root>
                    <Router>
                        <Stack key='root'>
                            <Scene key='plantaList' component={plantaList} initial hideNavBar />
                            <Scene key='plantaForm' component={plantaForm} hideNavBar />
                            <Scene key='familiaForm' component={familiaForm} hideNavBar />
                            <Scene key='generoForm' component={generoForm} hideNavBar />
                            <Scene key='especieForm' component={especieForm} hideNavBar />
                        </Stack>
                    </Router>
                </Root>
            </Container>
        )
    }
}