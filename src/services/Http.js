import axios from 'axios'

const local = 'http://10.0.3.2:5000/'
const online = 'https://plante-api-user.herokuapp.com/'
const baseUrl = local

export default class Http {
    async logar(dados) {
        return await axios
            .get(baseUrl + 'logins/logar', { params: { login: dados.login, senha: dados.senha } })
            .then((data) => { return data.data })
            .catch(() => { return {} })
    }

    async get(entidade) {
        return await axios
            .get(baseUrl + entidade)
            .then((data) => { return data.data })
            .catch(() => { return [] })
    }

    async post(entidade, dados) {
        return await axios
            .post(baseUrl + entidade, dados)
            .then((data) => { return data.data })
            .catch((erro) => { console.error(erro) })
    }

    async put(entidade, _id, dados) {
        return await axios
            .put(baseUrl + entidade + '/' + _id, dados)
            .then((data) => { return data.data })
            .catch((erro) => { console.error(erro) })
    }

    async getLast(entidade) {
        return await this.get(entidade)
            .then((data) => {
                return data[data.length - 1]
            })
    }

    async delete(entidade, _id) {
        try {
            return await axios
                .delete(baseUrl + entidade + '/' + _id)
                .then((data) => { return 'Ok' })
        } catch (error) {
            return 'Não foi possível excluir'
        }
    }
}

