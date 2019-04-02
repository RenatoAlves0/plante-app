import { Component } from 'react'
import axios from 'axios'

export default class Http extends Component {
    constructor(props) {
        super(props)
        this.state = {
            prefix: 'http://10.0.2.2:5000/api/'
        }
    }

    async get(entidade) {
        await axios.get(this.state.prefix + entidade)
            .then((data) => {
                return data.data;
            })
            .catch((erro) => {
                console.error(erro);
                return undefined;
            })
    }
}

