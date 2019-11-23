import rnfs from 'react-native-fs'
import Http from '../services/Http'
import loginService from '../services/Login'
let http = new Http()


let alertas_aux = {
    temperatura: { data: [], valor: [], maxIdeal: undefined, minIdeal: undefined },
    umidade_solo: { data: [], valor: [], maxIdeal: undefined, minIdeal: undefined },
    umidade_ar: { data: [], valor: [], maxIdeal: undefined, minIdeal: undefined }
}

class Alertas {
    async update() {
        let usuarioId = await loginService.get()
        usuarioId = usuarioId.usuario

        let plantacaoId = await http.plantacoesPrincipaisByUsuario(usuarioId)
            .then(async data => {
                let aux = await http.culturaByPlantacao(data[0].plantacao)
                alertas_aux.temperatura.maxIdeal = aux.clima.temperaturaMaxima
                alertas_aux.temperatura.minIdeal = aux.clima.temperaturaMinima
                alertas_aux.umidade_ar.maxIdeal = aux.clima.umidadeMaxima
                alertas_aux.umidade_ar.minIdeal = aux.clima.umidadeMinima
                alertas_aux.umidade_solo.maxIdeal = aux.solo.umidadeMaxima
                alertas_aux.umidade_solo.minIdeal = aux.solo.umidadeMinima
                return data[0].plantacao
            })

        await http.alertasByUsuarioAndPlantacao('alertaTemperaturas', usuarioId, plantacaoId)
            .then(async data => {
                await data.forEach(item => {
                    alertas_aux.temperatura.data.push(item.data)
                    alertas_aux.temperatura.valor.push(item.valor)
                })
                console.log('alertas_aux.temperatura.data')
                console.log(alertas_aux.temperatura.data)
                console.log(usuarioId)
                console.log(plantacaoId)
            })
            .catch(erro => console.error(erro))

        await http.alertasByUsuarioAndPlantacao('alertaUmidades', usuarioId, plantacaoId)
            .then(async data => {
                await data.forEach(item => {
                    alertas_aux.umidade_ar.data.push(item.data)
                    alertas_aux.umidade_ar.valor.push(item.valor)
                })
            })
            .catch(erro => console.error(erro))

        await http.alertasByUsuarioAndPlantacao('alertaUmidadeSolos', usuarioId, plantacaoId)
            .then(async data => {
                await data.forEach(item => {
                    alertas_aux.umidade_solo.data.push(item.data)
                    alertas_aux.umidade_solo.valor.push(item.valor)
                })
            })
            .catch(erro => console.error(erro))

        await this.gravarArquivo(
            rnfs.DocumentDirectoryPath + '/alertas.json',
            JSON.stringify(alertas_aux))
    }

    async get() {
        let index_file = -1
        return await rnfs.readDir(rnfs.DocumentDirectoryPath)
            .then(async (result) => {
                console.log('Resultado de leitura obtido', result)
                await result.forEach(async element => {
                    if (element.name == 'alertas.json') {
                        index_file = await result.indexOf(element)
                    }
                })
                if (index_file < 0) {
                    await this.update()
                    this.get()
                }
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
                console.log('Alertas gravado com sucesso no armazenamento interno!')
            })
            .catch((err) => {
                console.log('Falha ao gravar Alertas no armazenamento interno!')
                console.log(err.message)
            })
    }

    // getDayOfWeek(date) {
    //     var dayOfWeek = new Date(date).getDay()
    //     return this.getStringDayOfWeek(dayOfWeek)
    // }

    // getStringDayOfWeek(day) {
    //     return isNaN(day) ? null : ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][day]
    // }
}

const alertas = new Alertas()
export default alertas
