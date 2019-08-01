import React, { Component } from 'react'
import { ScrollView, Dimensions } from 'react-native'
import { Text, Form, ListItem, Row, Spinner, Content, Container, View } from 'native-base'
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
            lista_weather: {
                dia_semana: [], hora: [], dia_nuvens: [], dia_ceu: [], dia_chuva_probabilidade: [],
                dia_chuva_mm: [], dia_vento_velocidade: [], dia_vento_direcao: [], sol_nascer: [],
                sol_por: [], sol_duracao: [], noite_nuvens: [], noite_ceu: [], noite_chuva_probabilidade: [],
                noite_chuva_mm: [], noite_vento_velocidade: [], noite_vento_direcao: [], lua_nascer: [],
                lua_por: []
            },
            dia_semana_aux: undefined,
            hora_aux: undefined,
        }
        this.card_weather = [
            { icon: 'thermometer', cor1: this.estilo.cor.purple, cor2: this.estilo.cor.purple_vivid },
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
                let dia_semana, hora, dia_nuvens, dia_ceu, dia_chuva_probabilidade,
                    dia_chuva_mm, dia_vento_velocidade, dia_vento_direcao, sol_nascer,
                    sol_por, sol_duracao, noite_nuvens, noite_ceu, noite_chuva_probabilidade,
                    noite_chuva_mm, noite_vento_velocidade, noite_vento_direcao, lua_nascer,
                    lua_por, sensacao_termica_minima, sensacao_termica_minima_sombra, temperatura_minima,
                    sensacao_termica_maxima, sensacao_termica_maxima_sombra, temperatura_maxima

                array_obj = {
                    dia_semana: [], hora: [], dia_nuvens: [], dia_ceu: [], dia_chuva_probabilidade: [],
                    dia_chuva_mm: [], dia_vento_velocidade: [], dia_vento_direcao: [], sol_nascer: [],
                    sol_por: [], sol_duracao: [], noite_nuvens: [], noite_ceu: [], noite_chuva_probabilidade: [],
                    noite_chuva_mm: [], noite_vento_velocidade: [], noite_vento_direcao: [], lua_nascer: [],
                    lua_por: [], sensacao_termica_minima: [], sensacao_termica_minima_sombra: [],
                    temperatura_minima: [], sensacao_termica_maxima: [],
                    sensacao_termica_maxima_sombra: [], temperatura_maxima: []
                }


                await array.forEach((element, index) => {
                    dia_semana = element.Date
                    hora = new Date().getHours()
                    dia_semana ? dia_semana = this.getDayOfWeek(dia_semana) : ''
                    sensacao_termica_minima = element.RealFeelTemperature.Minimum.Value
                    sensacao_termica_maxima = element.RealFeelTemperature.Maximum.Value
                    sensacao_termica_minima_sombra = element.RealFeelTemperatureShade.Minimum.Value
                    sensacao_termica_maxima_sombra = element.RealFeelTemperatureShade.Maximum.Value
                    temperatura_minima = element.Temperature.Minimum.Value
                    temperatura_maxima = element.Temperature.Maximum.Value
                    dia_nuvens = element.Day.CloudCover
                    dia_ceu = element.Day.ShortPhrase
                    dia_chuva_probabilidade = element.Day.RainProbability
                    dia_chuva_mm = element.Day.Rain.Value
                    dia_vento_velocidade = element.Day.Wind.Speed.Value
                    dia_vento_direcao = element.Day.Wind.Direction.Localized
                    sol_nascer = element.Sun.Rise
                    sol_por = element.Sun.Set
                    sol_duracao = element.HoursOfSun
                    noite_nuvens = element.Night.CloudCover
                    noite_ceu = element.Night.ShortPhrase
                    noite_chuva_probabilidade = element.Night.RainProbability
                    noite_chuva_mm = element.Night.Rain.Value
                    noite_vento_velocidade = element.Night.Wind.Speed.Value
                    noite_vento_direcao = element.Night.Wind.Direction.Localized
                    lua_nascer = element.Moon.Rise
                    lua_por = element.Moon.Set
                    sol_nascer ? sol_nascer = sol_nascer.substring(11, 16) : ''
                    sol_por ? sol_por = sol_por.substring(11, 16) : ''
                    lua_nascer ? lua_nascer = lua_nascer.substring(11, 16) : ''
                    lua_por ? lua_por = lua_por.substring(11, 16) : ''

                    array_obj.hora.push(hora)
                    array_obj.dia_semana.push(dia_semana)
                    array_obj.sensacao_termica_minima.push(sensacao_termica_minima)
                    array_obj.sensacao_termica_maxima.push(sensacao_termica_maxima)
                    array_obj.sensacao_termica_minima_sombra.push(sensacao_termica_minima_sombra)
                    array_obj.sensacao_termica_maxima_sombra.push(sensacao_termica_maxima_sombra)
                    array_obj.temperatura_minima.push(temperatura_minima)
                    array_obj.temperatura_maxima.push(temperatura_maxima)
                    array_obj.dia_nuvens.push(dia_nuvens)
                    array_obj.dia_ceu.push(dia_ceu)
                    array_obj.dia_chuva_probabilidade.push(dia_chuva_probabilidade)
                    array_obj.dia_chuva_mm.push(dia_chuva_mm)
                    array_obj.dia_vento_velocidade.push(dia_vento_velocidade)
                    array_obj.dia_vento_direcao.push(dia_vento_direcao)
                    array_obj.sol_nascer.push(sol_nascer)
                    array_obj.sol_por.push(sol_por)
                    array_obj.sol_duracao.push(sol_duracao)
                    array_obj.noite_nuvens.push(noite_nuvens)
                    array_obj.noite_ceu.push(noite_ceu)
                    array_obj.noite_chuva_probabilidade.push(noite_chuva_probabilidade)
                    array_obj.noite_chuva_mm.push(noite_chuva_mm)
                    array_obj.noite_vento_velocidade.push(noite_vento_velocidade)
                    array_obj.noite_vento_direcao.push(noite_vento_direcao)
                    array_obj.lua_nascer.push(lua_nascer)
                    array_obj.lua_por.push(lua_por)

                    index == 0 || index == 4 ? [
                        array_obj.hora.push(hora),
                        array_obj.dia_semana.push(dia_semana),
                        array_obj.sensacao_termica_minima.push(sensacao_termica_minima),
                        array_obj.sensacao_termica_maxima.push(sensacao_termica_maxima),
                        array_obj.sensacao_termica_minima_sombra.push(sensacao_termica_minima_sombra),
                        array_obj.sensacao_termica_maxima_sombra.push(sensacao_termica_maxima_sombra),
                        array_obj.temperatura_minima.push(temperatura_minima),
                        array_obj.temperatura_maxima.push(temperatura_maxima),
                        array_obj.dia_nuvens.push(dia_nuvens),
                        array_obj.dia_ceu.push(dia_ceu),
                        array_obj.dia_chuva_probabilidade.push(dia_chuva_probabilidade),
                        array_obj.dia_chuva_mm.push(dia_chuva_mm),
                        array_obj.dia_vento_velocidade.push(dia_vento_velocidade),
                        array_obj.dia_vento_direcao.push(dia_vento_direcao),
                        array_obj.sol_nascer.push(sol_nascer),
                        array_obj.sol_por.push(sol_por),
                        array_obj.sol_duracao.push(sol_duracao),
                        array_obj.noite_nuvens.push(noite_nuvens),
                        array_obj.noite_ceu.push(noite_ceu),
                        array_obj.noite_chuva_probabilidade.push(noite_chuva_probabilidade),
                        array_obj.noite_chuva_mm.push(noite_chuva_mm),
                        array_obj.noite_vento_velocidade.push(noite_vento_velocidade),
                        array_obj.noite_vento_direcao.push(noite_vento_direcao),
                        array_obj.lua_nascer.push(lua_nascer),
                        array_obj.lua_por.push(lua_por)
                    ] : null
                })

                console.log('array_obj')
                console.log(array_obj)

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
                this.state.lista_weather && this.state.lista_weather.dia_semana && this.state.lista_weather.dia_semana[1] ?
                    await this.setState({ dia_semana_aux: this.state.lista_weather.dia_semana[1] }) : null
                this.state.lista_weather && this.state.lista_weather.hora && this.state.lista_weather.hora[1] ?
                    await this.setState({ hora_aux: this.state.lista_weather.hora[1] }) : null
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

    renderCard(i) {
        if (i == 0 || i == 6) return
        return <ListItem key={i + 'n'} style={{
            marginVertical: 20, marginLeft: i == 1 ? 40 : 10, marginRight: i == 5 ? 40 : 10,
            paddingLeft: 0, paddingRight: 0, borderRadius: 10, borderBottomWidth: 0,
            width: Dimensions.get('screen').width - 80, flexDirection: 'column'
        }}>

            <Text style={{ fontSize: 25, color: this.estilo.cor.black + '77', fontWeight: 'bold', alignSelf: 'flex-end', marginHorizontal: 5 }}>
                {i == 1 ? this.state.lista_weather.dia_semana[i] == this.getStringDayOfWeek(new Date().getDay()) ? 'Hoje' : 'Ontem'
                    : i == 2 ? this.state.lista_weather.dia_semana[i] == this.getStringDayOfWeek(new Date().getDay()) ? 'Hoje' : 'Amanhã'
                        : this.state.lista_weather.dia_semana[i]}</Text>

            {/* temperatura */}
            <Form style={{ width: '100%', backgroundColor: this.estilo.cor.black + '77', borderRadius: 10, paddingHorizontal: 25, paddingVertical: 15, marginTop: 20 }}>
                <Row style={{ alignItems: 'flex-end' }}>
                    <FeatherIcon name='thermometer' style={{ fontSize: 30, color: 'white', marginLeft: -5 }} />
                    <Text style={{ fontSize: 17, color: this.estilo.cor.white, fontWeight: 'bold' }}> Temperatura</Text>
                    <Row style={{ justifyContent: 'flex-end', width: '50%' }}>
                        <Text style={{ fontSize: 17, color: this.estilo.cor.white + '77', fontWeight: 'bold' }}>{this.state.lista_weather.temperatura_minima[i]} / </Text>
                        <Text style={{ fontSize: 17, color: this.estilo.cor.white, fontWeight: 'bold' }}>{this.state.lista_weather.temperatura_maxima[i]}º</Text>
                    </Row>
                </Row>

                <Text style={{ fontSize: 17, color: this.estilo.cor.white + '77', alignSelf: 'flex-end', marginVertical: 7 }}>sensação térmica</Text>
                <Row>
                    <Row>
                        <FeatherIcon name='cloud' style={{ fontSize: 20, color: this.estilo.cor.white + '77', marginTop: 3 }} />
                        <Text style={{ fontSize: 17, color: this.estilo.cor.white + '77' }}>  {this.state.lista_weather.sensacao_termica_minima_sombra[i]} / </Text>
                        <Text style={{ fontSize: 17, color: this.estilo.cor.white }}>{this.state.lista_weather.sensacao_termica_maxima_sombra[i]}º</Text>
                    </Row>
                    <Row style={{ justifyContent: 'flex-end' }}>
                        <FeatherIcon name='sun' style={{ fontSize: 20, color: this.estilo.cor.white + '77', marginTop: 3 }} />
                        <Text style={{ fontSize: 17, color: this.estilo.cor.white + '77' }}>  {this.state.lista_weather.sensacao_termica_minima[i]} / </Text>
                        <Text style={{ fontSize: 17, color: this.estilo.cor.white }}>{this.state.lista_weather.sensacao_termica_maxima[i]}º</Text>
                    </Row>
                </Row>
                {/* dia */}
                <Row style={{ alignItems: 'flex-end', marginBottom: 5, marginTop: 30 }}>
                    <FeatherIcon name='sun' style={{ fontSize: 30, color: 'white', marginLeft: -5 }} />
                    <Text style={{ fontSize: 17, color: this.estilo.cor.white, fontWeight: 'bold' }}>  Dia</Text>
                    <Row style={{ justifyContent: 'flex-end', width: '50%' }}>
                        <Text style={{ fontSize: 17, color: this.estilo.cor.white + '77' }}>nuvens </Text>
                        <Text style={{ fontSize: 17, color: this.estilo.cor.white, fontWeight: 'bold' }}>{this.state.lista_weather.dia_nuvens[i]}%</Text>
                    </Row>
                </Row>
                <Row style={{ justifyContent: 'flex-end' }} >
                    <Text style={{ fontSize: 17, color: this.estilo.cor.white + '77' }}>tempo de sol </Text>
                    <Text style={{ fontSize: 17, color: this.estilo.cor.white, fontWeight: 'bold' }}>{this.state.lista_weather.sol_duracao[i]} h</Text>
                </Row>
                <Text style={{ fontSize: 17, color: this.estilo.cor.white, marginVertical: 10 }}>{this.state.lista_weather.dia_ceu[i]}</Text>
                <Row style={{ marginTop: 10 }}>
                    <FeatherIcon name='cloud-drizzle' style={{ fontSize: 20, color: this.estilo.cor.white + '77', marginTop: 3 }} />
                    <Text style={{ fontSize: 17, color: this.estilo.cor.white + '77' }}>  {this.state.lista_weather.dia_chuva_probabilidade[i]}%  </Text>
                    <Text style={{ fontSize: 17, color: this.estilo.cor.white }}>{this.state.lista_weather.dia_chuva_mm[i]} mm</Text>
                </Row>
                <Row style={{ marginTop: 10 }}>
                    <FeatherIcon name='wind' style={{ fontSize: 20, color: this.estilo.cor.white + '77', marginTop: 3 }} />
                    <Text style={{ fontSize: 17, color: this.estilo.cor.white + '77' }}>  {this.state.lista_weather.dia_vento_direcao[i]}  </Text>
                    <Text style={{ fontSize: 17, color: this.estilo.cor.white }}>{this.state.lista_weather.dia_vento_velocidade[i]} km/h</Text>
                </Row>
                <Row style={{ marginTop: 10 }}>
                    <Row>
                        <FeatherIcon name='sunrise' style={{ fontSize: 20, color: this.estilo.cor.white + '77', marginTop: 3 }} />
                        <Text style={{ fontSize: 17, color: this.estilo.cor.white }}>  {this.state.lista_weather.sol_nascer[i]} h </Text>
                    </Row>
                    <Row style={{ justifyContent: 'flex-end' }}>
                        <FeatherIcon name='sunset' style={{ fontSize: 20, color: this.estilo.cor.white + '77', marginTop: 3 }} />
                        <Text style={{ fontSize: 17, color: this.estilo.cor.white }}>  {this.state.lista_weather.sol_por[i]} h </Text>
                    </Row>
                </Row>
                {/* noite */}
                <Row style={{ alignItems: 'flex-end', marginBottom: 5, marginTop: 30 }}>
                    <FeatherIcon name='moon' style={{ fontSize: 30, color: 'white', marginLeft: -5 }} />
                    <Text style={{ fontSize: 17, color: this.estilo.cor.white, fontWeight: 'bold' }}>  Noite</Text>
                    <Row style={{ justifyContent: 'flex-end', width: '50%' }}>
                        <Text style={{ fontSize: 17, color: this.estilo.cor.white + '77', fontWeight: 'bold' }}>nuvens </Text>
                        <Text style={{ fontSize: 17, color: this.estilo.cor.white, fontWeight: 'bold' }}>{this.state.lista_weather.noite_nuvens[i]}%</Text>
                    </Row>
                </Row>
                <Text style={{ fontSize: 17, color: this.estilo.cor.white, marginVertical: 10 }}>{this.state.lista_weather.noite_ceu[i]}</Text>
                <Row style={{ marginTop: 10 }}>
                    <FeatherIcon name='cloud-drizzle' style={{ fontSize: 20, color: this.estilo.cor.white + '77', marginTop: 3 }} />
                    <Text style={{ fontSize: 17, color: this.estilo.cor.white + '77' }}>  {this.state.lista_weather.noite_chuva_probabilidade[i]}%</Text>
                    <Text style={{ fontSize: 17, color: this.estilo.cor.white }}>  {this.state.lista_weather.noite_chuva_mm[i]} mm</Text>
                </Row>
                <Row style={{ marginTop: 10 }}>
                    <FeatherIcon name='wind' style={{ fontSize: 20, color: this.estilo.cor.white + '77', marginTop: 3 }} />
                    <Text style={{ fontSize: 17, color: this.estilo.cor.white + '77' }}>  {this.state.lista_weather.noite_vento_direcao[i]}</Text>
                    <Text style={{ fontSize: 17, color: this.estilo.cor.white }}>  {this.state.lista_weather.noite_vento_velocidade[i]} km/h</Text>
                </Row>
                <Row style={{ marginTop: 10 }}>
                    <Row>
                        <FeatherIcon name='arrow-up' style={{ fontSize: 20, color: this.estilo.cor.white + '77', marginTop: 3 }} />
                        <Text style={{ fontSize: 17, color: this.estilo.cor.white }}> {this.state.lista_weather.lua_nascer[i]} h </Text>
                    </Row>
                    <Row style={{ justifyContent: 'flex-end' }}>
                        <FeatherIcon name='arrow-down' style={{ fontSize: 20, color: this.estilo.cor.white + '77', marginTop: 3 }} />
                        <Text style={{ fontSize: 17, color: this.estilo.cor.white }}> {this.state.lista_weather.lua_por[i]} h </Text>
                    </Row>
                </Row>
            </Form>
        </ListItem>
    }

    render() {
        return (
            <Container>
                <LinearGradient colors={[
                    this.estilo.cor.blue_dark, this.estilo.cor.blue_dark,
                    this.estilo.cor.blue_light,
                    this.estilo.cor.white
                ]}
                    style={{ flex: 1 }} angle={0} angleCenter={{ x: 0, y: 0.75 }} useAngle={true} >
                    <Content>
                        <ScrollView
                            horizontal
                            pagingEnabled
                            decelerationRate='fast'
                            snapToAlignment='center'
                            snapToInterval={Dimensions.get('window').width - 60} //your element width
                        >
                            {this.state.lista_weather.hora.map((value, i) => (this.renderCard(i)))}
                        </ScrollView>
                    </Content>
                    {this.state.loaded ? null : <Spinner color={this.estilo.cor.white + '77'} style={{ alignSelf: 'center', marginBottom: 30 }} />}
                </LinearGradient>
            </Container>
        )
    }
}