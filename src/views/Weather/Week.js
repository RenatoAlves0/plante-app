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
            card_weather_cor: this.estilo.cor.purple,
            sensacao_termica: 0,
            sol: 0,
            lua: 0,
            card_weather_atual: 0,
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
    }

    async componentWillMount() {
        await this.setState({ weather_week: await weatherWeek.get() })
        this.setState({ render: true })
        this.render()
    }

    renderTemperatura() {
        return <Content style={{ backgroundColor: this.estilo.cor.white, flex: 1 }}>
            <View style={{ width: Dimensions.get('screen').width, alignItems: 'center' }}>
                <Form style={{ marginTop: 20 }}>
                    <Chart data_array={this.state.weather_week.temperatura_maxima}
                        opacity={''}
                        color={this.estilo.cor.purple} label_data='º' />
                    <Chart data_array={this.state.weather_week.temperatura_minima}
                        label_array={this.state.weather_week.dia_semana}
                        opacity={'77'} background={this.estilo.cor.purple}
                        color={this.estilo.cor.purple} label_data='º' />
                </Form>

                {/* Sensação Térmica */}
                <Form style={{ flexDirection: 'row', paddingVertical: 20 }}>
                    <Text style={{
                        fontSize: 17, color: this.estilo.cor.white, fontWeight: 'bold',
                        backgroundColor: this.estilo.cor.purple_vivid, paddingVertical: 10,
                        paddingHorizontal: 20, borderRadius: 50, alignSelf: 'center'
                    }}>Sensação térmica</Text>
                    <Form style={{ backgroundColor: this.estilo.cor.purple_vivid, marginLeft: 15, flexDirection: 'row', borderRadius: 50 }}>
                        <Button rounded transparent
                            onPress={() => this.setState({ sensacao_termica: 0 })}>
                            {this.state.sensacao_termica == 0 ?
                                <Text uppercase={false} style={{ fontSize: 17, color: this.estilo.cor.white, borderRightWidth: 1, borderRightColor: this.estilo.cor.white }}>Sol</Text> :
                                <FeatherIcon name='sun'
                                    style={{ fontSize: 20, marginHorizontal: 15, color: this.estilo.cor.white + 'AA' }} />}
                        </Button>
                        <Button rounded transparent
                            onPress={() => this.setState({ sensacao_termica: 1 })}>
                            {this.state.sensacao_termica == 1 ?
                                <Text uppercase={false} style={{ fontSize: 17, color: this.estilo.cor.white, borderLeftWidth: 1, borderLeftColor: this.estilo.cor.white }}>Sombra</Text> :
                                <FeatherIcon name='cloud'
                                    style={{ fontSize: 20, marginHorizontal: 15, color: this.estilo.cor.white + 'AA' }} />}
                        </Button>
                    </Form>
                </Form>

                <View style={this.state.sensacao_termica == 0 ? { marginTop: 20 } : this.estilo.hide}>
                    <Chart data_array={this.state.weather_week.sensacao_termica_maxima}
                        opacity={''}
                        color={this.estilo.cor.purple_vivid} label_data='º' />
                    <Chart data_array={this.state.weather_week.sensacao_termica_minima}
                        label_array={this.state.weather_week.dia_semana}
                        opacity={'99'} background={this.estilo.cor.purple_vivid}
                        color={this.estilo.cor.purple_vivid} label_data='º' />
                </View>

                <View style={this.state.sensacao_termica == 1 ? { marginTop: 20 } : this.estilo.hide}>
                    <Chart data_array={this.state.weather_week.sensacao_termica_maxima_sombra}
                        opacity={''}
                        color={this.estilo.cor.purple_vivid} label_data='º' />
                    <Chart data_array={this.state.weather_week.sensacao_termica_minima_sombra}
                        label_array={this.state.weather_week.dia_semana}
                        opacity={'99'} background={this.estilo.cor.purple_vivid}
                        color={this.estilo.cor.purple_vivid} label_data='º' />
                </View>
            </View>
        </Content>
    }

    renderDia() {
        return <Content style={{ backgroundColor: this.estilo.cor.white, flex: 1 }}>
            <View style={{ width: Dimensions.get('screen').width, alignItems: 'center' }}>

                {/* Vento */}
                <Form style={{
                    flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 20, marginBottom: 60,
                    backgroundColor: this.estilo.cor.greenish_medium, borderRadius: 200, marginVertical: 30
                }}>
                    <Text style={{ fontSize: 17, color: this.estilo.cor.white, fontWeight: 'bold' }}>Vento    </Text>
                    <FeatherIcon name='wind' style={{ fontSize: 20, color: this.estilo.cor.white, marginLeft: -5 }} />
                </Form>
                <Chart data_array={this.state.weather_week.dia_vento_velocidade}
                    label_array={this.state.weather_week.dia_semana}
                    label_descricao_array={this.state.weather_week.dia_vento_direcao}
                    opacity={''}
                    color={this.estilo.cor.greenish_medium} label_data=' km/h' />

                {/* Nuvens */}
                <Form style={{
                    flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 20,
                    backgroundColor: this.estilo.cor.blue_light, borderRadius: 200, marginVertical: 30
                }}>
                    <Text style={{ fontSize: 17, color: this.estilo.cor.white, fontWeight: 'bold' }}>Nuvens    </Text>
                    <FeatherIcon name='cloud' style={{ fontSize: 20, color: this.estilo.cor.white, marginLeft: -5 }} />
                </Form>
                <Chart data_array={this.state.weather_week.dia_nuvens}
                    label_array={this.state.weather_week.dia_semana}
                    opacity={''}
                    color={this.estilo.cor.blue_light} label_data='%' />

                {/* Chuva */}
                <Form style={{
                    flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 20,
                    backgroundColor: this.estilo.cor.blue, borderRadius: 200, marginVertical: 30
                }}>
                    <Text style={{ fontSize: 17, color: this.estilo.cor.white, fontWeight: 'bold' }}>Chuva    </Text>
                    <FeatherIcon name='cloud-drizzle' style={{ fontSize: 20, color: this.estilo.cor.white, marginLeft: -5 }} />
                </Form>
                <Chart data_array={this.state.weather_week.dia_chuva_mm}
                    label_array={this.state.weather_week.dia_semana}
                    label_descricao_array={this.state.weather_week.dia_chuva_probabilidade}
                    label_array_label={'%'}
                    opacity={''}
                    color={this.estilo.cor.blue} label_data=' mm' />

                {/* Tempo de sol */}
                <Form style={{
                    flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 20, marginVertical: 30,
                    backgroundColor: this.estilo.cor.orange_medium, borderRadius: 200
                }}>
                    <Text style={{ fontSize: 17, color: this.estilo.cor.white, fontWeight: 'bold' }}>Tempo de sol    </Text>
                    <FeatherIcon name='clock' style={{ fontSize: 20, color: this.estilo.cor.white, marginLeft: -5 }} />
                </Form>
                <Chart label_descricao_array={this.state.weather_week.sol_duracao}
                    label_array={this.state.weather_week.dia_semana}
                    label_array_label={'h'}
                    opacity={''} label_descricao_array_bold={true}
                    color={this.estilo.cor.orange_medium} />

                {/* Sol */}
                <Form style={{ flexDirection: 'row', marginVertical: 30 }}>
                    <Text style={{
                        fontSize: 17, color: this.estilo.cor.white, fontWeight: 'bold',
                        backgroundColor: this.estilo.cor.orange, paddingVertical: 10,
                        paddingHorizontal: 20, borderRadius: 50, alignSelf: 'center'
                    }}>Sol</Text>
                    <Form style={{ backgroundColor: this.estilo.cor.orange, marginLeft: 15, flexDirection: 'row', borderRadius: 50 }}>
                        <Button rounded transparent
                            onPress={() => this.setState({ sol: 0 })}>
                            {this.state.sol == 0 ?
                                <Text uppercase={false} style={{ fontSize: 17, color: this.estilo.cor.white, borderRightWidth: 1, borderRightColor: this.estilo.cor.white }}>Nascer</Text> :
                                <FeatherIcon name='sunrise'
                                    style={{ fontSize: 20, marginHorizontal: 15, color: this.estilo.cor.white + 'AA' }} />}
                        </Button>
                        <Button rounded transparent
                            onPress={() => this.setState({ sol: 1 })}>
                            {this.state.sol == 1 ?
                                <Text uppercase={false} style={{ fontSize: 17, color: this.estilo.cor.white, borderLeftWidth: 1, borderLeftColor: this.estilo.cor.white }}>Por</Text> :
                                <FeatherIcon name='sunset'
                                    style={{ fontSize: 20, marginHorizontal: 15, color: this.estilo.cor.white + 'AA' }} />}
                        </Button>
                    </Form>
                </Form>

                <View style={this.state.sol == 0 ? null : this.estilo.hide}>
                    <Chart label_descricao_array={this.state.weather_week.sol_nascer}
                        label_array={this.state.weather_week.dia_semana}
                        label_array_label_value={'h'}
                        opacity={''} label_descricao_array_bold={true}
                        color={this.estilo.cor.orange} />
                </View>
                <View style={this.state.sol == 1 ? null : this.estilo.hide}>
                    <Chart label_descricao_array={this.state.weather_week.sol_por}
                        label_array={this.state.weather_week.dia_semana}
                        label_array_label_value={'h'}
                        opacity={''} label_descricao_array_bold={true}
                        color={this.estilo.cor.orange} />
                </View>
            </View>
        </Content>
    }

    renderNoite() {
        return <Content style={{ backgroundColor: this.estilo.cor.white, flex: 1 }}>
            <View style={{ width: Dimensions.get('screen').width, alignItems: 'center' }}>

                {/* Vento */}

                <Form style={{
                    flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 20, marginBottom: 60,
                    backgroundColor: this.estilo.cor.greenish_medium, borderRadius: 200, marginVertical: 30
                }}>
                    <Text style={{ fontSize: 17, color: this.estilo.cor.white, fontWeight: 'bold' }}>Vento    </Text>
                    <FeatherIcon name='wind' style={{ fontSize: 20, color: this.estilo.cor.white, marginLeft: -5 }} />
                </Form>
                <Chart data_array={this.state.weather_week.noite_vento_velocidade}
                    label_array={this.state.weather_week.dia_semana}
                    label_descricao_array={this.state.weather_week.noite_vento_direcao}
                    opacity={''}
                    color={this.estilo.cor.greenish_medium} label_data=' km/h' />

                {/* Nuvens */}
                <Form style={{
                    flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 20,
                    backgroundColor: this.estilo.cor.blue_light, borderRadius: 200, marginVertical: 30
                }}>
                    <Text style={{ fontSize: 17, color: this.estilo.cor.white, fontWeight: 'bold' }}>Nuvens    </Text>
                    <FeatherIcon name='cloud' style={{ fontSize: 20, color: this.estilo.cor.white, marginLeft: -5 }} />
                </Form>
                <Form>
                    <Chart data_array={this.state.weather_week.noite_nuvens}
                        label_array={this.state.weather_week.dia_semana}
                        opacity={''}
                        color={this.estilo.cor.blue_light} label_data='%' />
                </Form>

                {/* Chuva */}
                <Form style={{
                    flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 20,
                    backgroundColor: this.estilo.cor.blue, borderRadius: 200, marginVertical: 30
                }}>
                    <Text style={{ fontSize: 17, color: this.estilo.cor.white, fontWeight: 'bold' }}>Chuva    </Text>
                    <FeatherIcon name='cloud-drizzle' style={{ fontSize: 20, color: this.estilo.cor.white, marginLeft: -5 }} />
                </Form>
                <Chart data_array={this.state.weather_week.noite_chuva_mm}
                    label_array={this.state.weather_week.dia_semana}
                    label_descricao_array={this.state.weather_week.noite_chuva_probabilidade}
                    label_array_label={'%'}
                    opacity={''}
                    color={this.estilo.cor.blue} label_data=' mm' />

                {/* Lua */}
                <Form style={{ flexDirection: 'row', marginVertical: 30 }}>
                    <Text style={{
                        fontSize: 17, color: this.estilo.cor.white, fontWeight: 'bold',
                        backgroundColor: this.estilo.cor.blue_dark, paddingVertical: 10,
                        paddingHorizontal: 20, borderRadius: 50, alignSelf: 'center'
                    }}>Lua</Text>
                    <Form style={{ backgroundColor: this.estilo.cor.blue_dark, marginLeft: 15, flexDirection: 'row', borderRadius: 50 }}>
                        <Button rounded transparent
                            onPress={() => this.setState({ lua: 0 })}>
                            {this.state.lua == 0 ?
                                <Text uppercase={false} style={{ fontSize: 17, color: this.estilo.cor.white, borderRightWidth: 1, borderRightColor: this.estilo.cor.white }}>Nascer</Text> :
                                <FeatherIcon name='arrow-up'
                                    style={{ fontSize: 20, marginHorizontal: 15, color: this.estilo.cor.white + 'AA' }} />}
                        </Button>
                        <Button rounded transparent
                            onPress={() => this.setState({ lua: 1 })}>
                            {this.state.lua == 1 ?
                                <Text uppercase={false} style={{ fontSize: 17, color: this.estilo.cor.white, borderLeftWidth: 1, borderLeftColor: this.estilo.cor.white }}>Por</Text> :
                                <FeatherIcon name='arrow-down'
                                    style={{ fontSize: 20, marginHorizontal: 15, color: this.estilo.cor.white + 'AA' }} />}
                        </Button>
                    </Form>
                </Form>
                <View style={this.state.lua == 0 ? null : this.estilo.hide}>
                    <Chart label_descricao_array={this.state.weather_week.lua_nascer}
                        label_array={this.state.weather_week.dia_semana}
                        label_array_label_value={'h'}
                        opacity={''} label_descricao_array_bold={true}
                        color={this.estilo.cor.blue_dark} />
                </View>
                <View style={this.state.lua == 1 ? null : this.estilo.hide}>
                    <Chart label_descricao_array={this.state.weather_week.lua_por}
                        label_array={this.state.weather_week.dia_semana}
                        label_array_label_value={'h'}
                        opacity={''} label_descricao_array_bold={true}
                        color={this.estilo.cor.blue_dark} />
                </View>
            </View>
        </Content>
    }

    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: this.estilo.cor.white }}>
                    <Button rounded transparent onPress={() => Actions.pop()}>
                        <FeatherIcon name='arrow-left' style={{ color: this.estilo.cor.gray_solid, fontSize: 22, marginHorizontal: 5 }} />
                    </Button>
                    <Body>
                        <Text style={{ color: this.estilo.cor.gray_solid, fontSize: 22, fontWeight: 'bold', marginLeft: 20 }}>Previsão de 5 dias</Text>
                    </Body>
                </Header>
                <StatusBar backgroundColor={this.estilo.cor.white} barStyle='dark-content' />

                {this.state.render ? this.state.card_weather_atual == 0 ? this.renderTemperatura() :
                    this.state.card_weather_atual == 1 ? this.renderDia() :
                        this.state.card_weather_atual == 2 ? this.renderNoite() : null : null}

                <Form style={{ flexDirection: 'row', justifyContent: 'center', backgroundColor: this.estilo.cor.white, paddingVertical: 5 }}>
                    {this.card_weather.map((item) => (
                        <Button transparent key={item.icon} rounded style={{ paddingHorizontal: 15 }}
                            onPress={() => {
                                this.setState({
                                    card_weather_atual: item.index, card_weather_cor: item.cor,
                                    variavel_ambiental: item.variavel_ambiental
                                })
                            }}>
                            {item.index == this.state.card_weather_atual ?
                                <Text uppercase={false} style={{ color: this.estilo.cor.gray_solid, fontSize: 18, marginLeft: -10 }}
                                >{item.variavel_ambiental}</Text> : null}
                            <FeatherIcon name={item.icon} style={[{ fontSize: 25, color: this.estilo.cor.gray_medium },
                            this.state.card_weather_atual >= item.index && this.state.card_weather_atual < item.index + 1 ?
                                { color: this.estilo.cor.gray_solid } : null]} />
                        </Button>
                    ))}
                </Form>
            </Container>
        )
    }
}