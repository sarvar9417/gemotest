import { useCallback, useState } from 'react'

export const useHttp = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const [turn, setTurn] = useState()

    const request = useCallback(async (url, method = 'GET', body = 'null', headers = {}) => {
        setLoading(true)
        try {
            if (body) {
                body = JSON.stringify(body)
                headers['Content-Type'] = 'application/json'
            }
            const response = await fetch(url, { method, body, headers })
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Ko`zda tutilmagan xatolik yuzberdi')
            }
            setLoading(false)
            return data
        } catch (e) {
            setLoading(false)
            setError(e.message)
            throw e
        }
    }, [])

    const getTurn = useCallback(async (section) => {
        try {
            const fetch = await request(`/api/section/turnid/${section}`, 'GET', null)
            setTurn(fetch)
        } catch (e) {
        }
    }, [setTurn])


    const clearError = () => setError(null)
    return { loading, request, error, clearError, getTurn, turn }
}
