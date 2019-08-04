import React, { Component } from 'react'
import { Dimensions, ScrollView } from 'react-native'
import { Form, Text, View, Button } from 'native-base'
import estilo from '../assets/Estilo'
import { AreaChart, XAxis } from 'react-native-svg-charts'
import { Path, Svg, Circle } from 'react-native-svg'
import * as shape from 'd3-shape'

export default class Chart extends Component {
    constructor(props) {
        super(props)
        this.props.max_value = 0
        this.estilo = new estilo()
        this.state = {
            loaded: false
        }
        this.tam = (((this.props.label_data).length || 0) * 10)
    }

    componentWillReceiveProps() {
    }

    async load() {
    }

    render() {
        const min = this.props.data_array ? Math.min(... this.props.data_array) : 0
        const max = this.props.data_array ? Math.max(... this.props.data_array) : 0
        const Decorator = ({ x, y, data }) => {
            return data.map((value, index) => (
                <Svg key={index} translateX={x(index)} translateY={y(value)}>
                    <Circle cx={x(index)} cy={y(value)} r={4} y={-10} fill={this.estilo.cor.white} />
                    <Form style={{
                        flexDirection: 'row', marginTop: -40, alignItems: this.props.label_data == 'º' ? 'flex-start' : 'baseline',
                        marginLeft: (this.props.label_data).length > 3 ? -35 : -25,
                        width: 40 + this.tam, height: 25, justifyContent: 'center'
                    }}>
                        <Text style={[index == 0 || index == 13 ? { color: 'transparent' } :
                            { color: this.estilo.cor.white }, { fontWeight: 'bold', fontSize: 17 }]}>{value}</Text>
                        <Text style={[index == 0 || index == 13 ? { color: 'transparent' } :
                            { color: this.estilo.cor.white }, { fontSize: (this.props.label_data).length > 3 ? 14 : 15, paddingBottom: 2 }]}>{this.props.label_data || ''}</Text>
                    </Form>
                </Svg>
            ))
        }
        const Line = ({ line }) => (
            <Path y={-10} d={line} stroke={this.estilo.cor.white} fill={'none'} strokeWidth={2} strokeDasharray={[4, 4]} />
        )
        return (
            <View style={{
                height: (50 * (this.props.max_value - this.props.min_value) || 0) + 50
                    + (this.props.label_descricao_array ? this.props.label_descricao_array_big ? 50 : 40 : 0)
                    + (!(this.props.max_value - this.props.min_value) && this.props.label_descricao_array ? 70 : 0),

                minHeight: this.props.label_descricao_array ? 500 : 70
            }} >
                <ScrollView showsHorizontalScrollIndicator={false}
                    horizontal={true} style={{ height: '100%' }}>
                    <View style={{ width: (this.tam * 7) + Dimensions.get('window').width * 2 }}>
                        <AreaChart
                            style={{
                                height: this.props.max_value ? (50 * (this.props.max_value - this.props.min_value)) : 70,
                                marginRight: -1, marginBottom: -2, borderRadius: 10, minHeight: 70
                            }}
                            data={this.props.data_array}
                            svg={{ fill: this.props.color }}
                            curve={shape.curveNatural}
                            contentInset={{ left: -40, right: -40, top: 40 }}
                            yMin={min - 1}
                            yMax={max - min >= 20 ? max + 10 : max + 1}
                        >
                            <Line />
                            <Decorator />
                        </AreaChart>
                        {this.props.label_descricao_array ?
                            <XAxis
                                style={{
                                    marginLeft: -50, marginRight: -38,
                                    paddingTop: this.props.label_descricao_array_big ? 10 : 18,
                                    height: this.props.label_descricao_array_big ? 51 : 41,
                                    backgroundColor: '', marginBottom: -1
                                }}
                                data={this.props.label_descricao_array}
                                formatLabel={(index) => {
                                    if (index == 0 || index == 13) return ''
                                    return this.props.label_descricao_array[index].value
                                        || this.props.label_descricao_array[index] + this.props.label_array_label
                                }}
                                contentInset={{ left: 10, right: 0 }}
                                svg={this.props.label_descricao_array_big ?
                                    { skewY: -15, translateY: 10, fontSize: 15, fill: this.estilo.cor.white }
                                    : { fontSize: 15, fill: this.estilo.cor.white }
                                }
                                numberOfTicks={12}
                            /> : null}
                        <XAxis
                            style={{
                                marginLeft: -50, marginRight: -38, paddingTop: 18, height: 52,
                                borderRadius: 20
                            }}
                            data={this.props.label_array}
                            formatLabel={(index) => {
                                if (index == 0 || index == 13) return ''
                                return this.props.label_array[index] + 'h'
                            }}
                            contentInset={{ left: 10, right: 0 }}
                            svg={{ fontSize: 15, fill: this.estilo.cor.white }}
                            numberOfTicks={12}
                        />
                    </View>
                </ScrollView>
            </View>
        )
    }
}