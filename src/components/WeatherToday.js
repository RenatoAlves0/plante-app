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

    // renderTemperatura() {
    //     return
    // }

    render() {
        const data = [24, 27, 30, 31, 30, 33, 34, 29, 28, 30, 33, 29]
        const data1 = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 23, 0]
        const axesSvg = { fontSize: 18, fill: this.estilo.cor.black };
        const xAxisHeight = 30
        const Decorator = ({ x, y, data }) => {
            return data.map((value, index) => (
                <Svg key={index} translateX={x(index)} translateY={y(value)} strokeWidth={50}>
                    <Text style={{ marginTop: -22, marginLeft: -8 }}>{value}º</Text>
                </Svg>
            ))
        }
        const Line = ({ line }) => (
            <Path d={line} stroke={this.estilo.cor.gray_white} fill={'none'} strokeWidth={3} />
        )
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
                <ScrollView horizontal={true} style={{ margin: 15, marginTop: 0, borderRadius: 10, backgroundColor: 'white' }}>
                    {/* {this.renderTemperatura()} */}
                    <View style={{ padding: 20, flexDirection: 'row', width: Dimensions.get('window').width * 1.7 }}>
                        {/* <YAxis
                            data={data}
                            style={{ marginBottom: xAxisHeight }}
                            svg={axesSvg}
                        /> */}
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <AreaChart
                                style={{ height: 150 }}
                                data={data}
                                svg={{ fill: this.estilo.cor.gray_translucid }}
                                curve={shape.curveNatural}
                                contentInset={{left: 10, right: 20}}
                                yMin={0}
                                yMax={50}
                            >
                                <Line />
                                <Decorator />
                            </AreaChart>
                            <XAxis
                                style={{ marginHorizontal: -10, height: xAxisHeight, paddingTop: 15 }}
                                data={data}
                                formatLabel={index => data1[index]+'h'}
                                contentInset={{ left: 20, right: 30 }}
                                svg={axesSvg}
                                numberOfTicks={12}
                            />
                        </View>
                    </View>
                </ScrollView>
                {/* {this.state.loaded ? null : <Spinner color={this.estilo.cor.white + '77'} style={{ alignSelf: 'center', marginBottom: 30 }} />} */}
            </LinearGradient >
        )
    }
}