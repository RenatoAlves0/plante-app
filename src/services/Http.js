import axios from 'axios'

const baseUrl = [
    'https://plante-api-user.herokuapp.com/',
    'https://plante-api.herokuapp.com/',
    'http://10.0.3.2:5000/'
]

export default class Http {
    async anosAlertas(dados, entidade) {
        return await axios
            .get(baseUrl[0] + entidade + '/anos/' + dados.usuarioId + '/' + dados.plantacaoId)
            .then(data => {
                return data.data
            })
            .catch(() => { return {} })
    }

    async mesesAlertas(dados, entidade) {
        return await axios
            .get(baseUrl[0] + entidade + '/meses/' + dados.usuarioId + '/' + dados.plantacaoId + '/' + dados.ano)
            .then(data => {
                return data.data
            })
            .catch(() => { return {} })
    }

    async diasAlertas(dados, entidade) {
        return await axios
            .get(baseUrl[0] + entidade + '/dias/' + dados.usuarioId + '/' + dados.plantacaoId + '/' + dados.ano + '/' + dados.mes)
            .then(data => {
                return data.data
            })
            .catch(() => { return {} })
    }

    async alertasPorDia(dados, entidade) {
        return await axios
            .get(baseUrl[0] + entidade + '/porDia/' + dados.usuarioId + '/' + dados.plantacaoId + '/' + dados.dia)
            .then(data => {
                return data.data
            })
            .catch(() => { return {} })
    }

    async deletarAlertaPorData(data, entidade) {
        return await axios
            .delete(baseUrl[0] + entidade + '/deletar_por_data/' + JSON.stringify(data))
            .then(data => console.log(data))
            .catch(error => console.log(error))
    }

    async culturaByPlantacao(plantacaoId) {
        return await axios
            .get(baseUrl[0] + 'plantacaos/' + plantacaoId)
            .then(async dataP => {
                return await axios
                    .get(baseUrl[1] + 'plantas/' + dataP.data.cultura)
                    .then(async data => { return data.data })
                    .catch(() => { return {} })
            })
            .catch(() => { return {} })
    }

    async logar(dados) {
        return await axios
            .get(baseUrl[0] + 'logins/logar', { params: { login: dados.login, senha: dados.senha } })
            .then((data) => { return data.data })
            .catch(() => { return {} })
    }

    async alertasByUsuarioAndPlantacao(entidade, usuarioId, plantacaoId) {
        return await axios
            .get(baseUrl[0] + entidade + '/usuario_plantacao/' + usuarioId + '/' + plantacaoId)
            .then((data) => { return data.data })
            .catch(() => { return {} })
    }

    async cidadesByEstado(dados) {
        return await axios
            .get(baseUrl[0] + 'cidades/estado/' + dados)
            .then((data) => { return data.data })
            .catch(() => { return {} })
    }

    async plantacoesByUsuario(dados) {
        return await axios
            .get(baseUrl[0] + 'plantacaos/usuario/' + dados)
            .then((data) => { return data.data })
            .catch(() => { return {} })
    }

    async plantacoesPrincipaisByUsuario(dados) {
        return await axios
            .get(baseUrl[0] + 'plantacaoPrincipals/usuario/' + dados)
            .then((data) => { return data.data })
            .catch(() => { return {} })
    }

    async get(entidade, i) {
        return await axios
            .get(baseUrl[i] + entidade)
            .then((data) => { return data.data })
            .catch(() => { return [] })
    }

    async getId(entidade, _id, i) {
        return await axios
            .get(baseUrl[i] + entidade + '/' + _id)
            .then((data) => { return data.data })
            .catch((erro) => { console.error(erro) })
    }

    async post(entidade, dados, i) {
        return await axios
            .post(baseUrl[i] + entidade, dados)
            .then((data) => { return data.data })
            .catch((erro) => { console.error(erro) })
    }

    async put(entidade, _id, dados, i) {
        return await axios
            .put(baseUrl[i] + entidade + '/' + _id, dados)
            .then((data) => { return data.data })
            .catch((erro) => { console.error(erro) })
    }

    async getLast(entidade, i) {
        return await this.get(entidade, i)
            .then((data) => {
                return data[data.length - 1]
            })
            .catch((erro) => { console.error(erro) })
    }

    async delete(entidade, _id, i) {
        try {
            return await axios
                .delete(baseUrl[i] + entidade + '/' + _id)
                .then((data) => { return 'Ok' })
        } catch (error) {
            return 'Não foi possível excluir'
        }
    }
}

