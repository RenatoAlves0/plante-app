import rnfs from 'react-native-fs'
import axios from 'axios'

let weather_today = {
    dia_semana: [], hora: [], situacao: [], temperatura: [],
    sensacao_termica: [], temperatura_de_bulbo_umido: [], ponto_de_orvalho: [],
    vento_velocidade: [], vento_direcao: [], umidade_relativa: [],
    chuva_quantidade: [], chuva_probabilidade: [], uv_indice: [], uv_descricao: []
}

class WeatherToday {

    async update() {
        await axios
            .get('http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/38025?apikey=AJ8uokBYThYFdXod4T6hebp4pLvEUQom&language=pt-br&details=true&metric=true')
            .then(async (data) => {
                let array = data.data
                let dia_semana, hora, situacao, temperatura, sensacao_termica, chuva_quantidade, chuva_probabilidade,
                    ponto_de_orvalho, vento_velocidade, vento_direcao, umidade_relativa, temperatura_de_bulbo_umido,
                    uv_indice, uv_descricao
                let menor_temperatura = 100, menor_sensacao_termica = 100, menor_vento_velocidade = 100,
                    menor_temperatura_de_bulbo_umido = 100, menor_ponto_de_orvalho = 100,
                    menor_umidade_relativa = 100, menor_chuva_quantidade = 100,
                    menor_chuva_probabilidade = 100, menor_uv_indice = 100
                let maior_temperatura = -100, maior_sensacao_termica = -100, maior_vento_velocidade = -100,
                    maior_temperatura_de_bulbo_umido = -100, maior_ponto_de_orvalho = -100,
                    maior_umidade_relativa = -100, maior_chuva_quantidade = -100,
                    maior_chuva_probabilidade = -100, maior_uv_indice = -100
                weather_today = {
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

                    weather_today.dia_semana.push(dia_semana)
                    weather_today.hora.push(hora)
                    weather_today.situacao.push(situacao)
                    weather_today.temperatura.push(temperatura)
                    weather_today.sensacao_termica.push(sensacao_termica)
                    weather_today.temperatura_de_bulbo_umido.push(temperatura_de_bulbo_umido)
                    weather_today.ponto_de_orvalho.push(ponto_de_orvalho)
                    weather_today.vento_direcao.push({ value: vento_direcao })
                    weather_today.vento_velocidade.push(vento_velocidade)
                    weather_today.umidade_relativa.push(umidade_relativa)
                    weather_today.chuva_quantidade.push(chuva_quantidade)
                    weather_today.chuva_probabilidade.push(chuva_probabilidade)
                    weather_today.uv_indice.push(uv_indice)
                    weather_today.uv_descricao.push({ value: uv_descricao })

                    index == 0 || index == 11 ? [
                        weather_today.dia_semana.push(dia_semana),
                        weather_today.hora.push(hora),
                        weather_today.situacao.push(situacao),
                        weather_today.temperatura.push(temperatura),
                        weather_today.sensacao_termica.push(sensacao_termica),
                        weather_today.temperatura_de_bulbo_umido.push(temperatura_de_bulbo_umido),
                        weather_today.ponto_de_orvalho.push(ponto_de_orvalho),
                        weather_today.vento_direcao.push({ value: vento_direcao }),
                        weather_today.vento_velocidade.push(vento_velocidade),
                        weather_today.umidade_relativa.push(umidade_relativa),
                        weather_today.chuva_quantidade.push(chuva_quantidade),
                        weather_today.chuva_probabilidade.push(chuva_probabilidade),
                        weather_today.uv_indice.push(uv_indice),
                        weather_today.uv_descricao.push({ value: uv_descricao })
                    ] : null
                })

                weather_today.menor_temperatura = menor_temperatura
                weather_today.menor_sensacao_termica = menor_sensacao_termica
                weather_today.menor_temperatura_de_bulbo_umido = menor_temperatura_de_bulbo_umido
                weather_today.menor_ponto_de_orvalho = menor_ponto_de_orvalho
                weather_today.menor_vento_velocidade = menor_vento_velocidade
                weather_today.menor_umidade_relativa = menor_umidade_relativa
                weather_today.menor_chuva_quantidade = menor_chuva_quantidade
                weather_today.menor_chuva_probabilidade = menor_chuva_probabilidade
                weather_today.menor_uv_indice = menor_uv_indice
                weather_today.maior_temperatura = maior_temperatura
                weather_today.maior_sensacao_termica = maior_sensacao_termica
                weather_today.maior_temperatura_de_bulbo_umido = maior_temperatura_de_bulbo_umido
                weather_today.maior_ponto_de_orvalho = maior_ponto_de_orvalho
                weather_today.maior_vento_velocidade = maior_vento_velocidade
                weather_today.maior_umidade_relativa = maior_umidade_relativa
                weather_today.maior_chuva_quantidade = maior_chuva_quantidade
                weather_today.maior_chuva_probabilidade = maior_chuva_probabilidade
                weather_today.maior_uv_indice = maior_uv_indice

                await this.gravarArquivo(
                    rnfs.DocumentDirectoryPath + '/weather_twelve.json',
                    JSON.stringify(weather_today))
            })
            .catch(async (erro) => {
                console.error(erro)
                console.log('Resultado obtido do Servidor AccuWeather (12):')
                console.log(array)
            })
    }

    async get() {
        let index_file
        return await rnfs.readDir(rnfs.DocumentDirectoryPath)
            .then(async (result) => {
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
                return await JSON.parse(contents)
            })
            .catch((err) => {
                console.log(err.message, err.code)
                return null
            })
    }

    async gravarArquivo(caminho, dados) {
        await rnfs.writeFile(caminho, dados, 'utf8')
            .then(() => {
                console.log('Weather (12) gravado com sucesso no armazenamento interno!')
            })
            .catch((err) => {
                console.log('Falha ao gravar Weather (12) no armazenamento interno!')
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
}

const weatherToday = new WeatherToday()
export default weatherToday
