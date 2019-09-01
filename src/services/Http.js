import axios from 'axios'

const baseUrl = [
    'https://plante-api-user.herokuapp.com/',
    'https://plante-api.herokuapp.com/',
    'http://10.0.3.2:5000/'
]

export default class Http {
    async logar(dados) {
        return await axios
            .get(baseUrl[0] + 'logins/logar', { params: { login: dados.login, senha: dados.senha } })
            .then((data) => { return data.data })
            .catch(() => { return {} })
    }

    async get(entidade, i) {
        return await axios
            .get(baseUrl[i] + entidade)
            .then((data) => { return data.data })
            .catch(() => { return [] })
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

