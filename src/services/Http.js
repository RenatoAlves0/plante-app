import axios from 'axios'

const local = 'http://10.0.3.2:5000/'
const online = 'https://plante-api.herokuapp.com/'
const baseUrl = online

export default class Http {
    async get(entidade) {
        return await axios
            .get(baseUrl + entidade)
            .then((data) => { return data.data })
            .catch((erro) => { console.error(erro) })
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

