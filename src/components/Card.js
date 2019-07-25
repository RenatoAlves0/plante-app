import React, { Component } from 'react'
import { Text, Button, Icon } from 'native-base'
import estilo from '../assets/Estilo'
import LinearGradient from 'react-native-linear-gradient'

export default class Card extends Component {
    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.state = {}
    }

    componentWillMount() {
        this.load()
    }

    componentWillReceiveProps() {
        this.load()
    }

    async load() { }

    render() {
        return (
            <LinearGradient colors={[this.props.item.cor1, this.props.item.cor2]} useAngle={true}
                angle={45} angleCenter={{ x: 0.5, y: 0.5 }} style={[this.estilo.item_dash]}>
                <Button style={this.estilo.buttom_item_dash} onPress={() => this.props.item.method ? this.props.item.method() : null}>
                    {this.props.item.icon_name && this.props.item.icon_type ? <Icon name={this.props.item.icon_name} type={this.props.item.icon_type} style={this.estilo.icon_item_dash} /> : null}
                    {this.props.item.value ? <Text uppercase={false} style={{ fontSize: 23, color: 'white' }} >{this.props.item.value}{this.props.item.value_sufix}</Text> : null}
                    {this.props.item.sub_value ? <Text uppercase={false} style={{ color: this.estilo.cor.white + '77', fontSize: 15 }} >{this.props.item.sub_value_prefix}{this.props.item.sub_value}{this.props.item.sub_value_sufix}</Text> : null}
                </Button>
            </LinearGradient>
        )
    }
}

