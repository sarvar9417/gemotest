import React from 'react';

export const AboutUs = () => {
    return <div>
        <section id="about" className="about">
            <div className="container" data-aos="fade-up">
                <div className="section-title">
                    <h2>Biz haqimizda</h2>
                    <p> “GEMO-TEST” o'z faoliyatini 2018-yilda boshlagan. Korxona manzili: Navoiy shahar, 2-daxa, Navoiy ko'chasi Mamuriy bino. Bundan tashqari korxonaning bir necha filiallari mavjud, Nurota tumani filiali 2018-yil, Navbaxor tumani filiali 2019-yil ishga tushurilgan.
                        Labaratoriyalarimizda oliy malumotli shifokorlar, o'rta tibbiyot xodimlari xizmat ko'rsatadi.
                    </p>
                </div>
                <div className="row">
                    <div className="col-lg-6" data-aos="fade-right">
                        <img src="assets/img/about.jpg" className="img-fluid aboutimg" alt={"Gemotest"} />
                    </div>
                    <div className="col-lg-6 pt-4 pt-lg-0 content mt-5" data-aos="fade-left">
                        <h2><span className='text-danger'>GEMO-</span><span className='text-info'>TEST</span> laboratoriyasi</h2>
                        <p className="fst-italic">
                            Xizmat turlari
                        </p>
                        <ul>
                            <li><i className="bi bi-check-circle" /> Barcha laboratoriya tahlillari</li>
                            <li><i className="bi bi-check-circle" /> Terapevt, UTT, EKG, allergolog, urolog, gelmentolog</li>
                            <li><i className="bi bi-check-circle" /> 2020-yil mart oyidan boshlab COVID-2019 </li>
                        </ul>
                        <p>
                           Hozirgi kunda Respublika bo'yicha 200 dan ortiq tashkilot va davolash profilaktika muassasalari biz bilan hamkorlikda ishlab kelmoqda.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    </div>;
};
