import rnfs from 'react-native-fs'
import Http from '../services/Http'
import loginService from '../services/Login'
let http = new Http()
// let alertas_aux = {}

class Alertas {

    caracteristicasIdeais = async (plantacaoId) => {
        let ideal = {
            temperatura: { max: undefined, min: undefined },
            umidade_solo: { max: undefined, min: undefined },
            umidade_ar: { max: undefined, min: undefined }
        }

        let aux = await http.culturaByPlantacao(plantacaoId)
        ideal.temperatura.max = aux.clima.temperaturaMaxima
        ideal.temperatura.min = aux.clima.temperaturaMinima
        ideal.umidade_ar.max = aux.clima.umidadeMaxima
        ideal.umidade_ar.min = aux.clima.umidadeMinima
        ideal.umidade_solo.max = aux.solo.umidadeMaxima
        ideal.umidade_solo.min = aux.solo.umidadeMinima

        return ideal
    }

    get = async (usuarioId, plantacaoId, dia, entidade) => {
        let alertas = await http.alertasPorDia(dados = {
            usuarioId: usuarioId,
            plantacaoId: plantacaoId,
            dia: dia,
        }, entidade = entidade)
        let valor = []
        alertas.forEach(item => valor.push(item.valor))
        let data = []
        alertas.forEach(item => data.push(item.data))
        // let indexEntidade = entidades.findIndex(item => item.value == entidade)
        let alerta = { valor, data }
        return alerta
    }

    //     async deletarAlertasAntigos(array, entidade) {
    //         array = array.filter((el, i, arr) => arr.indexOf(el) == i)
    //         array.sort((a, b) => new Date(b) - new Date(a))
    //         let auxArray = []
    //         array.forEach((data, index) => index > 4 ? auxArray.push(data) : alertas_aux.dias.find(item => item == data) ? null : alertas_aux.dias.push(data))
    //         if (auxArray[0]) http.deletarAlertaPorData(auxArray, entidade)
    //     }

    //     async update() {
    //         alertas_aux = {
    //             dias: [],
    //             temperatura: { hora: [], dia: [], valor: [], maxIdeal: undefined, minIdeal: undefined },
    //             umidade_solo: { hora: [], dia: [], valor: [], maxIdeal: undefined, minIdeal: undefined },
    //             umidade_ar: { hora: [], dia: [], valor: [], maxIdeal: undefined, minIdeal: undefined }
    //         }

    //         let usuarioId = await loginService.get()
    //         usuarioId = usuarioId.usuario

    //         let plantacaoId = await http.plantacoesPrincipaisByUsuario(usuarioId)
    //             .then(async data => {
    //                 let aux = await http.culturaByPlantacao(data[0].plantacao)
    //                 alertas_aux.temperatura.maxIdeal = aux.clima.temperaturaMaxima
    //                 alertas_aux.temperatura.minIdeal = aux.clima.temperaturaMinima
    //                 alertas_aux.umidade_ar.maxIdeal = aux.clima.umidadeMaxima
    //                 alertas_aux.umidade_ar.minIdeal = aux.clima.umidadeMinima
    //                 alertas_aux.umidade_solo.maxIdeal = aux.solo.umidadeMaxima
    //                 alertas_aux.umidade_solo.minIdeal = aux.solo.umidadeMinima
    //                 return data[0].plantacao
    //             })

    //         await http.alertasByUsuarioAndPlantacao('alertaTemperaturas', usuarioId, plantacaoId)
    //             .then(async data => {
    //                 await data.forEach(item => {
    //                     alertas_aux.temperatura.dia.push(item.data.split('T')[0])
    //                     alertas_aux.temperatura.hora.push(item.data.split('T')[1].substring(0, 5) + 'h')
    //                     alertas_aux.temperatura.valor.push(item.valor)
    //                 })
    //                 this.deletarAlertasAntigos(alertas_aux.temperatura.dia, 'alertaTemperaturas')
    //             })
    //             .catch(erro => console.error(erro))

    //         await http.alertasByUsuarioAndPlantacao('alertaUmidades', usuarioId, plantacaoId)
    //             .then(async data => {
    //                 await data.forEach(item => {
    //                     alertas_aux.umidade_ar.dia.push(item.data.split('T')[0])
    //                     alertas_aux.umidade_ar.hora.push(item.data.split('T')[1].substring(0, 5) + 'h')
    //                     alertas_aux.umidade_ar.valor.push(item.valor)
    //                 })
    //                 this.deletarAlertasAntigos(alertas_aux.umidade_ar.dia, 'alertaUmidades')
    //             })
    //             .catch(erro => console.error(erro))

    //         await http.alertasByUsuarioAndPlantacao('alertaUmidadeSolos', usuarioId, plantacaoId)
    //             .then(async data => {
    //                 await data.forEach(item => {
    //                     alertas_aux.umidade_solo.dia.push(item.data.split('T')[0])
    //                     alertas_aux.umidade_solo.hora.push(item.data.split('T')[1].substring(0, 5) + 'h')
    //                     alertas_aux.umidade_solo.valor.push(item.valor)
    //                 })
    //                 this.deletarAlertasAntigos(alertas_aux.umidade_solo.dia, 'alertaUmidadeSolos')
    //             })
    //             .catch(erro => console.error(erro))

    //         alertas_aux.dias.sort((a, b) => new Date(a) - new Date(b))

    //         await this.gravarArquivo(
    //             rnfs.DocumentDirectoryPath + '/alertas.json',
    //             JSON.stringify(alertas_aux))
    //     }

    //     async get() {
    //         let index_file = -1
    //         return await rnfs.readDir(rnfs.DocumentDirectoryPath)
    //             .then(async (result) => {
    //                 console.log('Resultado de leitura obtido', result)
    //                 await result.forEach(async element => {
    //                     if (element.name == 'alertas.json') {
    //                         index_file = await result.indexOf(element)
    //                     }
    //                 })
    //                 if (index_file < 0) {
    //                     await this.update()
    //                     this.get()
    //                 }
    //                 return Promise.all([rnfs.stat(result[0].path), result[index_file].path])
    //             })
    //             .then((statResult) => {
    //                 if (statResult[0].isFile()) return rnfs.readFile(statResult[1], 'utf8')
    //                 return 'no file'
    //             })
    //             .then(async (contents) => {
    //                 console.log(JSON.parse(contents))
    //                 return await JSON.parse(contents)
    //             })
    //             .catch((err) => {
    //                 console.log(err.message, err.code)
    //                 return null
    //             })
    //     }

    //     async gravarArquivo(caminho, dados) {
    //         await rnfs.writeFile(caminho, dados, 'utf8')
    //             .then(() => {
    //                 console.log('Alertas gravado com sucesso no armazenamento interno!')
    //             })
    //             .catch((err) => {
    //                 console.log('Falha ao gravar Alertas no armazenamento interno!')
    //                 console.log(err.message)
    //             })
    //     }
}

const alertas = new Alertas()
export default alertas
