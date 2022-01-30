import React from 'react'
import { LabaratoriyaRoutes } from './LabaratoriyaRoutes'
import { BrowserRouter as Router } from 'react-router-dom'
import { useAuth } from './hooks/auth.hook'
import { AuthContext } from './context/AuthContext'
import { Navbar } from './components/Navbar'
export const Labaratoriya = () => {
    localStorage.removeItem('directorData')
    localStorage.removeItem('doctorData')
    localStorage.removeItem('cashierData')
    localStorage.removeItem('callcenterData')
    localStorage.removeItem('reseptionData')
    localStorage.removeItem('fizioterapevtData')
    localStorage.removeItem('counteragentData')
    localStorage.removeItem('medsestraData')
    const { login, token, logout, labaratoriyaId } = useAuth()
    const isAuthenticated = !!token
    const labaratoriyaRouter = LabaratoriyaRoutes(isAuthenticated)
    return (
        <AuthContext.Provider value={{ login, logout, token, labaratoriyaId, isAuthenticated }} >
            <Router>
                {isAuthenticated && <Navbar />}
                {labaratoriyaRouter}
            </Router>
        </AuthContext.Provider>
    )
}



