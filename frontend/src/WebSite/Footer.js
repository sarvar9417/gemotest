import React from 'react'

export const Footer = () => {
  return (
    <>
    <footer id="footer">
                <div className="footer-top">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-4 col-md-6">
                                <div className="footer-info">
                                    <h3>GEMO-TEST</h3>
                                    <p>
                                        A108 Adam Street <br />
                                        NY 535022, USA<br /><br />
                                      
                                    </p>

                                    
                                   
                                </div>
                            </div>

                            <div className=' col-lg-4 col-md-6'>
                                <div className="footer-info" >
                                <p>
                                    <strong>Telfon:</strong> +1 5589 55488 55<br />
                                    <strong>Email:</strong> info@example.com<br />
                                    </p>
                                    <div className="social-links mt-3">
                                        <a href="#" className="twitter"><i className="bx bxl-twitter" /></a>
                                        <a href="#" className="facebook"><i className="bx bxl-facebook" /></a>
                                        <a href="#" className="instagram"><i className="bx bxl-instagram" /></a>
                                        <a href="#" className="google-plus"><i className="bx bxl-skype" /></a>
                                        <a href="#" className="linkedin"><i className="bx bxl-linkedin" /></a>
                                    </div>
                                </div>
                            </div>
                      
                            <div className="col-lg-4 col-md-6 footer-newsletter">
                                <h4>Our Newsletter</h4>
                                <form action method="post">
                                    <input type="email" name="email" /><input type="submit" defaultValue="Subscribe" />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                  
                    <div className="credits">
        
                        Designed by <a href="https://bootstrapmade.com/"> "DSONEPROVIDER" MCHJ </a>
                    </div>
                </div>
            </footer>
    </>
  )
}
