import React, { Component } from 'react'
import { Dimensions, ScrollView, View } from 'react-native'
import { Button, Form, Container, Text } from 'native-base'
import estilo from '../assets/Estilo'
import FeatherIcon from 'react-native-vector-icons/Feather'
import axios from 'axios'
import rnfs from 'react-native-fs'
import { AreaChart, XAxis } from 'react-native-svg-charts'
import { Path, Svg } from 'react-native-svg'
import * as shape from 'd3-shape'

export default class Card extends Component {
    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.state = {
            loaded: false,
            card_weather_atual: 0,
            lista_weather: {
                dia_semana: [],
                hora: [],
                situacao: [],
                temperatura: [],
                sensacao_termica: [],
                temperatura_de_bulbo_umido: [],
                ponto_de_orvalho: [],
                vento: [],
                umidade_relativa: [],
                chuva: [],
                uv: []
            },
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
                let dia_semana, hora, situacao, temperatura, sensacao_termica, chuva, uv,
                    ponto_de_orvalho, vento, umidade_relativa, temperatura_de_bulbo_umido,
                    array_obj = {
                        dia_semana: [], hora: [], situacao: [], temperatura: [], sensacao_termica: [],
                        temperatura_de_bulbo_umido: [], ponto_de_orvalho: [], umidade_relativa: [],
                        vento: [], chuva: [], uv: [], menor_temperatura: undefined, menor_vento: undefined,
                        menor_sensacao_termica: undefined, menor_temperatura_de_bulbo_umido: undefined,
                        menor_ponto_de_orvalho: undefined, menor_chuva: undefined, maior_temperatura: undefined,
                        menor_umidade_relativa: undefined, maior_umidade_relativa: undefined,
                        maior_sensacao_termica: undefined, maior_temperatura_de_bulbo_umido: undefined,
                        maior_ponto_de_orvalho: undefined, maior_vento: undefined, maior_chuva: undefined
                    }
                let menor_temperatura = 100, menor_sensacao_termica = 100, menor_vento = 100,
                    menor_temperatura_de_bulbo_umido = 100, menor_ponto_de_orvalho = 100,
                    menor_umidade_relativa = 100, menor_chuva = menor_uv = 100
                let maior_temperatura = 0, maior_sensacao_termica = 0, maior_vento = 0,
                    maior_temperatura_de_bulbo_umido = 0, maior_ponto_de_orvalho = 0,
                    maior_umidade_relativa = 0, maior_chuva = maior_uv = 0

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
                    vento = { velocidade: element.Wind.Speed.Value, direcao: element.Wind.Direction.Localized }
                    umidade_relativa = element.RelativeHumidity
                    chuva = { probabilidade: element.RainProbability, quantidade: element.Rain.Value }
                    uv = { indice: element.UVIndex, descricao: element.UVIndexText }

                    menor_temperatura > temperatura ? menor_temperatura = temperatura : null
                    menor_sensacao_termica > sensacao_termica ? menor_sensacao_termica = sensacao_termica : null
                    menor_temperatura_de_bulbo_umido > temperatura_de_bulbo_umido ? menor_temperatura_de_bulbo_umido = temperatura_de_bulbo_umido : null
                    menor_ponto_de_orvalho > ponto_de_orvalho ? menor_ponto_de_orvalho = ponto_de_orvalho : null
                    menor_vento > vento.velocidade ? menor_vento = vento.velocidade : null
                    menor_umidade_relativa > umidade_relativa ? menor_umidade_relativa = umidade_relativa : null
                    menor_chuva > chuva.quantidade ? menor_chuva = chuva.quantidade : null
                    menor_uv > uv.indice ? menor_uv = uv.indice : null

                    maior_temperatura < temperatura ? maior_temperatura = temperatura : null
                    maior_sensacao_termica < sensacao_termica ? maior_sensacao_termica = sensacao_termica : null
                    maior_temperatura_de_bulbo_umido < temperatura_de_bulbo_umido ? maior_temperatura_de_bulbo_umido = temperatura_de_bulbo_umido : null
                    maior_ponto_de_orvalho < ponto_de_orvalho ? maior_ponto_de_orvalho = ponto_de_orvalho : null
                    maior_vento < vento.velocidade ? maior_vento = vento.velocidade : null
                    maior_umidade_relativa < umidade_relativa ? maior_umidade_relativa = umidade_relativa : null
                    maior_chuva < chuva.quantidade ? maior_chuva = chuva.quantidade : null
                    maior_uv < uv.indice ? maior_uv = uv.indice : null

                    array_obj.dia_semana.push(dia_semana)
                    array_obj.hora.push(hora)
                    array_obj.situacao.push(situacao)
                    array_obj.temperatura.push(temperatura)
                    array_obj.sensacao_termica.push(sensacao_termica)
                    array_obj.temperatura_de_bulbo_umido.push(temperatura_de_bulbo_umido)
                    array_obj.ponto_de_orvalho.push(ponto_de_orvalho)
                    array_obj.vento.push(vento)
                    array_obj.umidade_relativa.push(umidade_relativa)
                    array_obj.chuva.push(chuva)
                    array_obj.uv.push(uv)

                    index == 0 || index == 11 ? [
                        array_obj.dia_semana.push(dia_semana),
                        array_obj.hora.push(hora),
                        array_obj.situacao.push(situacao),
                        array_obj.temperatura.push(temperatura),
                        array_obj.sensacao_termica.push(sensacao_termica),
                        array_obj.temperatura_de_bulbo_umido.push(temperatura_de_bulbo_umido),
                        array_obj.ponto_de_orvalho.push(ponto_de_orvalho),
                        array_obj.vento.push(vento),
                        array_obj.umidade_relativa.push(umidade_relativa),
                        array_obj.chuva.push(chuva),
                        array_obj.uv.push(uv)
                    ] : null
                })

                array_obj.menor_temperatura = menor_temperatura
                array_obj.menor_sensacao_termica = menor_sensacao_termica
                array_obj.menor_temperatura_de_bulbo_umido = menor_temperatura_de_bulbo_umido
                array_obj.menor_ponto_de_orvalho = menor_ponto_de_orvalho
                array_obj.menor_vento = menor_vento
                array_obj.menor_umidade_relativa = menor_umidade_relativa
                array_obj.menor_chuva = menor_chuva
                array_obj.maior_temperatura = maior_temperatura
                array_obj.maior_sensacao_termica = maior_sensacao_termica
                array_obj.maior_temperatura_de_bulbo_umido = maior_temperatura_de_bulbo_umido
                array_obj.maior_ponto_de_orvalho = maior_ponto_de_orvalho
                array_obj.maior_vento = maior_vento
                array_obj.maior_umidade_relativa = maior_umidade_relativa
                array_obj.maior_chuva = maior_chuva

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
        const Decorator = ({ x, y, data }) => {
            return data.map((value, index) => (
                <Svg key={index} translateX={x(index)} translateY={y(value)}>
                    <Text style={[index == 0 || index == 13 ? { color: 'transparent' } :
                        { color: this.estilo.cor.purple }, {
                        marginTop: -35, marginLeft: -20, fontWeight: 'bold', width: 43,
                        fontSize: 17, textAlign: 'center'
                    }]}>{value}º</Text>
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
                    <Form style={{ width: Dimensions.get('window').width * 1.7 }}>
                        <AreaChart
                            style={{ height: 150 }}
                            data={this.state.lista_weather.temperatura}
                            svg={{ fill: this.estilo.cor.purple }}
                            curve={shape.curveNatural}
                            contentInset={{ left: -20, right: -22 }}
                            yMin={this.state.lista_weather.menor_temperatura}
                            yMax={this.state.lista_weather.maior_temperatura + 5}
                        >
                            <Line />
                            <Decorator />
                        </AreaChart>
                        <XAxis
                            style={{
                                marginLeft: -30, marginRight: -18, height: 50, paddingTop: 25,
                                backgroundColor: this.estilo.cor.purple
                            }}
                            data={this.state.lista_weather.hora}
                            formatLabel={(index) => {
                                if (index == 0 || index == 13) return ''
                                return this.state.lista_weather.hora[index] + 'h'
                            }}
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