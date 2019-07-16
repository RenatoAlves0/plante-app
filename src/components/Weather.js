import React, { Component } from 'react'
import { Text, Button, Icon, View, Form, ListItem, Row } from 'native-base'
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

    async load() {
        let aux = [{
            dia: 'Segunda',
            data: '15 de jul',
            temperatura: 32,
            tipo_temperatura: 'quente'
        },
        {
            dia: 'Terça',
            data: '16 de jul',
            temperatura: 30,
            tipo_temperatura: 'quente'
        },
        {
            dia: 'Quarta',
            data: '17 de jul',
            temperatura: 28,
            tipo_temperatura: 'média'
        },
        {
            dia: 'Quinta',
            data: '18 de jul',
            temperatura: 25,
            tipo_temperatura: 'média'
        },
        {
            dia: 'Sexta',
            data: '19 de jul',
            temperatura: 30,
            tipo_temperatura: 'quente'
        }]
        await this.setState({ lista_weather: aux })
        if (1 == 2) return await axios
            // .get('https://api.darksky.net/forecast/cd6497bd71117cbb49fd4f70a5e9dc93/-4.56167,-37.769718')
            .get('http://dataservice.accuweather.com/forecasts/v1/daily/5day/38025?apikey=AJ8uokBYThYFdXod4T6hebp4pLvEUQom&language=pt-br&details=true&metric=true')
            .then((data) => {
                let array = data.data.DailyForecasts
                let horas_sol, sensacao_termica, sensacao_termica_sombra, temperatura, dia, noite, lua, sol, obj

                array.forEach(element => {
                    horas_sol = element.HoursOfSun
                    sensacao_termica = { min: element.RealFeelTemperature.Minimum.Value, max: element.RealFeelTemperature.Maximum.Value }
                    sensacao_termica_sombra = { min: element.RealFeelTemperatureShade.Minimum.Value, max: element.RealFeelTemperatureShade.Maximum.Value }
                    temperatura = { min: element.Temperature.Minimum.Value, max: element.Temperature.Maximum.Value }

                    dia = {
                        nuvens: element.Day.CloudCover, //%
                        ceu: element.Day.ShortPhrase,
                        chuva_probabilidade: element.Day.RainProbability, //%
                        chuva_mm: element.Day.Rain.Value,
                        vento_velocidade: element.Day.Wind.Speed.Value, //km/h
                        vento_direcao: element.Day.Wind.Direction.Localized
                    }

                    noite = {
                        nuvens: element.Night.CloudCover, //%
                        ceu: element.Night.ShortPhrase,
                        chuva_probabilidade: element.Night.RainProbability, //%
                        chuva_mm: element.Night.Rain.Value,
                        vento_velocidade: element.Night.Wind.Speed.Value, //km/h
                        vento_direcao: element.Night.Wind.Direction.Localized
                    }

                    lua = {
                        nascer: element.Moon.Rise,
                        por: element.Moon.Set
                    }

                    sol = {
                        nascer: element.Sun.Rise,
                        por: element.Sun.Set
                    }

                    obj = {
                        horas_sol: horas_sol,
                        sensacao_termica: sensacao_termica,
                        sensacao_termica_sombra: sensacao_termica_sombra,
                        temperatura: temperatura,
                        dia: dia,
                        noite: noite,
                        lua: lua,
                        sol: sol
                    }

                    console.log(obj)

                })

            })
            .catch((erro) => { console.error(erro) })
    }

    render() {
        return (
            <LinearGradient colors={[this.card_weather[this.state.card_weather_atual].cor1,
            this.card_weather[this.state.card_weather_atual].cor2]} useAngle={true}
                angle={45} angleCenter={{
                    x: this.card_weather[this.state.card_weather_atual].x || 0.5,
                    y: this.card_weather[this.state.card_weather_atual].y || 0.5
                }} style={[this.estilo.item_dash,
                { width: 350, height: 'auto', paddingBottom: 10 }]}>
                <View>
                    <Text style={{ alignSelf: 'center', marginTop: 20, fontSize: 18, color: this.estilo.cor.white + '77' }}>Previsão</Text>
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
                    {this.state.lista_weather.map((item) => (
                        <ListItem key={item.dia} style={{ marginTop: -15, paddingRight: 0, marginLeft: 30, marginRight: 30, borderBottomWidth: 0 }}>
                            <Row>
                                <Form style={{ flexDirection: 'column', width: '50%' }}>
                                    <Text style={{ fontSize: 18, color: this.estilo.cor.white, fontWeight: 'bold' }}> {item.dia} </Text>
                                    <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77' }}> {item.data} </Text>
                                </Form>
                                <Form style={{ flexDirection: 'column', width: '50%', alignItems: 'flex-end' }}>
                                    <Text style={{ fontSize: 18, color: this.estilo.cor.white, fontWeight: 'bold' }}> {item.temperatura} ºC </Text>
                                    <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77' }}> {item.tipo_temperatura} </Text>
                                </Form>
                            </Row>
                        </ListItem>
                    ))}
                </View>
            </LinearGradient>
        )
    }
}