import React from 'react';

export const Counts = () => {
    return <div>
        <section id="counts" className="counts">
            <div className="container" data-aos="fade-up">
                <div className="row no-gutters">
                    <div className="col-lg-3 col-md-6 d-md-flex align-items-md-stretch">
                        <div className="count-box">
                            <i className="fas fa-user-md" />
                            <span data-purecounter-start={0} data-purecounter-end={10} data-purecounter-duration={1} className="purecounter text-danger" />
                            <p className='fs-5'><strong>Shifokorlar xizmati</strong> </p>
                            {/* <a href="#">Find out more »</a> */}
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 d-md-flex align-items-md-stretch">
                        <div className="count-box">
                            <i className="far fa-hospital" />
                            <span data-purecounter-start={0} data-purecounter-end={3} data-purecounter-duration={1} className="purecounter text-danger" />
                            <p className='fs-5'><strong>Filial</strong> </p>
                            {/* <a href="#">Find out more »</a> */}
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 d-md-flex align-items-md-stretch">
                        <div className="count-box">
                            <i className="fas fa-flask" />
                            <span data-purecounter-start={0} data-purecounter-end={215} data-purecounter-duration={1} className="purecounter text-danger" />
                            <p className='fs-5'><strong>Labaratoriya tekshiruvlari</strong> </p>
                            {/* <a href="#">Find out more »</a> */}
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 d-md-flex align-items-md-stretch">
                        <div className="count-box">
                            <i className="fas fa-award" />
                            <span data-purecounter-start={0} data-purecounter-end={100000} data-purecounter-duration={1} className="purecounter text-danger" />
                            <p className='fs-5'><strong>Mijozlar minnatdorchiligi</strong></p>
                            {/* <a href="#">Find out more »</a> */}
                        </div>
                    </div>
                </div>
            </div>
        </section>{/* End Counts Section */}
    </div>;
};
