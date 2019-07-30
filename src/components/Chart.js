import React, { Component } from 'react'
import { Dimensions, ScrollView } from 'react-native'
import { Form, Text, View, Button } from 'native-base'
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
            loaded: false
        }
        this.tam = (((this.props.label_data).length || 0) * 10)
    }

    componentWillReceiveProps() {
    }

    async load() {
    }

    render() {
        const Decorator = ({ x, y, data }) => {
            return data.map((value, index) => (
                <Svg key={index} translateX={x(index)} translateY={y(value)}>
                    <Form style={{
                        flexDirection: 'row', marginTop: -40, alignItems: this.props.label_data == 'º' ? 'flex-start' : 'baseline',
                        marginLeft: (this.props.label_data).length > 3 ? -35 : -25,
                        width: 40 + this.tam, height: 25, justifyContent: 'center'
                    }}>
                        <Text style={[index == 0 || index == 13 ? { color: 'transparent' } :
                            { color: this.props.color }, { fontWeight: 'bold', fontSize: 18 }]}>{value}</Text>
                        <Text style={[index == 0 || index == 13 ? { color: 'transparent' } :
                            { color: this.props.color }, { fontSize: 15, paddingBottom: 2 }]}>{this.props.label_data || ''}</Text>
                    </Form>
                </Svg>
            ))
        }
        const Line = ({ line }) => (
            <Path y={-5} d={line} stroke={this.props.color + '77'} fill={'none'} strokeWidth={10} />
        )
        return (
            <ScrollView showsHorizontalScrollIndicator={false}
                horizontal={true} style={{ height: '100%' }}>
                <View style={{ width: (this.tam * 7) + Dimensions.get('window').width * 2 }}>
                    <AreaChart
                        style={{
                            height: this.props.label_descricao_array_big ? '55%' :
                                this.props.label_descricao_array ? '60%' : '80%',
                            marginRight: -1
                        }}
                        data={this.props.data_array}
                        svg={{ fill: this.props.color }}
                        curve={shape.curveNatural}
                        contentInset={{ left: -40, right: -40 }}
                        yMin={this.props.min_value}
                        yMax={this.props.max_value + 20}
                    >
                        <Line />
                        <Decorator />
                    </AreaChart>
                    {this.props.label_descricao_array ?
                        <XAxis
                            style={{
                                marginLeft: -50, marginRight: -38, paddingTop: 18,
                                height: this.props.label_descricao_array_big ? '25%' : '20%',
                                backgroundColor: this.props.color, marginTop: -1
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
                            marginLeft: -50, marginRight: -38, paddingTop: 18, height: 50,
                            backgroundColor: this.props.color
                        }}
                        data={this.props.label_array}
                        formatLabel={(index) => {
                            if (index == 0 || index == 13 ||
                                this.props.hora_atual == index) return ''
                            return this.props.label_array[index] + 'h'
                        }}
                        contentInset={{ left: 10, right: 0 }}
                        svg={{ fontSize: 15, fill: this.estilo.cor.white + '77' }}
                        numberOfTicks={12}
                    />
                    <XAxis
                        style={{
                            marginLeft: -50, marginRight: -38, paddingTop: 18, height: 50,
                            backgroundColor: 'transparent', marginTop: -50
                        }}
                        data={this.props.label_array}
                        formatLabel={(index) => {
                            if (this.props.hora_atual == index) return this.props.label_array[index] + 'h'
                            return ''
                        }}
                        contentInset={{ left: 10, right: 0 }}
                        svg={{ fontSize: 15, fill: this.estilo.cor.white }}
                        numberOfTicks={12}
                    />
                </View>
            </ScrollView >
        )
    }
}