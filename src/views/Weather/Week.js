import React, { Component } from 'react'
import { StatusBar, Dimensions } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { Text, Form, ListItem, Row, Spinner, Content, Container, View, Button, Col, Header, Left, Body, Right } from 'native-base'
import estilo from '../../assets/Estilo'
import FeatherIcon from 'react-native-vector-icons/Feather'
import axios from 'axios'
import rnfs from 'react-native-fs'
import Chart from '../../components/ChartWeek'
import weatherWeek from '../../services/WeatherWeek'

export default class Week extends Component {
    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.state = {
            loaded: false,
            weather_cor: this.estilo.cor.purple,
            sol: 0,
            lua: 0,
            turno: 0,
            sensacao_termica: 0,
            weather_atual: 'temperatura',
            temperatura_tipo: 'temperatura',
            sol_tipo: 0,
            variavel_ambiental: 'Temperatura',
            weather_week: {},
            dia_semana_aux: undefined,
            hora_aux: undefined,
            render: false
        }
        this.card_weather = [
            { index: 0, icon: 'thermometer', variavel_ambiental: 'Temperatura', cor: this.estilo.cor.purple },
            { index: 1, icon: 'sun', variavel_ambiental: 'Dia', cor: this.estilo.cor.orange },
            { index: 2, icon: 'moon', variavel_ambiental: 'Noite', cor: this.estilo.cor.blue_dark },
        ]

