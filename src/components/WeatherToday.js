import React, { Component } from 'react'
import { Dimensions, ScrollView, Modal, View } from 'react-native'
import { Button, Form, ListItem, Row, Col, Spinner, Content, Container, Text } from 'native-base'
import estilo from '../assets/Estilo'
import LinearGradient from 'react-native-linear-gradient'
import FeatherIcon from 'react-native-vector-icons/Feather'
import axios from 'axios'
import rnfs from 'react-native-fs'
import { Grid, AreaChart, XAxis, YAxis } from 'react-native-svg-charts'
import { G, Line, Circle, Path, Svg } from 'react-native-svg'
import * as shape from 'd3-shape'

export default class Card extends Component {
    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.state = {
            loaded: false,
            card_weather_atual: 0,
            lista_weather: [],
            dia_semana_aux: undefined,
            hora_aux: undefined,
        }
        this.card_weather = [
            { icon: 'thermometer', cor1: this.estilo.cor.red_vivid, cor2: this.estilo.cor.purple_vivid },
            { icon: 'sun', cor1: this.estilo.cor.orange, cor2: this.estilo.cor.orange_light },
            { icon: 'moon', cor1: this.estilo.cor.blue, cor2: this.estilo.cor.blue_dark },
        ]
    }

    componentWillReceiveProps() {
        if (this.props.update) this.load()
    }

    async load() {
        await this.lerArquivo(rnfs.DocumentDirectoryPath)
        console.log(this.state.dia_semana_aux)
        console.log(this.getStringDayOfWeek(new Date().getDay()))
        console.log(this.state.hora_aux)
        console.log(new Date().getHours())
        if (this.getStringDayOfWeek(new Date().getDay()) == this.state.dia_semana_aux
            && (new Date().getHours()) - this.state.hora_aux < 3)
            console.log('Dados Weather (12h) já atualizados')
        else {
            console.log('Dados Weather (12h) desatualizados ou inexistentes\nobtendo novos dados ...')
            await this.getWeather()
        }
        this.setState({ loaded: true })
    }

    async getWeather() {
        await axios
            .get('http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/38025?apikey=AJ8uokBYThYFdXod4T6hebp4pLvEUQom&language=pt-br&details=true&metric=true')
            .then(async (data) => {
                let array = data.data
                console.log('array')
                console.log(array)
                let dia_semana, hora,
                    situacao, temperatura,
                    sensacao_termica, temperatura_de_bulbo_umido,
                    ponto_de_orvalho, vento,
                    umidade_relativa, chuva, uv, obj, array_obj = []

                await array.forEach((element, index) => {
                    dia_semana = element.DateTime
                    hora = element.DateTime
                    dia_semana ? dia_semana = this.getDayOfWeek(dia_semana) : ''
                    hora ? hora = new Date(hora).getHours() : ''
                    situacao = element.IconPhrase
                    temperatura = element.Temperature.Value
                    sensacao_termica = element.RealFeelTemperature.Value
                    temperatura_de_bulbo_umido = element.WetBulbTemperature.Value
                    ponto_de_orvalho = element.DewPoint.Value
                    vento = {
                        velocidade: element.Wind.Speed.Value, //km/h
                        direcao: element.Wind.Direction.Localized
                    }
                    umidade_relativa = element.RelativeHumidity //%
                    chuva = {
                        probabilidade: element.RainProbability,
                        quantidade: element.Rain.Value //mm
                    }
                    uv = {
                        indice: element.UVIndex,
                        descricao: element.UVIndexText
                    }
                    obj = {
                        dia_semana: dia_semana,
                        hora: hora,
                        situacao: situacao,
                        temperatura: temperatura,
                        sensacao_termica: sensacao_termica,
                        temperatura_de_bulbo_umido: temperatura_de_bulbo_umido,
                        ponto_de_orvalho: ponto_de_orvalho,
                        vento: vento,
                        umidade_relativa: umidade_relativa,
                        chuva: chuva,
                        uv: uv
                    }
                    array_obj.push(obj)
                })
                console.log('array_obj')
                console.log(array_obj)
                await this.gravarArquivo(
                    rnfs.DocumentDirectoryPath + '/weather_twelve.json',
                    JSON.stringify(array_obj))
                await this.lerArquivo(rnfs.DocumentDirectoryPath)
            })
            .catch(async (erro) => {
                console.error(erro)
                console.log('Resultado obtido do Servidor AccuWeather (12h):')
                console.log(array)
                console.log('Servidor AccuWeather (12h) ainda não atualizado!')
                await this.lerArquivo(rnfs.DocumentDirectoryPath)
            })
    }

    async lerArquivo(caminho) {
        let index_file
        await rnfs.readDir(caminho)
            .then(async (result) => {
                this.setState({ dia_semana_aux: 'vazio' })
                this.setState({ hora_aux: 'vazio' })
                console.log('Resultado de leitura obtido', result)
                await result.forEach(async element => {
                    if (element.name == 'weather_twelve.json') {
                        index_file = await result.indexOf(element)
                    }
                })
                return Promise.all([rnfs.stat(result[0].path), result[index_file].path])
            })
            .then((statResult) => {
                if (statResult[0].isFile()) return rnfs.readFile(statResult[1], 'utf8')
                return 'no file'
            })
            .then(async (contents) => {
                await this.setState({ lista_weather: JSON.parse(contents) })
                console.log(this.state.lista_weather)
                this.state.lista_weather && this.state.lista_weather[0] && this.state.lista_weather[0].dia_semana ?
                    await this.setState({ dia_semana_aux: this.state.lista_weather[0].dia_semana }) : null
                this.state.lista_weather && this.state.lista_weather[0] && this.state.lista_weather[0].hora ?
                    await this.setState({ hora_aux: this.state.lista_weather[0].hora }) : null
                console.log(this.state.lista_weather[0].hora)
            })
            .catch((err) => {
                this.setState({ dia_semana_aux: 'vazio' })
                this.setState({ hora_aux: 'vazio' })
                console.log(err.message, err.code)
                return null
            })
    }

    async gravarArquivo(caminho, dados) {
        await rnfs.writeFile(caminho, dados, 'utf8')
            .then(() => {
                console.log('Weather (12h) gravado com sucesso no armazenamento interno!')
            })
            .catch((err) => {
                console.log('Falha ao gravar Weather (12h) no armazenamento interno!')
                console.log(err.message)
            })
    }

    getDayOfWeek(date) {
        var dayOfWeek = new Date(date).getDay()
        return this.getStringDayOfWeek(dayOfWeek)
    }

    getStringDayOfWeek(day) {
        return isNaN(day) ? null : ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][day]
    }

    render() {
        const data = [24, 24, 27, 30, 31, 30, 33, 34, 29, 28, 30, 33, 29, 29]
        const data1 = [0, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 23, 0, 0]
        const Decorator = ({ x, y, data }) => {
            return data.map((value, index) => (
                <Svg key={index} translateX={x(index)} translateY={y(value)}>
                    <Text style={{
                        marginTop: -35, marginLeft: -8, fontWeight: 'bold',
                        color: this.estilo.cor.purple, fontSize: 17
                    }}>{value}º</Text>
                </Svg>
            ))
        }
        const Line = ({ line }) => (
            <Path d={line} stroke={this.estilo.cor.purple + '77'} fill={'none'} strokeWidth={10} />
        )
        return (
            <Container>
                <ScrollView horizontal={true} style={{
                    marginTop: 0, maxHeight: 200
                }}>
                    <Form style={{ width: Dimensions.get('window').width * 1.5 }}>
                        <AreaChart
                            style={{ height: 150 }}
                            data={data}
                            svg={{ fill: this.estilo.cor.purple }}
                            curve={shape.curveNatural}
                            contentInset={{ left: -20, right: -22 }}
                            yMin={22}
                            yMax={50}
                        >
                            <Line />
                            <Decorator />
                        </AreaChart>
                        <XAxis
                            style={{
                                marginHorizontal: -30, height: 50, paddingTop: 25,
                                backgroundColor: this.estilo.cor.purple
                            }}
                            data={data}
                            formatLabel={index => data1[index] + 'h'}
                            contentInset={{ left: 10, right: 0 }}
                            svg={{ fontSize: 15, fill: this.estilo.cor.white }}
                            numberOfTicks={12}
                        />
                    </Form>
                </ScrollView>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', backgroundColor: this.estilo.cor.purple }}>
                    {this.card_weather.map((item) => (
                        <Button key={item.icon} rounded style={this.estilo.button_item_weather}
                            onPress={() => this.setState({ card_weather_atual: this.card_weather.indexOf(item) })}>
                            <FeatherIcon name={item.icon} style={[this.estilo.icon_item_weather,
                            this.state.card_weather_atual == this.card_weather.indexOf(item) ?
                                { color: this.estilo.cor.white } : null]} />
                        </Button>
                    ))}
                </View>
            </Container>
        )
    }
}