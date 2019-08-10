import React, { Component } from 'react'
import { StatusBar, Dimensions } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { Text, Form, Container, View, Button, Header, Body, Row } from 'native-base'
import estilo from '../../assets/Estilo'
import FeatherIcon from 'react-native-vector-icons/Feather'
import Chart from '../../components/ChartToday'
import weatherToday from '../../services/WeatherToday'

export default class Today extends Component {
    constructor(props) {
        super(props)
        this.estilo = new estilo()
        this.state = {
            loaded: false,
            weather_cor: this.estilo.cor.purple,
            turno: 0,
            sensacao_termica: 0,
            weather_atual: 'temperatura',
            temperatura_tipo: 'temperatura',
            variavel_ambiental: 'Temperatura',
            weather_today: {},
        }

        this.weather = [
            { key: 'temperatura', icon: 'thermometer', variavel_ambiental: 'Temperatura', cor: this.estilo.cor.purple },
            { key: 'umidade', icon: 'droplet', variavel_ambiental: 'Umidade', cor: this.estilo.cor.blue_light },
            { key: 'chuva', icon: 'cloud-drizzle', variavel_ambiental: 'Chuva', cor: this.estilo.cor.blue },
            { key: 'vento', icon: 'wind', variavel_ambiental: 'Vento', cor: this.estilo.cor.greenish_medium },
            { key: 'radiacao', icon: 'sun', variavel_ambiental: 'Radiação', cor: this.estilo.cor.orange },
        ]

        this.weather_temperatura = [
            { key: 'temperatura', label: 'Temperatura' },
            { key: 'ponto_orvalho', label: 'Ponto de orvalho' },
            { key: 'sensacao_termica', label: 'Sensação térmica' },
            { key: 'bulbo_umido', label: 'Bulbo úmido' },
        ]
    }

