import React, { Component } from 'react'
import { StatusBar, Dimensions } from 'react-native'
import { Text, Form, ListItem, Row, Spinner, Content, Container, View, Button, Col } from 'native-base'
import estilo from '../assets/Estilo'
import FeatherIcon from 'react-native-vector-icons/Feather'
import axios from 'axios'
import rnfs from 'react-native-fs'
import Chart from './ChartWeek'

export default class WeatherWeek extends Component {
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
            lista_weather: {
                dia_semana: [], hora: [], dia_nuvens: [], dia_ceu: [], dia_chuva_probabilidade: [],
                dia_chuva_mm: [], dia_vento_velocidade: [], dia_vento_direcao: [], sol_nascer: [],
                sol_por: [], sol_duracao: [], noite_nuvens: [], noite_ceu: [], noite_chuva_probabilidade: [],
                noite_chuva_mm: [], noite_vento_velocidade: [], noite_vento_direcao: [], lua_nascer: [],
                lua_por: [], temperatura_maxima: [], temperatura_minima: [], sensacao_termica_maxima: [],
                sensacao_termica_minima: [], sensacao_termica_maxima_sombra: [], sensacao_termica_minima_sombra: []
            },
            dia_semana_aux: undefined,
            hora_aux: undefined,
        }
        this.card_weather = [
            { index: 0, icon: 'thermometer', variavel_ambiental: 'Temperatura', cor: this.estilo.cor.purple },
            { index: 1, icon: 'sun', variavel_ambiental: 'Dia', cor: this.estilo.cor.orange },
            { index: 2, icon: 'moon', variavel_ambiental: 'Noite', cor: this.estilo.cor.orange_medium },
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
                    array_obj.dia_semana.push({ value: dia_semana })
                    array_obj.sensacao_termica_minima.push(sensacao_termica_minima)
                    array_obj.sensacao_termica_maxima.push(sensacao_termica_maxima)
                    array_obj.sensacao_termica_minima_sombra.push(sensacao_termica_minima_sombra)
                    array_obj.sensacao_termica_maxima_sombra.push(sensacao_termica_maxima_sombra)
                    array_obj.temperatura_minima.push(temperatura_minima)
                    array_obj.temperatura_maxima.push(temperatura_maxima)
                    array_obj.dia_nuvens.push(dia_nuvens)
                    array_obj.dia_ceu.push({ value: dia_ceu })
                    array_obj.dia_chuva_probabilidade.push(dia_chuva_probabilidade)
                    array_obj.dia_chuva_mm.push(dia_chuva_mm)
                    array_obj.dia_vento_velocidade.push(dia_vento_velocidade)
                    array_obj.dia_vento_direcao.push({ value: dia_vento_direcao })
                    array_obj.sol_nascer.push({ value: sol_nascer })
                    array_obj.sol_por.push({ value: sol_por })
                    array_obj.sol_duracao.push(sol_duracao)
                    array_obj.noite_nuvens.push(noite_nuvens)
                    array_obj.noite_ceu.push({ value: noite_ceu })
                    array_obj.noite_chuva_probabilidade.push(noite_chuva_probabilidade)
                    array_obj.noite_chuva_mm.push(noite_chuva_mm)
                    array_obj.noite_vento_velocidade.push(noite_vento_velocidade)
                    array_obj.noite_vento_direcao.push({ value: noite_vento_direcao })
                    array_obj.lua_nascer.push({ value: lua_nascer })
                    array_obj.lua_por.push({ value: lua_por })

                    index == 0 || index == 4 ? [
                        array_obj.hora.push(hora),
                        array_obj.dia_semana.push({ value: dia_semana }),
                        array_obj.sensacao_termica_minima.push(sensacao_termica_minima),
                        array_obj.sensacao_termica_maxima.push(sensacao_termica_maxima),
                        array_obj.sensacao_termica_minima_sombra.push(sensacao_termica_minima_sombra),
                        array_obj.sensacao_termica_maxima_sombra.push(sensacao_termica_maxima_sombra),
                        array_obj.temperatura_minima.push(temperatura_minima),
                        array_obj.temperatura_maxima.push(temperatura_maxima),
                        array_obj.dia_nuvens.push(dia_nuvens),
                        array_obj.dia_ceu.push({ value: dia_ceu }),
                        array_obj.dia_chuva_probabilidade.push(dia_chuva_probabilidade),
                        array_obj.dia_chuva_mm.push(dia_chuva_mm),
                        array_obj.dia_vento_velocidade.push(dia_vento_velocidade),
                        array_obj.dia_vento_direcao.push({ value: dia_vento_direcao }),
                        array_obj.sol_nascer.push({ value: sol_nascer }),
                        array_obj.sol_por.push({ value: sol_por }),
                        array_obj.sol_duracao.push(sol_duracao),
                        array_obj.noite_nuvens.push(noite_nuvens),
                        array_obj.noite_ceu.push({ value: noite_ceu }),
                        array_obj.noite_chuva_probabilidade.push(noite_chuva_probabilidade),
                        array_obj.noite_chuva_mm.push(noite_chuva_mm),
                        array_obj.noite_vento_velocidade.push(noite_vento_velocidade),
                        array_obj.noite_vento_direcao.push({ value: noite_vento_direcao }),
                        array_obj.lua_nascer.push({ value: lua_nascer }),
                        array_obj.lua_por.push({ value: lua_por })
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

    renderTemperatura() {
        return <Content style={{ backgroundColor: this.estilo.cor.white, flex: 1 }}>
            <View style={{ width: Dimensions.get('screen').width, alignItems: 'center' }}>
                <View style={{
                    backgroundColor: this.estilo.cor.purple, borderRadius: 10, alignItems: 'center',
                    alignSelf: 'center', padding: 20, marginBottom: 20, marginTop: 10, elevation: 10
                }}>
                    <Form style={{
                        flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 20,
                        backgroundColor: this.estilo.cor.white + '11', borderRadius: 100, marginBottom: 20
                    }}>
                        <Text style={{ fontSize: 17, color: this.estilo.cor.white, fontWeight: 'bold' }}>Temperatura    </Text>
                        <FeatherIcon name='thermometer' style={{ fontSize: 20, color: this.estilo.cor.white, marginLeft: -5 }} />
                    </Form>
                    <View style={{ height: 70, marginTop: 40 }}>
                        <Chart data_array={this.state.lista_weather.temperatura_maxima}
                            opacity={''}
                            color={this.estilo.cor.white} label_data='º' />
                    </View>
                    <View style={{ height: 100, marginTop: 10 }}>
                        <Chart data_array={this.state.lista_weather.temperatura_minima}
                            label_array={this.state.lista_weather.dia_semana}
                            opacity={'77'}
                            color={this.estilo.cor.white} label_data='º' />
                    </View>
                </View>

                {/* Sensação Térmica */}
                <View style={{
                    backgroundColor: this.estilo.cor.purple_vivid, borderRadius: 10, alignItems: 'center',
                    alignSelf: 'center', padding: 20, marginBottom: 20, elevation: 10
                }}>
                    <Form style={{ flexDirection: 'row', marginBottom: 20 }}>
                        <Text style={{
                            fontSize: 17, color: this.estilo.cor.white, fontWeight: 'bold',
                            backgroundColor: this.estilo.cor.white + '11', paddingVertical: 10,
                            paddingHorizontal: 20, borderRadius: 50
                        }}>Sensação térmica</Text>
                        <Form style={{ backgroundColor: this.estilo.cor.white + '11', marginLeft: 15, flexDirection: 'row', borderRadius: 50 }}>
                            <Button rounded transparent style={{ backgroundColor: this.state.sensacao_termica == 0 ? this.estilo.cor.white + '33' : 'transparent' }}
                                onPress={() => this.setState({ sensacao_termica: 0 })}>
                                {this.state.sensacao_termica == 0 ?
                                    <Text uppercase={false} style={{ color: this.estilo.cor.white }}>Sol</Text> :
                                    <FeatherIcon name='sun'
                                        style={{ fontSize: 20, marginHorizontal: 15, color: this.estilo.cor.white + '77' }} />}
                            </Button>
                            <Button rounded transparent style={{ backgroundColor: this.state.sensacao_termica == 1 ? this.estilo.cor.white + '33' : 'transparent' }}
                                onPress={() => this.setState({ sensacao_termica: 1 })}>
                                {this.state.sensacao_termica == 1 ?
                                    <Text uppercase={false} style={{ color: this.estilo.cor.white }}>Sombra</Text> :
                                    <FeatherIcon name='cloud'
                                        style={{ fontSize: 20, marginHorizontal: 15, color: this.estilo.cor.white + '77' }} />}
                            </Button>
                        </Form>
                    </Form>

                    <View style={{ height: 70, marginTop: 20, display: this.state.sensacao_termica == 0 ? 'flex' : 'none' }}>
                        <Chart data_array={this.state.lista_weather.sensacao_termica_maxima}
                            opacity={''}
                            color={this.estilo.cor.white} label_data='º' />
                    </View>
                    <View style={{ height: 100, marginTop: 10, display: this.state.sensacao_termica == 0 ? 'flex' : 'none' }}>
                        <Chart data_array={this.state.lista_weather.sensacao_termica_minima}
                            label_array={this.state.lista_weather.dia_semana}
                            opacity={'99'}
                            color={this.estilo.cor.white} label_data='º' />
                    </View>

                    <View style={{ height: 70, marginTop: 20, display: this.state.sensacao_termica == 1 ? 'flex' : 'none' }}>
                        <Chart data_array={this.state.lista_weather.sensacao_termica_maxima_sombra}
                            opacity={''}
                            color={this.estilo.cor.white} label_data='º' />
                    </View>
                    <View style={{ height: 100, marginTop: 10, display: this.state.sensacao_termica == 1 ? 'flex' : 'none' }}>
                        <Chart data_array={this.state.lista_weather.sensacao_termica_minima_sombra}
                            label_array={this.state.lista_weather.dia_semana}
                            opacity={'99'}
                            color={this.estilo.cor.white} label_data='º' />
                    </View>
                </View>
            </View>
        </Content>
    }

    renderDia() {
        return <Content style={{ backgroundColor: this.estilo.cor.white, flex: 1 }}>
            <View style={{ width: Dimensions.get('screen').width, alignItems: 'center' }}>
                <View style={{
                    backgroundColor: this.estilo.cor.blue, borderRadius: 10, alignItems: 'center',
                    alignSelf: 'center', padding: 20, marginBottom: 20, marginTop: 10, elevation: 10
                }}>
                    <Form style={{
                        flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 20,
                        backgroundColor: this.estilo.cor.white + '11', borderRadius: 100, marginBottom: 20
                    }}>
                        <Text style={{ fontSize: 17, color: this.estilo.cor.white, fontWeight: 'bold' }}>Chuva    </Text>
                        <FeatherIcon name='cloud-drizzle' style={{ fontSize: 20, color: this.estilo.cor.white, marginLeft: -5 }} />
                    </Form>
                    <View style={{ height: 120, marginTop: 10 }}>
                        <Chart data_array={this.state.lista_weather.dia_chuva_mm}
                            label_array={this.state.lista_weather.dia_semana}
                            label_descricao_array={this.state.lista_weather.dia_chuva_probabilidade}
                            label_array_label={'%'}
                            opacity={''}
                            color={this.estilo.cor.white} label_data=' mm' />
                    </View>
                </View>

                {/* Vento */}
                <View style={{
                    backgroundColor: this.estilo.cor.greenish_medium, borderRadius: 10, alignItems: 'center',
                    alignSelf: 'center', padding: 20, marginBottom: 20, elevation: 10
                }}>
                    <Form style={{
                        flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 20,
                        backgroundColor: this.estilo.cor.white + '11', borderRadius: 100, marginBottom: 40
                    }}>
                        <Text style={{ fontSize: 17, color: this.estilo.cor.white, fontWeight: 'bold' }}>Vento    </Text>
                        <FeatherIcon name='wind' style={{ fontSize: 20, color: this.estilo.cor.white, marginLeft: -5 }} />
                    </Form>
                    <View style={{ height: 120, marginTop: 20 }}>
                        <Chart data_array={this.state.lista_weather.dia_vento_velocidade}
                            label_array={this.state.lista_weather.dia_semana}
                            label_descricao_array={this.state.lista_weather.dia_vento_direcao}
                            opacity={''}
                            color={this.estilo.cor.white} label_data=' km/h' />
                    </View>
                </View>

                {/* Nuvens */}
                <View style={{
                    backgroundColor: this.estilo.cor.gray, borderRadius: 10, alignItems: 'center',
                    alignSelf: 'center', padding: 20, marginBottom: 20, elevation: 10
                }}>
                    <Form style={{
                        flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 20,
                        backgroundColor: this.estilo.cor.white + '11', borderRadius: 100, marginBottom: 20
                    }}>
                        <Text style={{ fontSize: 17, color: this.estilo.cor.white, fontWeight: 'bold' }}>Nuvens    </Text>
                        <FeatherIcon name='cloud' style={{ fontSize: 20, color: this.estilo.cor.white, marginLeft: -5 }} />
                    </Form>
                    <View style={{ height: 100, marginTop: 20 }}>
                        <Chart data_array={this.state.lista_weather.dia_nuvens}
                            label_array={this.state.lista_weather.dia_semana}
                            opacity={''}
                            color={this.estilo.cor.white} label_data='%' />
                    </View>
                </View>

                {/* Sol */}
                <View style={{
                    backgroundColor: this.estilo.cor.orange, borderRadius: 10, alignItems: 'center',
                    alignSelf: 'center', padding: 20, marginBottom: 20, elevation: 10
                }}>
                    <Form style={{ flexDirection: 'row', marginBottom: 20 }}>
                        <Text style={{
                            fontSize: 17, color: this.estilo.cor.white, fontWeight: 'bold',
                            backgroundColor: this.estilo.cor.white + '11', paddingVertical: 10,
                            paddingHorizontal: 20, borderRadius: 50
                        }}>Sol</Text>
                        <Form style={{ backgroundColor: this.estilo.cor.white + '11', marginLeft: 15, flexDirection: 'row', borderRadius: 50 }}>
                            <Button rounded transparent style={{ backgroundColor: this.state.sol == 0 ? this.estilo.cor.white + '33' : 'transparent' }}
                                onPress={() => this.setState({ sol: 0 })}>
                                {this.state.sol == 0 ?
                                    <Text uppercase={false} style={{ color: this.estilo.cor.white }}>Nascer</Text> :
                                    <FeatherIcon name='sunrise'
                                        style={{ fontSize: 20, marginHorizontal: 15, color: this.estilo.cor.white + '77' }} />}
                            </Button>
                            <Button rounded transparent style={{ backgroundColor: this.state.sol == 1 ? this.estilo.cor.white + '33' : 'transparent' }}
                                onPress={() => this.setState({ sol: 1 })}>
                                {this.state.sol == 1 ?
                                    <Text uppercase={false} style={{ color: this.estilo.cor.white }}>Por</Text> :
                                    <FeatherIcon name='sunset'
                                        style={{ fontSize: 20, marginHorizontal: 15, color: this.estilo.cor.white + '77' }} />}
                            </Button>
                        </Form>
                    </Form>
                    <View style={{ height: 50, marginTop: 10, display: this.state.sol == 0 ? 'flex' : 'none' }}>
                        <Chart label_descricao_array={this.state.lista_weather.sol_nascer}
                            label_array={this.state.lista_weather.dia_semana}
                            label_array_label_value={'h'}
                            opacity={''} label_descricao_array_bold={true}
                            color={this.estilo.cor.white} />
                    </View>
                    <View style={{ height: 50, marginTop: 10, display: this.state.sol == 1 ? 'flex' : 'none' }}>
                        <Chart label_descricao_array={this.state.lista_weather.sol_por}
                            label_array={this.state.lista_weather.dia_semana}
                            label_array_label_value={'h'}
                            opacity={''} label_descricao_array_bold={true}
                            color={this.estilo.cor.white} />
                    </View>
                </View>

                {/* Sol duração */}
                <View style={{
                    backgroundColor: this.estilo.cor.orange_medium, borderRadius: 10, alignItems: 'center',
                    alignSelf: 'center', padding: 20, marginBottom: 20, elevation: 10
                }}>
                    <Form style={{
                        flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 20,
                        backgroundColor: this.estilo.cor.white + '11', borderRadius: 100, marginBottom: 20
                    }}>
                        <Text style={{ fontSize: 17, color: this.estilo.cor.white, fontWeight: 'bold' }}>Tempo de sol    </Text>
                        <FeatherIcon name='clock' style={{ fontSize: 20, color: this.estilo.cor.white, marginLeft: -5 }} />
                    </Form>
                    <View style={{ height: 50, marginTop: 10 }}>
                        <Chart label_descricao_array={this.state.lista_weather.sol_duracao}
                            label_array={this.state.lista_weather.dia_semana}
                            label_array_label={'h'}
                            opacity={''} label_descricao_array_bold={true}
                            color={this.estilo.cor.white} />
                    </View>
                </View>
            </View>
        </Content>
    }

    renderNoite() {
        return <Content style={{ backgroundColor: this.estilo.cor.white, flex: 1 }}>
            <View style={{ width: Dimensions.get('screen').width, alignItems: 'center' }}>
                <View style={{
                    backgroundColor: this.estilo.cor.blue, borderRadius: 10, alignItems: 'center',
                    alignSelf: 'center', padding: 20, marginBottom: 20, marginTop: 10, elevation: 10
                }}>
                    <Form style={{
                        flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 20,
                        backgroundColor: this.estilo.cor.white + '11', borderRadius: 100, marginBottom: 20
                    }}>
                        <Text style={{ fontSize: 17, color: this.estilo.cor.white, fontWeight: 'bold' }}>Chuva    </Text>
                        <FeatherIcon name='cloud-drizzle' style={{ fontSize: 20, color: this.estilo.cor.white, marginLeft: -5 }} />
                    </Form>
                    <View style={{ height: 120, marginTop: 10 }}>
                        <Chart data_array={this.state.lista_weather.noite_chuva_mm}
                            label_array={this.state.lista_weather.dia_semana}
                            label_descricao_array={this.state.lista_weather.noite_chuva_probabilidade}
                            label_array_label={'%'}
                            opacity={''}
                            color={this.estilo.cor.white} label_data=' mm' />
                    </View>
                </View>
                {/* Vento */}

                <View style={{
                    backgroundColor: this.estilo.cor.greenish_medium, borderRadius: 10, alignItems: 'center',
                    alignSelf: 'center', padding: 20, marginBottom: 20, elevation: 10
                }}>
                    <Form style={{
                        flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 20,
                        backgroundColor: this.estilo.cor.white + '11', borderRadius: 100, marginBottom: 40
                    }}>
                        <Text style={{ fontSize: 17, color: this.estilo.cor.white, fontWeight: 'bold' }}>Vento    </Text>
                        <FeatherIcon name='wind' style={{ fontSize: 20, color: this.estilo.cor.white, marginLeft: -5 }} />
                    </Form>
                    <View style={{ height: 120, marginTop: 20 }}>
                        <Chart data_array={this.state.lista_weather.noite_vento_velocidade}
                            label_array={this.state.lista_weather.dia_semana}
                            label_descricao_array={this.state.lista_weather.noite_vento_direcao}
                            opacity={''}
                            color={this.estilo.cor.white} label_data=' km/h' />
                    </View>
                </View>

                {/* Nuvens */}
                <View style={{
                    backgroundColor: this.estilo.cor.gray, borderRadius: 10, alignItems: 'center',
                    alignSelf: 'center', padding: 20, marginBottom: 20, elevation: 10
                }}>
                    <Form style={{
                        flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 20,
                        backgroundColor: this.estilo.cor.white + '11', borderRadius: 100, marginBottom: 20
                    }}>
                        <Text style={{ fontSize: 17, color: this.estilo.cor.white, fontWeight: 'bold' }}>Nuvens    </Text>
                        <FeatherIcon name='cloud' style={{ fontSize: 20, color: this.estilo.cor.white, marginLeft: -5 }} />
                    </Form>
                    <View style={{ height: 100, marginTop: 20 }}>
                        <Chart data_array={this.state.lista_weather.noite_nuvens}
                            label_array={this.state.lista_weather.dia_semana}
                            opacity={''}
                            color={this.estilo.cor.white} label_data='%' />
                    </View>
                </View>

                {/* Lua */}
                <View style={{
                    backgroundColor: this.estilo.cor.orange, borderRadius: 10, alignItems: 'center',
                    alignSelf: 'center', padding: 20, marginBottom: 20, elevation: 10
                }}>
                    <Form style={{ flexDirection: 'row', marginBottom: 20 }}>
                        <Text style={{
                            fontSize: 17, color: this.estilo.cor.white, fontWeight: 'bold',
                            backgroundColor: this.estilo.cor.white + '11', paddingVertical: 10,
                            paddingHorizontal: 20, borderRadius: 50
                        }}>Lua</Text>
                        <Form style={{ backgroundColor: this.estilo.cor.white + '11', marginLeft: 15, flexDirection: 'row', borderRadius: 50 }}>
                            <Button rounded transparent style={{ backgroundColor: this.state.lua == 0 ? this.estilo.cor.white + '33' : 'transparent' }}
                                onPress={() => this.setState({ lua: 0 })}>
                                {this.state.lua == 0 ?
                                    <Text uppercase={false} style={{ color: this.estilo.cor.white }}>Nascer</Text> :
                                    <FeatherIcon name='arrow-up'
                                        style={{ fontSize: 20, marginHorizontal: 15, color: this.estilo.cor.white + '77' }} />}
                            </Button>
                            <Button rounded transparent style={{ backgroundColor: this.state.lua == 1 ? this.estilo.cor.white + '33' : 'transparent' }}
                                onPress={() => this.setState({ lua: 1 })}>
                                {this.state.lua == 1 ?
                                    <Text uppercase={false} style={{ color: this.estilo.cor.white }}>Por</Text> :
                                    <FeatherIcon name='arrow-down'
                                        style={{ fontSize: 20, marginHorizontal: 15, color: this.estilo.cor.white + '77' }} />}
                            </Button>
                        </Form>
                    </Form>
                    <View style={{ height: 50, marginTop: 10, display: this.state.lua == 0 ? 'flex' : 'none' }}>
                        <Chart label_descricao_array={this.state.lista_weather.lua_nascer}
                            label_array={this.state.lista_weather.dia_semana}
                            label_array_label_value={'h'}
                            opacity={''} label_descricao_array_bold={true}
                            color={this.estilo.cor.white} />
                    </View>
                    <View style={{ height: 50, marginTop: 10, display: this.state.lua == 1 ? 'flex' : 'none' }}>
                        <Chart label_descricao_array={this.state.lista_weather.lua_por}
                            label_array={this.state.lista_weather.dia_semana}
                            label_array_label_value={'h'}
                            opacity={''} label_descricao_array_bold={true}
                            color={this.estilo.cor.white} />
                    </View>
                </View>
            </View>
        </Content>
    }

    render() {
        return (
            <Container style={{ flex: 1, backgroundColor: 'red' }}>
                <StatusBar backgroundColor={this.estilo.cor.white} barStyle='light-content' />

                {this.state.card_weather_atual == 0 ? this.renderTemperatura() :
                    this.state.card_weather_atual == 1 ? this.renderDia() :
                        this.state.card_weather_atual == 2 ? this.renderNoite() : null}

                <Form style={{ flexDirection: 'row', justifyContent: 'center', backgroundColor: this.estilo.cor.white, paddingVertical: 5 }}>
                    {this.card_weather.map((item) => (
                        <Button key={item.icon} rounded style={{ paddingHorizontal: 10, backgroundColor: '', elevation: 0 }}
                            onPress={() => {
                                this.setState({
                                    card_weather_atual: item.index, card_weather_cor: item.cor,
                                    variavel_ambiental: item.variavel_ambiental
                                })
                            }}>
                            {item.index == this.state.card_weather_atual ?
                                <Text uppercase={false} style={{ color: this.estilo.cor.gray_solid, fontSize: 18, marginLeft: -20 }}
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