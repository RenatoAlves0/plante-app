import React from 'react'
import { Container, Spinner } from "native-base"

export default (props) => (
    <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Spinner color='#cecece' />
    </Container>
)