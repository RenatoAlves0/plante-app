import React, { Component } from 'react'
import { Dimensions, ScrollView, Modal } from 'react-native'
import { Text, Button, View, Form, ListItem, Row, Col, Spinner, Content, Container } from 'native-base'
import estilo from '../assets/Estilo'
import LinearGradient from 'react-native-linear-gradient'
import FeatherIcon from 'react-native-vector-icons/Feather'
import axios from 'axios'
import rnfs from 'react-native-fs'
import { LineChart } from 'react-native-chart-kit'

export default class Card extends Component {
    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.state = {
            loaded: false,
            card_weather_atual: 0,
            lista_weather: [],
            dia_semana_aux: undefined
        }
        this.card_weather = [
            { icon: 'thermometer', cor1: this.estilo.cor.red_vivid, cor2: this.estilo.cor.purple_vivid },
            { icon: 'sun', cor1: this.estilo.cor.orange, cor2: this.estilo.cor.orange_light },
            { icon: 'moon', cor1: this.estilo.cor.blue, cor2: this.estilo.cor.blue_dark },
        ]
    }

    componentWillReceiveProps() {
    }

    async load() {
    }

    renderTemperatura() {
        return <LineChart
            data={{
                labels: ['1h', '2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', '10h', '11h', '12h'],
                datasets: [{
                    data: [
                        Math.random() * 100,
                        Math.random() * 100,
                        Math.random() * 100,
                        Math.random() * 100,
                        Math.random() * 100,
                        Math.random() * 100,
                        Math.random() * 100,
                        Math.random() * 100,
                        Math.random() * 100,
                        Math.random() * 100,
                        Math.random() * 100,
                        Math.random() * 100,
                    ]
                }]
            }}
            width={Dimensions.get('window').width * 1.5} // from react-native
            height={320}
            yAxisLabel={'$'}
            chartConfig={{
                backgroundColor: '#e26a00',
                backgroundGradientFrom: '#fb8c00',
                backgroundGradientTo: '#ffa726',
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {}
            }}
            bezier
            style={{
                borderRadius: 10
            }}
        />
    }

    render() {
        return (
            <LinearGradient colors={[this.card_weather[this.state.card_weather_atual].cor1,
            this.card_weather[this.state.card_weather_atual].cor2]} useAngle={true}
                angle={90} angleCenter={{
                    x: this.card_weather[this.state.card_weather_atual].x || 0.5,
                    y: this.card_weather[this.state.card_weather_atual].y || 0.5
                }} style={this.estilo.item_dash_weather}>
                <Form style={{ flexDirection: 'row', alignSelf: 'center' }}>
                    {this.card_weather.map((item) => (
                        <Button key={item.icon} rounded style={this.estilo.button_item_weather}
                            onPress={() => this.setState({ card_weather_atual: this.card_weather.indexOf(item) })}>
                            <FeatherIcon name={item.icon} style={[this.estilo.icon_item_weather,
                            this.state.card_weather_atual == this.card_weather.indexOf(item) ?
                                { color: this.estilo.cor.white } : null]} />
                        </Button>
                    ))}
                </Form>
                <ScrollView horizontal={true} style={{ margin: 15, marginTop: 0, borderRadius: 10 }}>
                    {this.renderTemperatura()}
                </ScrollView>
                {/* {this.state.loaded ? null : <Spinner color={this.estilo.cor.white + '77'} style={{ alignSelf: 'center', marginBottom: 30 }} />} */}
            </LinearGradient >
        )
    }
}