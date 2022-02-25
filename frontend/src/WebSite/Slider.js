import React from 'react';

export const Slider = () => {
    return <div>
        <section id="hero">
            <div id="heroCarousel" data-bs-interval={5000} className="carousel slide carousel-fade" data-bs-ride="carousel">
                <ol className="carousel-indicators" id="hero-carousel-indicators" />
                <div className="carousel-inner" role="listbox">
                    {/* Slide 1 */}
                    <div className="carousel-item active" style={{ backgroundImage: 'url(assets/img/slide/slide-1.jpeg)' }}>
                        <div className="container">
                            <h2> <span className='text-danger'>GEMO-</span><span className='text-info'>TEST</span> ga xush kelibsiz</h2>
                            <p> “GEMO-TEST” xususiy korxonasi 2018-yil O'zbekiston Respublikasining "Xususiy korxona to'g'risida"gi qonun va boshqa qonun hujjatlariga asosan tashkil qilingan va hozirgi kungacha sifatli xizmat ko'rsatib kelmoqda.</p>
                            <a href="#contact" className="btn-get-started scrollto">Biz bilan bog'laning</a>
                        </div>
                    </div>
                    {/* Slide 2 */}
                    <div className="carousel-item" style={{ backgroundImage: 'url(assets/img/slide/slide-2.jpeg)' }}>
                        <div className="container">
                            <h2> <span className='text-danger'>GEMO-</span><span className='text-info'>TEST</span> ga xush kelibsiz</h2>
                            <p>“GEMO-TEST” xususiy korxonasi 2018-yil O'zbekiston Respublikasining "Xususiy korxona to'g'risida"gi qonun va boshqa qonun hujjatlariga asosan tashkil qilingan va hozirgi kungacha sifatli xizmat ko'rsatib kelmoqda.</p>
                            <a href="#contact" className="btn-get-started scrollto">Biz bilan bog'laning</a>
                        </div>
                    </div>
                    {/* Slide 3 */}
                    <div className="carousel-item" style={{ backgroundImage: 'url(assets/img/slide/slide-3.gif)' }}>
                        <div className="container">
                            <h2> <span className='text-danger'>GEMO-</span><span className='text-info'>TEST</span> ga xush kelibsiz</h2>
                            <p>“GEMO-TEST” xususiy korxonasi 2018-yil O'zbekiston Respublikasining "Xususiy korxona to'g'risida"gi qonun va boshqa qonun hujjatlariga asosan tashkil qilingan va hozirgi kungacha sifatli xizmat ko'rsatib kelmoqda.</p>
                            <a href="#contact" className="btn-get-started scrollto">Biz bilan bog'laning</a>
                        </div>
                    </div>
                </div>
                <a className="carousel-control-prev" href="#heroCarousel" role="button" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon bi bi-chevron-left" aria-hidden="true" />
                </a>
                <a className="carousel-control-next" href="#heroCarousel" role="button" data-bs-slide="next">
                    <span className="carousel-control-next-icon bi bi-chevron-right" aria-hidden="true" />
                </a>
            </div>
        </section>{/* End Hero */}
    </div>;
};
