import React from 'react';
// import './tableStyle.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTelegram } from '@fortawesome/free-brands-svg-icons'

export const Print = ({ sectionFiles, client, connector, sections, tablesections, logo, qr, tablecolumns }) => {
    let k = 0
    const checkClassHead = (data) => {
        if (data.col5.length > 1) {
            return "text-center fw-bold cw18 py-0"
        }
        if (data.col4.length > 1) {
            return "text-center fw-bold   cw22 py-0"
        }
        return "text-center fw-bold  cw30 py-0"
    }

    const checkClassFoot = (data) => {
        if (data.col5.length > 1) {
            return "text-center cw18 py-0"
        }
        if (data.col4.length > 1) {
            return "text-center  cw22 py-0"
        }
        return "text-center cw30 py-0"
    }
    return (
        <div >
            <table className="report-container w-100">
                <thead className="report-header">
                    <tr>
                        <th className="report-header-cell">
                            <div>
                                <div className="row" style={{ fontSize: "10pt" }}>
                                    <div className="col-4" style={{ border: "1px solid", textAlign: "center" }}>
                                        <p className='pt-2'>
                                            O'zbekiston Respublikasi Sog'liqni Saqlash Vazirligi
                                        </p>
                                    </div>
                                    <div className="col-4" style={{ border: "1px solid", textAlign: "center", borderLeft: "none" }}>
                                        <p className='pt-2'>
                                            IFUD: 86900
                                        </p>
                                    </div>
                                    <div className="col-4" style={{ border: "1px solid", textAlign: "center", borderLeft: "none" }}>
                                        <p style={{ margin: "0" }}>
                                            O'zbekiston Respublikasi SSV 31.12.2020y dagi №363 buyrug'i bilan tasdiqlangan
                                        </p>
                                    </div>
                                </div>
                                <div className="row" style={{ fontSize: "20pt" }}>
                                    <div className="col-6 pt-2" style={{ textAlign: "center" }}>
                                        <p className='pt-3' style={{ fontFamily: "-moz-initial" }}>
                                            "GEMO-TEST" <br />
                                            MARKAZIY LABORATORIYA
                                        </p>
                                    </div>
                                    <div className="col-6" style={{ textAlign: "center" }}>
                                        <p className='text-end m-0'>
                                            <img width="120" src={qr && qr} alt="QR" />
                                        </p>
                                    </div>
                                </div>
                                <div className="row" >
                                    <div className="col-12" style={{ padding: "0" }}>
                                        <table style={{ width: "100%", border: "2px solid", borderTop: "3px solid" }}>
                                            <tr style={{ textAlign: "center" }}>
                                                <td className='p-0' style={{ width: "33%", backgroundColor: "white", border: "1px solid #000" }}>
                                                    Mijozning F.I.SH
                                                </td>
                                                <td className='p-0' style={{ width: "33%", backgroundColor: "white", border: "1px solid #000" }}>
                                                    <h4>{client && client.lastname + " " + client.firstname}</h4>
                                                </td>
                                                <td rowSpan="2" colSpan={2} style={{ width: "33%" }}>
                                                    <p className='fw-bold fs-5 m-0'>
                                                        TAHLIL <br /> NATIJALARI
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr style={{ textAlign: "center" }}>
                                                <td className='p-0' style={{ width: "33%", backgroundColor: "white", border: "1px solid #000" }}>
                                                    Tug'ilgan yili
                                                </td>
                                                <td className='p-0' style={{ width: "33%", backgroundColor: "white", border: "1px solid #000", fontSize: "20px" }}>
                                                    {client && new Date(client.born).toLocaleDateString()}
                                                </td>
                                            </tr>
                                            <tr style={{ textAlign: "center" }}>
                                                <td className='p-0' style={{ width: "33%", backgroundColor: "white", border: "1px solid #000" }}>
                                                    Telefon raqami
                                                </td>
                                                <td className='p-0' style={{ width: "33%", backgroundColor: "white", border: "1px solid #000", fontSize: "20px" }}>
                                                    +{client && client.phone}
                                                </td>
                                                <td className='p-0 fw-bold' style={{ width: "100px", backgroundColor: "white", border: "1px solid #000" }}>
                                                    Probirka
                                                </td>
                                                <td className='p-0' style={{ width: "100px", backgroundColor: "white", border: "1px solid #000", fontSize: "20px" }}>
                                                    {connector && connector.probirka}
                                                </td>
                                            </tr>

                                            <tr style={{ textAlign: "center" }}>
                                                <td className='p-0' style={{ width: "33%", backgroundColor: "white", border: "1px solid #000" }}>
                                                    Sana
                                                </td>
                                                <td className='p-0' style={{ width: "33%", backgroundColor: "white", border: "1px solid #000", fontSize: "20px" }}>
                                                    {connector && new Date(connector.bronDay).toLocaleDateString()}
                                                </td>
                                                <td className='p-0 fw-bold' style={{ width: "200px", backgroundColor: "white", border: "1px solid #000" }}>
                                                    ID
                                                </td>
                                                <td className='p-0' style={{ width: "200px", backgroundColor: "white", border: "1px solid #000", fontSize: "20px" }}>
                                                    {client && client.id}
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                                <div className="row mt-3" style={{ backgroundColor: "#C0C0C0" }}>
                                    <div className="col-4">
                                        <p className='px-2 m-0'>
                                            "GEMO-TEST" х/к
                                        </p>
                                    </div>
                                    <div className="col-8">
                                        <p className='px-2 m-0 text-end pr-5'>
                                            Xizmatlar litsenziyalangan.   LITSENZIYA №21830906  03.09.2020. SSV RU
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody className="report-content">
                    <tr>
                        <td className="report-content-cell">
                            {
                                sections && sections.map((section, index) => {
                                    if (
                                        tablesections && tablesections[index].length > 0 && section.probirka
                                    ) {
                                        return (
                                            <>
                                                <table style={{ width: "100%" }}>
                                                    {
                                                        (sections[index - 1] && sections[index - 1].name !== section.name) || index === 0
                                                            || tablesections[index - 1].length === 0 || tablesections[index].length > 5 ?
                                                            <>
                                                                <span className='d-none'>{k = 0}</span>
                                                                <tr>
                                                                    <td className='text-center py-0 pt-2' colSpan={6} style={{ backgroundColor: "#FFF" }} >
                                                                        {tablesections[index].length > 5 ? section.subname : section.name}
                                                                    </td>
                                                                </tr>
                                                                <tr style={{ backgroundColor: "#C0C0C0" }}>
                                                                    <td className='text-center fw-bold cn py-1' style={{ border: "1px solid #000" }}>
                                                                        №
                                                                    </td>
                                                                    <td className={tablecolumns && tablecolumns[index] && checkClassHead(tablecolumns[index])} style={{ border: "1px solid #000" }}>
                                                                        {tablecolumns && tablecolumns[index] && tablecolumns[index].col1}
                                                                    </td>
                                                                    <td className={tablecolumns && tablecolumns[index] && checkClassHead(tablecolumns[index])} style={{ border: "1px solid #000" }}>
                                                                        {tablecolumns && tablecolumns[index] && tablecolumns[index].col2}
                                                                    </td>
                                                                    <td className={tablecolumns && tablecolumns[index] && checkClassHead(tablecolumns[index])} style={{ border: "1px solid #000" }}>
                                                                        {tablecolumns && tablecolumns[index] && tablecolumns[index].col3}
                                                                    </td>
                                                                    {
                                                                        tablecolumns && tablecolumns[index] && (tablecolumns[index].col4).length > 1 ?
                                                                            <td className={tablecolumns && tablecolumns[index] && checkClassHead(tablecolumns[index])} style={{ border: "1px solid #000" }}>
                                                                                {tablecolumns[index].col4}
                                                                            </td> : ""
                                                                    }
                                                                    {
                                                                        tablecolumns && tablecolumns[index] && (tablecolumns[index].col5).length > 1 ?
                                                                            <td className={tablecolumns && tablecolumns[index] && checkClassHead(tablecolumns[index])} style={{ border: "1px solid #000" }}>
                                                                                {tablecolumns[index].col5}
                                                                            </td> : ""
                                                                    }
                                                                </tr>
                                                            </>
                                                            : ""

                                                    }
                                                    {
                                                        tablesections && tablesections[index].map((tablesection, key) => {
                                                            return (
                                                                <tr style={{ backgroundColor: "white", marginTop: "10px !important" }}>
                                                                    <td className='cn py-0' style={{ textAlign: "center", border: "1px solid #000", borderTop: "0px solid white" }}>
                                                                        {++k}
                                                                    </td>
                                                                    <td
                                                                        className={tablecolumns && tablecolumns[index] && checkClassFoot(tablecolumns[index])}
                                                                        style={{ border: "1px solid #000", padding: "10px", borderTop: "0px solid white" }}
                                                                    >
                                                                        <p className='py-0 m-0 ps-2 text-start'>{tablesection.name}</p>
                                                                    </td>
                                                                    <td
                                                                        className={tablecolumns && tablecolumns[index] && checkClassFoot(tablecolumns[index])}
                                                                        style={{ textAlign: "center", border: "1px solid #000", borderTop: "0px solid white" }}
                                                                    >
                                                                        <pre className='pretable fw-bold fs-6' >{tablesection.result}</pre>
                                                                    </td>
                                                                    <td
                                                                        className={tablecolumns && tablecolumns[index] && checkClassFoot(tablecolumns[index])}
                                                                        style={{ textAlign: "center", border: "1px solid #000", borderTop: "0px solid white" }}
                                                                    >
                                                                        <pre className='pretable' >{tablesection.norma}</pre>
                                                                    </td>
                                                                    {
                                                                        tablecolumns && tablecolumns[index] && (tablecolumns[index].col4).length > 1 ?
                                                                            <td
                                                                                className={tablecolumns && tablecolumns[index] && checkClassFoot(tablecolumns[index])}
                                                                                style={{ textAlign: "center", border: "1px solid #000", borderTop: "0px solid white" }}
                                                                            >
                                                                                <pre className='pretable' >{tablesection.additionalone}</pre>
                                                                            </td> : ""
                                                                    }
                                                                    {
                                                                        tablecolumns && tablecolumns[index] && (tablecolumns[index].col5).length > 1 ?
                                                                            <td
                                                                                className={tablecolumns && tablecolumns[index] && checkClassFoot(tablecolumns[index])}
                                                                                style={{ textAlign: "center", border: "1px solid #000", borderTop: "0px solid white" }}
                                                                            >
                                                                                <pre className='pretable' >{tablesection.additionaltwo}</pre>
                                                                            </td> : ""
                                                                    }
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </table>
                                                {
                                                    !section.probirka ?
                                                        (<table className='mt-4 w-100'>
                                                            <tr>
                                                                <td colSpan={3} className="text-uppercase">
                                                                    {section.subname}
                                                                </td>
                                                            </tr>
                                                            <tr style={{ backgroundColor: "white" }}>
                                                                <th
                                                                    style={{ border: "1px solid #000", padding: "10px" }}
                                                                >
                                                                    Xulosa
                                                                </th>
                                                                <td
                                                                    style={{ border: "1px solid #000", padding: "10px" }}
                                                                    className='p-0'
                                                                >
                                                                    <pre style={{ border: "none" }} >{sections[index].summary}</pre>
                                                                </td>
                                                            </tr>
                                                            <tr style={{ backgroundColor: "white" }}>
                                                                <th style={{ border: "1px solid #000", padding: "10px" }}> Izoh </th>
                                                                <td style={{ border: "1px solid #000", padding: "10px" }} className='p-0'>
                                                                    <pre style={{ border: "none" }} >{sections[index].comment}</pre>
                                                                </td>
                                                            </tr>
                                                        </table>) : ""
                                                }
                                            </>
                                        )
                                    } else {
                                        if (!section.probirka) {
                                            return (
                                                <table className='mt-4 w-100'>
                                                    <tr>
                                                        <td colSpan={3} className="text-uppercase">
                                                            {section.subname}
                                                        </td>
                                                    </tr>
                                                    {
                                                        section.summary.length > 1 ?
                                                            <tr style={{ backgroundColor: "white" }}>
                                                                <th
                                                                    className='text-center'
                                                                    style={{ border: "1px solid #000", padding: "10px", width: "100px" }}
                                                                >
                                                                    Xulosa
                                                                </th>
                                                                <td
                                                                    style={{ border: "1px solid #000", padding: "10px" }}
                                                                    className='p-0 fw-normal text-start'
                                                                >
                                                                    <pre style={{ border: "none" }} >{section.summary}</pre>
                                                                </td>
                                                            </tr> : ""
                                                    }
                                                    {
                                                        section.comment.length > 1 ?
                                                            <tr style={{ backgroundColor: "white" }}>
                                                                <th style={{ border: "1px solid #000", padding: "10px", textAlign: "center", width: "100px" }}> Izoh </th>
                                                                <td style={{ border: "1px solid #000", padding: "10px" }} className='p-0'>
                                                                    <pre style={{ border: "none" }} >{sections[index].comment}</pre>
                                                                </td>
                                                            </tr>
                                                            : ""
                                                    }

                                                </table>
                                            )
                                        }
                                    }
                                })
                            }
                        </td>
                    </tr>
                </tbody>
                <tfoot className="report-footer">
                    <tr>
                        <td className="report-footer-cell">
                            <div className='row'>
                                <div className='col-4'>
                                    <div className="footer-info">
                                        <p className='text-start py-0 m-0'> Manzil: {logo && logo.address} </p>
                                        <p className='text-start  py-0 m-0'> Telefon: +{logo && logo.phone1}, +{logo && logo.phone2} </p>
                                        <p className='text-start  py-0 m-0'> <FontAwesomeIcon icon={faTelegram} /> http://t.me/gemotestuz </p>
                                        <p className='text-start  py-0 m-0'> Pochta indeksi: 210100 </p>
                                    </div>
                                </div>
                                <div className='col-4'>
                                    <p className='text-center' style={{ paddingTop: "35px" }}> Vrach: Iydiyev B.  __________ </p>
                                </div>
                                <div className='col-4'>
                                    <img width="200" src={logo && logo.logo} />
                                </div>
                                <div className='col-12'>
                                    <p className='text-center fs-5' > WWW.GEMO-TEST.UZ </p>
                                </div>
                            </div>

                        </td>
                    </tr>
                </tfoot>
            </table>
            {
                sections && sections.map((section, index) => {
                    if (sectionFiles && sectionFiles[index].length > 0) {
                        return (
                            <>
                                <div className='row mt-4'>
                                    <div className='col-12 text-center w-100 py-1'>
                                        {section.name + " " + section.subname}
                                    </div>
                                </div>

                                {
                                    sectionFiles && sectionFiles[index] && sectionFiles[index].map((file) => {
                                        return (
                                            <div className='row'>
                                                <div
                                                    className='col-12 w-100'
                                                >
                                                    <img
                                                        className='img m-auto'
                                                        src={file.imageurl}
                                                        alt="result"
                                                        width="100%"
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })

                                }

                            </>
                        )
                    }
                })
            }
        </div >
    )
};
