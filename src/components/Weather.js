import React, { Component } from 'react'
import { Text, Button, Icon, View, Form, ListItem, Row, Col } from 'native-base'
import estilo from '../assets/Estilo'
import LinearGradient from 'react-native-linear-gradient'
import FeatherIcon from 'react-native-vector-icons/Feather'
import axios from 'axios'
import rnfs from 'react-native-fs'

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
            { icon: 'moon', cor1: this.estilo.cor.blue, cor2: this.estilo.cor.blue_dark },
            // { icon: 'droplet', cor1: this.estilo.cor.blue_solid, cor2: this.estilo.cor.greenish },
            // { icon: 'wind', cor1: this.estilo.cor.green_solid, cor2: this.estilo.cor.greenish }
        ]
        this.path_weather = rnfs.DocumentDirectoryPath + '/weather.json'
    }

    componentWillMount() {
        this.load()
    }

    componentWillReceiveProps() {
        this.load()
    }

    async load() { }

    async getWeather() {
        // await axios
        //     // .get('https://api.darksky.net/forecast/cd6497bd71117cbb49fd4f70a5e9dc93/-4.56167,-37.769718')
        //     .get('http://dataservice.accuweather.com/forecasts/v1/daily/5day/38025?apikey=AJ8uokBYThYFdXod4T6hebp4pLvEUQom&language=pt-br&details=true&metric=true')
        //     .then(async (data) => {
        //         let array = data.data.DailyForecasts
        //         let sensacao_termica, sensacao_termica_sombra,
        //             temperatura, dia, noite, dia_semana, obj, array_obj = []

        //         await array.forEach((element, index) => {
        //             dia_semana = element.Date
        //             sensacao_termica = {
        //                 min: element.RealFeelTemperature.Minimum.Value,
        //                 max: element.RealFeelTemperature.Maximum.Value
        //             }
        //             sensacao_termica_sombra = {
        //                 min: element.RealFeelTemperatureShade.Minimum.Value,
        //                 max: element.RealFeelTemperatureShade.Maximum.Value
        //             }
        //             temperatura = {
        //                 min: element.Temperature.Minimum.Value,
        //                 max: element.Temperature.Maximum.Value
        //             }
        //             dia = {
        //                 nuvens: element.Day.CloudCover, //%
        //                 ceu: element.Day.ShortPhrase,
        //                 chuva_probabilidade: element.Day.RainProbability, //%
        //                 chuva_mm: element.Day.Rain.Value,
        //                 vento_velocidade: element.Day.Wind.Speed.Value, //km/h
        //                 vento_direcao: element.Day.Wind.Direction.Localized,
        //                 sol: {
        //                     nascer: element.Sun.Rise.substring(11, 16),
        //                     por: element.Sun.Set.substring(11, 16),
        //                     duracao: element.HoursOfSun
        //                 }
        //             }
        //             noite = {
        //                 nuvens: element.Night.CloudCover, //%
        //                 ceu: element.Night.ShortPhrase,
        //                 chuva_probabilidade: element.Night.RainProbability, //%
        //                 chuva_mm: element.Night.Rain.Value,
        //                 vento_velocidade: element.Night.Wind.Speed.Value, //km/h
        //                 vento_direcao: element.Night.Wind.Direction.Localized,
        //                 lua: {
        //                     nascer: element.Moon.Rise.substring(11, 16),
        //                     por: element.Moon.Set.substring(11, 16)
        //                 }
        //             }
        //             obj = {
        //                 id: index,
        //                 dia_semana: this.getDayOfWeek(dia_semana),
        //                 sensacao_termica: sensacao_termica,
        //                 sensacao_termica_sombra: sensacao_termica_sombra,
        //                 temperatura: temperatura,
        //                 dia: dia,
        //                 noite: noite
        //             }
        //             array_obj.push(obj)
        //         })
        let array_obj = await [
            {
                "id": 0,
                "dia_semana": "Quinta",
                "sensacao_termica": {
                    "min": 20.5,
                    "max": 33.7
                },
                "sensacao_termica_sombra": {
                    "min": 20.5,
                    "max": 31
                },
                "temperatura": {
                    "min": 21.7,
                    "max": 32.4
                },
                "dia": {
                    "nuvens": 73,
                    "ceu": "Sol entre nuvens",
                    "chuva_probabilidade": 2,
                    "chuva_mm": 0,
                    "vento_velocidade": 18.5,
                    "vento_direcao": "SE",
                    "sol": {
                        "nascer": "05:41",
                        "por": "17:34",
                        "duracao": 4.5
                    }
                },
                "noite": {
                    "nuvens": 42,
                    "ceu": "Parcialmente nublado",
                    "chuva_probabilidade": 2,
                    "chuva_mm": 0,
                    "vento_velocidade": 16.7,
                    "vento_direcao": "SE",
                    "lua": {
                        "nascer": "19:07",
                        "por": "07:41"
                    }
                }
            },
            {
                "id": 1,
                "dia_semana": "Sexta",
                "sensacao_termica": {
                    "min": 23.4,
                    "max": 33.8
                },
                "sensacao_termica_sombra": {
                    "min": 23.4,
                    "max": 30.6
                },
                "temperatura": {
                    "min": 23.3,
                    "max": 31.4
                },
                "dia": {
                    "nuvens": 4,
                    "ceu": "Ensolarado",
                    "chuva_probabilidade": 1,
                    "chuva_mm": 0,
                    "vento_velocidade": 20.4,
                    "vento_direcao": "SE",
                    "sol": {
                        "nascer": "05:41",
                        "por": "17:34",
                        "duracao": 11.3
                    }
                },
                "noite": {
                    "nuvens": 10,
                    "ceu": "Céu claro",
                    "chuva_probabilidade": 4,
                    "chuva_mm": 0,
                    "vento_velocidade": 20.4,
                    "vento_direcao": "SE",
                    "lua": {
                        "nascer": "19:54",
                        "por": "08:23"
                    }
                }
            },
            {
                "id": 2,
                "dia_semana": "Sábado",
                "sensacao_termica": {
                    "min": 23.2,
                    "max": 33.3
                },
                "sensacao_termica_sombra": {
                    "min": 23.2,
                    "max": 30.3
                },
                "temperatura": {
                    "min": 23.1,
                    "max": 30
                },
                "dia": {
                    "nuvens": 13,
                    "ceu": "Predominantemente ensolarado",
                    "chuva_probabilidade": 9,
                    "chuva_mm": 0,
                    "vento_velocidade": 22.2,
                    "vento_direcao": "SE",
                    "sol": {
                        "nascer": "05:41",
                        "por": "17:34",
                        "duracao": 10.5
                    }
                },
                "noite": {
                    "nuvens": 34,
                    "ceu": "Parcialmente nublado",
                    "chuva_probabilidade": 25,
                    "chuva_mm": 0,
                    "vento_velocidade": 16.7,
                    "vento_direcao": "SE",
                    "lua": {
                        "nascer": "20:38",
                        "por": "09:05"
                    }
                }
            },
            {
                "id": 3,
                "dia_semana": "Domingo",
                "sensacao_termica": {
                    "min": 22.8,
                    "max": 32.8
                },
                "sensacao_termica_sombra": {
                    "min": 22.8,
                    "max": 29.9
                },
                "temperatura": {
                    "min": 22.9,
                    "max": 30.1
                },
                "dia": {
                    "nuvens": 54,
                    "ceu": "Predominantemente nublado",
                    "chuva_probabilidade": 25,
                    "chuva_mm": 0,
                    "vento_velocidade": 20.4,
                    "vento_direcao": "SE",
                    "sol": {
                        "nascer": "05:41",
                        "por": "17:34",
                        "duracao": 6.9
                    }
                },
                "noite": {
                    "nuvens": 13,
                    "ceu": "Predominantemente claro",
                    "chuva_probabilidade": 10,
                    "chuva_mm": 0,
                    "vento_velocidade": 16.7,
                    "vento_direcao": "SE",
                    "lua": {
                        "nascer": "21:22",
                        "por": "09:45"
                    }
                }
            },
            {
                "id": 4,
                "dia_semana": "Segunda",
                "sensacao_termica": {
                    "min": 22.7,
                    "max": 31.6
                },
                "sensacao_termica_sombra": {
                    "min": 22.7,
                    "max": 28.4
                },
                "temperatura": {
                    "min": 22.8,
                    "max": 29.4
                },
                "dia": {
                    "nuvens": 23,
                    "ceu": "Predominantemente ensolarado",
                    "chuva_probabilidade": 5,
                    "chuva_mm": 0,
                    "vento_velocidade": 20.4,
                    "vento_direcao": "SE",
                    "sol": {
                        "nascer": "05:41",
                        "por": "17:34",
                        "duracao": 9.2
                    }
                },
                "noite": {
                    "nuvens": 11,
                    "ceu": "Predominantemente claro",
                    "chuva_probabilidade": 9,
                    "chuva_mm": 0,
                    "vento_velocidade": 16.7,
                    "vento_direcao": "SE",
                    "lua": {
                        "nascer": "22:05",
                        "por": "10:25"
                    }
                }
            }
        ]
        console.log(array_obj)
        await rnfs.writeFile(this.path_weather, JSON.stringify(array_obj), 'utf8')
            .then(() => {
                console.log('Weather gravado com sucesso no armazenamento interno!')
            })
            .catch((err) => {
                console.log('Falha ao gravar Weather no armazenamento interno!')
                console.log(err.message)
            })

        await rnfs.readDir(rnfs.DocumentDirectoryPath)
            .then((result) => {
                console.log('Resultado de leitura obtido', result);
                return Promise.all([rnfs.stat(result[0].path), result[0].path]);
            })
            .then((statResult) => {
                if (statResult[0].isFile()) {
                    return rnfs.readFile(statResult[1], 'utf8')
                }
                return 'no file'
            })
            .then((contents) => {
                this.setState({ lista_weather: JSON.parse(contents) })
                console.log(this.state.lista_weather)
            })
            .catch((err) => {
                console.log(err.message, err.code)
            })

        // })
        //         .catch((erro) => { console.error(erro) })
    }

    getDayOfWeek(date) {
        var dayOfWeek = new Date(date).getDay();
        return isNaN(dayOfWeek) ? null : ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][dayOfWeek];
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