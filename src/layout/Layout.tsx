import * as React from 'react'

import Header from './Header'
import Container from './Container'
import Footer from './Footer'

export default function Layout({ children }) {
    return (
        <>
            <Header />
            <Container>
                {children}
            </Container>
            <Footer />
        </>
    )
}