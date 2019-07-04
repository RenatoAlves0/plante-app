import React, { Component } from 'react'
import { Icon, View, Text } from 'native-base'
import estilo from '../assets/Estilo'

export default class ListEmpty extends Component {
    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.state = {
            index: undefined
        }
        this.icons = [
            { name: 'flower', type: 'Entypo' },
            { name: 'cloud', type: 'Entypo' },
            { name: 'grain', type: 'MaterialIcons' },
            { name: 'wb-sunny', type: 'MaterialIcons' },
            { name: 'lab-flask', type: 'Entypo' }
        ]
    }

    componentWillMount() {
        this.load()
    }

    componentWillReceiveProps() {
        this.load()
    }

    async load() {
        this.setState({ index: this.props.index })
    }

    render() {
        return (
            <View style={{ flex: 1, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                <Icon name={this.icons[this.state.index].name} type={this.icons[this.state.index].type}
                    style={{ color: this.estilo.cor.gray_medium, fontSize: 60 }} />
                <Text style={{
                    fontSize: 20, fontWeight: 'bold', color: this.estilo.cor.gray_medium,
                    marginTop: 20
                }}>
                    Lista vazia !
            </Text>
            </View>
        )
    }
}