import React, { useContext, useState } from 'react'
import './ResetPassword.css'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const ResetPassword = () => {

    const { backendUrl } = useContext(AppContext)
    axios.defaults.withCredentials = true;

    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [isEmailSent, setIsEmailSent] = useState('')
    const [otp, setOtp] = useState(0);
    const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)

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

    const onSubmitEmail = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email })
            data.success ? toast.success(data.message) : toast.error(data.message)
            data.success && setIsEmailSent(true)
        } catch (error) {
            toast.error(error.message)
        }
    }

    const onSubmitOtp = async (e) => {
        e.preventDefault();
        const otpArray = inputRefs.current.map(e => e.value)
        setOtp(otpArray.join(''))
        setIsOtpSubmitted(true)
    }

    const onSubmitNewPassword = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(backendUrl + '/api/auth/reset-password',
                { email, otp, newPassword })
            data.success ? toast.success(data.message) : toast.error(data.message);
            data.success && navigate('/login')
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className='reset-password'>
            <img className='logo' onClick={() => navigate('/')} src={assets.logo} alt="" />
            <div className='outer-reset' >
                <div className='inner-reset'>

                    {!isEmailSent &&
                        <>
                            <h2>Reset Password</h2>
                            <p>Enter your registered email address</p>
                            <form onSubmit={onSubmitEmail} action="">
                                <div className='input-name'>
                                    <img src={assets.mail_icon} alt="" />
                                    <input value={email} onChange={e => setEmail(e.target.value)}
                                        type="email" placeholder='Email id' name="" id="" required />
                                </div>
                                {/* <p onClick={() => navigate('/reset-password')} className='forget-password'>Forget password?</p> */}

                                <button>Submit</button>
                            </form>
                        </>}


                    {/* otp input form */}
                    {!isOtpSubmitted && isEmailSent &&
                        <div className="sample">
                            <div className="inner-container">
                                <form onSubmit={onSubmitOtp} action="">
                                    <h2>Reset Password OTP</h2>
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
                                    <button>Submit</button>
                                </form>
                            </div>
                        </div>
                    }



                    {/* enter new password */}

                    {isOtpSubmitted && isEmailSent &&
                        <>
                            <h2>New Password</h2>
                            <p>Enter the new password below</p>
                            <form onSubmit={onSubmitNewPassword} action="">
                                <div className='input-name'>
                                    <img src={assets.lock_icon} alt="" />
                                    <input value={newPassword} onChange={e => setNewPassword(e.target.value)}
                                        type="password" placeholder='Password' name="" id="" required />
                                </div>
                                {/* <p onClick={() => navigate('/reset-password')} className='forget-password'>Forget password?</p> */}

                                <button>Submit</button>
                            </form>
                        </>
                    }



                </div>
            </div>
        </div>
    )
}

export default ResetPassword