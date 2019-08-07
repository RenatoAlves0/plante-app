import rnfs from 'react-native-fs'
import axios from 'axios'

let weather_week = {
    dia_semana: [], hora: [], dia_nuvens: [], dia_ceu: [], dia_chuva_probabilidade: [],
    dia_chuva_mm: [], dia_vento_velocidade: [], dia_vento_direcao: [], sol_nascer: [],
    sol_por: [], sol_duracao: [], noite_nuvens: [], noite_ceu: [], noite_chuva_probabilidade: [],
    noite_chuva_mm: [], noite_vento_velocidade: [], noite_vento_direcao: [], lua_nascer: [],
    lua_por: [], temperatura_maxima: [], temperatura_minima: [], sensacao_termica_maxima: [],
    sensacao_termica_minima: [], sensacao_termica_maxima_sombra: [], sensacao_termica_minima_sombra: []
}

export default function (state = weather_week, action) {
    switch (action.type) {
        case "weather_week_update": weather_week_update()
            break
        case "get_weather_week": get_weather_week()
            break
    }
    return weather_week
}

async function get_weather_week() {
    lerArquivo(rnfs.DocumentDirectoryPath)
}

async function weather_week_update() {
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
            weather_week = {
                dia_semana: [], hora: [], dia_nuvens: [], dia_ceu: [], dia_chuva_probabilidade: [],
                dia_chuva_mm: [], dia_vento_velocidade: [], dia_vento_direcao: [], sol_nascer: [],
                sol_por: [], sol_duracao: [], noite_nuvens: [], noite_ceu: [], noite_chuva_probabilidade: [],
                noite_chuva_mm: [], noite_vento_velocidade: [], noite_vento_direcao: [], lua_nascer: [],
                lua_por: [], temperatura_maxima: [], temperatura_minima: [], sensacao_termica_maxima: [],
                sensacao_termica_minima: [], sensacao_termica_maxima_sombra: [], sensacao_termica_minima_sombra: []
            }
            await array.forEach((element, index) => {
                dia_semana = element.Date
                hora = new Date().getHours()
                dia_semana ? dia_semana = getDayOfWeek(dia_semana) : ''
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

                weather_week.hora.push(hora)
                weather_week.dia_semana.push({ value: dia_semana })
                weather_week.sensacao_termica_minima.push(sensacao_termica_minima)
                weather_week.sensacao_termica_maxima.push(sensacao_termica_maxima)
                weather_week.sensacao_termica_minima_sombra.push(sensacao_termica_minima_sombra)
                weather_week.sensacao_termica_maxima_sombra.push(sensacao_termica_maxima_sombra)
                weather_week.temperatura_minima.push(temperatura_minima)
                weather_week.temperatura_maxima.push(temperatura_maxima)
                weather_week.dia_nuvens.push(dia_nuvens)
                weather_week.dia_ceu.push({ value: dia_ceu })
                weather_week.dia_chuva_probabilidade.push(dia_chuva_probabilidade)
                weather_week.dia_chuva_mm.push(dia_chuva_mm)
                weather_week.dia_vento_velocidade.push(dia_vento_velocidade)
                weather_week.dia_vento_direcao.push({ value: dia_vento_direcao })
                weather_week.sol_nascer.push({ value: sol_nascer })
                weather_week.sol_por.push({ value: sol_por })
                weather_week.sol_duracao.push(sol_duracao)
                weather_week.noite_nuvens.push(noite_nuvens)
                weather_week.noite_ceu.push({ value: noite_ceu })
                weather_week.noite_chuva_probabilidade.push(noite_chuva_probabilidade)
                weather_week.noite_chuva_mm.push(noite_chuva_mm)
                weather_week.noite_vento_velocidade.push(noite_vento_velocidade)
                weather_week.noite_vento_direcao.push({ value: noite_vento_direcao })
                weather_week.lua_nascer.push({ value: lua_nascer })
                weather_week.lua_por.push({ value: lua_por })

                index == 0 || index == 4 ? [
                    weather_week.hora.push(hora),
                    weather_week.dia_semana.push({ value: dia_semana }),
                    weather_week.sensacao_termica_minima.push(sensacao_termica_minima),
                    weather_week.sensacao_termica_maxima.push(sensacao_termica_maxima),
                    weather_week.sensacao_termica_minima_sombra.push(sensacao_termica_minima_sombra),
                    weather_week.sensacao_termica_maxima_sombra.push(sensacao_termica_maxima_sombra),
                    weather_week.temperatura_minima.push(temperatura_minima),
                    weather_week.temperatura_maxima.push(temperatura_maxima),
                    weather_week.dia_nuvens.push(dia_nuvens),
                    weather_week.dia_ceu.push({ value: dia_ceu }),
                    weather_week.dia_chuva_probabilidade.push(dia_chuva_probabilidade),
                    weather_week.dia_chuva_mm.push(dia_chuva_mm),
                    weather_week.dia_vento_velocidade.push(dia_vento_velocidade),
                    weather_week.dia_vento_direcao.push({ value: dia_vento_direcao }),
                    weather_week.sol_nascer.push({ value: sol_nascer }),
                    weather_week.sol_por.push({ value: sol_por }),
                    weather_week.sol_duracao.push(sol_duracao),
                    weather_week.noite_nuvens.push(noite_nuvens),
                    weather_week.noite_ceu.push({ value: noite_ceu }),
                    weather_week.noite_chuva_probabilidade.push(noite_chuva_probabilidade),
                    weather_week.noite_chuva_mm.push(noite_chuva_mm),
                    weather_week.noite_vento_velocidade.push(noite_vento_velocidade),
                    weather_week.noite_vento_direcao.push({ value: noite_vento_direcao }),
                    weather_week.lua_nascer.push({ value: lua_nascer }),
                    weather_week.lua_por.push({ value: lua_por })
                ] : null
            })

            await gravarArquivo(
                rnfs.DocumentDirectoryPath + '/weather_week.json',
                JSON.stringify(weather_week))
        })
        .catch(async (erro) => {
            console.error(erro)
            console.log('Resultado obtido do Servidor AccuWeather:')
            console.log(array)
        })
}

async function lerArquivo(caminho) {
    let index_file
    await rnfs.readDir(caminho)
        .then(async (result) => {
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
            weather_week = JSON.parse(contents)
            return weather_week
        })
        .catch((err) => {
            console.log(err.message, err.code)
            return null
        })
}

async function gravarArquivo(caminho, dados) {
    await rnfs.writeFile(caminho, dados, 'utf8')
        .then(() => {
            console.log('Weather gravado com sucesso no armazenamento interno!')
        })
        .catch((err) => {
            console.log('Falha ao gravar Weather no armazenamento interno!')
            console.log(err.message)
        })
}

function getDayOfWeek(date) {
    var dayOfWeek = new Date(date).getDay()
    return getStringDayOfWeek(dayOfWeek)
}

function getStringDayOfWeek(day) {
    return isNaN(day) ? null : ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][day]
}