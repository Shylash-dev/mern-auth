import React, { useContext, useState } from 'react'
import './Login.css'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {

    const navigate = useNavigate();

    const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext)

    const [state, setState] = useState('Sign Up')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            axios.defaults.withCredentials = true;
            if (state === 'Sign Up') {

                const { data } = await axios.post(backendUrl + '/api/auth/register',
                    { name, email, password }
                )
                if (data.success) {
                    setIsLoggedin(true)
                    getUserData()
                    navigate('/')
                } else {
                    toast.error(data.message)
                }
            } else {

                const { data } = await axios.post(backendUrl + '/api/auth/login',
                    { email, password }
                )
                if (data.success) {
                    setIsLoggedin(true)
                    getUserData()
                    navigate('/')
                } else {
                    toast.error(data.message)
                }

            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className='login'>
            <img className='logo' onClick={() => navigate('/')} src={assets.logo} alt="" />
            <div className='sign-in' >
                <div className='inner-signin'>
                    <h2>{state === 'Sign Up' ? 'Create account' : 'Login'}</h2>
                    <p>{state === 'Sign Up' ? 'Create your account' : 'Login to your account'}</p>
                    <form onSubmit={onSubmitHandler} action="">
                        {state === 'Sign Up' && (
                            <div className='input-name'>
                                <img src={assets.person_icon} alt="" />
                                <input onChange={e => setName(e.target.value)} value={name}
                                    type="text" placeholder='Full Name' required />
                            </div>
                        )}

                        <div className='input-name'>
                            <img src={assets.mail_icon} alt="" />
                            <input onChange={e => setEmail(e.target.value)} value={email}
                                type="email" placeholder='Email id' required />
                        </div>
                        <div className='input-name'>
                            <img src={assets.lock_icon} alt="" />
                            <input onChange={e => setPassword(e.target.value)} value={password}
                                type="password" placeholder='Password' required />
                        </div>
                        <p onClick={() => navigate('/reset-password')} className='forget-password'>Forget password?</p>

                        <button>{state}</button>
                    </form>
                    {state === 'Sign Up' ? (
                        <p>Already have an account? {' '}
                            <span onClick={() => setState('Login')}>Login here</span>
                        </p>
                    ) : (<p>Don't have an account? {' '}
                        <span onClick={() => setState('Sign Up')}>Sign up</span>
                    </p>)}
                </div>
            </div>
        </div>
    )
}

export default Login