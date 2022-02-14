import React from 'react'

export const Servise = () => {
  return (
    (<>
            <section id="services" className="services services">
                    <div className="container" data-aos="fade-up">
                        <div className="section-title">
                            <h2> Bizning laboratoriay xizmatlarimiz </h2>
                        </div>
                        <div className="row">
                            <div className="col-lg-4 col-md-6 icon-box" data-aos="zoom-in" data-aos-delay={100}>
                                <div className="icon"><i className="fas fa-heartbeat" /></div>
                                <h4 className="title"><a href> Klinik laboratoriya tekshiruvlari</a></h4>
                            </div>
                            <div className="col-lg-4 col-md-6 icon-box" data-aos="zoom-in" data-aos-delay={200}>
                                <div className="icon"><i className="fas fa-pills" /></div>
                                <h4 className="title"><a href> Immunologik tekshiruvlar </a></h4>
                            </div>
                            <div className="col-lg-4 col-md-6 icon-box" data-aos="zoom-in" data-aos-delay={300}>
                                <div className="icon"><i className="fas fa-hospital-user" /></div>
                                <h4 className="title"><a href> Bakterilogik tekshiruvlar </a></h4>
                            </div>
                            <div className="col-lg-4 col-md-6 icon-box" data-aos="zoom-in" data-aos-delay={100}>
                                <div className="icon"><i className="fas fa-dna" /></div>
                                <h4 className="title"><a href> Gematologik tekshiruvlar </a></h4>
                            </div>
                            <div className="col-lg-4 col-md-6 icon-box" data-aos="zoom-in" data-aos-delay={200}>
                                <div className="icon"><i className="fas fa-wheelchair" /></div>
                                <h4 className="title"><a href> IFA tekshiruvlari</a></h4>
                            </div>
                            <div className="col-lg-4 col-md-6 icon-box" data-aos="zoom-in" data-aos-delay={300}>
                                <div className="icon"><i className="fas fa-notes-medical" /></div>
                                <h4 className="title"><a href> PSR tekshiruvlari</a></h4>
                            </div>
                        </div>
                    </div>
                </section>
    </>)
  )
}
