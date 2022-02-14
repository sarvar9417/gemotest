import React from 'react'

export const LabaratoriyaXonalar = () => {
  return (
    (<>
         <section id="departments" className="departments">
                    <div className="container" data-aos="fade-up">
                        <div className="section-title">
                            <h2> Bizning laboratoriya xonalarimiz </h2>
                        </div>
                        <div className="row" data-aos="fade-up" data-aos-delay={100}>
                            <div className="col-lg-4 mb-5 mb-lg-0">
                                <ul className="nav nav-tabs flex-column">
                                    <li className="nav-item">
                                        <a className="nav-link active show" data-bs-toggle="tab" data-bs-target="#tab-1">
                                            <h4> Bakteriologik tekshiruvlar xonasi </h4>
                                        </a>
                                    </li>
                                    <li className="nav-item mt-2">
                                        <a className="nav-link" data-bs-toggle="tab" data-bs-target="#tab-2">
                                            <h4> Maxsus laboratoriya xonasi klinik diog</h4>
                                        </a>
                                    </li>
                                    <li className="nav-item mt-2">
                                        <a className="nav-link" data-bs-toggle="tab" data-bs-target="#tab-3">
                                            <h4> IFA taxlilxonasi</h4>
                                        </a>
                                    </li>
                                    <li className="nav-item mt-2">
                                        <a className="nav-link" data-bs-toggle="tab" data-bs-target="#tab-4">
                                            <h4> UTT diagnostika xonasi</h4>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-lg-8">
                                <div className="tab-content">
                                    <div className="tab-pane active show" id="tab-1">
                                        <h3> Bakteriologik tekshiruvlar xonasi </h3>
                                        <img src="assets/img/xona1.1.jpg" alt className="img-fluid" />
                                        <img src="assets/img/xona1.2.jpg" alt className="img-fluid" />
                                    </div>
                                    <div className="tab-pane" id="tab-2">
                                        <h3>  Maxsus laboratoriya xonasi klinik diog </h3>
                                        <img src="assets/img/xona2.1.jpg" alt className="img-fluid" />
                                        <img src="assets/img/xona2.2.jpg" alt className="img-fluid" />
                                    </div>
                                    <div className="tab-pane" id="tab-3">
                                        <h3> IFA taxlilxonasi </h3>
                                        <img src="assets/img/xona3.1.jpg" alt className="img-fluid" />
                                        <img src="assets/img/xona3.2.jpg" alt className="img-fluid" />
                                    </div>
                                    <div className="tab-pane" id="tab-4">
                                        <h3> UTT diagnostika xonasi </h3>
                                        <img src="assets/img/xona4.1.jpg" alt className="img-fluid" />
                                        <img src="assets/img/xona4.2.jpg" alt className="img-fluid" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
    </>)
  )
}
