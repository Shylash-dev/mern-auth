import React from 'react'
import './Home.css'
import Navbar from '../components/Navbar'
import Header from '../components/Header'

const Home = () => {
    return (
        <div className='home' >
            <Navbar />
            <Header />
        </div>
    )
}

export default Home