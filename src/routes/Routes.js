import React, { Component } from 'react'
import { StatusBar } from 'react-native'
import { Router, Scene, Stack } from 'react-native-router-flux'
import { Container, Root } from 'native-base'
import estilo from '../assets/Estilo'
import login from '../components/Login'
import plantaList from '../views/Planta/List'
import plantaForm from '../views/Planta/Form'
import familiaForm from '../views/Familia/Form'
import generoForm from '../views/Genero/Form'
import especieForm from '../views/Especie/Form'
import climaList from '../views/Clima/List'
import climaForm from '../views/Clima/Form'
import soloList from '../views/Solo/List'
import soloForm from '../views/Solo/Form'
import luzList from '../views/Luz/List'
import luzForm from '../views/Luz/Form'
import nutrienteList from '../views/Nutriente/List'
import nutrienteForm from '../views/Nutriente/Form'
import dash from '../views/Dashboard/Dash'
import week from '../views/Weather/Week'
import today from '../views/Weather/Today'

export default class Routes extends Component {
    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.state = {}
    }

    render() {
        return (
            <Container>
                <StatusBar backgroundColor={this.estilo.cor.white} barStyle="dark-content" />
                <Root>
                    <Router>
                        <Stack key='root'>
                            <Scene key='login' component={login} initial hideNavBar />
                            <Scene key='plantaList' component={plantaList} hideNavBar />
                            <Scene key='plantaForm' component={plantaForm} hideNavBar />
                            <Scene key='familiaForm' component={familiaForm} hideNavBar />
                            <Scene key='generoForm' component={generoForm} hideNavBar />
                            <Scene key='especieForm' component={especieForm} hideNavBar />
                            <Scene key='climaList' component={climaList} hideNavBar />
                            <Scene key='climaForm' component={climaForm} hideNavBar />
                            <Scene key='soloList' component={soloList} hideNavBar />
                            <Scene key='soloForm' component={soloForm} hideNavBar />
                            <Scene key='luzList' component={luzList} hideNavBar />
                            <Scene key='luzForm' component={luzForm} hideNavBar />
                            <Scene key='nutrienteList' component={nutrienteList} hideNavBar />
                            <Scene key='nutrienteForm' component={nutrienteForm} hideNavBar />
                            <Scene key='dash' component={dash} hideNavBar />
                            <Scene key='week' component={week} hideNavBar />
                            <Scene key='today' component={today} hideNavBar />
                        </Stack>
                    </Router>
                </Root>
            </Container>
        )
    }
}