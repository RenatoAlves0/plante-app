import React, { Component } from 'react'
import { Text, Button, Icon, Form } from 'native-base'
import estilo from '../assets/Estilo'
import LinearGradient from 'react-native-linear-gradient'
import { translate } from '../i18n/locales'

export default class Card extends Component {
    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.state = {
            alerta: false
        }
    }

    componentDidMount() {
        this.load()
    }

    componentDidUpdate() {
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
                        {this.state.alerta ? <Form style={{
                            position: 'absolute', width: 160, height: 190, justifyContent: 'center', alignItems: 'center',
                            backgroundColor: this.estilo.cor.white, top: 5, right: 5, borderRadius: 16
                        }}>
                            <Text style={{ fontSize: 23, textAlign: 'center', color: this.props.item.cor1 }}>{this.props.item.alerta[0] == '-' ? this.props.item.alerta.replace('-', '') + '\n' + translate('abaixo') :
                                this.props.item.alerta + '\n' + translate('acima')}</Text>
                            <Text style={{ fontSize: 18, color: this.estilo.cor.gray_solid }}>{translate('do_ideal')}</Text>
                        </Form> : null}
                        {this.props.item.alerta ? <Button style={{
                            position: 'absolute', top: 10, right: 10, height: 25,
                            backgroundColor: this.state.alerta ? this.props.item.cor2 : this.estilo.cor.red_vivid, width: 25,
                            borderRadius: 20, elevation: 7
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

