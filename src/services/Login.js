import rnfs from 'react-native-fs'

let login = {
    _id: '', login: '', senha: '', usuario: ''
}

class LoginService {

    update = async (_login) => {
        login = _login
        await this.gravarArquivo(
            rnfs.DocumentDirectoryPath + '/login.json',
            JSON.stringify(login))
    }

    async get() {
        let index_file = -1
        return await rnfs.readDir(rnfs.DocumentDirectoryPath)
            .then(async (result) => {
                console.log('Resultado de leitura obtido', result)
                await result.forEach(async element => {
                    if (element.name == 'login.json') {
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
                console.log('Login gravado com sucesso no armazenamento interno!')
            })
            .catch((err) => {
                console.log('Falha ao gravar Login no armazenamento interno!')
                console.log(err.message)
            })
    }
}

const loginService = new LoginService()
export default loginService
