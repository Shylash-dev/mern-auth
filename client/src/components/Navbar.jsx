import React, { useContext } from 'react'
import './Navbar.css'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {

    const navigate = useNavigate()
    const { userData, backendUrl, setUserData, setIsLoggedin } = useContext(AppContext)

    const sendVerificationOtp = async () => {
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp')
            if (data.success) {
                navigate('/email-verify')
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const logout = async () => {
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.post(backendUrl + '/api/auth/logout')
            data.success && setIsLoggedin(false)
            data.success && setUserData(false)
            navigate('/')
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className='navbar'>
            <img src={assets.logo} alt="" className='navbar-img' />
            {userData
                ? <div className='letter-icon'>
                    {userData.name[0].toUpperCase()}
                    <div className='list'>
                        <ul>
                            {!userData.isAccountVerified && <li onClick={sendVerificationOtp} >Veriy email</li>}

                            <li onClick={logout} >Logout</li>
                        </ul>
                    </div>
                </div>
                : <button onClick={() => navigate('/login')} >
                    <div className='button-img'>
                        <span>Login</span> <img src={assets.arrow_icon} alt="" />
                    </div>
                </button>
            }

        </div>
    )
}

export default Navbar