import React, { useState, useEffect, useContext } from 'react'
import { useHttp } from '../hooks/http.hook'
import 'react-toastify/dist/ReactToastify.css'
import { AuthContext } from '../context/AuthContext'
import { toast } from 'react-toastify'
import Reseption from './icons/reseption.png'
import { useHistory } from 'react-router-dom'

toast.configure()
export const AuthPage = () => {
    const auth = useContext(AuthContext)
    const { loading, request, error, clearError } = useHttp()
    const [form, setForm] = useState({
        login: '', password: ''
    })

    const notify = (e) => {
        toast.error(e)
    }
    const history = useHistory()

    useEffect(() => {
        if (error) {
            notify(error)
            clearError()
        }
    }, [error, clearError])

    const changeHandlar = event => {
        if (event.key === "Enter") {
            loginHandler()
        } else {
            setForm({ ...form, [event.target.name]: event.target.value })
        }

    }

    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/reseption/login', 'POST', { ...form })
            auth.login(data.token, data.reseptionId, data.user)
        } catch (e) {
            notify(e)
        }
    }

    return (
        <section>
            {/*  */}
            <div className="container">
                <div className="main-wrapp login-body" style={{ margin: "0 auto" }}>
                    <div className="login-wrapp">
                        <div className="container">
                            <div className=" loginbox ">
                                <div className="login-left d-none d-md-block">
                                    <img className="w-100" src={Reseption} alt="Logo" />
                                </div>
                                <div className="login-right">
                                    <div className="login-right-wrap">
                                        <h1>Qabul bo'limi</h1>
                                        <div className="login-or">
                                            <span className="or-line"></span>
                                            <span className="span-or"></span>
                                        </div>
                                        {/* <p className="account-subtitle">Mijozlarni ro'yxatga olish</p> */}

                                        <div className="form-group mb-3">
                                            <input
                                                onKeyUp={(e) => {
                                                    if (e.key === "Enter") { loginHandler() }
                                                }}
                                                className="form-control"
                                                onChange={changeHandlar}
                                                name="login"
                                                type="text"
                                                id="login"
                                                placeholder="login"
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <input className="form-control"
                                                onKeyUp={(e) => {
                                                    if (e.key === "Enter") { loginHandler() }
                                                }}
                                                onChange={changeHandlar}
                                                name="password"
                                                type="password"
                                                id="password"
                                                placeholder="parol"
                                            />
                                        </div>
                                        <div className="form-group text-end">
                                            <button
                                                onClick={loginHandler}
                                                className="btn btn-primary btn-block"
                                                type="button"
                                                disabled={loading}
                                            >
                                                Kirish
                                            </button>
                                            <button
                                                onClick={() => { history.push('/sayt') }}
                                                className="btn btn-danger btn-block"
                                                type="button"
                                                disabled={loading}
                                            >
                                                Bosh sahifa
                                            </button>
                                        </div>
                                        <div className="login-or">
                                            <span className="or-line"></span>
                                            <span className="span-or"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </section>
    )
}
