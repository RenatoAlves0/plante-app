import React, { Component } from 'react'
import { Dimensions, ScrollView } from 'react-native'
import { Form, Text, View } from 'native-base'
import estilo from '../assets/Estilo'
import { AreaChart, XAxis } from 'react-native-svg-charts'
import { Path, Svg } from 'react-native-svg'
import * as shape from 'd3-shape'

export default class Chart extends Component {
    constructor(props) {
        super(props)
        this.props.max_value = 0
        this.estilo = new estilo()
        this.state = {
            loaded: false,
            // this.props.data_array
            // this.props.label_array
            // this.props.type_label
            // this.props.min_value
            // this.props.max_value
            // this.props.color
        }
    }

    componentWillReceiveProps() {
    }

    async load() {
    }

    render() {
        const Decorator = ({ x, y, data }) => {
            return data.map((value, index) => (
                <Svg key={index} translateX={x(index)} translateY={y(value)}>
                    <Text style={[index == 0 || index == 13 ? { color: 'transparent' } :
                        { color: this.props.color }, {
                        marginTop: -35, marginLeft: -20, fontWeight: 'bold', width: 43,
                        fontSize: 17, textAlign: 'center'
                    }]}>{value}{this.props.type_label}</Text>
                </Svg>
            ))
        }
        const Line = ({ line }) => (
            <Path d={line} stroke={this.props.color + '77'} fill={'none'} strokeWidth={10} />
        )
        return (
            <ScrollView horizontal={true} style={{
                maxHeight: 45 + this.props.max_value * 3 || 0
            }}>
                <View style={{ width: Dimensions.get('window').width * 1.7 }}>
                    <AreaChart
                        style={{ height: this.props.max_value * 3 || 0 }}
                        data={this.props.data_array}
                        svg={{ fill: this.props.color }}
                        curve={shape.curveNatural}
                        contentInset={{ left: -20, right: -22 }}
                        yMin={this.props.min_value - 1}
                        yMax={this.props.max_value + 10}
                    >
                        <Line />
                        <Decorator />
                    </AreaChart>
                    <XAxis
                        style={{
                            marginLeft: -30, marginRight: -18, height: 50, paddingTop: 18,
                            backgroundColor: this.props.color, marginTop: -1
                        }}
                        data={this.props.label_array}
                        formatLabel={(index) => {
                            if (index == 0 || index == 13) return ''
                            return this.props.label_array[index] + 'h'
                        }}
                        contentInset={{ left: 10, right: 0 }}
                        svg={{ fontSize: 15, fill: this.estilo.cor.white, fontWeight: 'bold' }}
                        numberOfTicks={12}
                    />
                </View>
            </ScrollView>
        )
    }
}