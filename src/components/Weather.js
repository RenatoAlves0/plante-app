import React, { Component } from 'react'
import { Text, Button, Icon, View, Form, ListItem, Row, Col } from 'native-base'
import estilo from '../assets/Estilo'
import LinearGradient from 'react-native-linear-gradient'
import FeatherIcon from 'react-native-vector-icons/Feather'
import axios from 'axios'

export default class Card extends Component {
    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.state = {
            card_weather_atual: 0,
            lista_weather: [],
        }
        this.card_weather = [
            { icon: 'thermometer', cor1: this.estilo.cor.red_vivid, cor2: this.estilo.cor.purple_vivid },
            { icon: 'sun', cor1: this.estilo.cor.orange, cor2: this.estilo.cor.orange_light },
            { icon: 'moon', cor1: this.estilo.cor.blue_dark, cor2: this.estilo.cor.blue },
            // { icon: 'droplet', cor1: this.estilo.cor.blue_solid, cor2: this.estilo.cor.greenish },
            { icon: 'wind', cor1: this.estilo.cor.green_solid, cor2: this.estilo.cor.greenish }
        ]
    }

    componentWillMount() {
        this.load()
    }

    componentWillReceiveProps() {
        this.load()
    }

    async load() { }

    async getWeather() {
        await axios
            // .get('https://api.darksky.net/forecast/cd6497bd71117cbb49fd4f70a5e9dc93/-4.56167,-37.769718')
            .get('http://dataservice.accuweather.com/forecasts/v1/daily/5day/38025?apikey=AJ8uokBYThYFdXod4T6hebp4pLvEUQom&language=pt-br&details=true&metric=true')
            .then(async (data) => {
                let array = data.data.DailyForecasts
                console.log(array)
                let sensacao_termica, sensacao_termica_sombra,
                    temperatura, dia, noite, dia_semana, obj, array_obj = []

                await array.forEach((element, index) => {
                    dia_semana = element.Date
                    sensacao_termica = {
                        min: element.RealFeelTemperature.Minimum.Value,
                        max: element.RealFeelTemperature.Maximum.Value
                    }
                    sensacao_termica_sombra = {
                        min: element.RealFeelTemperatureShade.Minimum.Value,
                        max: element.RealFeelTemperatureShade.Maximum.Value
                    }
                    temperatura = {
                        min: element.Temperature.Minimum.Value,
                        max: element.Temperature.Maximum.Value
                    }
                    dia = {
                        nuvens: element.Day.CloudCover, //%
                        ceu: element.Day.ShortPhrase,
                        chuva_probabilidade: element.Day.RainProbability, //%
                        chuva_mm: element.Day.Rain.Value,
                        vento_velocidade: element.Day.Wind.Speed.Value, //km/h
                        vento_direcao: element.Day.Wind.Direction.Localized,
                        sol: {
                            nascer: element.Sun.Rise,
                            por: element.Sun.Set,
                            duracao: element.HoursOfSun
                        }
                    }
                    noite = {
                        nuvens: element.Night.CloudCover, //%
                        ceu: element.Night.ShortPhrase,
                        chuva_probabilidade: element.Night.RainProbability, //%
                        chuva_mm: element.Night.Rain.Value,
                        vento_velocidade: element.Night.Wind.Speed.Value, //km/h
                        vento_direcao: element.Night.Wind.Direction.Localized,
                        lua: {
                            nascer: element.Moon.Rise,
                            por: element.Moon.Set
                        }
                    }
                    obj = {
                        id: index,
                        dia_semana: this.getDayOfWeek(dia_semana),
                        sensacao_termica: sensacao_termica,
                        sensacao_termica_sombra: sensacao_termica_sombra,
                        temperatura: temperatura,
                        dia: dia,
                        noite: noite
                    }
                    array_obj.push(obj)
                })
                this.setState({ lista_weather: array_obj })
                console.log(array_obj)
            })
            .catch((erro) => { console.error(erro) })
    }

    getDayOfWeek(date) {
        var dayOfWeek = new Date(date).getDay();
        return isNaN(dayOfWeek) ? null : ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][dayOfWeek];
    }

    render() {
        return (
            <LinearGradient colors={[this.card_weather[this.state.card_weather_atual].cor1,
            this.card_weather[this.state.card_weather_atual].cor2]} useAngle={true}
                angle={45} angleCenter={{
                    x: this.card_weather[this.state.card_weather_atual].x || 0.5,
                    y: this.card_weather[this.state.card_weather_atual].y || 0.5
                }} style={[this.estilo.item_dash,
                { width: 350, height: 'auto' }]}>
                <View>
                    <Text onPress={() => this.getWeather()} style={{ alignSelf: 'center', marginTop: 20, fontSize: 18, color: this.estilo.cor.white + '77' }}>Previsão</Text>
                    <Form style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        {this.card_weather.map((item) => (
                            <Button key={item.icon} rounded style={this.estilo.button_item_weather}
                                onPress={() => this.setState({ card_weather_atual: this.card_weather.indexOf(item) })}>
                                <FeatherIcon name={item.icon} style={[this.estilo.icon_item_weather,
                                this.state.card_weather_atual == this.card_weather.indexOf(item) ?
                                    { color: this.estilo.cor.white } : null]} />
                            </Button>
                        ))}
                    </Form>
                    {this.state.lista_weather.map((item, index) => (
                        <ListItem key={item.id} style={{
                            marginLeft: 15, marginRight: 15, marginBottom: 10,
                            padding: 15, borderBottomWidth: 0, borderRadius: 10,
                            backgroundColor: this.estilo.cor.gray_translucid
                        }}>
                            <Col>
                                <Row>
                                    <Form style={{ flexDirection: 'column', width: '50%' }}>
                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white, fontWeight: 'bold' }}>{index == 0 ? 'Hoje' : index == 1 ? 'Amanhã' : item.dia_semana}</Text>
                                        {/* <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77', fontWeight: 'bold' }}>quente?</Text> */}
                                    </Form>
                                    <Form style={{ flexDirection: 'row', width: '50%', justifyContent: 'flex-end' }}>
                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77', fontWeight: 'bold' }}>{item.temperatura.min} / </Text>
                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white, fontWeight: 'bold' }}>{item.temperatura.max}º</Text>
                                    </Form>
                                </Row>
                                <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77', alignSelf: 'flex-start', marginVertical: 5 }}>Sensação térmica</Text>
                                <Row style={{ alignItems: 'flex-end' }}>
                                    <Form style={{ flexDirection: 'row', width: '50%' }}>
                                        <FeatherIcon name='sun' style={{ fontSize: 18, color: this.estilo.cor.white, marginTop: 3 }} />
                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77' }}>  {item.sensacao_termica.min} / </Text>
                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white }}>{item.sensacao_termica.max}º</Text>
                                    </Form>
                                    <Form style={{ flexDirection: 'row', width: '50%', justifyContent: 'flex-end' }}>
                                        <FeatherIcon name='cloud' style={{ fontSize: 18, color: this.estilo.cor.white, marginTop: 3 }} />
                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77' }}>  {item.sensacao_termica_sombra.min} / </Text>
                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white }}>{item.sensacao_termica_sombra.max}º</Text>
                                    </Form>
                                </Row>
                            </Col>
                        </ListItem>
                    ))}
                </View>
            </LinearGradient>
        )
    }
}