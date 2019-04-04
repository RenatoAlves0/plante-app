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
            .then(() => { 'Salvo com sucesso' })
            .catch((erro) => { console.error(erro) })
    }
}

