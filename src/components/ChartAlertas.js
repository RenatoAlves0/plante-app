import React, { Component } from 'react'
import { ScrollView } from 'react-native'
import { Form, Text, View } from 'native-base'
import FeatherIcon from 'react-native-vector-icons/Feather'
import estilo from '../assets/Estilo'
import { AreaChart } from 'react-native-svg-charts'
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

    async componentDidMount() {
        await this.load()
    }

    async load() {
        await this.nomralizaValor()
        await this.nomralizaData()
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

    render() {
        const min = this.props.valor ? Math.min(... this.props.valor) : 0
        const max = this.props.valor ? Math.max(... this.props.valor) : 0
        const Decorator = ({ x, y, data }) => {
            return data.map((value, index) => (
                <Svg height='0' width='0' key={index} translateX={x(index)} translateY={y(value)}>
                    {this.props.data ?
                        <Form style={{
                            flexDirection: 'column', marginTop: -26, alignItems: 'center', marginLeft: -40,
                            width: 40 + (((this.props.tipo).length || 0) * 10), height: 25, justifyContent: 'center'
                        }}>

                            <Text style={index == 0 || index == this.props.valor.length - 1 ? { color: 'transparent' } :
                                { color: this.props.color, fontSize: 18, fontWeight: 'bold' }}
                            >{value > 0 ?
                                (this.props.ideal.max + value).toFixed(1) + this.props.tipo
                                : (this.props.ideal.min + value).toFixed(1) + this.props.tipo}</Text>

                            {value > 0 ?
                                <Text style={index == 0 || index == this.props.valor.length - 1 ? { color: 'transparent' } :
                                    { color: this.estilo.cor.red, fontSize: 15, fontWeight: 'bold', textAlign: 'center', marginLeft: -5 }}>
                                    <FeatherIcon name='arrow-up'
                                        style={index == 0 || index == this.props.valor.length - 1 ?
                                            { color: 'transparent' } :
                                            { color: this.estilo.cor.red, fontSize: 18 }} />
                                    {value}</Text>
                                :
                                <Text style={index == 0 || index == this.props.valor.length - 1 ? { color: 'transparent' } :
                                    { color: this.estilo.cor.red, fontSize: 15, fontWeight: 'bold', textAlign: 'center', marginLeft: -5 }}>
                                    <FeatherIcon name='arrow-down'
                                        style={index == 0 || index == this.props.valor.length - 1 ?
                                            { color: 'transparent' } :
                                            { color: this.estilo.cor.red, fontSize: 18 }} />
                                    {value * -1}</Text>
                            }
                            <Text style={index == 0 || index == this.props.valor.length - 1 ? { color: 'transparent' } :
                                {
                                    color: this.estilo.cor.white, fontSize: 16, marginTop: 30, fontWeight: 'bold', textAlign: 'center',
                                    backgroundColor: this.estilo.cor.gray, padding: 2, borderRadius: 8, width: 65
                                }}
                            >{new Date(this.props.data[index]).toLocaleTimeString().substring(0, 5) + ' h'}</Text>
                        </Form>
                        : null}
                </Svg>
            ))
        }

        const Line = ({ line }) => (
            <Path y={-2} d={line} stroke={this.props.color} fill={'none'} strokeWidth={5} strokeDasharray={[5, 5]} />
        )

        // const EixoX = ({ x, y, data }) => {
        //     return data.map((value, index) => (
        //         <Svg key={index} translateX={x(index)} translateY={y(min)}>
        //             {this.props.data ?
        //                 <Form style={{
        //                     flexDirection: 'column', marginTop: -38, marginLeft: -20,
        //                     width: 50, height: 25, justifyContent: 'center'
        //                 }}>
        //                     <Text style={index == 0 || index == this.props.valor.length - 1 ? { color: 'transparent' } :
        //                         { color: this.props.color, fontSize: 16, paddingBottom: 2, marginLeft: -10, fontWeight: 'bold' }}
        //                     >{new Date(this.props.data[index]).toLocaleTimeString().substring(0, 5) + ' h'}</Text>
        //                 </Form> : null}
        //         </Svg>
        //     ))
        // }

        return (
            <ScrollView showsHorizontalScrollIndicator={false}
                horizontal={true} style={{ height: 250 }}>
                <View style={{ width: this.props.data.length * 70, justifyContent: 'flex-end', backgroundColor: this.estilo.cor.white }}>
                    <AreaChart
                        style={{
                            height: '100%', paddingTop: 50, paddingBottom: 30,
                            marginBottom: -1, marginRight: -1,
                            marginTop: min == 0 && max == 0 ? 20 : 0
                        }}
                        data={this.props.valor}
                        curve={shape.curveNatural}
                        contentInset={{ left: -20, right: -20, top: 0 }}
                        yMin={min != 0 ? min - 1 : min}
                        yMax={max - min >= 20 ? max + 10 : max + 1}
                    >
                        <Line />
                        <Decorator />
                    </AreaChart>
                    {/* <AreaChart
                        style={{ height: 50 }}
                        data={this.props.valor}
                        contentInset={{ left: -20, right: -20 }}
                    >
                        <EixoX />
                    </AreaChart> */}
                </View>
            </ScrollView>
        )
    }
}