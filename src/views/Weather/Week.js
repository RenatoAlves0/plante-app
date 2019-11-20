import React, { Component } from 'react'
import { StatusBar, Dimensions, ScrollView, Image } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { Text, Form, Container, View, Button, Header, Body, Row } from 'native-base'
import estilo from '../../assets/Estilo'
import FeatherIcon from 'react-native-vector-icons/Feather'
import Chart from '../../components/ChartWeek'
import weatherWeek from '../../services/WeatherWeek'
import { translate } from '../../i18n/locales'

export default class Week extends Component {
    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.state = {
            loaded: false,
            weather_cor: this.estilo.cor.purple,
            turno: 0,
            sensacao_termica: 0,
            weather_atual: 'temperatura',
            temperatura_tipo: 'temperatura',
            variavel_ambiental: 'Temperatura',
            weather_week: {},
        }

        this.weather = [
            { key: 'temperatura', icon: 'thermometer', variavel_ambiental: translate('temperatura'), cor: this.estilo.cor.purple },
            { key: 'chuva', icon: 'cloud-drizzle', variavel_ambiental: translate('chuva'), cor: this.estilo.cor.blue },
            { key: 'nuvem', icon: 'cloud', variavel_ambiental: translate('nuvens'), cor: this.estilo.cor.blue_light },
            { key: 'vento', icon: 'wind', variavel_ambiental: translate('vento'), cor: this.estilo.cor.greenish_medium },
            { key: 'sol', icon: 'sun', variavel_ambiental: translate('sol'), cor: this.estilo.cor.orange },
            { key: 'lua', icon: 'moon', variavel_ambiental: translate('lua'), cor: this.estilo.cor.blue_dark },
        ]
    }

    async componentWillMount() {
        await this.setState({ weather_week: await weatherWeek.get() })
        this.render()
    }

    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: this.estilo.cor.white, elevation: 0 }}>
                    <Button rounded transparent onPress={() => Actions.pop()}>
                        <FeatherIcon name='chevron-left' style={{ color: this.estilo.cor.gray_solid, fontSize: 22, marginHorizontal: 5 }} />
                    </Button>
                    <Body>
                        <Text style={{ color: this.estilo.cor.gray_solid, fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>5 {translate('dias')}</Text>
                    </Body>
                    <Button rounded transparent onPress={() => Actions.today()}>
                        <FeatherIcon name='clock' style={{ color: this.estilo.cor.gray_solid, fontSize: 22, marginHorizontal: 5 }} />
                    </Button>
                </Header>
                <StatusBar backgroundColor={this.estilo.cor.white} barStyle='dark-content' />

                {/* Opções (abaixo) */}
                {/* Sensação Térmica */}
                <Form style={this.state.weather_atual == 'temperatura' && this.state.temperatura_tipo == 'sensacao_termica' ?
                    { flexDirection: 'row', borderRadius: 50, marginTop: 40, alignSelf: 'center' } : this.estilo.hide} >
                    <Button rounded transparent
                        onPress={() => this.setState({ sensacao_termica: 0 })}>
                        <FeatherIcon name='sun'
                            style={{ fontSize: 20, color: this.state.sensacao_termica == 0 ? this.estilo.cor.gray_solid : this.estilo.cor.gray_medium }} />
                        <Text uppercase={false} style={{ paddingLeft: 10, fontSize: 17, color: this.state.sensacao_termica == 0 ? this.estilo.cor.gray_solid : this.estilo.cor.gray_medium }}>{translate('sol')}</Text>
                    </Button>
                    <Button rounded transparent
                        onPress={() => this.setState({ sensacao_termica: 1 })}>
                        <FeatherIcon name='cloud'
                            style={{ marginLeft: 10, fontSize: 20, color: this.state.sensacao_termica == 1 ? this.estilo.cor.gray_solid : this.estilo.cor.gray_medium }} />
                        <Text uppercase={false} style={{ paddingLeft: 10, paddingRight: 0, fontSize: 17, color: this.state.sensacao_termica == 1 ? this.estilo.cor.gray_solid : this.estilo.cor.gray_medium }}>{translate('sombra')}</Text>
                    </Button>
                </Form>

                {/* Dia / Noite */}
                <Form style={this.state.weather_atual == 'temperatura' || this.state.weather_atual == 'sol' || this.state.weather_atual == 'lua' ? this.estilo.hide :
                    { flexDirection: 'row', marginTop: 40, alignSelf: 'center' }}>
                    <Button rounded transparent
                        onPress={() => this.setState({ turno: 0 })}>
                        <FeatherIcon name='sun'
                            style={{ fontSize: 20, color: this.state.turno == 0 ? this.estilo.cor.gray_solid : this.estilo.cor.gray_medium }} />
                        <Text uppercase={false} style={{ paddingLeft: 10, fontSize: 17, color: this.state.turno == 0 ? this.estilo.cor.gray_solid : this.estilo.cor.gray_medium }}>{translate('dia')}</Text>
                    </Button>
                    <Button rounded transparent
                        onPress={() => this.setState({ turno: 1 })}>
                        <FeatherIcon name='moon'
                            style={{ marginLeft: 10, fontSize: 20, color: this.state.turno == 1 ? this.estilo.cor.gray_solid : this.estilo.cor.gray_medium }} />
                        <Text uppercase={false} style={{ paddingLeft: 10, paddingRight: 0, fontSize: 17, color: this.state.turno == 1 ? this.estilo.cor.gray_solid : this.estilo.cor.gray_medium }}>{translate('noite')}</Text>
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
                    <Form style={this.state.weather_atual == 'sol' ? null : this.estilo.hide}>

                        <Row style={{ backgroundColor: this.estilo.cor.orange, justifyContent: 'center', height: 50, paddingTop: 15 }}>
                            <Text uppercase={false} style={{ fontSize: 17, color: this.estilo.cor.white, fontWeight: 'bold' }}>{translate('nascer_do_sol')}</Text>
                            <FeatherIcon name='sunrise' style={{ fontSize: 20, marginHorizontal: 15, color: this.estilo.cor.white }} />
                        </Row>
                        <Chart label_descricao_array={this.state.weather_week.sol_nascer}
                            label_array_label_value={'h'}
                            opacity={''} label_descricao_array_bold={true}
                            color={this.estilo.cor.orange} />

                        <Row style={{ backgroundColor: this.estilo.cor.orange_medium, justifyContent: 'center', height: 50, paddingTop: 15 }}>
                            <Text uppercase={false} style={{ fontSize: 17, color: this.estilo.cor.white, fontWeight: 'bold' }}>{translate('por_do_sol')}</Text>
                            <FeatherIcon name='sunset' style={{ fontSize: 20, marginHorizontal: 15, color: this.estilo.cor.white }} />
                        </Row>
                        <Chart label_descricao_array={this.state.weather_week.sol_por}
                            label_array_label_value={'h'}
                            opacity={''} label_descricao_array_bold={true}
                            color={this.estilo.cor.orange_medium} />

                        <Row style={{ backgroundColor: this.estilo.cor.orange, justifyContent: 'center', height: 51, paddingTop: 15, marginBottom: -1 }}>
                            <Text uppercase={false} style={{ fontSize: 17, color: this.estilo.cor.white, fontWeight: 'bold' }}>{translate('duracao')}</Text>
                            <FeatherIcon name='clock' style={{ fontSize: 20, marginHorizontal: 15, color: this.estilo.cor.white }} />
                        </Row>
                        <Chart label_descricao_array={this.state.weather_week.sol_duracao}
                            label_array={this.state.weather_week.dia_semana}
                            label_array_label={'h'}
                            opacity={''} label_descricao_array_bold={true}
                            color={this.estilo.cor.orange} />
                    </Form>

                    {/* Lua */}
                    <Form style={this.state.weather_atual == 'lua' ? null : this.estilo.hide}>
                        <Row style={{ backgroundColor: this.estilo.cor.blue_solid, justifyContent: 'center', height: 50, paddingTop: 15 }}>
                            <Text uppercase={false} style={{ fontSize: 17, color: this.estilo.cor.white, fontWeight: 'bold' }}>{translate('nascer_da_lua')}</Text>
                            <FeatherIcon name='arrow-up' style={{ fontSize: 20, marginHorizontal: 15, color: this.estilo.cor.white }} />
                        </Row>
                        <Chart label_descricao_array={this.state.weather_week.lua_nascer}
                            label_array_label_value={'h'}
                            opacity={''} label_descricao_array_bold={true}
                            color={this.estilo.cor.blue_solid} />

                        <Row style={{ backgroundColor: this.estilo.cor.blue_dark, justifyContent: 'center', height: 50, paddingTop: 15 }}>
                            <Text uppercase={false} style={{ fontSize: 17, color: this.estilo.cor.white, fontWeight: 'bold' }}>{translate('por_da_lua')}</Text>
                            <FeatherIcon name='arrow-down' style={{ fontSize: 20, marginHorizontal: 15, color: this.estilo.cor.white }} />
                        </Row>
                        <Chart label_descricao_array={this.state.weather_week.lua_por}
                            label_array={this.state.weather_week.dia_semana}
                            label_array_label_value={'h'}
                            opacity={''} label_descricao_array_bold={true}
                            color={this.estilo.cor.blue_dark} />
                    </Form>
                    {/* Gŕaficos (acima) */}
                </View>

                <Form style={{ justifyContent: 'center', backgroundColor: this.state.weather_cor, paddingBottom: 5 }}>
                    {/* Botões */}
                    <Form style={{ flexDirection: 'row', marginVertical: 30, justifyContent: 'center' }}>
                        {/* Genérico */}
                        <Button rounded style={this.state.weather_atual == 'temperatura' ? this.estilo.hide : {
                            backgroundColor: this.estilo.cor.white + '11', borderRadius: 20,
                            paddingVertical: 10, paddingHorizontal: 20, alignSelf: 'center',
                            elevation: 0, borderRadius: 20
                        }}>
                            <Text uppercase={false} style={{
                                color: this.estilo.cor.white, fontWeight: 'bold',
                                fontSize: 17, paddingLeft: 30, paddingRight: 30
                            }}
                            >{this.state.variavel_ambiental}</Text>
                        </Button>

                        {/* Temperatura / Sensação Térmica */}
                        <Form style={this.state.weather_atual == 'temperatura' ?
                            { flexDirection: 'row', flexWrap: 'wrap' } : this.estilo.hide} >
                            <Button rounded style={{ backgroundColor: this.estilo.cor.white + '11', marginHorizontal: 10, elevation: 0, borderRadius: 20 }}
                                onPress={() => this.setState({ temperatura_tipo: 'temperatura' })}>
                                <Text uppercase={false} style={{
                                    color: this.state.temperatura_tipo == 'temperatura' ? this.estilo.cor.white : this.estilo.cor.white + '77',
                                    fontSize: 17, paddingLeft: 30, paddingRight: 30
                                }}>{translate('temperatura')}</Text>
                            </Button>
                            <Button rounded style={{ backgroundColor: this.estilo.cor.white + '11', marginHorizontal: 10, elevation: 0, borderRadius: 20 }}
                                onPress={() => this.setState({ temperatura_tipo: 'sensacao_termica' })}>
                                <Text uppercase={false} style={{
                                    color: this.state.temperatura_tipo == 'sensacao_termica' ? this.estilo.cor.white : this.estilo.cor.white + '77',
                                    fontSize: 17, paddingLeft: 30, paddingRight: 30
                                }}>{translate('sensacao_termica')}</Text>
                            </Button>
                        </Form>
                    </Form>

                    <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
                        <Form style={{ flexDirection: 'row', justifyContent: 'center', paddingVertical: 5, paddingLeft: 10 }}>
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
                    </ScrollView>
                    <Image
                        resizeMode='contain'
                        style={{ width: 120, height: 40, alignSelf: 'center', marginBottom: 10 }}
                        source={require('../../assets/images/accuWeather/AccuWeather75.png')}
                    />
                </Form>
            </Container>
        )
    }
}