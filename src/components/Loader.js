import React from 'react';
import { Container, Spinner } from "native-base";

export default (props) => (
    <Container style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner color='#cecece' />
    </Container>
)