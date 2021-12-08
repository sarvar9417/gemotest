import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Modal from 'react-modal'
import { toast } from "react-toastify"
import { AuthContext } from '../../context/AuthContext'
import makeAnimated from "react-select/animated"
import { useHttp } from '../../hooks/http.hook'
import Select from "react-select"
import { CheckDoctorData } from './CheckDoctorData'

// const mongoose = require("mongoose")
const animatedComponents = makeAnimated()

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
}

export const AddDoctor = () => {
  const auth = useContext(AuthContext)
  const { request } = useHttp()
  const history = useHistory()
  // Modal oyna funksiyalari
  let allPrice = 0
  const [modalIsOpen, setIsOpen] = useState(false)

  function openModal() {
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
  }

  // Bo'limlar
  const [options, setOptions] = useState()
  const getOptions = useCallback(async () => {
    try {
      const data = await request("/api/direction/", "GET", null, {
        Authorization: `Bearer ${auth.token}`
      })
      setOptions(data)
    } catch (e) {
      notify(e)
    }
  }, [auth, request, setOptions])

  //Doctor ma'lumotlari
  const [doctor, setDoctor] = useState({
    firstname: "",
    lastname: "",
    fathername: "",
    born: "",
    phone: "",
    section: "",
    image: ""
  })

  const [loginPassword, setLoginPassword] = useState({
    login: "",
    password: "",
    doctorId: ""
  })

  const changeHandlar = (event) => {
    setDoctor({ ...doctor, [event.target.name]: event.target.value })
  }

  const changeLogin = (event) => {
    setLoginPassword({ ...loginPassword, [event.target.name]: event.target.value })
  }



  const changeDate = (event) => {
    setDoctor({ ...doctor, born: new Date(event.target.value) })
  }

  const changeSection = (event) => {
    console.log(event.value)
    setDoctor({ ...doctor, section: event.value })
  }

  const checkData = () => {
    if (CheckDoctorData(doctor)) {
      return notify(CheckDoctorData(doctor))
    }
    openModal()
  }

  const [load, setLoad] = useState(false)
  const uploadImage = async (e) => {
    const files = e.target.files[0]
    const data = new FormData()
    data.append('file', files)
    data.append('upload_preset', "myimage")
    setLoad(true)
    const res = await fetch("https://api.cloudinary.com/v1_1/academik/image/upload", { method: 'POST', body: data })
    const file = await res.json()
    setDoctor({ ...doctor, image: file.secure_url })
    setLoad(false)
  }

  const createHandler = async () => {
    try {
      const data = await request("/api/auth/doctor/doctorresume/register", "POST", { ...doctor }, {
        Authorization: `Bearer ${auth.token}`
      })
      console.log(data);
      createLogin(data._id)
    } catch (e) {
      notify(e)
    }
  }

  const createLogin = async (id) => {
    try {
      console.log(id);
      const data = await request("/api/auth/doctor/register", "POST", { 
        login: loginPassword.login,
        password: loginPassword.password,
        doctorId: id
      }, {
        Authorization: `Bearer ${auth.token}`
      })
      history.push("/director/doctors")
    } catch (e) {
      notify(e)
    }
  }

  const notify = (e) => {
    toast.error(e)
  }

  useEffect(() => {
    if (!options) {
      getOptions()
    }
  }, [])

  return (
    <div>
      <div className="">
        <div className="col-md-12">
          <article className="linkk mt-5" >
            <h1 style={{ fontWeight: "700" }}>MedCenter </h1>
            <div className="row mt-4" style={{ border: "25px solid hsla(212, 54%, 71%, 0.471)" }}>
              <div className="row pt-3">
                <div className="col-md-4 text-center" >
                  <input style={{ width: "157px" }} name="file" onChange={uploadImage} type="file" className="form-control" />
                  <img width="200px" src={doctor.image} alt={doctor.image} style={{ maxWidth: "200px", margin: "10px", borderRadius: "10px" }} />
                </div>
                <div className="col-md-8 text-center">
                  <p style={{ fontWeight: "500", fontSize: "18px", margin: "10px" }}>Login: <input onChange={changeLogin} name="login" className="addDoctor" /> <div className="clr"></div>  </p>
                  <p style={{ fontWeight: "500", fontSize: "18px", margin: "10px" }} >Parol: <input onChange={changeLogin} name="password" className="addDoctor" /> <div className="clr"></div></p>
                </div>
              </div>
              <div className="col-md-6 mt-3">
                <div className="row">
                  <p style={{ fontWeight: "700", color: "blue", fontSize: "22px", margin: "10px" }}>Asosiy ma'lumotlar</p>
                  <div className="col-4">
                    <p style={{ fontWeight: "700", fontSize: "18px", margin: "10px" }} className="pt-2">Familiyasi:</p>
                    <p style={{ fontWeight: "700", fontSize: "18px", margin: "10px" }} >Ismi:</p>
                    <p style={{ fontWeight: "700", fontSize: "18px", margin: "10px" }}>Otasining ismi:</p>
                  </div>
                  <div className="col-8">
                    <p style={{ fontWeight: "500", fontSize: "18px", margin: "10px" }}> <input onChange={changeHandlar} name="lastname" className="addDoctor" /> <div className="clr"></div>  </p>
                    <p style={{ fontWeight: "500", fontSize: "18px", margin: "10px" }} ><input onChange={changeHandlar} name="firstname" className="addDoctor" /> <div className="clr"></div></p>
                    <p style={{ fontWeight: "500", fontSize: "18px", margin: "10px" }}><input onChange={changeHandlar} name="fathername" className="addDoctor" /><div className="clr"></div></p>
                  </div>
                </div>
              </div>
              <div className="col-md-5 mt-3">
                <div className="row">
                  <p style={{ fontWeight: "700", color: "blue", fontSize: "20px", margin: "10px 0" }}>Qo'shimcha ma'lumotlar</p>
                  <div className="col-4">
                    <p style={{ fontWeight: "700", fontSize: "18px", margin: "10px 0" }}>Tug'ilgan sanasi:</p>
                    <p style={{ fontWeight: "700", fontSize: "18px", margin: "10px 0" }}>Telefon: </p>
                    <p style={{ fontWeight: "700", fontSize: "18px", margin: "10px 0" }}>Ixtisosligi: </p>
                  </div>
                  <div className="col-8">
                    <p style={{ fontWeight: "500", fontSize: "18px", margin: "10px 0" }}> <input onChange={changeDate} type="date" className="addDoctor" /><div className="clr"></div></p>
                    <p style={{ fontWeight: "500", fontSize: "18px", margin: "10px 0" }}><input onChange={changeHandlar} name="phone" type="number" className="addDoctor pt-3" /><div className="clr"></div></p>
                    <p style={{ fontWeight: "500", fontSize: "18px", margin: "10px 0" }}><Select
                      className="mt-3"
                      onChange={changeSection}
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      options={options && options}
                      name="section"
                    /></p>
                  </div>
                </div>
              </div>

            </div>
            <div className="text-end pt-4 px-4">
              <button onClick={checkData} className="btn btn-success"> Qo'shish </button>
            </div>
          </article>
        </div>
      </div>



      {/* Modal oynaning ochilishi */}
      <div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div className="">
            <div className="" >
              <div className="card">
                <div className="card-header" >
                  <img width="300px" className="card-image" src={doctor.image} />
                </div>
                <div className="card-body">
                  <h5>F.I.Sh: {doctor.lastname} {doctor.firstname} {doctor.fathername}</h5>
                  <p> Tu'gilgan yili: {new Date(doctor.born).toLocaleDateString()}</p>
                  <p>tel: +{doctor.phone}</p>
                  <h6>Ixtisosligi: {doctor.section}</h6>
                  <h4>Login: {loginPassword.login}</h4>
                  <h4>Ixtisosligi: {loginPassword.password}</h4>
                </div>

              </div>
            </div>
          </div>
          <div className="row m-1">
            <div className="col-12 text-center">
              <button onClick={createHandler} className="btn btn-success" style={{ marginRight: "30px" }}>Tasdiqlash</button>
              <button onClick={closeModal} className="btn btn-danger" >Qaytish</button>
            </div>
          </div>

        </Modal>
      </div>

    </div>
  )
}
