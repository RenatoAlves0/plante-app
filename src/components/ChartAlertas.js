import React, { Component } from 'react'
import { Dimensions, ScrollView } from 'react-native'
import { Form, Text, View } from 'native-base'
import estilo from '../assets/Estilo'
import { AreaChart, XAxis } from 'react-native-svg-charts'
import { Path, Svg } from 'react-native-svg'
import * as shape from 'd3-shape'

export default class ChartAlertas extends Component {
    constructor(props) {
        super(props)
        this.props.max_value = 0
        this.estilo = new estilo()
        this.state = {
            loaded: false
        }
    }

    async componentWillReceiveProps() {
        await this.load()
    }

    componentWillUnmount() {
        this.props = {}
    }

    async load() {
        await this.nomralizaData()
        await this.nomralizaValor()
        this.setState({ loaded: true })
    }

    async nomralizaValor() {
        let primeiro = await this.props.valor[0]
        let ultimo = await this.props.valor[this.props.valor.length - 1]

        await this.props.valor.unshift(primeiro)
        await this.props.valor.push(ultimo)
    }

    async nomralizaData() {
        let primeiro = await this.props.data[0]
        let ultimo = await this.props.data[this.props.data.length - 1]

        await this.props.data.unshift(primeiro)
        await this.props.data.push(ultimo)
    }

    async eixox() {
        return (
            <XAxis
                style={{
                    marginLeft: -40, marginRight: -30, height: 52, marginBottom: -1,
                    backgroundColor: this.props.color, paddingTop: 18
                }}
                data={this.props.data}
                formatLabel={index => {
                    return new Date(this.props.data[index]).toLocaleTimeString().substring(0, 5) + ' h'
                }}
                contentInset={{ left: 10, right: 0 }}
                svg={{ fontSize: 16, fill: this.props.font_color ? this.props.font_color : this.estilo.cor.white }}
                numberOfTicks={12}
            />
        )
    }

    render() {
        const min = this.props.valor ? Math.min(... this.props.valor) : 0
        const max = this.props.valor ? Math.max(... this.props.valor) : 0
        const Decorator = ({ x, y, data }) => {
            return data.map((value, index) => (
                <Svg key={index} translateX={x(index)} translateY={y(value)}>
                    {this.props.data ?
                        <Form style={{
                            flexDirection: (this.props.data).length > 3 ? 'column' : 'row',
                            marginTop: (this.props.data).length > 3 ? -45 : -35,
                            alignItems: this.props.data == 'º' ? 'flex-start' : 'baseline',
                            marginLeft: (this.props.data).length > 3 ? -20 : -25,
                            width: 40 + (((this.props.data).length || 0) * 10), height: 25, justifyContent: 'center'
                        }}>
                            <Text style={index == 0 || index == this.props.valor.length - 1 ? { color: 'transparent' } :
                                { color: this.props.color, fontSize: 18, fontWeight: 'bold' }}>{value}</Text>
                            <Text style={index == 0 || index == this.props.valor.length - 1 ? { color: 'transparent' } :
                                { color: this.props.color, fontSize: (this.props.data).length > 1 ? 14 : 15, paddingBottom: 2 }}
                            >{new Date(this.props.data[index]).toLocaleTimeString().substring(0, 5) + ' h' || ''}</Text>
                        </Form> : null}
                </Svg>
            ))
        }
        const Line = ({ line }) => (
            <Path y={-2} d={line} stroke={this.props.color + '77'} fill={'none'} strokeWidth={5} strokeDasharray={[0, 0]} />
        )

        return (
            <ScrollView showsHorizontalScrollIndicator={false}
                horizontal={true} style={{ height: 250 }}>
                <View style={{ width: this.props.data.length * 70, justifyContent: 'flex-end', backgroundColor: this.estilo.cor.white }}>
                    <AreaChart
                        style={{ height: max - min == 0 ? 20 : 200, marginRight: -1, marginBottom: -1, marginTop: min == 0 && max == 0 ? 20 : 0 }}
                        data={this.props.valor}
                        svg={{ fill: this.props.color }}
                        curve={shape.curveNatural}
                        contentInset={{ left: -20, right: -20, top: 40 }}
                        yMin={min != 0 ? min - 1 : min}
                        yMax={max - min >= 20 ? max + 10 : max + 1}
                    >
                        <Line />
                        <Decorator />
                    </AreaChart>

                    <XAxis
                        style={{
                            marginLeft: -40, marginRight: -30, height: 52, marginBottom: -1,
                            backgroundColor: this.props.color, paddingTop: 18
                        }}
                        data={this.props.data}
                        formatLabel={index => {
                            if (this.props.data[index]) return new Date(this.props.data[index]).toLocaleTimeString().substring(0, 5) + ' h'
                            else return ''
                        }}
                        contentInset={{ left: 10, right: 0 }}
                        svg={{ fontSize: 16, fill: this.props.font_color ? this.props.font_color : this.estilo.cor.white }}
                        numberOfTicks={12}
                    />
                </View>
            </ScrollView>
        )
    }
}