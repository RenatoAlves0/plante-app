import { Dimensions } from 'react-native'
export default class Estilos {
    constructor() {
        this.cor = {
            red_solid: '#962020',
            red: '#d32f2f',
            red_vivid: '#ff1036',
            pink_solid: '#da5259',
            pink: '#eb3f96',
            purple: '#7b1fa2',
            purple_vivid: '#c100b7',
            blue_light: '#039cb0',
            blue: '#1967d2',
            blue_solid: '#0032a0',
            blue_dark: '#00226d',
            greenish_light: '#07f1f4',
            greenish: '#00d9bb',
            greenish_medium: '#008e79',
            greenish_solid: '#007463',
            green_ligth: '#00e770',
            green: '#4cda64',
            green_solid: '#23a54c',
            lemon: '#c2da4c',
            yellow: '#fbb010',
            yellow_light: '#f0d30f',
            orange: '#ffa000',
            orange_medium: '#ff7600',
            brown: '#5d4037',
            brwon_light: '#b17f5f',
            gray_solid: '#666666',
            gray: '#888888',
            gray_medium: '#acacac',
            gray_white: '#cecece',
            gray_white_light: '#f5f5f5',
            gray_translucid: '#00000055',
            white: '#ffffff',
            black: '#000000'
        }

        this.cor_platacao = [
            this.cor.brown_vivid,
            this.cor.pink_solid,
            this.cor.red,
            this.cor.orange_medium,
            this.cor.yellow,
            this.cor.green_solid,
            this.cor.greenish_medium,
            this.cor.blue_light,
            this.cor.purple,
            this.cor.purple_vivid,
        ],

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

        this.form_user = {
            backgroundColor: this.cor.white,
            width: Dimensions.get('screen').width * .9, borderRadius: 20, marginTop: 20,
            alignSelf: 'center', elevation: 60, padding: 15, flexWrap: 'wrap'
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
            paddingTop: 0, paddingBottom: 0, paddingRight: 0, paddingLeft: 0, marginLeft: -1,
            borderBottomWidth: 0, alignItems: 'center', width: Dimensions.get('window').width,
            alignContent: 'center', alignSelf: 'center', backgroundColor: this.cor.red
        }

        this.swiperow_deletbuttom = {
            backgroundColor: this.cor.red, paddingBottom: 6,
            elevation: 0, margin: 10, borderRadius: 20
        }

        this.contentmodal = {
            backgroundColor: 'white', borderRadius: 20, marginHorizontal: 10, marginTop: 10
        }

        this.head_contentmodal = {
            marginBottom: 10, marginTop: 20, alignSelf: 'center',
            fontSize: 20, fontWeight: 'bold', color: this.cor.green_solid
        }

        this.listitemview = {
            justifyContent: 'center', alignItems: 'center', flexDirection: 'row'
        }

        this.item_dash = {
            width: 170, height: 200, marginHorizontal: 10, paddingTop: 0,
            paddingBottom: 0, borderRadius: 20, elevation: 10, marginVertical: 20
        }

        this.item_dash_weather = {
            width: '90%', marginVertical: 15, marginHorizontal: 10, paddingTop: 0,
            alignSelf: 'center', paddingBottom: 5, borderRadius: 20, elevation: 10
        }

        this.buttom_item_dash = {
            borderRadius: 20, alignItems: 'center', justifyContent: 'center',
            height: '100%', width: '100%', backgroundColor: '',
            flexDirection: 'column', elevation: 0
        }

        this.icon_item_dash = {
            fontSize: 50, marginBottom: 20, color: this.cor.white
        }

        this.button_item_weather = {
            paddingHorizontal: 20, backgroundColor: '', elevation: 0, marginHorizontal: 5
        }

        this.icon_item_weather = {
            fontSize: 25, color: this.cor.white + '77'
        }

        this.hide = {
            height: 0, width: 0, opacity: 0
        }
    }
}

