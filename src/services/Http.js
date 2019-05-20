import axios from 'axios'

const baseUrl = 'http://10.0.3.2:5000/api/'

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

    async put(entidade, id, dados) {
        return await axios
            .put(baseUrl + entidade, id, dados)
            .then((data) => { return data.data })
            .catch((erro) => { console.error(erro) })
    }

    async getLast(entidade) {
        return await this.get(entidade)
            .then((data) => {
                return data[data.length - 1]
            })

    }

    async delete(entidade, id) {
        try {
            return await axios
                .delete(baseUrl + entidade + '/' + id)
                .then((data) => { return 'Ok' })
        } catch (error) {
            return 'Não foi possível excluir'
        }
    }
}

