import React from 'react';
import { AboutUs } from './AboutUs';
import { Contact } from './Contact';
import { Counts } from './Counts';
import { Footer } from './Footer';
import Futures from './Futures';
import { Gallery } from './Gallery';
import { LabaratoriyaXonalar } from './LabaratoriyaXonalar';
import { Sertifikat } from './Sertifikat';
import { GetResult } from './GetResult';
import { LogoBlock } from './LogoBlock';
import { Navbar } from './Navbar';
import { Servise } from './Servise';
import { Slider } from './Slider';
import { Toptar } from './Toptar';

export const Site = () => {
    return <div>
        <div>
            <Toptar />
             <Navbar />
            <Slider />
            <main id="main">
                <AboutUs />
                <Counts />
                {/* ======= Features Section ======= */}
                <Futures/>
                {/* End Features Section */}
                {/* ======= Services Section ======= */}
                <Servise/>
                {/* End Services Section */}
                 <GetResult />
                <LabaratoriyaXonalar/>

              {/* ======= Testimonials Section ======= 
                <section id="testimonials" className="testimonials">
                    <div className="container" data-aos="fade-up">
                        <div className="section-title">
                            <h2>Testimonials</h2>
                            <p>Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia fugiat sit in iste officiis commodi quidem hic quas.</p>
                        </div>
                        <div className="testimonials-slider swiper" data-aos="fade-up" data-aos-delay={100}>
                            <div className="swiper-wrapper">
                                <div className="swiper-slide">
                                    <div className="testimonial-item">
                                        <p>
                                            <i className="bx bxs-quote-alt-left quote-icon-left" />
                                            Proin iaculis purus consequat sem cure digni ssim donec porttitora entum suscipit rhoncus. Accusantium quam, ultricies eget id, aliquam eget nibh et. Maecen aliquam, risus at semper.
                                            <i className="bx bxs-quote-alt-right quote-icon-right" />
                                        </p>
                                        <img src="assets/img/testimonials/testimonials-1.jpg" className="testimonial-img" alt />
                                        <h3>Saul Goodman</h3>
                                        <h4>Ceo &amp; Founder</h4>
                                    </div>
                                </div>{/* End testimonial item *
                                <div className="swiper-slide">
                                    <div className="testimonial-item">
                                        <p>
                                            <i className="bx bxs-quote-alt-left quote-icon-left" />
                                            Export tempor illum tamen malis malis eram quae irure esse labore quem cillum quid cillum eram malis quorum velit fore eram velit sunt aliqua noster fugiat irure amet legam anim culpa.
                                            <i className="bx bxs-quote-alt-right quote-icon-right" />
                                        </p>
                                        <img src="assets/img/testimonials/testimonials-2.jpg" className="testimonial-img" alt />
                                        <h3>Sara Wilsson</h3>
                                        <h4>Designer</h4>
                                    </div>
                                </div>{/* End testimonial item *
                                <div className="swiper-slide">
                                    <div className="testimonial-item">
                                        <p>
                                            <i className="bx bxs-quote-alt-left quote-icon-left" />
                                            Enim nisi quem export duis labore cillum quae magna enim sint quorum nulla quem veniam duis minim tempor labore quem eram duis noster aute amet eram fore quis sint minim.
                                            <i className="bx bxs-quote-alt-right quote-icon-right" />
                                        </p>
                                        <img src="assets/img/testimonials/testimonials-3.jpg" className="testimonial-img" alt />
                                        <h3>Jena Karlis</h3>
                                        <h4>Store Owner</h4>
                                    </div>
                                </div>{/* End testimonial item *
                                <div className="swiper-slide">
                                    <div className="testimonial-item">
                                        <p>
                                            <i className="bx bxs-quote-alt-left quote-icon-left" />
                                            Fugiat enim eram quae cillum dolore dolor amet nulla culpa multos export minim fugiat minim velit minim dolor enim duis veniam ipsum anim magna sunt elit fore quem dolore labore illum veniam.
                                            <i className="bx bxs-quote-alt-right quote-icon-right" />
                                        </p>
                                        <img src="assets/img/testimonials/testimonials-4.jpg" className="testimonial-img" alt />
                                        <h3>Matt Brandon</h3>
                                        <h4>Freelancer</h4>
                                    </div>
                                </div>{/* End testimonial item *
                                <div className="swiper-slide">
                                    <div className="testimonial-item">
                                        <p>
                                            <i className="bx bxs-quote-alt-left quote-icon-left" />
                                            Quis quorum aliqua sint quem legam fore sunt eram irure aliqua veniam tempor noster veniam enim culpa labore duis sunt culpa nulla illum cillum fugiat legam esse veniam culpa fore nisi cillum quid.
                                            <i className="bx bxs-quote-alt-right quote-icon-right" />
                                        </p>
                                        <img src="assets/img/testimonials/testimonials-5.jpg" className="testimonial-img" alt />
                                        <h3>John Larson</h3>
                                        <h4>Entrepreneur</h4>
                                    </div>
                                </div>{/* End testimonial item 
                            </div>
                            <div className="swiper-pagination" />
                        </div>
                    </div>
                </section>{/* End Testimonials Section  */}

                    <Sertifikat/>

                    <Gallery/>

                {/* ======= Pricing Section ======= 
                <section id="pricing" className="pricing">
                    <div className="container" data-aos="fade-up">
                        <div className="section-title">
                            <h2>Pricing</h2>
                            <p>Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia fugiat sit in iste officiis commodi quidem hic quas.</p>
                        </div>
                        <div className="row">
                            <div className="col-lg-3 col-md-6">
                                <div className="box" data-aos="fade-up" data-aos-delay={100}>
                                    <h3>Free</h3>
                                    <h4><sup>$</sup>0<span> / month</span></h4>
                                    <ul>
                                        <li>Aida dere</li>
                                        <li>Nec feugiat nisl</li>
                                        <li>Nulla at volutpat dola</li>
                                        <li className="na">Pharetra massa</li>
                                        <li className="na">Massa ultricies mi</li>
                                    </ul>
                                    <div className="btn-wrap">
                                        <a href="#" className="btn-buy">Buy Now</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 mt-4 mt-md-0">
                                <div className="box featured" data-aos="fade-up" data-aos-delay={200}>
                                    <h3>Business</h3>
                                    <h4><sup>$</sup>19<span> / month</span></h4>
                                    <ul>
                                        <li>Aida dere</li>
                                        <li>Nec feugiat nisl</li>
                                        <li>Nulla at volutpat dola</li>
                                        <li>Pharetra massa</li>
                                        <li className="na">Massa ultricies mi</li>
                                    </ul>
                                    <div className="btn-wrap">
                                        <a href="#" className="btn-buy">Buy Now</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 mt-4 mt-lg-0">
                                <div className="box" data-aos="fade-up" data-aos-delay={300}>
                                    <h3>Developer</h3>
                                    <h4><sup>$</sup>29<span> / month</span></h4>
                                    <ul>
                                        <li>Aida dere</li>
                                        <li>Nec feugiat nisl</li>
                                        <li>Nulla at volutpat dola</li>
                                        <li>Pharetra massa</li>
                                        <li>Massa ultricies mi</li>
                                    </ul>
                                    <div className="btn-wrap">
                                        <a href="#" className="btn-buy">Buy Now</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 mt-4 mt-lg-0">
                                <div className="box" data-aos="fade-up" data-aos-delay={400}>
                                    <span className="advanced">Advanced</span>
                                    <h3>Ultimate</h3>
                                    <h4><sup>$</sup>49<span> / month</span></h4>
                                    <ul>
                                        <li>Aida dere</li>
                                        <li>Nec feugiat nisl</li>
                                        <li>Nulla at volutpat dola</li>
                                        <li>Pharetra massa</li>
                                        <li>Massa ultricies mi</li>
                                    </ul>
                                    <div className="btn-wrap">
                                        <a href="#" className="btn-buy">Buy Now</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section> */}
                {/* ======= Frequently Asked Questioins Section ======= **}
                <section id="faq" className="faq section-bg">
                    <div className="container" data-aos="fade-up">
                        <div className="section-title">
                            <h2>Frequently Asked Questioins</h2>
                            <p>Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia fugiat sit in iste officiis commodi quidem hic quas.</p>
                        </div>
                        <ul className="faq-list">
                            <li>
                                <div data-bs-toggle="collapse" className="collapsed question" href="#faq1">Non consectetur a erat nam at lectus urna duis? <i className="bi bi-chevron-down icon-show" /><i className="bi bi-chevron-up icon-close" /></div>
                                <div id="faq1" className="collapse" data-bs-parent=".faq-list">
                                    <p>
                                        Feugiat pretium nibh ipsum consequat. Tempus iaculis urna id volutpat lacus laoreet non curabitur gravida. Venenatis lectus magna fringilla urna porttitor rhoncus dolor purus non.
                                    </p>
                                </div>
                            </li>
                            <li>
                                <div data-bs-toggle="collapse" href="#faq2" className="collapsed question">Feugiat scelerisque varius morbi enim nunc faucibus a pellentesque? <i className="bi bi-chevron-down icon-show" /><i className="bi bi-chevron-up icon-close" /></div>
                                <div id="faq2" className="collapse" data-bs-parent=".faq-list">
                                    <p>
                                        Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi. Id interdum velit laoreet id donec ultrices. Fringilla phasellus faucibus scelerisque eleifend donec pretium. Est pellentesque elit ullamcorper dignissim. Mauris ultrices eros in cursus turpis massa tincidunt dui.
                                    </p>
                                </div>
                            </li>
                            <li>
                                <div data-bs-toggle="collapse" href="#faq3" className="collapsed question">Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi? <i className="bi bi-chevron-down icon-show" /><i className="bi bi-chevron-up icon-close" /></div>
                                <div id="faq3" className="collapse" data-bs-parent=".faq-list">
                                    <p>
                                        Eleifend mi in nulla posuere sollicitudin aliquam ultrices sagittis orci. Faucibus pulvinar elementum integer enim. Sem nulla pharetra diam sit amet nisl suscipit. Rutrum tellus pellentesque eu tincidunt. Lectus urna duis convallis convallis tellus. Urna molestie at elementum eu facilisis sed odio morbi quis
                                    </p>
                                </div>
                            </li>
                            <li>
                                <div data-bs-toggle="collapse" href="#faq4" className="collapsed question">Ac odio tempor orci dapibus. Aliquam eleifend mi in nulla? <i className="bi bi-chevron-down icon-show" /><i className="bi bi-chevron-up icon-close" /></div>
                                <div id="faq4" className="collapse" data-bs-parent=".faq-list">
                                    <p>
                                        Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi. Id interdum velit laoreet id donec ultrices. Fringilla phasellus faucibus scelerisque eleifend donec pretium. Est pellentesque elit ullamcorper dignissim. Mauris ultrices eros in cursus turpis massa tincidunt dui.
                                    </p>
                                </div>
                            </li>
                            <li>
                                <div data-bs-toggle="collapse" href="#faq5" className="collapsed question">Tempus quam pellentesque nec nam aliquam sem et tortor consequat? <i className="bi bi-chevron-down icon-show" /><i className="bi bi-chevron-up icon-close" /></div>
                                <div id="faq5" className="collapse" data-bs-parent=".faq-list">
                                    <p>
                                        Molestie a iaculis at erat pellentesque adipiscing commodo. Dignissim suspendisse in est ante in. Nunc vel risus commodo viverra maecenas accumsan. Sit amet nisl suscipit adipiscing bibendum est. Purus gravida quis blandit turpis cursus in
                                    </p>
                                </div>
                            </li>
                            <li>
                                <div data-bs-toggle="collapse" href="#faq6" className="collapsed question">Tortor vitae purus faucibus ornare. Varius vel pharetra vel turpis nunc eget lorem dolor? <i className="bi bi-chevron-down icon-show" /><i className="bi bi-chevron-up icon-close" /></div>
                                <div id="faq6" className="collapse" data-bs-parent=".faq-list">
                                    <p>
                                        Laoreet sit amet cursus sit amet dictum sit amet justo. Mauris vitae ultricies leo integer malesuada nunc vel. Tincidunt eget nullam non nisi est sit amet. Turpis nunc eget lorem dolor sed. Ut venenatis tellus in metus vulputate eu scelerisque. Pellentesque diam volutpat commodo sed egestas egestas fringilla phasellus faucibus. Nibh tellus molestie nunc non blandit massa enim nec.
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>{/* End Frequently Asked Questioins Section */}
                {/* ======= Contact Section ======= */}
                    <Contact/> 
                {/* End Contact Section */}
            </main>{/* End #main */}
                    <Footer/>
            {/* <div id="preloader" /> */}
            <a href="#" className="back-to-top d-flex align-items-center justify-content-center"><i className="bi bi-arrow-up-short" /></a>
        </div>

    </div>

};
