import React, { Component } from 'react'
import { Dimensions, ScrollView } from 'react-native'
import { Form, Text, View, Button } from 'native-base'
import estilo from '../assets/Estilo'
import { AreaChart, XAxis } from 'react-native-svg-charts'
import { Path, Svg, Circle } from 'react-native-svg'
import * as shape from 'd3-shape'

export default class ChartWeek extends Component {
    constructor(props) {
        super(props)
        this.props.max_value = 0
        this.estilo = new estilo()
        this.state = {
            loaded: false
        }
    }

    render() {
        const min = this.props.data_array ? Math.min(... this.props.data_array) : 0
        const max = this.props.data_array ? Math.max(... this.props.data_array) : 0
        const Decorator = ({ x, y, data }) => {
            return data.map((value, index) => (
                <Svg key={index} translateX={x(index)} translateY={y(value)}>
                    <Circle cx={x(index)} cy={y(value)} r={4} y={-5} fill={this.props.color} />
                    {this.props.label_data ?
                        <Form style={{
                            flexDirection: (this.props.label_data).length > 3 ? 'column' : 'row',
                            marginTop: (this.props.label_data).length > 3 ? -45 : -35,
                            alignItems: this.props.label_data == 'º' ? 'flex-start' : 'baseline',
                            marginLeft: (this.props.label_data).length > 3 ? -20 : -25,
                            width: 40 + (((this.props.label_data).length || 0) * 10), height: 25, justifyContent: 'center'
                        }}>
                            <Text style={index == 0 || index == 6 ? { color: 'transparent' } :
                                { color: this.props.color + this.props.opacity, fontSize: 17, fontWeight: 'bold' }}>{value}</Text>
                            <Text style={index == 0 || index == 6 ? { color: 'transparent' } :
                                { color: this.props.color + this.props.opacity, fontSize: (this.props.label_data).length > 1 ? 12 : 15, paddingBottom: 2 }}>{this.props.label_data || ''}</Text>
                        </Form> : null}
                </Svg>
            ))
        }
        const Line = ({ line }) => (
            <Path y={-5} d={line} stroke={this.props.color + '77'} fill={'none'} strokeWidth={2} strokeDasharray={[0, 0]} />
        )
        return (
            <View style={{ width: Dimensions.get('window').width - 80 }}>
                {this.props.data_array ?
                    <AreaChart
                        style={{ height: 70, marginRight: -1 }}
                        data={this.props.data_array}
                        svg={{ fill: 'transparent' }}
                        curve={shape.curveNatural}
                        contentInset={{ left: -40, right: -40 }}
                        yMin={min - 1}
                        yMax={max - min >= 20 ? max + 10 : max + 1}
                    >
                        <Line />
                        <Decorator />
                    </AreaChart> : null}
                {this.props.label_descricao_array ?
                    <XAxis
                        style={{
                            marginLeft: -50, marginRight: -38,
                            height: 20, backgroundColor: 'transparent'
                        }}
                        data={this.props.label_descricao_array}
                        formatLabel={(index) => {
                            if (index == 0 || index == 6) return ''
                            if (this.props.label_descricao_array[index]) {
                                if (this.props.label_array_label_value)
                                    return this.props.label_descricao_array[index].value + this.props.label_array_label_value
                                        || this.props.label_descricao_array[index] + this.props.label_array_label_value
                                return this.props.label_descricao_array[index].value
                                    || this.props.label_descricao_array[index] + this.props.label_array_label
                            }
                        }}
                        contentInset={{ left: 10, right: 0 }}
                        svg={this.props.label_descricao_array_big ?
                            { skewY: -15, translateY: 10, fontSize: 15, fill: this.estilo.cor.white }
                            : this.props.label_descricao_array_bold ? { fontSize: 15, fill: this.estilo.cor.white, fontWeight: 'bold' }
                                : { fontSize: 15, fill: this.estilo.cor.white }
                        }
                        numberOfTicks={12}
                    /> : null}
                {this.props.label_array ? <XAxis
                    style={{
                        marginLeft: -50, marginRight: -38, height: 20,
                        backgroundColor: 'transparent', marginTop: 10
                    }}
                    data={this.props.label_array}
                    formatLabel={(index) => {
                        if (index == 0 || index == 6) return ''
                        if (this.props.label_array[index])
                            return this.props.label_array[index].value.substring(0, 3)
                                || this.props.label_array[index].substring(0, 3)
                    }}
                    contentInset={{ left: 10, right: 0 }}
                    svg={{ fontSize: 16, fill: this.estilo.cor.white }}
                    numberOfTicks={12}
                /> : null}
            </View>
        )
    }
}