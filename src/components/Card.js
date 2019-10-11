import React, { Component } from 'react'
import { Text, Button, Icon, Form } from 'native-base'
import estilo from '../assets/Estilo'
import LinearGradient from 'react-native-linear-gradient'

export default class Card extends Component {
    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.state = {
            alerta: false
        }
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
                {this.props.item.action ?
                    <Button style={this.estilo.buttom_item_dash} onPress={() => this.props.item.method ? this.props.item.method() : null}>
                        {this.props.item.icon_name && this.props.item.icon_type ? <Icon name={this.props.item.icon_name} type={this.props.item.icon_type} style={this.estilo.icon_item_dash} /> : null}
                        {this.props.item.value ? <Text uppercase={false} style={{ fontSize: 23, color: 'white' }} >{this.props.item.value}{this.props.item.value_sufix}</Text> : null}
                        {this.props.item.sub_value ? <Text uppercase={false} style={{ color: this.estilo.cor.white + '77', fontSize: 15 }} >{this.props.item.sub_value_prefix}{this.props.item.sub_value}{this.props.item.sub_value_sufix}</Text> : null}
                    </Button>
                    : <Form style={this.estilo.buttom_item_dash}>
                        <Form style={[this.state.alerta ? {
                            position: 'absolute', width: 160, height: 190, paddingTop: 30, alignItems: 'center',
                            backgroundColor: this.estilo.cor.white, top: 5, right: 5, borderRadius: 16
                        } : this.estilo.hide]}>
                            <Text style={{ fontSize: 30, textAlign: 'center', fontWeight: 'bold', color: this.props.item.cor1 }}>{this.props.item.alerta}</Text>
                            <Text style={{ fontSize: 18, color: this.estilo.cor.gray_solid }}>do ideal</Text>
                        </Form>
                        {this.props.item.alerta ? <Button style={{
                            position: 'absolute', top: 0, right: 0, width: 30, height: 30,
                            backgroundColor: this.estilo.cor.red_vivid, elevation: 7,
                            borderTopRightRadius: 20, borderBottomLeftRadius: 10
                        }}
                            onPress={() => this.setState({ alerta: !this.state.alerta })}><Text /></Button> : null}
                        {!this.state.alerta && this.props.item.icon_name && this.props.item.icon_type ? <Icon name={this.props.item.icon_name} type={this.props.item.icon_type} style={this.estilo.icon_item_dash} /> : null}
                        {!this.state.alerta && this.props.item.value ? <Text uppercase={false} style={{ fontSize: 23, color: 'white' }} >{this.props.item.value}{this.props.item.value_sufix}</Text> : null}
                        {!this.state.alerta && this.props.item.sub_value ? <Text uppercase={false} style={{ color: this.estilo.cor.white + '77', fontSize: 15 }} >{this.props.item.sub_value_prefix}{this.props.item.sub_value}{this.props.item.sub_value_sufix}</Text> : null}

                    </Form>}
            </LinearGradient>
        )
    }
}

