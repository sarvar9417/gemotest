import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify'
import { useHttp } from '../Director/hooks/http.hook';
toast.configure()

export const GetResult = () => {

    const { request } = useHttp()
    const [born, setBorn] = useState()
    const [id, setId] = useState()
    const history = useHistory()

    const getClient = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector/client/${id}/${born}`, 'GET', null)
            history.push(`/clienthistorys/${fetch._id}`)
        } catch (e) {
            toast.error(e.message)
        }
    }, [request, id, born, toast])

    return <div>
        <section id="appointment" className="appointment section-bg">
            <div className="container" data-aos="fade-up">
                <div className="section-title">
                    <h2>Tekshiruv natijalaringizni oling</h2>
                    <p> Tekshiruv natijalaridan online xabardor bo'lish va ularni yuklab olish uchun ostki qismda ko'rsatilgan joyda <b>ID</b> raqam <b>tug'ilgan sanangiz</b>  ma'lumotlarini kiriting </p>
                </div>
                <form action="forms/appointment.php" method="post" role="form" className="php-email-form" data-aos="fade-up" data-aos-delay={100}>
                    <div className="row">
                        <div className="col-md-6 form-group">
                            <b>ID raqamingizni kiriting:</b>
                            <input
                                onChange={(event) => setId(parseInt(event.target.value))}
                                type="text"
                                name="number"
                                className="form-control"
                                id="name"
                                placeholder="ID raqamingizni kiriting"
                                required
                            />
                        </div>
                        <div className="col-md-6 form-group mt-3 mt-md-0">
                            <b>Tug'ilgan yilingizni kiriting:</b>
                            <input
                                onChange={(event) => setBorn(event.target.value)}
                                type="date"
                                className="form-control"
                                name="email"
                                id="email"
                                placeholder="Tug'ilgan yilingizni kiriting"
                                required
                            />
                        </div>
                    </div>
                    <div className="text-center"><button onClick={getClient} type="submit">Tekshirish</button></div>
                </form>
            </div>
        </section>
    </div>;
};
