import React, { Component } from 'react'
import { Dimensions, ScrollView } from 'react-native'
import { Form, View, Text } from 'native-base'
import estilo from '../assets/Estilo'
import { AreaChart, XAxis } from 'react-native-svg-charts'
import { Path, Svg } from 'react-native-svg'
import * as shape from 'd3-shape'

export default class ChartToday extends Component {
    constructor(props) {
        super(props)
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
                <Svg height='0' width='0' key={index} translateX={x(index)} translateY={y(value)}>
                    {this.props.label_data ?
                        <Form style={{
                            flexDirection: (this.props.label_data).length > 3 ? 'column' : 'row',
                            marginTop: (this.props.label_data).length > 3 ? -45 : -35,
                            alignItems: this.props.label_data == 'º' ? 'flex-start' : 'baseline',
                            marginLeft: (this.props.label_data).length > 3 ? -20 : -25,
                            width: 40 + (((this.props.label_data).length || 0) * 10), height: 25, justifyContent: 'center'
                        }}>
                            <Text style={index == 0 || index == 13 ? { color: 'transparent' } :
                                { color: this.props.color, fontSize: 18, fontWeight: 'bold' }}>{value}</Text>
                            <Text style={index == 0 || index == 13 ? { color: 'transparent' } :
                                { color: this.props.color, fontSize: (this.props.label_data).length > 1 ? 14 : 15, paddingBottom: 2 }}>{this.props.label_data || ''}</Text>
                        </Form> : null}
                </Svg>
            ))
        }
        const Line = ({ line }) => (
            <Path y={-2} d={line} stroke={this.props.color + '77'} fill={'none'} strokeWidth={5} strokeDasharray={[0, 0]} />
        )
        return (
            <ScrollView showsHorizontalScrollIndicator={false}
                horizontal={true} style={{
                    height: ((max - min) == 0 ? 100 : 250)
                        + (this.props.label_descricao_array ? this.props.label_descricao_array_big ? 50 : 40 : 0)
                        + (!(max - min) && this.props.label_descricao_array ? 70 : 0),
                }}>
                <View style={{ width: 120 + Dimensions.get('window').width * 2, justifyContent: 'flex-end', backgroundColor: this.estilo.cor.white }}>
                    {this.props.data_array ?
                        <AreaChart
                            style={{ height: max - min == 0 ? 20 : 200, marginRight: -1, marginBottom: -1, marginTop: min == 0 && max == 0 ? 20 : 0 }}
                            data={this.props.data_array}
                            svg={{ fill: this.props.color }}
                            curve={shape.curveNatural}
                            contentInset={{ left: -20, right: -20, top: 40 }}
                            yMin={min != 0 ? min - 1 : min}
                            yMax={max - min >= 20 ? max + 10 : max + 1}
                        >
                            <Line />
                            <Decorator />
                        </AreaChart> : null}
                    {this.props.label_descricao_array ?
                        <XAxis
                            style={{
                                marginLeft: -40, marginRight: -30, marginBottom: -1,
                                paddingTop: this.props.label_descricao_array_big ? 10 : 18,
                                height: this.props.label_descricao_array_big ? 51 : 41,
                                backgroundColor: this.props.color, marginBottom: -1
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
                    {this.props.label_array ? <XAxis
                        style={{
                            marginLeft: -40, marginRight: -30, height: 52, marginBottom: -1,
                            backgroundColor: this.props.color, paddingTop: 18
                        }}
                        data={this.props.label_array}
                        formatLabel={(index) => {
                            if (index == 0 || index == 13) return ''
                            return this.props.label_array[index] + 'h'
                        }}
                        contentInset={{ left: 10, right: 0 }}
                        svg={{ fontSize: 16, fill: this.props.font_color ? this.props.font_color : this.estilo.cor.white }}
                        numberOfTicks={12}
                    /> : null}
                </View>
            </ScrollView>
        )
    }
}