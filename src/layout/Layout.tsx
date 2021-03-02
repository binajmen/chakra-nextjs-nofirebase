import * as React from 'react'

import Header from './Header'
import Container from './Container'
import Footer from './Footer'

import Toaster from '../components/Toaster'

type LayoutProps = {
    children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
    return (
        <>
            <Header />
            <Container>
                {children}
            </Container>
            <Footer />
            <Toaster />
        </>
    )
}