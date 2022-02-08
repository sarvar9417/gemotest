import React from 'react';
import './tableStyle.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTelegram } from '@fortawesome/free-brands-svg-icons'

export const Print = ({ client, connector, sections, tablesections, logo, qr, tablecolumns }) => {
    const checkClassHead = (data) => {
        if (data.col5.length > 1) {
            return "text-center fw-bold cw18"
        }
        if (data.col4.length > 1) {
            return "text-center fw-bold   cw22"
        }
        return "text-center fw-bold  cw30"
    }

    const checkClassFoot = (data) => {
        if (data.col5.length > 1) {
            return "text-center cw18"
        }
        if (data.col4.length > 1) {
            return "text-center  cw22"
        }
        return "text-center cw30"
    }
    return (
        <div >
            <table className="report-container w-100">
                <thead className="report-header mt-5">
                    <tr>
                        <th className="report-header-cell">
                            <div style={{ borderTop: "30px" }}>
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
                                        <p className='pt-4' style={{ fontFamily: "-moz-initial" }}>
                                            "GEMO-TEST" <br />
                                            MARKAZIY LABARATORIYA
                                        </p>
                                    </div>
                                    <div className="col-6" style={{ textAlign: "center" }}>
                                        <p className='text-end m-0'>
                                            <img width="140" src={qr && qr} alt="QR" />
                                        </p>
                                    </div>
                                </div>
                                <div className="row" >
                                    <div className="col-12" style={{ padding: "0" }}>
                                        <table style={{ width: "100%", border: "2px solid", borderTop: "3px solid" }}>
                                            <tr style={{ textAlign: "center" }}>
                                                <td className='p-0 py-1' style={{ width: "33%", backgroundColor: "white", border: "1px solid #000" }}>
                                                    Mijozning F.I.SH
                                                </td>
                                                <td className='p-0 py-1' style={{ width: "33%", backgroundColor: "white", border: "1px solid #000" }}>
                                                    <h4>{client && client.lastname + " " + client.firstname}</h4>
                                                </td>
                                                <td rowSpan="2" colSpan={2} style={{ width: "33%" }}>
                                                    <p className='fw-bold fs-4'>
                                                        TAHLIL <br /> NATIJALARI
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr style={{ textAlign: "center" }}>
                                                <td className='p-0 py-2' style={{ width: "33%", backgroundColor: "white", border: "1px solid #000" }}>
                                                    Tug'ilgan yili
                                                </td>
                                                <td className='p-0 py-2' style={{ width: "33%", backgroundColor: "white", border: "1px solid #000", fontSize: "20px" }}>
                                                    {client && new Date(client.born).toLocaleDateString()}
                                                </td>
                                            </tr>
                                            <tr style={{ textAlign: "center" }}>
                                                <td className='p-0 py-2' style={{ width: "33%", backgroundColor: "white", border: "1px solid #000" }}>
                                                    Telefon
                                                </td>
                                                <td className='p-0 py-2' style={{ width: "33%", backgroundColor: "white", border: "1px solid #000", fontSize: "20px" }}>
                                                    +{connector && connector.phone}
                                                </td>
                                                <td className='p-0 py-2 fw-bold' style={{ width: "100px", backgroundColor: "white", border: "1px solid #000" }}>
                                                    Probirka
                                                </td>
                                                <td className='p-0 py-2' style={{ width: "100px", backgroundColor: "white", border: "1px solid #000", fontSize: "20px" }}>
                                                    {connector && connector.probirka}
                                                </td>
                                            </tr>

                                            <tr style={{ textAlign: "center" }}>
                                                <td className='p-0 py-2' style={{ width: "33%", backgroundColor: "white", border: "1px solid #000" }}>
                                                    Sana
                                                </td>
                                                <td className='p-0 py-2' style={{ width: "33%", backgroundColor: "white", border: "1px solid #000", fontSize: "20px" }}>
                                                    {connector && new Date(connector.bronDay).toLocaleDateString()}
                                                </td>
                                                <td className='p-0 py-2 fw-bold' style={{ width: "200px", backgroundColor: "white", border: "1px solid #000" }}>
                                                    ID
                                                </td>
                                                <td className='p-0 py-2' style={{ width: "200px", backgroundColor: "white", border: "1px solid #000", fontSize: "20px" }}>
                                                    {client && client.id}
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                                <div className="row mt-3" style={{ backgroundColor: "#C0C0C0" }}>
                                    <div className="col-4">
                                        <p className='p-2 m-0'>
                                            "GEMO-TEST" х/к
                                        </p>
                                    </div>
                                    <div className="col-8">
                                        <p className='p-2 m-0 text-end pr-5'>
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
                                        tablesections && tablesections[index].length > 0
                                    ) {
                                        return (
                                            <div className='p-0 box'>
                                                <table style={{ width: "100%" }} className='m-0'>
                                                    <tr>
                                                        <td colSpan={4} style={{ backgroundColor: "#FFF" }} >
                                                            {section.name + " " + section.subname}
                                                        </td>

                                                    </tr>
                                                    <tr style={{ backgroundColor: "#C0C0C0" }}>
                                                        <td className='text-center fw-bold cn' style={{ border: "1px solid #000" }}>
                                                            №
                                                        </td>
                                                        <td className={tablecolumns && tablecolumns[index] && checkClassHead(tablecolumns[index])} style={{ border: "1px solid #000", maxWidth: "33%", minWidth: "19%" }}>
                                                            {tablecolumns && tablecolumns[index] && tablecolumns[index].col1}
                                                        </td>
                                                        <td className={tablecolumns && tablecolumns[index] && checkClassHead(tablecolumns[index])} style={{ border: "1px solid #000", maxWidth: "33%", minWidth: "19%" }}>
                                                            {tablecolumns && tablecolumns[index] && tablecolumns[index].col2}
                                                        </td>
                                                        <td className={tablecolumns && tablecolumns[index] && checkClassHead(tablecolumns[index])} style={{ border: "1px solid #000", maxWidth: "33%", minWidth: "19%" }}>
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
                                                    {
                                                        tablesections && tablesections[index].map((tablesection, key) => {
                                                            return (
                                                                <tr style={{ backgroundColor: "white" }}>
                                                                    <td className='cn' style={{ textAlign: "center", border: "1px solid #000" }}>
                                                                        {key + 1}
                                                                    </td>
                                                                    <td className={tablecolumns && tablecolumns[index] && checkClassFoot(tablecolumns[index])} style={{ border: "1px solid #000", padding: "10px", minWidth: "20%", maxWidth: "33%" }}>
                                                                        {tablesection.name}
                                                                    </td>
                                                                    <td className={tablecolumns && tablecolumns[index] && checkClassFoot(tablecolumns[index])} style={{ textAlign: "center", border: "1px solid #000", minWidth: "20%", maxWidth: "33%" }}>
                                                                        {tablesection.result}
                                                                    </td>
                                                                    <td className={tablecolumns && tablecolumns[index] && checkClassFoot(tablecolumns[index])} style={{ textAlign: "center", border: "1px solid #000", minWidth: "20%", maxWidth: "33%" }}>
                                                                        {tablesection.norma}
                                                                    </td>
                                                                    {
                                                                        tablecolumns && tablecolumns[index] && (tablecolumns[index].col4).length > 1 ?
                                                                            <td className={tablecolumns && tablecolumns[index] && checkClassFoot(tablecolumns[index])} style={{ textAlign: "center", border: "1px solid #000" }}>
                                                                                {tablesection.additionalone}
                                                                            </td> : ""
                                                                    }
                                                                    {
                                                                        tablecolumns && tablecolumns[index] && (tablecolumns[index].col5).length > 1 ?
                                                                            <td className={tablecolumns && tablecolumns[index] && checkClassFoot(tablecolumns[index])} style={{ textAlign: "center", border: "1px solid #000" }}>
                                                                                {tablesection.additionaltwo}
                                                                            </td> : ""
                                                                    }
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </table>
                                                <br />
                                                {
                                                    !section.probirka ?
                                                        (<table style={{ width: "100%" }}>
                                                            <tr style={{ backgroundColor: "white" }}>
                                                                <th style={{ border: "1px solid #000", padding: "10px", width: "100px" }} > Xulosa </th>
                                                                <td style={{ border: "1px solid #000", padding: "10px" }} colSpan="5" className='px-2'>
                                                                    {section.summary}
                                                                </td>
                                                            </tr>
                                                            <tr style={{ backgroundColor: "white" }}>
                                                                <th style={{ border: "1px solid #000", padding: "10px", width: "200px" }}> Izoh </th>
                                                                <td style={{ border: "1px solid #000", padding: "10px" }} className='px-2'>
                                                                    {section.comment}
                                                                </td>
                                                            </tr></table>) : ""
                                                }
                                            </div>
                                        )
                                    } else {
                                        if (!section.probirka) {
                                            return (
                                                <table>
                                                    <tr style={{ backgroundColor: "white" }}>
                                                        <td colSpan={6} style={{ backgroundColor: "#FFF" }} >
                                                            {section.name + " " + section.subname}
                                                        </td>
                                                    </tr>
                                                    <tr style={{ backgroundColor: "white" }}>
                                                        <th style={{ border: "1px solid #000", padding: "10px", width: "100px" }} > Xulosa </th>
                                                        <td style={{ border: "1px solid #000", padding: "10px" }} className='p-2'>
                                                            {section.summary}
                                                        </td>
                                                    </tr>
                                                    <tr style={{ backgroundColor: "white" }}>
                                                        <th style={{ border: "1px solid #000", padding: "10px", width: "100px" }}> Izoh </th>
                                                        <td style={{ border: "1px solid #000", padding: "10px" }} className='p-2'>
                                                            {section.comment}
                                                        </td>
                                                    </tr>
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
                                        <p className='text-start'> Manzil: {logo && logo.address} </p>
                                        <p className='text-start'> Telefon: +{logo && logo.phone1}, +{logo && logo.phone2}, +{logo && logo.phone3} </p>
                                        {/* <p className='text-start'> <FontAwesomeIcon icon={faTelegram} /> http://t.me/gemotest.uz </p> */}
                                        <p className='text-start'> Pochta indeksi: 210100 </p>
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
        </div>
    )
};
