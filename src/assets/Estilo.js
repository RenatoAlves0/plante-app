import { Dimensions } from 'react-native'
export default class Estilos {
    constructor() {
        this.cor = {
            red_solid: '#962020',
            red: '#d32f2f',
            red_vivid: '#ff1036',
            purple: '#7b1fa2',
            purple_vivid: '#c100b7',
            blue_light: '#03c8e2',
            blue: '#1976d2',
            blue_solid: '#1f65ff',
            blue_dark: '#00226d',
            greenish_light: '#07f1f4',
            greenish: '#00bfa5',
            greenish_solid: '#008f75',
            green_ligth: '#00e770',
            green: '#4cda64',
            green_solid: '#388e3c',
            lemon: '#c2da4c',
            yellow: '#f1f407',
            orange: '#ffa000',
            orange_light: '#ff8d33',
            brown: '#5d4037',
            brown_vivid: '#754040',
            brwon_light: '#c39898',
            gray: '#888888',
            gray_medium: '#acacac',
            gray_white: '#cecece',
            gray_white_light: '#f5f5f5',
            gray_translucid: '#00000055',
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
            borderRadius: 10,
            flexDirection: 'column'
        }

        this.form_vazio = {
            marginBottom: 10
        }

        this.subrow = {
            backgroundColor: this.cor.gray_white + '99',
            borderRadius: 10,
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
            elevation: 0, margin: 10, borderRadius: 10
        }

        this.contentmodal = {
            backgroundColor: 'white', borderRadius: 10, marginHorizontal: 10, marginTop: 10
        }

        this.head_contentmodal = {
            marginBottom: 10, marginTop: 20, alignSelf: 'center',
            fontSize: 20, fontWeight: 'bold', color: this.cor.green_solid
        }

        this.listitemview = {
            justifyContent: 'center', alignItems: 'center', flexDirection: 'row'
        }

        this.item_dash = {
            width: 160, height: 200, margin: 15, paddingTop: 0,
            paddingBottom: 0, borderRadius: 10, elevation: 10
        }

        this.buttom_item_dash = {
            borderRadius: 10, alignItems: 'center', justifyContent: 'center',
            height: '100%', width: '100%', backgroundColor: '',
            flexDirection: 'column', elevation: 0
        }

        this.icon_item_dash = {
            fontSize: 50, marginBottom: 20, color: this.cor.white
        }

        this.button_item_weather = {
            marginVertical: 20, paddingHorizontal: 20, backgroundColor: '', elevation: 0, marginHorizontal: 5
        }

        this.icon_item_weather = {
            fontSize: 30, color: this.cor.white + '77'
        }
    }
}

