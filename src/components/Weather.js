import React, { Component } from 'react'
import { Text, Button, Icon, View, Form, ListItem, Row, Col, Spinner } from 'native-base'
import estilo from '../assets/Estilo'
import LinearGradient from 'react-native-linear-gradient'
import FeatherIcon from 'react-native-vector-icons/Feather'
import axios from 'axios'
import rnfs from 'react-native-fs'
import Loader from './Loader'

export default class Card extends Component {
    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.state = {
            loaded: false,
            card_weather_atual: 0,
            lista_weather: [],
            dia_semana_aux: undefined
        }
        this.card_weather = [
            { icon: 'thermometer', cor1: this.estilo.cor.red_vivid, cor2: this.estilo.cor.purple_vivid },
            { icon: 'sun', cor1: this.estilo.cor.orange, cor2: this.estilo.cor.orange_light },
            { icon: 'moon', cor1: this.estilo.cor.blue, cor2: this.estilo.cor.blue_dark },
        ]
    }

    async componentWillReceiveProps() {
        if (this.props.update) this.load()
    }

    async load() {
        await this.lerArquivo(rnfs.DocumentDirectoryPath)
        console.log(this.state.dia_semana_aux)
        if (this.getStringDayOfWeek(new Date().getDay()) == this.state.dia_semana_aux)
            console.log('Dados Weather já atualizados')
        else {
            console.log('Dados Weather desatualizados ou inexistentes\nobtendo novos dados ...')
            await this.getWeather()
        }
        this.setState({ loaded: true })
    }

    async getWeather() {
        await axios
            // .get('https://api.darksky.net/forecast/cd6497bd71117cbb49fd4f70a5e9dc93/-4.56167,-37.769718')
            .get('http://dataservice.accuweather.com/forecasts/v1/daily/5day/38025?apikey=AJ8uokBYThYFdXod4T6hebp4pLvEUQom&language=pt-br&details=true&metric=true')
            .then(async (data) => {
                let array = data.data.DailyForecasts
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
                            nascer: element.Sun.Rise.substring(11, 16),
                            por: element.Sun.Set.substring(11, 16),
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
                            nascer: element.Moon.Rise.substring(11, 16),
                            por: element.Moon.Set.substring(11, 16)
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
                await this.gravarArquivo(
                    rnfs.DocumentDirectoryPath + '/weather.json',
                    JSON.stringify(array_obj))
                await this.lerArquivo(rnfs.DocumentDirectoryPath)
            })
            .catch((erro) => { console.error(erro) })
    }

    async lerArquivo(caminho) {
        await rnfs.readDir(caminho)
            .then((result) => {
                this.setState({ dia_semana_aux: 'vazio' })
                console.log('Resultado de leitura obtido', result)
                return Promise.all([rnfs.stat(result[0].path), result[0].path])
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
            })
            .catch((err) => {
                this.setState({ dia_semana_aux: 'vazio' })
                console.log(err.message, err.code)
                return null
            })
    }

    async gravarArquivo(caminho, dados) {
        await rnfs.writeFile(caminho, dados, 'utf8')
            .then(() => {
                console.log('Weather gravado com sucesso no armazenamento interno!')
            })
            .catch((err) => {
                console.log('Falha ao gravar Weather no armazenamento interno!')
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
        return (
            <LinearGradient colors={[this.card_weather[this.state.card_weather_atual].cor1,
            this.card_weather[this.state.card_weather_atual].cor2]} useAngle={true}
                angle={90} angleCenter={{
                    x: this.card_weather[this.state.card_weather_atual].x || 0.5,
                    y: this.card_weather[this.state.card_weather_atual].y || 0.5
                }} style={[this.estilo.item_dash,
                { width: 350, height: 'auto' }]}>
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
                    {this.state.loaded ? null : <Spinner color={this.estilo.cor.white} style={{ alignSelf: 'center', marginBottom: 30 }} />}
                    {this.state.lista_weather.map((item, index) => (
                        <ListItem key={item.id} style={{
                            marginLeft: 15, marginRight: 15, marginBottom: 10,
                            padding: 15, borderBottomWidth: 0, borderRadius: 10,
                            backgroundColor: this.estilo.cor.gray_translucid,
                            display: this.state.card_weather_atual == 0 ? 'flex' : 'none'
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
                                <Row>
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

                    {this.state.lista_weather.map((item, index) => (
                        <ListItem key={item.id} style={{
                            marginLeft: 15, marginRight: 15, marginBottom: 10,
                            padding: 15, borderBottomWidth: 0, borderRadius: 10,
                            backgroundColor: this.estilo.cor.gray_translucid,
                            display: this.state.card_weather_atual == 1 ? 'flex' : 'none'
                        }}>
                            <Col>
                                <Row>
                                    <Form style={{ flexDirection: 'column', width: '50%' }}>
                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white, fontWeight: 'bold' }}>{index == 0 ? 'Hoje' : index == 1 ? 'Amanhã' : item.dia_semana}</Text>
                                    </Form>
                                    <Form style={{ flexDirection: 'row', width: '50%', justifyContent: 'flex-end' }}>
                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77', fontWeight: 'bold' }}>nuvens </Text>
                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white, fontWeight: 'bold' }}>{item.dia.nuvens}%</Text>
                                    </Form>
                                </Row>
                                <Row>
                                    <Form style={{ flexDirection: 'column', width: '100%', alignItems: 'flex-end' }}>
                                        <Text style={{ fontSize: 14, color: this.estilo.cor.white, textAlign: 'right' }}>{item.dia.ceu}</Text>
                                    </Form>
                                </Row>
                                <Row style={{ marginTop: 10 }}>
                                    <Form style={{ flexDirection: 'row', width: '33%' }}>
                                        <FeatherIcon name='cloud-drizzle' style={{ fontSize: 18, color: this.estilo.cor.white, marginTop: 3 }} />
                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77', alignSelf: 'flex-start' }}>  Chuva</Text>
                                    </Form>
                                    <Form style={{ flexDirection: 'row', width: '33%', justifyContent: 'flex-end' }}>
                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77' }}>??? </Text>
                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white }}>{item.dia.chuva_probabilidade}%</Text>
                                    </Form>
                                    <Form style={{ flexDirection: 'row', width: '33%', justifyContent: 'flex-end' }}>
                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white }}>{item.dia.chuva_mm}</Text>
                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77' }}> mm</Text>
                                    </Form>
                                </Row>
                                <Row style={{ marginTop: 10 }}>
                                    <Form style={{ flexDirection: 'row', width: '33%' }}>
                                        <FeatherIcon name='wind' style={{ fontSize: 18, color: this.estilo.cor.white, marginTop: 3 }} />
                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77', alignSelf: 'flex-start' }}>  Vento</Text>
                                    </Form>
                                    <Form style={{ flexDirection: 'row', width: '38%', justifyContent: 'flex-end' }}>
                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white }}>{item.dia.vento_velocidade}</Text>
                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77' }}> km/h</Text>
                                    </Form>
                                    <Form style={{ flexDirection: 'row', width: '28%', justifyContent: 'flex-end' }}>
                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white }}>{item.dia.vento_direcao}  </Text>
                                        <FeatherIcon name='compass' style={{ fontSize: 18, color: this.estilo.cor.white + '77', marginTop: 3 }} />
                                    </Form>
                                </Row>
                                <Row style={{ marginTop: 10 }}>
                                    <Form style={{ flexDirection: 'row', width: '42%' }}>
                                        <FeatherIcon name='sun' style={{ fontSize: 18, color: this.estilo.cor.white, marginTop: 3 }} />
                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77', alignSelf: 'flex-start' }}>  Sol</Text>
                                    </Form>
                                    <Form style={{ flexDirection: 'row', width: '33%' }}>
                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white }}>{item.dia.sol.duracao} h  </Text>
                                        <FeatherIcon name='clock' style={{ fontSize: 18, color: this.estilo.cor.white + '77', marginTop: 3 }} />
                                    </Form>
                                </Row>
                                <Row style={{ marginTop: 10 }}>
                                    <Form style={{ flexDirection: 'row', width: '42%' }}>
                                        <FeatherIcon name='sunrise' style={{ fontSize: 18, color: this.estilo.cor.white, marginTop: 3 }} />
                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77' }}>  {item.dia.sol.nascer} h </Text>
                                    </Form>
                                    <Form style={{ flexDirection: 'row', width: '33%' }}>
                                        <FeatherIcon name='sunset' style={{ fontSize: 18, color: this.estilo.cor.white, marginTop: 3 }} />
                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77' }}>  {item.dia.sol.por} h </Text>
                                    </Form>
                                </Row>
                            </Col>
                        </ListItem>
                    ))}

                    {this.state.lista_weather.map((item, index) => (
                        <ListItem key={item.id} style={{
                            marginLeft: 15, marginRight: 15, marginBottom: 10,
                            padding: 15, borderBottomWidth: 0, borderRadius: 10,
                            backgroundColor: this.estilo.cor.gray_translucid,
                            display: this.state.card_weather_atual == 2 ? 'flex' : 'none'
                        }}>
                            <Col>
                                <Row>
                                    <Form style={{ flexDirection: 'column', width: '50%' }}>
                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white, fontWeight: 'bold' }}>{index == 0 ? 'Hoje' : index == 1 ? 'Amanhã' : item.dia_semana}</Text>
                                    </Form>
                                    <Form style={{ flexDirection: 'row', width: '50%', justifyContent: 'flex-end' }}>
                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77', fontWeight: 'bold' }}>nuvens </Text>
                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white, fontWeight: 'bold' }}>{item.noite.nuvens}%</Text>
                                    </Form>
                                </Row>
                                <Row>
                                    <Form style={{ flexDirection: 'column', width: '100%', alignItems: 'flex-end' }}>
                                        <Text style={{ fontSize: 14, color: this.estilo.cor.white, textAlign: 'right' }}>{item.noite.ceu}</Text>
                                    </Form>
                                </Row>
                                <Row style={{ marginTop: 10 }}>
                                    <Form style={{ flexDirection: 'row', width: '33%' }}>
                                        <FeatherIcon name='cloud-drizzle' style={{ fontSize: 18, color: this.estilo.cor.white, marginTop: 3 }} />
                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77', alignSelf: 'flex-start' }}>  Chuva</Text>
                                    </Form>
                                    <Form style={{ flexDirection: 'row', width: '33%', justifyContent: 'flex-end' }}>
                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77' }}>??? </Text>
                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white }}>{item.noite.chuva_probabilidade}%</Text>
                                    </Form>
                                    <Form style={{ flexDirection: 'row', width: '33%', justifyContent: 'flex-end' }}>
                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white }}>{item.noite.chuva_mm}</Text>
                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77' }}> mm</Text>
                                    </Form>
                                </Row>
                                <Row style={{ marginTop: 10 }}>
                                    <Form style={{ flexDirection: 'row', width: '33%' }}>
                                        <FeatherIcon name='wind' style={{ fontSize: 18, color: this.estilo.cor.white, marginTop: 3 }} />
                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77', alignSelf: 'flex-start' }}>  Vento</Text>
                                    </Form>
                                    <Form style={{ flexDirection: 'row', width: '38%', justifyContent: 'flex-end' }}>
                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white }}>{item.noite.vento_velocidade}</Text>
                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77' }}> km/h</Text>
                                    </Form>
                                    <Form style={{ flexDirection: 'row', width: '28%', justifyContent: 'flex-end' }}>
                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white }}>{item.noite.vento_direcao}  </Text>
                                        <FeatherIcon name='compass' style={{ fontSize: 18, color: this.estilo.cor.white + '77', marginTop: 3 }} />
                                    </Form>
                                </Row>
                                <Row style={{ marginTop: 10 }}>
                                    <Form style={{ flexDirection: 'row', width: '28%' }}>
                                        <FeatherIcon name='moon' style={{ fontSize: 18, color: this.estilo.cor.white, marginTop: 3 }} />
                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77', alignSelf: 'flex-start' }}>  Lua</Text>
                                    </Form>
                                    <Form style={{ flexDirection: 'row', width: '38%' }}>
                                        <FeatherIcon name='arrow-up' style={{ fontSize: 18, color: this.estilo.cor.white, marginTop: 3 }} />
                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77' }}>  {item.noite.lua.nascer} h </Text>
                                    </Form>
                                    <Form style={{ flexDirection: 'row', width: '33%', justifyContent: 'flex-end' }}>
                                        <FeatherIcon name='arrow-down' style={{ fontSize: 18, color: this.estilo.cor.white, marginTop: 3 }} />
                                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77' }}>  {item.noite.lua.por} h </Text>
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