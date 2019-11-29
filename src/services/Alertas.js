import rnfs from 'react-native-fs'
import Http from '../services/Http'
import loginService from '../services/Login'
let http = new Http()


let alertas_aux = {}

class Alertas {

    async deletarAlertasAntigos(array, entidade) {
        array = array.filter((el, i, arr) => arr.indexOf(el) == i)
        array.sort((a, b) => new Date(b) - new Date(a))
        let auxArray = []
        array.forEach((data, index) => index > 4 ? auxArray.push(data) : null)
        if (auxArray[0]) http.deletarAlertaPorData(auxArray, entidade)
    }

    async update() {
        alertas_aux = {
            temperatura: { hora: [], dia: [], valor: [], maxIdeal: undefined, minIdeal: undefined },
            umidade_solo: { hora: [], dia: [], valor: [], maxIdeal: undefined, minIdeal: undefined },
            umidade_ar: { hora: [], dia: [], valor: [], maxIdeal: undefined, minIdeal: undefined }
        }

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
                let dias = []
                await data.forEach(item => {
                    alertas_aux.temperatura.dia.push(this.getDayOfWeek(item.data))
                    dias.push(item.data.split('T')[0])
                    alertas_aux.temperatura.hora.push(item.data.split('T')[1].substring(0, 5) + 'h')
                    alertas_aux.temperatura.valor.push(item.valor)
                })
                this.deletarAlertasAntigos(dias, 'alertaTemperaturas')
            })
            .catch(erro => console.error(erro))

        await http.alertasByUsuarioAndPlantacao('alertaUmidades', usuarioId, plantacaoId)
            .then(async data => {
                let dias = []
                await data.forEach(item => {
                    alertas_aux.umidade_ar.dia.push(this.getDayOfWeek(item.data))
                    dias.push(item.data.split('T')[0])
                    alertas_aux.umidade_ar.hora.push(item.data.split('T')[1].substring(0, 5) + 'h')
                    alertas_aux.umidade_ar.valor.push(item.valor)
                })
                this.deletarAlertasAntigos(dias, 'alertaUmidades')
            })
            .catch(erro => console.error(erro))

        await http.alertasByUsuarioAndPlantacao('alertaUmidadeSolos', usuarioId, plantacaoId)
            .then(async data => {
                let dias = []
                await data.forEach(item => {
                    alertas_aux.umidade_solo.dia.push(this.getDayOfWeek(item.data))
                    dias.push(item.data.split('T')[0])
                    alertas_aux.umidade_solo.hora.push(item.data.split('T')[1].substring(0, 5) + 'h')
                    alertas_aux.umidade_solo.valor.push(item.valor)
                })
                this.deletarAlertasAntigos(dias, 'alertaUmidadeSolos')
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
                console.log(JSON.parse(contents))
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

    getDayOfWeek(date) {
        var dayOfWeek = new Date(date).getDay()
        return this.getStringDayOfWeek(dayOfWeek)
    }

    getStringDayOfWeek(day) {
        return isNaN(day) ? null : ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][day]
    }
}

const alertas = new Alertas()
export default alertas
