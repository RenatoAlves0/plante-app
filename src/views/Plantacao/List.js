import React, { Component } from 'react'
import { StatusBar, Dimensions } from 'react-native'
import { Container, Text, Button, Content, Row, Header, Body } from 'native-base'
import { Actions } from 'react-native-router-flux'
import estilo from '../../assets/Estilo'
import http from '../../services/Http'
import Card from '../../components/Card'
import FeatherIcon from 'react-native-vector-icons/Feather'

export default class PlantacaoList extends Component {

    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.http = new http()
        this.state = {
        }
    }

    nova_plantacao = () => {
        Actions.plantacaoForm()
    }

    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: this.estilo.cor.white, elevation: 0 }}>
                    <Button rounded transparent onPress={() => Actions.pop()}>
                        <FeatherIcon name='arrow-left' style={{ color: this.estilo.cor.gray_solid, fontSize: 22, marginHorizontal: 5 }} />
                    </Button>
                    <Body>
                        <Text style={{ color: this.estilo.cor.gray_solid, fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>Plantações</Text>
                    </Body>
                    <Button disabled rounded transparent onPress={() => Actions.pop()}>
                        <FeatherIcon name='arrow-left' style={{ color: 'transparent', fontSize: 22, marginHorizontal: 5 }} />
                    </Button>
                </Header>
                <StatusBar backgroundColor={this.estilo.cor.white} barStyle="dark-content" />
                <Content>
                    <Row style={{ flexWrap: 'wrap', flexDirection: 'row', marginLeft: (Dimensions.get('screen').width * .13) - 20 }}>
                        <Card item={{
                            cor1: this.estilo.cor.blue, cor2: this.estilo.cor.greenish_light, method: {},
                            icon_name: 'water-pump', icon_type: 'MaterialCommunityIcons', value: 'Desligar',
                            sub_value_prefix: 'umidade ', sub_value: '45', sub_value_sufix: ' %'
                        }} />

                        <Card item={{
                            cor1: this.estilo.cor.gray_solid, cor2: this.estilo.cor.gray_white, method: this.nova_plantacao,
                            icon_name: 'plus', icon_type: 'MaterialCommunityIcons', sub_value: 'plantação'
                        }} />
                    </Row>
                </Content>
            </Container>
        )
    }
}

