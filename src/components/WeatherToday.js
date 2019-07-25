import React, { Component } from 'react'
import { Dimensions, ScrollView, Modal, View } from 'react-native'
import { Button, Form, ListItem, Row, Col, Spinner, Content, Container, Text } from 'native-base'
import estilo from '../assets/Estilo'
import LinearGradient from 'react-native-linear-gradient'
import FeatherIcon from 'react-native-vector-icons/Feather'
import axios from 'axios'
import rnfs from 'react-native-fs'
import { Grid, AreaChart, XAxis, YAxis } from 'react-native-svg-charts'
import { G, Line, Circle, Path, Svg } from 'react-native-svg'
import * as shape from 'd3-shape'

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
    render() {
        const data = [24, 24, 27, 30, 31, 30, 33, 34, 29, 28, 30, 33, 29, 29]
        const data1 = [0, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 23, 0, 0]
        const Decorator = ({ x, y, data }) => {
            return data.map((value, index) => (
                <Svg key={index} translateX={x(index)} translateY={y(value)}>
                    <Text style={{
                        marginTop: -35, marginLeft: -8, fontWeight: 'bold',
                        color: this.estilo.cor.purple, fontSize: 17
                    }}>{value}º</Text>
                </Svg>
            ))
        }
        const Line = ({ line }) => (
            <Path d={line} stroke={this.estilo.cor.purple + '77'} fill={'none'} strokeWidth={10} />
        )
        return (
            <Container>
                <ScrollView horizontal={true} style={{
                    marginTop: 0, maxHeight: 200
                }}>
                    <Form style={{ width: Dimensions.get('window').width * 1.5 }}>
                        <AreaChart
                            style={{ height: 150 }}
                            data={data}
                            svg={{ fill: this.estilo.cor.purple }}
                            curve={shape.curveNatural}
                            contentInset={{ left: -20, right: -22 }}
                            yMin={22}
                            yMax={50}
                        >
                            <Line />
                            <Decorator />
                        </AreaChart>
                        <XAxis
                            style={{
                                marginHorizontal: -30, height: 50, paddingTop: 25,
                                backgroundColor: this.estilo.cor.purple
                            }}
                            data={data}
                            formatLabel={index => data1[index] + 'h'}
                            contentInset={{ left: 10, right: 0 }}
                            svg={{ fontSize: 15, fill: this.estilo.cor.white }}
                            numberOfTicks={12}
                        />
                    </Form>
                </ScrollView>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', backgroundColor: this.estilo.cor.purple }}>
                    {this.card_weather.map((item) => (
                        <Button key={item.icon} rounded style={this.estilo.button_item_weather}
                            onPress={() => this.setState({ card_weather_atual: this.card_weather.indexOf(item) })}>
                            <FeatherIcon name={item.icon} style={[this.estilo.icon_item_weather,
                            this.state.card_weather_atual == this.card_weather.indexOf(item) ?
                                { color: this.estilo.cor.white } : null]} />
                        </Button>
                    ))}
                </View>
            </Container>
        )
    }
}