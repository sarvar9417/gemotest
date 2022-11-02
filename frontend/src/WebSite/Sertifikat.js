import React from 'react'

export const Sertifikat = () => {
    return (
        <>
            <section id="doctors" className="doctors section-bg">
                <div className="container" data-aos="fade-up">
                    <div className="section-title">
                        <h2> Sertifikatlar </h2>
                    </div>
                    <div className="row">
                        <div className="col-lg-4 col-md-6 d-flex align-items-stretch">
                            <div className="member-img" data-aos="fade-up" data-aos-delay={100}>
                                <img src="assets/img/sertifikatlar/sertifikat1.jpg" className="img-fluid" alt="Gemotest"/>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6 d-flex align-items-stretch">
                            <div className="member-img" data-aos="fade-up" data-aos-delay={200}>
                                <img src="assets/img/sertifikatlar/sertifikat2.jpg" className="img-fluid" alt="Gemotest"/>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6 d-flex align-items-stretch">
                            <div className="member-img" data-aos="fade-up" data-aos-delay={300}>
                                <img src="assets/img/sertifikatlar/sertifikat3.jpg" className="img-fluid" alt="Gemotest"/>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    )
}