    async componentWillMount() {
        await this.setState({ weather_today: await weatherToday.get() })
        this.render()
    }

    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: this.estilo.cor.white, elevation: 0 }}>
                    <Button rounded transparent onPress={() => Actions.pop()}>
                        <FeatherIcon name='arrow-left' style={{ color: this.estilo.cor.gray_solid, fontSize: 22, marginHorizontal: 5 }} />
                    </Button>
                    <Body>
                        <Text style={{ color: this.estilo.cor.gray_solid, fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>Previsão 12 horas</Text>
                    </Body>
                    <Button disabled rounded transparent onPress={() => Actions.pop()}>
                        <FeatherIcon name='arrow-left' style={{ color: 'transparent', fontSize: 22, marginHorizontal: 5 }} />
                    </Button>
                </Header>
                <StatusBar backgroundColor={this.estilo.cor.white} barStyle='dark-content' />

                <View style={{
                    flex: 1, width: Dimensions.get('screen').width,
                    alignItems: 'center', justifyContent: 'flex-end'
                }}>
                    {/* Gŕaficos (abaixo) */}
                    {/* Temperatura */}
                    <Form style={this.state.weather_atual == 'temperatura' && this.state.temperatura_tipo == 'temperatura' ? null : this.estilo.hide}>
                        <Chart data_array={this.state.weather_today.temperatura}
                            label_array={this.state.weather_today.hora}
                            color={this.estilo.cor.purple} label_data='º' />
                    </Form>

                    <Form style={this.state.weather_atual == 'temperatura' && this.state.temperatura_tipo == 'sensacao_termica' ? null : this.estilo.hide}>
                        <Chart data_array={this.state.weather_today.sensacao_termica}
                            label_array={this.state.weather_today.hora}
                            color={this.estilo.cor.purple} label_data='º' />
                    </Form>

                    <Form style={this.state.weather_atual == 'temperatura' && this.state.temperatura_tipo == 'bulbo_umido' ? null : this.estilo.hide}>
                        <Chart data_array={this.state.weather_today.temperatura_de_bulbo_umido}
                            label_array={this.state.weather_today.hora}
                            color={this.estilo.cor.purple} label_data='º' />
                    </Form>

                    <Form style={this.state.weather_atual == 'temperatura' && this.state.temperatura_tipo == 'ponto_orvalho' ? null : this.estilo.hide}>
                        <Chart data_array={this.state.weather_today.ponto_de_orvalho}
                            label_array={this.state.weather_today.hora}
                            color={this.estilo.cor.purple} label_data='º' />
                    </Form>

                    {/* Umidade */}
                    <Form style={this.state.weather_atual == 'umidade' ? null : this.estilo.hide}>
                        <Chart data_array={this.state.weather_today.umidade_relativa}
                            label_array={this.state.weather_today.hora}
                            color={this.estilo.cor.blue_light} label_data='º' />
                    </Form>

                    {/* Chuva */}
                    <Form style={this.state.weather_atual == 'chuva' ? null : this.estilo.hide}>
                        <Chart data_array={this.state.weather_today.chuva_quantidade}
                            label_descricao_array={this.state.weather_today.chuva_probabilidade}
                            label_array={this.state.weather_today.hora} label_array_label='%'
                            color={this.estilo.cor.blue} label_data='º' />
                    </Form>

                    {/* Vento */}
                    <Form style={this.state.weather_atual == 'vento' ? null : this.estilo.hide}>
                        <Chart data_array={this.state.weather_today.vento_velocidade}
                            label_descricao_array={this.state.weather_today.vento_direcao}
                            label_array={this.state.weather_today.hora}
                            color={this.estilo.cor.greenish_medium} label_data=' km/h' />
                    </Form>

                    {/* Radiação */}
                    <Form style={this.state.weather_atual == 'radiacao' ? null : this.estilo.hide}>
                        <Chart data_array={this.state.weather_today.uv_indice}
                            label_descricao_array={this.state.weather_today.uv_descricao}
                            label_descricao_array_big={true}
                            label_array={this.state.weather_today.hora}
                            color={this.estilo.cor.orange} label_data=' uv' />
                    </Form>
                    {/* Gŕaficos (acima) */}
                </View>

                <Form style={{ justifyContent: 'center', backgroundColor: this.state.weather_cor, paddingBottom: 5 }}>
                    {/* Botões */}
                    <Form style={{ flexDirection: 'row', marginVertical: 30, justifyContent: 'center' }}>
                        {/* Genérico */}
                        <Button rounded style={this.state.weather_atual == 'temperatura' ? this.estilo.hide : {
                            backgroundColor: this.estilo.cor.white + '11', borderRadius: 20,
                            paddingVertical: 10, alignSelf: 'center', elevation: 0
                        }}>
                            <Text uppercase={false} style={{
                                fontSize: 17, color: this.estilo.cor.white, fontWeight: 'bold',
                                paddingLeft: 30, paddingRight: 30
                            }}
                            >{this.state.variavel_ambiental}</Text>
                        </Button>

                        {/* Temperatura */}
                        <Form style={this.state.weather_atual != 'temperatura' ? this.estilo.hide :
                            { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingBottom: 5 }} >
                            {this.weather_temperatura.map((item) => (
                                <Button rounded key={item.key} style={{
                                    backgroundColor: this.estilo.cor.white + '11', marginHorizontal: 10, elevation: 0,
                                    marginVertical: 10, borderRadius: 20
                                }}
                                    onPress={() => this.setState({ temperatura_tipo: item.key })}>
                                    <Text uppercase={false} style={{
                                        fontSize: 17, color: item.key == this.state.temperatura_tipo ? this.estilo.cor.white : this.estilo.cor.white + '77',
                                        paddingLeft: 30, paddingRight: 30
                                    }}>{item.label}</Text>
                                </Button>
                            ))}
                        </Form>
                    </Form>

                    <Form style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingVertical: 5 }}>
                        {this.weather.map((item) => (
                            <Button large transparent key={item.icon} rounded style={{ paddingHorizontal: 20 }}
                                onPress={() => {
                                    this.setState({
                                        weather_atual: item.key, weather_cor: item.cor,
                                        variavel_ambiental: item.variavel_ambiental
                                    })
                                }}>
                                <FeatherIcon name={item.icon} style={[{ fontSize: 25, color: this.estilo.cor.white + '77' },
                                this.state.weather_atual == item.key ?
                                    { color: this.estilo.cor.white } : null]} />
                            </Button>
                        ))}
                    </Form>
                </Form>
            </Container >
        )
    }
}