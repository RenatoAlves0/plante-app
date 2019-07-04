import { Dimensions } from 'react-native'
export default class Estilos {
    constructor() {
        this.cor = {
            red: '#d32f2f',
            purple: '#7b1fa2',
            blue: '#1976d2',
            blue_solid: '#1f65ff',
            greenish: '#00bfa5',
            greenish_solid: '#008f75',
            green: '#4cda64',
            green_solid: '#388e3c',
            lemon: '#c2da4c',
            orange: '#ffa000',
            brown: '#5d4037',
            gray: '#888888',
            gray_medium: '#acacac',
            gray_white: '#cecece',
            gray_white_light: '#f5f5f5',
            gray_translucid: '#33333399',
            white: '#ffffff',
            black: '#000000'
        }

        this.title = {
            color: 'white',
            fontSize: 20
        }

        this.form = {
            padding: 10,
            backgroundColor: this.cor.gray_white + '99',
            margin: 10, marginBottom: 0,
            borderRadius: 7,
            flexDirection: 'column'
        }

        this.form_vazio = {
            marginBottom: 10
        }

        this.subrow = {
            backgroundColor: this.cor.gray_white + '99',
            borderRadius: 7,
            marginTop: 5
        }

        this.buttomadd = {
            fontSize: 20, backgroundColor: this.cor.blue, color: 'white',
            alignSelf: 'center', marginHorizontal: 10, width: 40, height: 40,
            padding: 10, borderRadius: 30
        }

        this.swiperow = {
            paddingTop: 0, paddingBottom: 0, paddingRight: 0, paddingLeft: 0,
            borderBottomWidth: 0, alignItems: 'center', width: Dimensions.get('window').width,
            alignContent: 'center', alignSelf: 'center', backgroundColor: this.cor.red
        }

        this.swiperow_deletbuttom = {
            backgroundColor: this.cor.red, paddingBottom: 6,
            elevation: 0, margin: 10, borderRadius: 7
        }

        this.contentmodal = {
            backgroundColor: 'white', borderRadius: 7, marginHorizontal: 10, marginTop: 10
        }

        this.head_contentmodal = {
            marginBottom: 10, marginTop: 20, alignSelf: 'center',
            fontSize: 20, fontWeight: 'bold', color: this.cor.green_solid
        }

        this.listitemview = {
            justifyContent: 'center', alignItems: 'center', flexDirection: 'row'
        }

        this.item_dash = {
            backgroundColor: this.cor.white, borderRadius: 7, margin: 15,
            width: 0.4 * Dimensions.get('window').width, height: 0.6 * Dimensions.get('window').width
        }
    }
}

