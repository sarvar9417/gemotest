import { Link } from 'react-router-dom'
import { Loading } from './components/Loading'
import './sayt.css'
import AOS from 'aos'
import 'aos/dist/aos'
import { useEffect, useState } from 'react'
import { Reseption } from './Sections/Reseption'
import { Cashier } from './Sections/Cashier'
import { Doctor } from './Sections/Doctor'
import { Director } from './Sections/Director'
import { Turn } from './Turn'
import { CallCenter } from './CallCenter'
import { Medsestra } from './Sections/Medsestra'
import { Fizioterapevt } from './Sections/Fizioterapevt'
import { CounterAgent } from './../CounterAgent/CounterAgent'
import { Labaratoriya } from './Sections/Labaratoriya'

export const Sayt = () => {

    const [loader, setLoader] = useState(true)

    useEffect(() => {
        setLoader(false)
        AOS.init({
            duration: 2000
        })


    }, [])

    if (loader) {
        return <>
            <Loading />
        </>
    }

    return (
        <div className="body">
            <div className="header">
                <h1>XALQ XIZMATI OLIY MAQSAD</h1>
            </div>
            <div className="links">
                <Reseption />
                <Director />
                <Cashier />
                <Doctor />
            </div>
            <div className='row'>
                <Labaratoriya/>
            </div>
            {/* <div className='row mt-5'>
                <Medsestra />
                <Fizioterapevt />
            </div>
            <div className='row mt-5'>
                <div className='col-12 text-center'>
                    <Link className='btn btn-warning px-5' to="/counteragent"> Kontragent </Link>
                </div>
            </div> */}
            <Turn />
            <CallCenter />
        </div>

    )
}