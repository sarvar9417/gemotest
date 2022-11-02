import React, { useState } from 'react'
import { NavoiyMap } from './maplar/NavoiyMap';

export const Contact = () => {

    const datas = [
        {
            manzil: `Navoiy shahar Navoiy ko'chasi 2-daxa mamuriy bino IIB boshqarmasi yonida`,
            instagram: `https://instagram.com/gemotestofical?utm_medium=copy_link`,
            telegram: `https://t.me/gemotest797tao`,
            telefon1: `+998 93 433 10 32`,
            telefon2: `+998 79 220 13 46`,
            lat: 40.092612,
            lang: 65.369701
        },

        {
            manzil: `Navbahor tumani Kelachi MFY A.Navoiy ko'chasi 10-uy`,
            instagram: ` https://instagram.com/gemotestofical?utm_medium=copy_link`,
            telegram: `https://t.me/gemotest797tao`,
            telefon1: `+998 94 377 90 94`,
            telefon2: ``,
            lat: 40.258977,
            lang: 65.439654
        },

        {
            manzil: `Nurato tumani U.Yusupov ko'chasi 32-a uy`,
            instagram: ` https://instagram.com/gemotestofical?utm_medium=copy_link`,
            telegram: `https://t.me/gemotest797tao`,
            telefon1: `+998 95 610 03 07`,
            telefon2: ``,
            lat: 40.564804,
            lang: 65.693007
        },
    ]

    const [contact, setContact] = useState(datas[0])

    return (
        <>
            <section id="contact" className="contact">
                <div className="container">
                    <div className="section-title">
                        <h2> Biz bilan bog'lanish </h2>
                    </div>
                </div>

                <div className='container my-4'>
                    <NavoiyMap lat={contact.lat} lang={contact.lang} />
                </div>

                <div className="container">
                    <div className="row mt-5">


                        <div className="mb-5" >

                            <div className='row'>
                                <div className='col-lg-4 col-md-4'>
                                    <h4 className='text-center'>
                                        <button onClick={() => setContact(datas[0])} className=' btn btn-info'> Navoiy</button>
                                    </h4>
                                </div>
                                <div className='col-lg-4 col-md-4'>
                                    <h4 className='text-center'>
                                        <button onClick={() => setContact(datas[1])} className=' btn btn-info'> Navbahor</button>
                                    </h4>
                                </div>
                                <div className='col-lg-4 col-md-4'>
                                    <h4 className='text-center'>
                                        <button onClick={() => setContact(datas[2])} className=' btn btn-info'> Nurota</button>
                                    </h4>
                                </div>

                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="info-box p-3">
                                        <i className="border bx bx-map" style={{ width: "80px" }} />
                                        <h3>Bizning manzil</h3>
                                        <p className='ms-4 mt-2'> {contact.manzil}  </p>
                                    </div>
                                </div>

                                <div className=" col-lg-5 info-box mt-4 ms-4 p-3">
                                    <a href={`${contact.telegram}`}><i className="iconnn bx bxl-telegram" />
                                        <p className='p text-center' > Telegram</p>
                                    </a>

                                </div>

                                <div className=" col-lg-5 info-box mt-4 ms-4 text-center p-3">
                                    <a href={`${contact.instagram}`}> <i className="iconnn bx bxl-instagram" />
                                        <p className='p text-center'>Instagram</p>
                                    </a>


                                </div>

                                <div className="col-md-12">
                                    <div className="info-box mt-4 p-3">
                                        <i className="border bx bx-phone-call me-2" />
                                        <h3>Bizning telefon raqam</h3>
                                        <p className='text-start ms-3' > {contact.telefon1}<br /> {contact.telefon2}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="php-email-form">
                                <div className="row">
                                    <div className="col form-group mt-3">
                                        <input type="text" name="name" className="form-control" id="name" placeholder="Ismingiz" required />
                                    </div>
                                    <div className="col form-group mt-3">
                                        <input type="email" className="form-control" name="email" id="email" placeholder="Emailingiz" required />
                                    </div>
                                </div>
                                <div className="form-group mt-3">
                                    <input type="text" className="form-control" name="subject" id="subject" placeholder="Mavzu" required />
                                </div>
                                <div className="form-group mt-3">
                                    <textarea className="form-control" name="message" rows={5} placeholder="Xabar" required defaultValue={""} />
                                </div>
                                <div className="my-3">
                                    <div className="loading">Loading</div>
                                    <div className="error-message" />
                                    <div className="sent-message"> Sizning xabaringiz jo'natildi. </div>
                                </div>
                                <div className="text-center"><button type="submit">Xabarni jo'natish</button></div>
                            </div>
                        </div>






                    </div>
                </div>
            </section>
        </>
    )
}
