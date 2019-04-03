import React from 'react'
import { Header, Item, Container, Form, Content, Input, Label, Picker, Icon, Text } from 'native-base'

export default class InputText extends React.Component {
    constructor() {
        super()
        this.state = {
            selected: undefined,
            plantas: [],
        }
    }

    changeItem(value) {
        this.setState({
            selected: value
        })
    }

    render() {
        return (
            <Container>
                <Header />
                <Content>
                    <Form>
                        <Item floatingLabel>
                            <Label>Nome</Label>
                            <Input />
                        </Item>
                        <Item picker>
                            <Picker
                                mode='dialog'
                                iosIcon={<Icon name='arrow-down' />}
                                style={{ width: undefined }}
                                placeholder='Famílias'
                                placeholderStyle={{ color: '#bfc6ea' }}
                                placeholderIconColor='#007aff'
                                selectedValue={this.state.selected}
                                onValueChange={this.changeItem.bind(this)}
                            >
                                <Picker.Item label='Wallet' value='key0' />
                                <Picker.Item label='ATM Card' value='key1' />
                                <Picker.Item label='Debit Card' value='key2' />
                                <Picker.Item label='Credit Card' value='key3' />
                                <Picker.Item label='Net Banking' value='key4' />
                            </Picker>
                        </Item>
                        {this.state.plantas ? this.state.plantas.map((item) => {
                            return <Text key={item.id} >{item.nome}</Text>
                        }) : null}
                    </Form>
                </Content>
            </Container>
        )
    }
}