import React, { Component } from 'react'
import { Button, Container, Text, View, Form } from 'native-base'
import estilo from '../assets/Estilo'
import FeatherIcon from 'react-native-vector-icons/Feather'
import axios from 'axios'
import rnfs from 'react-native-fs'
import Chart from './Chart'

export default class WeatherToday extends Component {
    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.state = {
            loaded: false,
            card_weather_atual: 0,
            card_weather_cor: this.estilo.cor.purple,
            unidade_de_medida: 'ºC',
            variavel_ambiental: 'Temperatura',
            lista_weather: {
                dia_semana: [], hora: [],
                situacao: [], temperatura: [],
                sensacao_termica: [], temperatura_de_bulbo_umido: [],
                ponto_de_orvalho: [], vento_velocidade: [],
                vento_direcao: [], umidade_relativa: [],
                chuva_quantidade: [], chuva_probabilidade: [],
                uv_indice: [], uv_descricao: []
            },
            dia_semana_aux: undefined,
            hora_aux: undefined,
        }
        this.card_weather = [
            { index: 0, icon: 'thermometer', unidade_de_medida: 'ºC', variavel_ambiental: 'Temperatura', cor: this.estilo.cor.purple },
            { index: 1, icon: 'droplet', unidade_de_medida: '%', variavel_ambiental: 'Umidade', cor: this.estilo.cor.greenish_medium },
            { index: 2, icon: 'cloud-drizzle', unidade_de_medida: 'mm', variavel_ambiental: 'Chuva', cor: this.estilo.cor.blue },
            { index: 3, icon: 'wind', unidade_de_medida: 'km/h', variavel_ambiental: 'Vento', cor: this.estilo.cor.greenish_medium },
            { index: 4, icon: 'sun', unidade_de_medida: 'uv', variavel_ambiental: 'Radiação', cor: this.estilo.cor.orange },
        ]
        this.card_weather_temperatura = [
            { index: 0, label: 'Real', unidade_de_medida: 'ºC' },
            { index: 0.1, label: 'Sensação térmica', unidade_de_medida: 'ºC' },
            { index: 0.2, label: 'Bulbo úmido', unidade_de_medida: 'ºC' },
            { index: 0.3, label: 'Ponto de orvalho', unidade_de_medida: 'ºC' },
        ]
    }

    componentWillReceiveProps() {
        if (this.props.update) this.load()
    }

    async load() {
        await this.lerArquivo(rnfs.DocumentDirectoryPath)
        if (this.getStringDayOfWeek(new Date().getDay()) == this.state.dia_semana_aux
            && (new Date().getHours()) - this.state.hora_aux < 1)
            console.log('Dados Weather (12h) já atualizados')
        else {
            console.log('Dados Weather (12h) desatualizados ou inexistentes\nobtendo novos dados ...')
            await this.getWeather()
        }
        this.setState({ loaded: true })
        console.log(this.state.lista_weather)
    }

    async getWeather() {
        await axios
            .get('http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/38025?apikey=AJ8uokBYThYFdXod4T6hebp4pLvEUQom&language=pt-br&details=true&metric=true')
            .then(async (data) => {
                let array = data.data
                let dia_semana, hora, situacao, temperatura, sensacao_termica, chuva_quantidade, chuva_probabilidade,
                    ponto_de_orvalho, vento_velocidade, vento_direcao, umidade_relativa, temperatura_de_bulbo_umido,
                    uv_indice, uv_descricao
                array_obj = {
                    dia_semana: [], hora: [], situacao: [], temperatura: [], sensacao_termica: [],
                    temperatura_de_bulbo_umido: [], ponto_de_orvalho: [], umidade_relativa: [], chuva_quantidade: [],
                    vento_velocidade: [], vento_direcao: [], chuva_probabilidade: [], uv_indice: [], uv_descricao: [],
                    menor_temperatura: undefined, menor_vento_velocidade: undefined, maior_ponto_de_orvalho: undefined,
                    menor_sensacao_termica: undefined, menor_temperatura_de_bulbo_umido: undefined,
                    menor_ponto_de_orvalho: undefined, menor_chuva_quantidade: undefined, maior_temperatura: undefined,
                    menor_umidade_relativa: undefined, maior_umidade_relativa: undefined,
                    maior_sensacao_termica: undefined, maior_temperatura_de_bulbo_umido: undefined,
                    maior_vento_velocidade: undefined, maior_chuva_quantidade: undefined,
                    menor_chuva_probabilidade: undefined, maior_chuva_probabilidade: undefined,
                    menor_uv_indice: undefined, maior_uv_indice: undefined
                }
                let menor_temperatura = 100, menor_sensacao_termica = 100, menor_vento_velocidade = 100,
                    menor_temperatura_de_bulbo_umido = 100, menor_ponto_de_orvalho = 100,
                    menor_umidade_relativa = 100, menor_chuva_quantidade = 100,
                    menor_chuva_probabilidade = 100, menor_uv_indice = 100
                let maior_temperatura = 0, maior_sensacao_termica = 0, maior_vento_velocidade = 0,
                    maior_temperatura_de_bulbo_umido = 0, maior_ponto_de_orvalho = 0,
                    maior_umidade_relativa = 0, maior_chuva_quantidade = 0,
                    maior_chuva_probabilidade = 0, maior_uv_indice = 0

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
                    vento_velocidade = element.Wind.Speed.Value
                    vento_direcao = element.Wind.Direction.Localized
                    umidade_relativa = element.RelativeHumidity
                    chuva_quantidade = element.Rain.Value
                    chuva_probabilidade = element.RainProbability
                    uv_indice = element.UVIndex
                    uv_descricao = element.UVIndexText
                    uv_descricao && uv_descricao == 'Muito alto' ? uv_descricao = 'Muito\nalto' : uv_descricao

                    menor_temperatura > temperatura ? menor_temperatura = temperatura : null
                    menor_sensacao_termica > sensacao_termica ? menor_sensacao_termica = sensacao_termica : null
                    menor_temperatura_de_bulbo_umido > temperatura_de_bulbo_umido ? menor_temperatura_de_bulbo_umido = temperatura_de_bulbo_umido : null
                    menor_ponto_de_orvalho > ponto_de_orvalho ? menor_ponto_de_orvalho = ponto_de_orvalho : null
                    menor_vento_velocidade > vento_velocidade ? menor_vento_velocidade = vento_velocidade : null
                    menor_umidade_relativa > umidade_relativa ? menor_umidade_relativa = umidade_relativa : null
                    menor_chuva_quantidade > chuva_quantidade ? menor_chuva_quantidade = chuva_quantidade : null
                    menor_chuva_probabilidade > chuva_probabilidade ? menor_chuva_probabilidade = chuva_probabilidade : null
                    menor_uv_indice > uv_indice ? menor_uv_indice = uv_indice : null

                    maior_temperatura < temperatura ? maior_temperatura = temperatura : null
                    maior_sensacao_termica < sensacao_termica ? maior_sensacao_termica = sensacao_termica : null
                    maior_temperatura_de_bulbo_umido < temperatura_de_bulbo_umido ? maior_temperatura_de_bulbo_umido = temperatura_de_bulbo_umido : null
                    maior_ponto_de_orvalho < ponto_de_orvalho ? maior_ponto_de_orvalho = ponto_de_orvalho : null
                    maior_vento_velocidade < vento_velocidade ? maior_vento_velocidade = vento_velocidade : null
                    maior_umidade_relativa < umidade_relativa ? maior_umidade_relativa = umidade_relativa : null
                    maior_chuva_quantidade < chuva_quantidade ? maior_chuva_quantidade = chuva_quantidade : null
                    maior_chuva_probabilidade < chuva_probabilidade ? maior_chuva_probabilidade = chuva_probabilidade : null
                    maior_uv_indice < uv_indice ? maior_uv_indice = uv_indice : null

                    array_obj.dia_semana.push(dia_semana)
                    array_obj.hora.push(hora)
                    array_obj.situacao.push(situacao)
                    array_obj.temperatura.push(temperatura)
                    array_obj.sensacao_termica.push(sensacao_termica)
                    array_obj.temperatura_de_bulbo_umido.push(temperatura_de_bulbo_umido)
                    array_obj.ponto_de_orvalho.push(ponto_de_orvalho)
                    array_obj.vento_direcao.push({ value: vento_direcao })
                    array_obj.vento_velocidade.push(vento_velocidade)
                    array_obj.umidade_relativa.push(umidade_relativa)
                    array_obj.chuva_quantidade.push(chuva_quantidade)
                    array_obj.chuva_probabilidade.push(chuva_probabilidade)
                    array_obj.uv_indice.push(uv_indice)
                    array_obj.uv_descricao.push({ value: uv_descricao })

                    index == 0 || index == 11 ? [
                        array_obj.dia_semana.push(dia_semana),
                        array_obj.hora.push(hora),
                        array_obj.situacao.push(situacao),
                        array_obj.temperatura.push(temperatura),
                        array_obj.sensacao_termica.push(sensacao_termica),
                        array_obj.temperatura_de_bulbo_umido.push(temperatura_de_bulbo_umido),
                        array_obj.ponto_de_orvalho.push(ponto_de_orvalho),
                        array_obj.vento_direcao.push({ value: vento_direcao }),
                        array_obj.vento_velocidade.push(vento_velocidade),
                        array_obj.umidade_relativa.push(umidade_relativa),
                        array_obj.chuva_quantidade.push(chuva_quantidade),
                        array_obj.chuva_probabilidade.push(chuva_probabilidade),
                        array_obj.uv_indice.push(uv_indice),
                        array_obj.uv_descricao.push({ value: uv_descricao })
                    ] : null
                })

                array_obj.menor_temperatura = menor_temperatura
                array_obj.menor_sensacao_termica = menor_sensacao_termica
                array_obj.menor_temperatura_de_bulbo_umido = menor_temperatura_de_bulbo_umido
                array_obj.menor_ponto_de_orvalho = menor_ponto_de_orvalho
                array_obj.menor_vento_velocidade = menor_vento_velocidade
                array_obj.menor_umidade_relativa = menor_umidade_relativa
                array_obj.menor_chuva_quantidade = menor_chuva_quantidade
                array_obj.menor_chuva_probabilidade = menor_chuva_probabilidade
                array_obj.menor_uv_indice = menor_uv_indice
                array_obj.maior_temperatura = maior_temperatura
                array_obj.maior_sensacao_termica = maior_sensacao_termica
                array_obj.maior_temperatura_de_bulbo_umido = maior_temperatura_de_bulbo_umido
                array_obj.maior_ponto_de_orvalho = maior_ponto_de_orvalho
                array_obj.maior_vento_velocidade = maior_vento_velocidade
                array_obj.maior_umidade_relativa = maior_umidade_relativa
                array_obj.maior_chuva_quantidade = maior_chuva_quantidade
                array_obj.maior_chuva_probabilidade = maior_chuva_probabilidade
                array_obj.maior_uv_indice = maior_uv_indice

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
        return (
            <Container>
                <Button rounded style={{
                    backgroundColor: this.state.card_weather_cor + '11',
                    elevation: 0, alignSelf: 'center', margin: 10, minWidth: 100, justifyContent: 'center'
                }}>
                    <Text uppercase={false} style={{ color: this.state.card_weather_cor, fontSize: 17 }}
                    >{this.state.variavel_ambiental}  ({this.state.unidade_de_medida})</Text>
                </Button>

                <Form style={[{ height: '30%', justifyContent: 'flex-end' },
                this.state.card_weather_atual == 0 ? null : { display: 'none' }]}>
                    <Chart data_array={this.state.lista_weather.temperatura}
                        label_array={this.state.lista_weather.hora}
                        min_value={this.state.lista_weather.menor_temperatura}
                        max_value={this.state.lista_weather.maior_temperatura}
                        color={this.estilo.cor.purple} />
                </Form>
                <View style={[{ height: '30%', justifyContent: 'flex-end' },
                this.state.card_weather_atual == 0.1 ? null : { display: 'none' }]}>
                    <Chart data_array={this.state.lista_weather.sensacao_termica}
                        label_array={this.state.lista_weather.hora}
                        min_value={this.state.lista_weather.menor_sensacao_termica}
                        max_value={this.state.lista_weather.maior_sensacao_termica}
                        color={this.estilo.cor.purple} />
                </View>
                <View style={[{ height: '30%', justifyContent: 'flex-end' },
                this.state.card_weather_atual == 0.2 ? null : { display: 'none' }]}>
                    <Chart data_array={this.state.lista_weather.temperatura_de_bulbo_umido}
                        label_array={this.state.lista_weather.hora}
                        min_value={this.state.lista_weather.menor_temperatura_de_bulbo_umido}
                        max_value={this.state.lista_weather.maior_temperatura_de_bulbo_umido}
                        color={this.estilo.cor.purple} />
                </View>
                <View style={[{ height: '30%', justifyContent: 'flex-end' },
                this.state.card_weather_atual == 0.3 ? null : { display: 'none' }]}>
                    <Chart data_array={this.state.lista_weather.ponto_de_orvalho}
                        label_array={this.state.lista_weather.hora}
                        min_value={this.state.lista_weather.menor_ponto_de_orvalho}
                        max_value={this.state.lista_weather.maior_ponto_de_orvalho}
                        color={this.estilo.cor.purple} />
                </View>
                <View style={[{ height: '30%', justifyContent: 'flex-end' },
                this.state.card_weather_atual == 1 ? null : { display: 'none' }]}>
                    <Chart data_array={this.state.lista_weather.umidade_relativa}
                        label_array={this.state.lista_weather.hora}
                        min_value={this.state.lista_weather.menor_umidade_relativa}
                        max_value={this.state.lista_weather.maior_umidade_relativa}
                        color={this.estilo.cor.greenish_medium} />
                </View>
                <View style={[{ height: '30%', justifyContent: 'flex-end' },
                this.state.card_weather_atual == 2 ? null : { display: 'none' }]}>
                    <Chart data_array={this.state.lista_weather.chuva_quantidade}
                        label_descricao_array={this.state.lista_weather.chuva_probabilidade}
                        label_array={this.state.lista_weather.hora} label_array_label='%'
                        min_value={this.state.lista_weather.menor_chuva_quantidade}
                        max_value={this.state.lista_weather.maior_chuva_quantidade}
                        color={this.estilo.cor.blue} />
                </View>
                <View style={[{ height: '30%', justifyContent: 'flex-end' },
                this.state.card_weather_atual == 3 ? null : { display: 'none' }]}>
                    <Chart data_array={this.state.lista_weather.vento_velocidade}
                        label_descricao_array={this.state.lista_weather.vento_direcao}
                        label_array={this.state.lista_weather.hora}
                        min_value={this.state.lista_weather.menor_vento_velocidade}
                        max_value={this.state.lista_weather.maior_vento_velocidade}
                        color={this.estilo.cor.greenish_medium} />
                </View>
                <View style={[{ height: '30%', justifyContent: 'flex-end' },
                this.state.card_weather_atual == 4 ? null : { display: 'none' }]}>
                    <Chart data_array={this.state.lista_weather.uv_indice}
                        label_descricao_array={this.state.lista_weather.uv_descricao}
                        label_descricao_array_big={true}
                        label_array={this.state.lista_weather.hora}
                        min_value={this.state.lista_weather.menor_uv_indice}
                        max_value={this.state.lista_weather.maior_uv_indice}
                        color={this.estilo.cor.orange} />
                </View>

                <View style={{ flex: 1, backgroundColor: this.state.card_weather_cor }}>
                    <Form style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 20 }}>
                        {this.card_weather.map((item) => (
                            <Button key={item.icon} large rounded style={this.estilo.button_item_weather}
                                onPress={() => {
                                    this.setState({
                                        card_weather_atual: item.index, unidade_de_medida: item.unidade_de_medida,
                                        card_weather_cor: item.cor, variavel_ambiental: item.variavel_ambiental
                                    })
                                }}>
                                <FeatherIcon name={item.icon} style={[this.estilo.icon_item_weather,
                                this.state.card_weather_atual >= item.index && this.state.card_weather_atual < item.index + 1 ?
                                    { color: this.estilo.cor.white } : null]} />
                            </Button>
                        ))}
                    </Form>
                    {this.state.card_weather_atual >= 0 &&
                        this.state.card_weather_atual < 1 ?
                        <View style={{ flexWrap: 'wrap', justifyContent: 'center', flexDirection: 'row' }}>
                            {this.card_weather_temperatura.map((item) => (
                                <Button key={item.label} rounded style={{ margin: 10, backgroundColor: this.estilo.cor.white + '11', elevation: 0 }}
                                    onPress={() => this.setState({ card_weather_atual: item.index, unidade_de_medida: item.unidade_de_medida })}>
                                    <Text uppercase={false} style={[{ color: this.estilo.cor.white + '77', fontSize: 17 },
                                    this.state.card_weather_atual == item.index ?
                                        { color: this.estilo.cor.white } : null]}>{item.label}</Text>
                                </Button>
                            ))}
                        </View> : null}
                </View>

            </Container>
        )
    }
}