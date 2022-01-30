
import { useCallback, useEffect, useState } from 'react'

const storageName = 'labaratoriyaData'
export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [labaratoriyaId, setLabaratoriyaId] = useState(null)

    const login = useCallback((jwtToken, id) => {
        setToken(jwtToken)
        setLabaratoriyaId(id)

        localStorage.setItem(storageName, JSON.stringify({
            labaratoriyaId: id,
            token: jwtToken
        }))
    }, [])

    const logout = useCallback(() => {
        setToken(null)
        setLabaratoriyaId(null)
        localStorage.removeItem(storageName)
    }, [])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName))
        if (data && data.token) {
            login(data.token, data.labaratoriyaId)
        }
    }, [login])

    return { login, logout, token, labaratoriyaId }
}
