import React from 'react'

const Futures = () => {
  return (
    <>
    <section id="features" className="features">
                    <div className="container" data-aos="fade-up">
                        <div className="row">
                            <div className="col-lg-6 order-2 order-lg-1" data-aos="fade-right">
                                <div className="icon-box mt-5 mt-lg-0">
                                    <i className="bx bx-receipt" />
                                    <h4> Analizator </h4>
                                    <p> Har bir analizatorga sifatni nazorat qilish tizimi integratsiya qilingan  </p>
                                </div>
                                <div className="icon-box mt-5">
                                    <i className="bx bx-cube-alt" />
                                    <h4> LabСentre </h4>
                                    <p> LabСentre Labarator Infarmatsion tizimi uch bosqichli sifat nazorat tizimida ishlaydi</p>
                                </div>
                                <div className="icon-box mt-5">
                                    <i className="bx bx-shield" />
                                    <h4> Jihozlarimiz </h4>
                                    <p> EQAS, Bio-Rad , RIQAS , LabQuality , VQC AcroMetrix kabi xalqaro sifat nazoratiga ega.</p>
                                </div>
                            </div>
                            <div className="image col-lg-6 order-1 order-lg-2" style={{ backgroundImage: 'url("assets/img/features.jpg")' }} data-aos="zoom-in" />
                        </div>
                    </div>
                </section>
    </>
  )
}

export default Futures