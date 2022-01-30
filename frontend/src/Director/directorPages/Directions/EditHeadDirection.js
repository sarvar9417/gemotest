import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import { toast } from "react-toastify"
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { Loader } from '../../components/Loader'
import '../tableStyle.css'
toast.configure()
export const EditHeadDirection = () => {
  const auth = useContext(AuthContext)
  const id = useParams().id
  const { request, error, loading, clearError } = useHttp()
  const history = useHistory()
  // Modal oyna funksiyalari
  const [modal, setModal] = useState(false)

  //Direction ma'lumotlari
  const [headdirection, setHeadDirection] = useState()

  const getHeadDirection = useCallback(async () => {
    try {
      const fetch = await request(`/api/headsection/${id}`, 'GET', null, {
        Authorization: `Bearer ${auth.token}`
      })
      setHeadDirection({
        name: fetch.name,
        probirka: fetch.probirka
      })

    } catch (error) {
      notify(error)
    }
  }, [auth, request, setHeadDirection])

  const createHandler = async () => {
    try {
      const data = await request(`/api/headsection/${id}`, "PATCH", { ...headdirection }, {
        Authorization: `Bearer ${auth.token}`
      })
      history.push('/director/headdirections')
    } catch (e) {
      notify(e)
    }
  }

  const notify = (e) => {
    toast.error(e)
  }

  useEffect(() => {
    if (error) {
      notify(error)
      clearError()
    }
    if (!headdirection) {
      getHeadDirection()
    }
  }, [notify, clearError, getHeadDirection])

  if (loading) {
    return <Loader />
  }

  return (
    <div>
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className=" table table-hover table-center mb-0">
                  <thead>
                    <tr>
                      <th className="text-center">Xizmat nomi</th>
                      <th className="text-center">Probirka</th>
                      <th className="text-center">Saqlash</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center">
                        <input style={{ border: "none", borderBottom: "1px solid #bbb", outline: "none" }} defaultValue={headdirection && headdirection.name} onChange={(event) => setHeadDirection({ ...headdirection, name: event.target.value })} name="name" />
                      </td>
                      <td className="text-center">
                        <input defaultChecked={headdirection && headdirection.probirka} style={{ width: "20px", height: "20px" }} type='checkbox' onChange={(event) => setHeadDirection({ ...headdirection, probirka: event.target.checked })} name="probirka" />
                      </td>
                      <td className='text-center'>
                        <button onClick={() => setModal(true)} className='btn button-success'>Saqlash</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Modal oynaning ochilishi */}
      <div className={modal ? "modal" : "d-none"}>
        <div className="modal-card">

          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="datatable table table-hover table-center mb-0">
                  <thead>
                    <tr>
                      <th className="text-center">Xizmat nomi</th></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center" style={{ width: "100px" }}>
                        <span className="table-avatar">
                          <span href="profile.html"> {headdirection && headdirection.name} </span>
                        </span>
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>
            <div className="card-footer">
              <div className=" text-center">
                <button onClick={createHandler} className="btn button-success" style={{ marginRight: "30px" }}>Tasdiqlash</button>
                <button onClick={() => setModal(false)} className="btn button-danger" >Qaytish</button>
              </div>
            </div>
          </div>



        </div>
      </div>

    </div >
  )
}
