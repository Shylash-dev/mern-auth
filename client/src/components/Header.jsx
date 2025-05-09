import React, { useContext } from 'react'
import './Header.css'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const Header = () => {

    const { userData } = useContext(AppContext)
    return (
        <div className='header'>
            <div className='sub-header'>
                <img className='header-icon' src={assets.header_img} alt="" />
                <h2>Hey {userData ? userData.name : 'Developer'} <img className='handwave-icon' src={assets.hand_wave} alt="" /></h2>
                <h1>Welcome to our app</h1>
                <p>Let's start with a quick product tour and we will have you up and running in no time</p>
                <button>Get Started </button>
            </div>
        </div>
    )
}

export default Header