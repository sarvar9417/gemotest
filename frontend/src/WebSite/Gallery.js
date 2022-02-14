import React from 'react'

export const Gallery = () => {
  return (
    (<>
    <section id="gallery" className="gallery">
                    <div className="container" data-aos="fade-up">
                        <div className="section-title">
                            <h2>Gallery</h2>
                        </div>
                        <div className="gallery-slider swiper">
                            <div className="swiper-wrapper align-items-center">
                                <div className="swiper-slide"><a className="gallery-lightbox" href="assets/img/gallery/gallery-1.jpg"><img src="assets/img/gallery/gallery-1.jpg" className="img-fluid" alt /></a></div>
                                <div className="swiper-slide"><a className="gallery-lightbox" href="assets/img/gallery/gallery-2.jpg"><img src="assets/img/gallery/gallery-2.jpg" className="img-fluid" alt /></a></div>
                                <div className="swiper-slide"><a className="gallery-lightbox" href="assets/img/gallery/gallery-3.jpg"><img src="assets/img/gallery/gallery-3.jpg" className="img-fluid" alt /></a></div>
                                <div className="swiper-slide"><a className="gallery-lightbox" href="assets/img/gallery/gallery-4.jpg"><img src="assets/img/gallery/gallery-4.jpg" className="img-fluid" alt /></a></div>
                                <div className="swiper-slide"><a className="gallery-lightbox" href="assets/img/gallery/gallery-5.jpg"><img src="assets/img/gallery/gallery-5.jpg" className="img-fluid" alt /></a></div>
                                <div className="swiper-slide"><a className="gallery-lightbox" href="assets/img/gallery/gallery-6.jpg"><img src="assets/img/gallery/gallery-6.jpg" className="img-fluid" alt /></a></div>
                                <div className="swiper-slide"><a className="gallery-lightbox" href="assets/img/gallery/gallery-7.jpg"><img src="assets/img/gallery/gallery-7.jpg" className="img-fluid" alt /></a></div>
                                <div className="swiper-slide"><a className="gallery-lightbox" href="assets/img/gallery/gallery-8.jpg"><img src="assets/img/gallery/gallery-8.jpg" className="img-fluid" alt /></a></div>
                            </div>
                            <div className="swiper-pagination" />
                        </div>
                    </div>
                </section>
    </>)
  )
}
