import React from 'react'
import { Map } from './Map';


export const Contact = () => {
  return (
    <>
    <section id="contact" className="contact">
                    <div className="container">
                        <div className="section-title">
                            <h2> Biz bilan bog'lanish </h2>
                        </div>
                    </div>
                    <div>
                       <Map />

                        <div className='row'>
                            <div className='col-lg-4'>
                                <h4 className='text-center'> Navoiy </h4>
                                {/* map uchun joy */}
                            </div>

                            <div className='col-lg-4'>
                            <h4 className='text-center'> Nurota </h4>
                             {/* map uchun joy */}
                            </div>

                            <div className='col-lg-4'>
                            <h4 className='text-center'> Navbahor </h4>
                             {/* map uchun joy */}
                            </div>

                        </div>
                    </div>
                    <div className="container">
                        <div className="row mt-5">
                            <div className="col-lg-6">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="info-box">
                                            <i className="bx bx-map me-2"/>
                                            <h3>Bizning manzil</h3>
                                            <p className='ms-4 mt-2' > A108 Adam Street, New York, NY 535022</p>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="info-box mt-4">
                                            <i className="bx bx-envelope me-2"/>
                                            <h3>Bizning Email</h3>
                                            <p className='text-start ms-3' >info@example.com<br />contact@example.com</p>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="info-box mt-4">
                                            <i className="bx bx-phone-call me-2"/>
                                            <h3>Bizning telefon raqam</h3>
                                            <p className='text-start ms-3' >+1 5589 55488 55<br />+1 6678 254445 41</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <form action="forms/contact.php" method="post" role="form" className="php-email-form">
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
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
    </>
  )
}