        this.weather = [
            { key: 'temperatura' || 'sensacao_termica', icon: 'thermometer', variavel_ambiental: 'Temperatura', cor: this.estilo.cor.purple },
            // { key: 'sensacao_termica', icon: 'thermometer', variavel_ambiental: 'Sensação térmica', cor: this.estilo.cor.purple },
            { key: 'chuva', icon: 'cloud-drizzle', variavel_ambiental: 'Chuva', cor: this.estilo.cor.blue },
            { key: 'nuvem', icon: 'cloud', variavel_ambiental: 'Nuvens', cor: this.estilo.cor.blue_light },
            { key: 'vento', icon: 'wind', variavel_ambiental: 'Vento', cor: this.estilo.cor.greenish_medium },
            { key: 'sol', icon: 'sun', variavel_ambiental: 'Sol', cor: this.estilo.cor.orange },
            { key: 'lua', icon: 'moon', variavel_ambiental: 'Lua', cor: this.estilo.cor.blue_dark },
        ]
    }

    async componentWillMount() {
        await this.setState({ weather_week: await weatherWeek.get() })
        this.setState({ render: true })
        this.render()
    }

    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: this.estilo.cor.white, elevation: 0 }}>
                    <Button rounded transparent onPress={() => Actions.pop()}>
                        <FeatherIcon name='arrow-left' style={{ color: this.estilo.cor.gray_solid, fontSize: 22, marginHorizontal: 5 }} />
                    </Button>
                    <Body>
                        <Text style={{ color: this.estilo.cor.gray_solid, fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>Previsão 5 dias</Text>
                    </Body>
                    <Button disabled rounded transparent onPress={() => Actions.pop()}>
                        <FeatherIcon name='arrow-left' style={{ color: 'transparent', fontSize: 22, marginHorizontal: 5 }} />
                    </Button>
                </Header>
                <StatusBar backgroundColor={this.estilo.cor.white} barStyle='dark-content' />

                {/* Opções (abaixo) */}
                {/* Sensação Térmica */}
                <Form style={this.state.weather_atual == 'temperatura' && this.state.temperatura_tipo == 'sensacao_termica' ?
                    { backgroundColor: this.estilo.cor.gray_white_light, flexDirection: 'row', borderRadius: 50, marginTop: 40, alignSelf: 'center' } : this.estilo.hide} >
                    <Button rounded transparent
                        onPress={() => this.setState({ sensacao_termica: 0 })}>
                        {this.state.sensacao_termica == 0 ?
                            <Text uppercase={false} style={{ fontSize: 17, color: this.estilo.cor.gray_solid, borderRightWidth: 1, borderRightColor: this.estilo.cor.gray_solid }}>no Sol</Text> :
                            <FeatherIcon name='sun'
                                style={{ fontSize: 20, marginHorizontal: 15, color: this.estilo.cor.gray_medium }} />}
                    </Button>
                    <Button rounded transparent
                        onPress={() => this.setState({ sensacao_termica: 1 })}>
                        {this.state.sensacao_termica == 1 ?
                            <Text uppercase={false} style={{ fontSize: 17, color: this.estilo.cor.gray_solid, borderLeftWidth: 1, borderLeftColor: this.estilo.cor.gray_solid }}>na Sombra</Text> :
                            <FeatherIcon name='cloud'
                                style={{ fontSize: 20, marginHorizontal: 15, color: this.estilo.cor.gray_medium }} />}
                    </Button>
                </Form>

                {/* Dia / Noite */}
                <Form style={this.state.weather_atual == 'temperatura' || this.state.weather_atual == 'sol' || this.state.weather_atual == 'lua' ? this.estilo.hide :
                    { backgroundColor: this.estilo.cor.gray_white_light, flexDirection: 'row', borderRadius: 50, marginTop: 40, alignSelf: 'center' }}>
                    <Button rounded transparent
                        onPress={() => this.setState({ turno: 0 })}>
                        {this.state.turno == 0 ?
                            <Text uppercase={false} style={{ fontSize: 17, color: this.estilo.cor.gray_solid, borderRightWidth: 1, borderRightColor: this.estilo.cor.gray_solid }}>de Dia</Text> :
                            <FeatherIcon name='sun'
                                style={{ fontSize: 20, marginHorizontal: 15, color: this.estilo.cor.gray_medium }} />}
                    </Button>
                    <Button rounded transparent
                        onPress={() => this.setState({ turno: 1 })}>
                        {this.state.turno == 1 ?
                            <Text uppercase={false} style={{ fontSize: 17, color: this.estilo.cor.gray_solid, borderLeftWidth: 1, borderLeftColor: this.estilo.cor.gray_solid }}>de Noite</Text> :
                            <FeatherIcon name='moon'
                                style={{ fontSize: 20, marginHorizontal: 15, color: this.estilo.cor.gray_medium }} />}
                    </Button>
                </Form>

                {/* Sol */}
                <Form style={this.state.weather_atual == 'sol' && this.state.sol_tipo == 0 ?
                    { backgroundColor: this.estilo.cor.gray_white_light, flexDirection: 'row', borderRadius: 50, marginTop: 40, alignSelf: 'center' } : this.estilo.hide}>
                    <Button rounded transparent
                        onPress={() => this.setState({ sol: 0 })}>
                        {this.state.sol == 0 ?
                            <Text uppercase={false} style={{ fontSize: 17, color: this.estilo.cor.gray_solid, borderRightWidth: 1, borderRightColor: this.estilo.cor.gray_solid }}>Nascer</Text> :
                            <FeatherIcon name='sunrise'
                                style={{ fontSize: 20, marginHorizontal: 15, color: this.estilo.cor.gray_medium }} />}
                    </Button>
                    <Button rounded transparent
                        onPress={() => this.setState({ sol: 1 })}>
                        {this.state.sol == 1 ?
                            <Text uppercase={false} style={{ fontSize: 17, color: this.estilo.cor.gray_solid, borderLeftWidth: 1, borderLeftColor: this.estilo.cor.gray_solid }}>Por</Text> :
                            <FeatherIcon name='sunset'
                                style={{ fontSize: 20, marginHorizontal: 15, color: this.estilo.cor.gray_medium }} />}
                    </Button>
                </Form>

                {/* Lua */}
                <Form style={this.state.weather_atual == 'lua' ?
                    { backgroundColor: this.estilo.cor.gray_white_light, flexDirection: 'row', borderRadius: 50, marginTop: 40, alignSelf: 'center' } : this.estilo.hide}>
                    <Button rounded transparent
                        onPress={() => this.setState({ lua: 0 })}>
                        {this.state.lua == 0 ?
                            <Text uppercase={false} style={{ fontSize: 17, color: this.estilo.cor.gray_solid, borderRightWidth: 1, borderRightColor: this.estilo.cor.gray_solid }}>Nascer</Text> :
                            <FeatherIcon name='arrow-up'
                                style={{ fontSize: 20, marginHorizontal: 15, color: this.estilo.cor.gray_medium }} />}
                    </Button>
                    <Button rounded transparent
                        onPress={() => this.setState({ lua: 1 })}>
                        {this.state.lua == 1 ?
                            <Text uppercase={false} style={{ fontSize: 17, color: this.estilo.cor.gray_solid, borderLeftWidth: 1, borderLeftColor: this.estilo.cor.gray_solid }}>Por</Text> :
                            <FeatherIcon name='arrow-down'
                                style={{ fontSize: 20, marginHorizontal: 15, color: this.estilo.cor.gray_medium }} />}
                    </Button>
                </Form>
                {/* Opções (acima) */}

                <View style={{
                    flex: 1, width: Dimensions.get('screen').width,
                    alignItems: 'center', justifyContent: 'flex-end'
                }}>
                    {/* Gŕaficos (abaixo) */}
                    {/* Temperatura */}
                    <Form style={this.state.weather_atual == 'temperatura' && this.state.temperatura_tipo == 'temperatura' ? null : this.estilo.hide}>
                        <Chart data_array={this.state.weather_week.temperatura_maxima}
                            opacity={''}
                            color={this.estilo.cor.purple} label_data='º' />
                        <Chart data_array={this.state.weather_week.temperatura_minima}
                            label_array={this.state.weather_week.dia_semana}
                            opacity={'77'} background={this.estilo.cor.purple}
                            color={this.estilo.cor.purple} label_data='º' />
                    </Form>

                    <Form style={this.state.weather_atual == 'temperatura' && this.state.temperatura_tipo == 'sensacao_termica' ? null : this.estilo.hide}>
                        <View style={this.state.sensacao_termica == 0 ? null : this.estilo.hide}>
                            <Chart data_array={this.state.weather_week.sensacao_termica_maxima}
                                opacity={''}
                                color={this.estilo.cor.purple} label_data='º' />
                            <Chart data_array={this.state.weather_week.sensacao_termica_minima}
                                label_array={this.state.weather_week.dia_semana}
                                opacity={'99'} background={this.estilo.cor.purple}
                                color={this.estilo.cor.purple} label_data='º' />
                        </View>

                        <View style={this.state.sensacao_termica == 1 ? null : this.estilo.hide}>
                            <Chart data_array={this.state.weather_week.sensacao_termica_maxima_sombra}
                                opacity={''}
                                color={this.estilo.cor.purple} label_data='º' />
                            <Chart data_array={this.state.weather_week.sensacao_termica_minima_sombra}
                                label_array={this.state.weather_week.dia_semana}
                                opacity={'99'} background={this.estilo.cor.purple}
                                color={this.estilo.cor.purple} label_data='º' />
                        </View>
                    </Form>

                    {/* Chuva */}
                    <Form style={this.state.weather_atual == 'chuva' && this.state.turno == 0 ? null : this.estilo.hide}>
                        <Chart data_array={this.state.weather_week.dia_chuva_mm}
                            label_array={this.state.weather_week.dia_semana}
                            label_descricao_array={this.state.weather_week.dia_chuva_probabilidade}
                            label_array_label={'%'}
                            opacity={''} color={this.estilo.cor.blue} label_data=' mm' />
                    </Form>

                    <Form style={this.state.weather_atual == 'chuva' && this.state.turno == 1 ? null : this.estilo.hide}>
                        <Chart data_array={this.state.weather_week.noite_chuva_mm}
                            label_array={this.state.weather_week.dia_semana}
                            label_descricao_array={this.state.weather_week.noite_chuva_probabilidade}
                            label_array_label={'%'}
                            opacity={''} color={this.estilo.cor.blue} label_data=' mm' />
                    </Form>

                    {/* Nuvens */}
                    <Form style={this.state.weather_atual == 'nuvem' && this.state.turno == 0 ? null : this.estilo.hide}>
                        <Chart data_array={this.state.weather_week.dia_nuvens}
                            label_array={this.state.weather_week.dia_semana}
                            opacity={''} color={this.estilo.cor.blue_light} label_data='%' />
                    </Form>

                    <Form style={this.state.weather_atual == 'nuvem' && this.state.turno == 1 ? null : this.estilo.hide}>
                        <Chart data_array={this.state.weather_week.noite_nuvens}
                            label_array={this.state.weather_week.dia_semana}
                            opacity={''} color={this.estilo.cor.blue_light} label_data='%' />
                    </Form>

                    {/* Vento */}
                    <Form style={this.state.weather_atual == 'vento' && this.state.turno == 0 ? null : this.estilo.hide}>
                        <Chart data_array={this.state.weather_week.dia_vento_velocidade}
                            label_array={this.state.weather_week.dia_semana}
                            label_descricao_array={this.state.weather_week.dia_vento_direcao}
                            opacity={''}
                            color={this.estilo.cor.greenish_medium} label_data=' km/h' />
                    </Form>

                    <Form style={this.state.weather_atual == 'vento' && this.state.turno == 1 ? null : this.estilo.hide}>
                        <Chart data_array={this.state.weather_week.noite_vento_velocidade}
                            label_array={this.state.weather_week.dia_semana}
                            label_descricao_array={this.state.weather_week.noite_vento_direcao}
                            opacity={''}
                            color={this.estilo.cor.greenish_medium} label_data=' km/h' />
                    </Form>

                    {/* Sol */}
                    <Form style={this.state.weather_atual == 'sol' && this.state.sol_tipo == 0 ? null : this.estilo.hide}>
                        <Form style={this.state.sol == 0 ? null : this.estilo.hide}>
                            <Chart label_descricao_array={this.state.weather_week.sol_nascer}
                                label_array={this.state.weather_week.dia_semana}
                                label_array_label_value={'h'}
                                opacity={''} label_descricao_array_bold={true}
                                color={this.estilo.cor.orange} />
                        </Form>
                        <Form style={this.state.sol == 1 ? null : this.estilo.hide}>
                            <Chart label_descricao_array={this.state.weather_week.sol_por}
                                label_array={this.state.weather_week.dia_semana}
                                label_array_label_value={'h'}
                                opacity={''} label_descricao_array_bold={true}
                                color={this.estilo.cor.orange} />
                        </Form>
                    </Form>

                    {/* Tempo de sol */}
                    <Form style={this.state.weather_atual == 'sol' && this.state.sol_tipo == 1 ? null : this.estilo.hide}>
                        <Chart label_descricao_array={this.state.weather_week.sol_duracao}
                            label_array={this.state.weather_week.dia_semana}
                            label_array_label={'h'}
                            opacity={''} label_descricao_array_bold={true}
                            color={this.estilo.cor.orange} />
                    </Form>

                    {/* Lua */}
                    <Form style={this.state.weather_atual == 'lua' ? null : this.estilo.hide}>
                        <Form style={this.state.lua == 0 ? null : this.estilo.hide}>
                            <Chart label_descricao_array={this.state.weather_week.lua_nascer}
                                label_array={this.state.weather_week.dia_semana}
                                label_array_label_value={'h'}
                                opacity={''} label_descricao_array_bold={true}
                                color={this.estilo.cor.blue_dark} />
                        </Form>
                        <Form style={this.state.lua == 1 ? null : this.estilo.hide}>
                            <Chart label_descricao_array={this.state.weather_week.lua_por}
                                label_array={this.state.weather_week.dia_semana}
                                label_array_label_value={'h'}
                                opacity={''} label_descricao_array_bold={true}
                                color={this.estilo.cor.blue_dark} />
                        </Form>
                    </Form>
                    {/* Gŕaficos (acima) */}
                </View>

                <Form style={{ justifyContent: 'center', backgroundColor: this.state.weather_cor, paddingBottom: 5 }}>
                    {/* Botões */}
                    <Form style={{ flexDirection: 'row', marginVertical: 30, justifyContent: 'center' }}>
                        {/* Genérico */}
                        <Button rounded style={this.state.weather_atual == 'temperatura' || this.state.weather_atual == 'sensacao_termica' ||
                            this.state.weather_atual == 'sol' ? this.estilo.hide : {
                                backgroundColor: this.estilo.cor.white + '11', borderRadius: 50,
                                paddingVertical: 10, paddingHorizontal: 20, alignSelf: 'center',
                                elevation: 0
                            }}>
                            <Text uppercase={false} style={{ fontSize: 17, color: this.estilo.cor.white, fontWeight: 'bold' }}
                            >{this.state.variavel_ambiental}</Text>
                        </Button>

                        {/* Temperatura / Sensação Térmica */}
                        <Form style={this.state.weather_atual == 'temperatura' ?
                            { flexDirection: 'row', flexWrap: 'wrap' } : this.estilo.hide} >
                            <Button rounded style={{ backgroundColor: this.estilo.cor.white + '11', marginHorizontal: 10, elevation: 0 }}
                                onPress={() => this.setState({ temperatura_tipo: 'temperatura' })}>
                                <Text uppercase={false} style={{ fontSize: 17, color: this.state.temperatura_tipo == 'temperatura' ? this.estilo.cor.white : this.estilo.cor.white + '77' }}>Temperatura</Text>
                            </Button>
                            <Button rounded style={{ backgroundColor: this.estilo.cor.white + '11', marginHorizontal: 10, elevation: 0 }}
                                onPress={() => this.setState({ temperatura_tipo: 'sensacao_termica' })}>
                                <Text uppercase={false} style={{ fontSize: 17, color: this.state.temperatura_tipo == 'sensacao_termica' ? this.estilo.cor.white : this.estilo.cor.white + '77' }}>Sensação térmica</Text>
                            </Button>
                        </Form>

                        {/* Sol / Tempo de sol */}
                        <Form style={this.state.weather_atual == 'sol' ?
                            { flexDirection: 'row', flexWrap: 'wrap' } : this.estilo.hide} >
                            <Button rounded style={{ backgroundColor: this.estilo.cor.white + '11', marginHorizontal: 10, elevation: 0 }}
                                onPress={() => this.setState({ sol_tipo: 0 })}>
                                <Text uppercase={false} style={{ fontSize: 17, color: this.state.sol_tipo == 0 ? this.estilo.cor.white : this.estilo.cor.white + '77' }}>Sol</Text>
                            </Button>
                            <Button rounded style={{ backgroundColor: this.estilo.cor.white + '11', marginHorizontal: 10, elevation: 0 }}
                                onPress={() => this.setState({ sol_tipo: 1 })}>
                                <Text uppercase={false} style={{ fontSize: 17, color: this.state.sol_tipo == 1 ? this.estilo.cor.white : this.estilo.cor.white + '77' }}>Tempo de sol</Text>
                            </Button>
                        </Form>
                    </Form>

                    <Form style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingVertical: 5 }}>
                        {this.weather.map((item) => (
                            <Button large transparent key={item.icon} rounded style={{ paddingHorizontal: 20 }}
                                onPress={() => {
                                    this.setState({
                                        weather_atual: item.key, weather_cor: item.cor,
                                        variavel_ambiental: item.variavel_ambiental
                                    })
                                }}>
                                <FeatherIcon name={item.icon} style={[{ fontSize: 25, color: this.estilo.cor.white + '77' },
                                this.state.weather_atual == item.key ?
                                    { color: this.estilo.cor.white } : null]} />
                            </Button>
                        ))}
                    </Form>
                </Form>
            </Container >
        )
    }
}