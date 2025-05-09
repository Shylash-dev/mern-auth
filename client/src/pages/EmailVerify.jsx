import React, { useContext, useEffect } from 'react'
import './EmailVerify.css'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const EmailVerify = () => {

    axios.defaults.withCredentials = true;
    const { backendUrl, isLoggedin, userData, getUserData } = useContext(AppContext)
    const navigate = useNavigate('');

    const inputRefs = React.useRef([])

    const handleInput = (e, index) => {
        if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && e.target.value === '' && index > 0 && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    }

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text')
        const pasteArray = paste.split('');
        pasteArray.forEach((char, index) => {
            if (inputRefs.current[index]) {
                inputRefs.current[index].value = char;
            }
        })
    }

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            console.log(inputRefs.current);

            const otpArray = inputRefs.current.map(e => e.value)
            const otp = otpArray.join('')

            const { data } = await axios.post(backendUrl + '/api/auth/verify-account', { otp })
            if (data.success) {
                toast.success(data.message);
                getUserData()
                navigate('/')
            }
        } catch (error) {
            toast.error(data.message)
        }
    }

    useEffect(() => {
        isLoggedin && userData && userData.isAccountVerified && navigate('/')
    }, [isLoggedin, userData])

    return (
        <div className='email-verify'>
            <img className='logo' onClick={() => navigate('/')} src={assets.logo} alt="" />
            <div className='sample'>
                <div className='inner-container'>
                    <form onSubmit={onSubmitHandler} action="">
                        <h2>Email Verify OTP</h2>
                        <p>Enter the 6 digit code sent to your email id.</p>
                        <div className='otp-inputs'>
                            {Array(6).fill(0).map((_, index) => (
                                <input
                                    onPaste={e => handlePaste(e)}
                                    onInput={(e) => handleInput(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    ref={e => inputRefs.current[index] = e} type="text" maxLength='1' key={index} required />
                            ))}
                        </div>
                        <button >Verify email</button>
                    </form>
                </div>
            </div>

        </div>
    )
}

export default EmailVerify