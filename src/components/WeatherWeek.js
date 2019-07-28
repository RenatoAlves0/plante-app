import React, { Component } from 'react'
import { Text, Button, Form, ListItem, Row, Col, Spinner } from 'native-base'
import estilo from '../assets/Estilo'
import LinearGradient from 'react-native-linear-gradient'
import FeatherIcon from 'react-native-vector-icons/Feather'
import axios from 'axios'
import rnfs from 'react-native-fs'

export default class WeatherWeek extends Component {
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
            { icon: 'sun', cor1: this.estilo.cor.orange, cor2: this.estilo.cor.orange_medium },
            { icon: 'moon', cor1: this.estilo.cor.blue, cor2: this.estilo.cor.blue_dark },
        ]
    }

    componentWillReceiveProps() {
        if (this.props.update) this.load()
    }

    async load() {
        await this.lerArquivo(rnfs.DocumentDirectoryPath)
        console.log((new Date().getHours()) - this.state.hora_aux)
        if (this.getStringDayOfWeek(new Date().getDay()) != this.state.dia_semana_aux &&
            ((new Date().getHours()) - this.state.hora_aux > 1) ||
            (new Date().getHours()) - this.state.hora_aux < -1) {
            console.log('Dados Weather desatualizados ou inexistentes\nobtendo novos dados ...')
            await this.getWeather()
        }
        else console.log('Dados Weather já atualizados')
        this.setState({ loaded: true })
    }

    async getWeather() {
        await axios
            .get('http://dataservice.accuweather.com/forecasts/v1/daily/5day/38025?apikey=AJ8uokBYThYFdXod4T6hebp4pLvEUQom&language=pt-br&details=true&metric=true')
            .then(async (data) => {
                let array = data.data.DailyForecasts
                let sensacao_termica, sensacao_termica_sombra, hora,
                    temperatura, dia, noite, dia_semana, obj, array_obj = []

                await array.forEach((element, index) => {
                    console.log(element.Date)
                    dia_semana = element.Date
                    hora = new Date().getHours()
                    dia_semana ? dia_semana = this.getDayOfWeek(dia_semana) : ''
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
                    dia.sol.nascer ? dia.sol.nascer = dia.sol.nascer.substring(11, 16) : ''
                    dia.sol.por ? dia.sol.por = dia.sol.por.substring(11, 16) : ''
                    noite.lua.nascer ? noite.lua.nascer = noite.lua.nascer.substring(11, 16) : ''
                    noite.lua.por ? noite.lua.por = noite.lua.por.substring(11, 16) : ''
                    obj = {
                        id: index,
                        hora: hora,
                        dia_semana: dia_semana,
                        sensacao_termica: sensacao_termica,
                        sensacao_termica_sombra: sensacao_termica_sombra,
                        temperatura: temperatura,
                        dia: dia,
                        noite: noite
                    }
                    array_obj.push(obj)
                })
                await this.gravarArquivo(
                    rnfs.DocumentDirectoryPath + '/weather_week.json',
                    JSON.stringify(array_obj))
                await this.lerArquivo(rnfs.DocumentDirectoryPath)
            })
            .catch(async (erro) => {
                console.error(erro)
                console.log('Resultado obtido do Servidor AccuWeather:')
                console.log(array)
                console.log('Servidor AccuWeather ainda não atualizado!')
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
                    if (element.name == 'weather_week.json') {
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

    renderTemperatura(item, index) {
        return <ListItem key={item.id + 't'} style={{
            marginLeft: 15, marginRight: 15, marginBottom: 10,
            padding: 15, borderBottomWidth: 0, borderRadius: 10,
            backgroundColor: this.estilo.cor.gray_translucid,
            display: this.state.card_weather_atual == 0 ? 'flex' : 'none'
        }}>
            <Col>
                <Row>
                    <Text style={{ fontSize: 18, color: this.estilo.cor.white, fontWeight: 'bold', width: '50%' }}>
                        {index == 0 ? item.dia_semana == this.getStringDayOfWeek(new Date().getDay()) ? 'Hoje' : 'Ontem'
                            : index == 1 ? item.dia_semana == this.getStringDayOfWeek(new Date().getDay()) ? 'Hoje' : 'Amanhã'
                                : item.dia_semana}</Text>
                    <Row style={{ justifyContent: 'flex-end' }}>
                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77', fontWeight: 'bold' }}>{item.temperatura.min} / </Text>
                        <Text style={{ fontSize: 18, color: this.estilo.cor.white, fontWeight: 'bold' }}>{item.temperatura.max}º</Text>
                    </Row>
                </Row>
                <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77', alignSelf: 'flex-start', marginVertical: 5 }}>Sensação térmica</Text>
                <Row>
                    <Row>
                        <FeatherIcon name='sun' style={{ fontSize: 18, color: this.estilo.cor.white, marginTop: 3 }} />
                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77' }}>  {item.sensacao_termica.min} / </Text>
                        <Text style={{ fontSize: 18, color: this.estilo.cor.white }}>{item.sensacao_termica.max}º</Text>
                    </Row>
                    <Row style={{ justifyContent: 'flex-end' }}>
                        <FeatherIcon name='cloud' style={{ fontSize: 18, color: this.estilo.cor.white, marginTop: 3 }} />
                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77' }}>  {item.sensacao_termica_sombra.min} / </Text>
                        <Text style={{ fontSize: 18, color: this.estilo.cor.white }}>{item.sensacao_termica_sombra.max}º</Text>
                    </Row>
                </Row>
            </Col>
        </ListItem>
    }

    renderDia(item, index) {
        return <ListItem key={item.id + 'd'} style={{
            marginLeft: 15, marginRight: 15, marginBottom: 10,
            padding: 15, borderBottomWidth: 0, borderRadius: 10,
            backgroundColor: this.estilo.cor.gray_translucid,
            display: this.state.card_weather_atual == 1 ? 'flex' : 'none'
        }}>
            <Col>
                <Row>
                    <Text style={{ fontSize: 18, color: this.estilo.cor.white, fontWeight: 'bold', width: '50%' }}>
                        {index == 0 ? item.dia_semana == this.getStringDayOfWeek(new Date().getDay()) ? 'Hoje' : 'Ontem'
                            : index == 1 ? item.dia_semana == this.getStringDayOfWeek(new Date().getDay()) ? 'Hoje' : 'Amanhã'
                                : item.dia_semana}</Text>
                    <Row style={{ width: '50%', justifyContent: 'flex-end' }}>
                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77', fontWeight: 'bold' }}>nuvens </Text>
                        <Text style={{ fontSize: 18, color: this.estilo.cor.white, fontWeight: 'bold' }}>{item.dia.nuvens}%</Text>
                    </Row>
                </Row>
                <Row style={{ justifyContent: 'flex-end' }} >
                    <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77', fontWeight: 'bold' }}>tempo de sol </Text>
                    <Text style={{ fontSize: 18, color: this.estilo.cor.white, fontWeight: 'bold' }}>{item.dia.sol.duracao}h</Text>
                </Row>
                <Text style={{ fontSize: 14, color: this.estilo.cor.white, textAlign: 'right', width: '100%' }}>{item.dia.ceu}</Text>
                <Row style={{ marginTop: 10 }}>
                    <Row>
                        <FeatherIcon name='cloud-drizzle' style={{ fontSize: 18, color: this.estilo.cor.white, marginTop: 3 }} />
                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77', alignSelf: 'flex-start' }}>  Chuva</Text>
                    </Row>
                    <Row style={{ justifyContent: 'flex-end' }}>
                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77' }}>??? </Text>
                        <Text style={{ fontSize: 18, color: this.estilo.cor.white }}>{item.dia.chuva_probabilidade}%</Text>
                    </Row>
                    <Row style={{ justifyContent: 'flex-end' }}>
                        <Text style={{ fontSize: 18, color: this.estilo.cor.white }}>{item.dia.chuva_mm}</Text>
                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77' }}> mm</Text>
                    </Row>
                </Row>
                <Row style={{ marginTop: 10 }}>
                    <Row>
                        <FeatherIcon name='wind' style={{ fontSize: 18, color: this.estilo.cor.white, marginTop: 3 }} />
                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77', alignSelf: 'flex-start' }}>  Vento</Text>
                    </Row>
                    <Row style={{ justifyContent: 'flex-end' }}>
                        <Text style={{ fontSize: 18, color: this.estilo.cor.white }}>{item.dia.vento_velocidade}</Text>
                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77' }}> km/h</Text>
                    </Row>
                    <Row style={{ justifyContent: 'flex-end' }}>
                        <Text style={{ fontSize: 18, color: this.estilo.cor.white }}>{item.dia.vento_direcao}  </Text>
                        <FeatherIcon name='compass' style={{ fontSize: 18, color: this.estilo.cor.white + '77', marginTop: 3 }} />
                    </Row>
                </Row>
                <Row style={{ marginTop: 10 }}>
                    <Row>
                        <FeatherIcon name='sun' style={{ fontSize: 18, color: this.estilo.cor.white, marginTop: 3 }} />
                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77' }}>  Sol</Text>
                    </Row>
                    <Row>
                        <FeatherIcon name='arrow-up' style={{ fontSize: 18, color: this.estilo.cor.white, marginTop: 3 }} />
                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77' }}> {item.dia.sol.nascer} h </Text>
                    </Row>
                    <Row style={{ justifyContent: 'flex-end' }}>
                        <FeatherIcon name='arrow-down' style={{ fontSize: 18, color: this.estilo.cor.white, marginTop: 3 }} />
                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77' }}> {item.dia.sol.por} h </Text>
                    </Row>
                </Row>
            </Col>
        </ListItem>
    }

    renderNoite(item, index) {
        return <ListItem key={item.id + 'n'} style={{
            marginLeft: 15, marginRight: 15, marginBottom: 10,
            padding: 15, borderBottomWidth: 0, borderRadius: 10,
            backgroundColor: this.estilo.cor.gray_translucid,
            display: this.state.card_weather_atual == 2 ? 'flex' : 'none'
        }}>
            <Col>
                <Row>
                    <Text style={{ fontSize: 18, color: this.estilo.cor.white, fontWeight: 'bold', width: '50%' }}>
                        {index == 0 ? item.dia_semana == this.getStringDayOfWeek(new Date().getDay()) ? 'Hoje' : 'Ontem'
                            : index == 1 ? item.dia_semana == this.getStringDayOfWeek(new Date().getDay()) ? 'Hoje' : 'Amanhã'
                                : item.dia_semana}</Text>
                    <Row style={{ width: '50%', justifyContent: 'flex-end' }}>
                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77', fontWeight: 'bold' }}>nuvens </Text>
                        <Text style={{ fontSize: 18, color: this.estilo.cor.white, fontWeight: 'bold' }}>{item.noite.nuvens}%</Text>
                    </Row>
                </Row>
                <Text style={{ fontSize: 14, color: this.estilo.cor.white, textAlign: 'right', width: '100%' }}>{item.noite.ceu}</Text>
                <Row style={{ marginTop: 10 }}>
                    <Row>
                        <FeatherIcon name='cloud-drizzle' style={{ fontSize: 18, color: this.estilo.cor.white, marginTop: 3 }} />
                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77', alignSelf: 'flex-start' }}>  Chuva</Text>
                    </Row>
                    <Row style={{ justifyContent: 'flex-end' }}>
                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77' }}>??? </Text>
                        <Text style={{ fontSize: 18, color: this.estilo.cor.white }}>{item.noite.chuva_probabilidade}%</Text>
                    </Row>
                    <Row style={{ justifyContent: 'flex-end' }}>
                        <Text style={{ fontSize: 18, color: this.estilo.cor.white }}>{item.noite.chuva_mm}</Text>
                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77' }}> mm</Text>
                    </Row>
                </Row>
                <Row style={{ marginTop: 10 }}>
                    <Row>
                        <FeatherIcon name='wind' style={{ fontSize: 18, color: this.estilo.cor.white, marginTop: 3 }} />
                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77', alignSelf: 'flex-start' }}>  Vento</Text>
                    </Row>
                    <Row style={{ justifyContent: 'flex-end' }}>
                        <Text style={{ fontSize: 18, color: this.estilo.cor.white }}>{item.noite.vento_velocidade}</Text>
                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77' }}> km/h</Text>
                    </Row>
                    <Row style={{ justifyContent: 'flex-end' }}>
                        <Text style={{ fontSize: 18, color: this.estilo.cor.white }}>{item.noite.vento_direcao}  </Text>
                        <FeatherIcon name='compass' style={{ fontSize: 18, color: this.estilo.cor.white + '77', marginTop: 3 }} />
                    </Row>
                </Row>
                <Row style={{ marginTop: 10 }}>
                    <Row>
                        <FeatherIcon name='moon' style={{ fontSize: 18, color: this.estilo.cor.white, marginTop: 3 }} />
                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77', alignSelf: 'flex-start' }}>  Lua</Text>
                    </Row>
                    <Row>
                        <FeatherIcon name='arrow-up' style={{ fontSize: 18, color: this.estilo.cor.white, marginTop: 3 }} />
                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77' }}> {item.noite.lua.nascer} h </Text>
                    </Row>
                    <Row style={{ justifyContent: 'flex-end' }}>
                        <FeatherIcon name='arrow-down' style={{ fontSize: 18, color: this.estilo.cor.white, marginTop: 3 }} />
                        <Text style={{ fontSize: 18, color: this.estilo.cor.white + '77' }}> {item.noite.lua.por} h </Text>
                    </Row>
                </Row>
            </Col>
        </ListItem>
    }

    render() {
        return (
            <LinearGradient colors={[this.card_weather[this.state.card_weather_atual].cor1,
            this.card_weather[this.state.card_weather_atual].cor2]} useAngle={true}
                angle={90} angleCenter={{
                    x: this.card_weather[this.state.card_weather_atual].x || 0.5,
                    y: this.card_weather[this.state.card_weather_atual].y || 0.5
                }} style={this.estilo.item_dash_weather}>
                <Form style={{ flexDirection: 'row', alignSelf: 'center' }}>
                    {this.card_weather.map((item) => (
                        <Button key={item.icon} large rounded style={this.estilo.button_item_weather}
                            onPress={() => this.setState({ card_weather_atual: this.card_weather.indexOf(item) })}>
                            <FeatherIcon name={item.icon} style={[this.estilo.icon_item_weather,
                            this.state.card_weather_atual == this.card_weather.indexOf(item) ?
                                { color: this.estilo.cor.white } : null]} />
                        </Button>
                    ))}
                </Form>
                {this.state.lista_weather.map((item, index) => [
                    this.renderTemperatura(item, index),
                    this.renderDia(item, index),
                    this.renderNoite(item, index)
                ])}
                {this.state.loaded ? null : <Spinner color={this.estilo.cor.white + '77'} style={{ alignSelf: 'center', marginBottom: 30 }} />}
            </LinearGradient >
        )
    }
}