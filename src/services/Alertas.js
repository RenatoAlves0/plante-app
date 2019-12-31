import Http from '../services/Http'
let http = new Http()

class Alertas {

    caracteristicasIdeais = async (plantacaoId) => {
        let ideal = {
            temperatura: { max: undefined, min: undefined },
            umidade_solo: { max: undefined, min: undefined },
            umidade_ar: { max: undefined, min: undefined },
            luminosidade: { max: undefined, min: undefined },
        }

        let aux = await http.culturaByPlantacao(plantacaoId)
        ideal.temperatura.max = aux.clima.temperaturaMaxima
        ideal.temperatura.min = aux.clima.temperaturaMinima
        ideal.umidade_ar.max = aux.clima.umidadeMaxima
        ideal.umidade_ar.min = aux.clima.umidadeMinima
        ideal.umidade_solo.max = aux.solo.umidadeMaxima
        ideal.umidade_solo.min = aux.solo.umidadeMinima

        if (aux.luz.intensidade == 'Sombra') {
            ideal.luminosidade.min = 0
            ideal.luminosidade.max = 20
        } else if (aux.luz.intensidade == 'Fraca') {
            ideal.luminosidade.min = 20
            ideal.luminosidade.max = 40
        } else if (aux.luz.intensidade == 'Média') {
            ideal.luminosidade.min = 40
            ideal.luminosidade.max = 70
        } else {
            ideal.luminosidade.min = 70
            ideal.luminosidade.max = 100
        }
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
        let alerta = { valor, data }
        return alerta
    }
}

const alertas = new Alertas()
export default alertas
