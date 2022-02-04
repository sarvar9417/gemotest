import React from 'react';

export const Print = ({ client, connector, sections, tablesections, logo, qr, tablecolumns }) => {

    return (
        <div>
            <div className="row" style={{ fontSize: "10pt" }}>
                <div className="col-6" style={{ border: "1px solid", textAlign: "center" }}>
                    <p>
                        Министерство Здравоохранения Республики Узбекистан
                    </p>
                </div>
                <div className="col-2" style={{ border: "1px solid", textAlign: "center", borderLeft: "none" }}>
                    <p>
                        ОКОНХ  91514
                    </p>
                </div>
                <div className="col-4" style={{ border: "1px solid", textAlign: "center", borderLeft: "none" }}>
                    <p style={{ margin: "0" }}>
                        Форма №     согласно приказу
                    </p>
                    <p style={{ margin: "0" }}>
                        МинЗдрав.РУз №363 от 31.12.2020.
                    </p>
                </div>
            </div>
            <div className="row" style={{ fontSize: "20pt" }}>
                <div className="col-6" style={{ textAlign: "center" }}>
                    <p className='pt-4'>
                        "ГЕМО-ТЕСТ"
                        <br /> ЛАБОРАТОРИЯ
                    </p>
                </div>
                <div className="col-2">

                </div>
                <div className="col-4" style={{ textAlign: "center" }}>
                    <p className='text-end m-0'>
                        <img width="140" src={qr && qr} alt="QR" />
                    </p>
                </div>
            </div>
            <div className="row" >
                <div className="col-12" style={{ padding: "0" }}>
                    <table style={{ width: "100%", border: "2px solid", borderTop: "3px solid" }}>
                        <tr style={{ textAlign: "center" }}>
                            <td className='p-0 py-1' style={{ width: "33%", backgroundColor: "#808080", color: "#fff", border: "1px solid #000" }}>
                                Ф.И.О. больного
                            </td>
                            <td className='p-0 py-1' style={{ width: "33%", border: "1px solid #000" }}>
                                <h4>{client && client.lastname + " " + client.firstname}</h4>
                            </td>
                            <td rowSpan="3" style={{ width: "33%" }}>
                                <p>
                                    <img width="200" src={logo && logo.logo} alt='Logo' />
                                </p>
                            </td>
                        </tr>
                        <tr style={{ textAlign: "center" }}>
                            <td className='p-0 py-2' style={{ width: "33%", backgroundColor: "#808080", color: "#fff", border: "1px solid #000" }}>
                                Год рождения
                            </td>
                            <td className='p-0 py-2' style={{ width: "33%", border: "1px solid #000", fontSize: "20px" }}>
                                {client && new Date(client.born).toLocaleDateString()}
                            </td>
                        </tr>
                        <tr style={{ textAlign: "center" }}>
                            <td className='p-0 py-2' style={{ width: "33%", backgroundColor: "#808080", color: "#fff", border: "1px solid #000" }}>
                                Дата
                            </td>
                            <td className='p-0 py-2' style={{ width: "33%", border: "1px solid #000", fontSize: "20px" }}>
                                {connector && new Date(connector.bronDay).toLocaleDateString()}
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <div className="row mt-3" style={{ backgroundColor: "#C0C0C0" }}>
                <div className="col-1">

                </div>
                <div className="col-4">
                    <p className='p-2 m-0'>
                        "GEMO-TEST" х/к
                    </p >
                </div>
                <div className="col-7">
                    <p className='p-2 m-0'>
                        Услуги лицензированны   ЛИЦЕНЗИЯ №01419  от 28.02.2019г. МинЗдрав Ру
                    </p>
                </div>
            </div>
            <div className="row p-0">
                {
                    sections && sections.map((section, index) => {
                        if (
                            tablesections && tablesections[index].length > 0
                        ) {
                            return (
                                <div className='p-0'>
                                    <table style={{ width: "100%" }} className='m-0'>
                                        <tr>
                                            <td colSpan={4} style={{ backgroundColor: "#FFF" }} >
                                                {section.name + " " + section.subname}
                                            </td>

                                        </tr>
                                        <tr style={{ backgroundColor: "#C0C0C0" }}>
                                            <td className='text-center fw-bold' style={{ border: "1px solid #000" }}>
                                                №
                                            </td>
                                            <td className='text-center fw-bold' style={{ border: "1px solid #000", maxWidth: "33%", minWidth: "19%" }}>
                                                {tablecolumns && tablecolumns[index] && tablecolumns[index].col1}
                                            </td>
                                            <td className='text-center fw-bold' style={{ border: "1px solid #000", maxWidth: "33%", minWidth: "19%" }}>
                                                {tablecolumns && tablecolumns[index] && tablecolumns[index].col2}
                                            </td>
                                            <td className='text-center fw-bold' style={{ border: "1px solid #000", maxWidth: "33%", minWidth: "19%" }}>
                                                {tablecolumns && tablecolumns[index] && tablecolumns[index].col3}
                                            </td>
                                            {
                                                tablecolumns && tablecolumns[index] && (tablecolumns[index].col4).length > 1 ?
                                                    <td className='text-center fw-bold' style={{ border: "1px solid #000" }}>
                                                        {tablecolumns[index].col4}
                                                    </td> : ""
                                            }
                                            {
                                                tablecolumns && tablecolumns[index] && (tablecolumns[index].col5).length > 1 ?
                                                    <td className='text-center fw-bold' style={{ border: "1px solid #000" }}>
                                                        {tablecolumns[index].col5}
                                                    </td> : ""
                                            }
                                        </tr>
                                        {
                                            tablesections && tablesections[index].map((tablesection, key) => {
                                                return (
                                                    <tr style={{ backgroundColor: "white" }}>
                                                        <td style={{ textAlign: "center", border: "1px solid #000" }}>
                                                            {key + 1}
                                                        </td>
                                                        <td className='px-3' style={{ border: "1px solid #000", padding: "10px", minWidth: "20%", maxWidth: "33%" }}>
                                                            {tablesection.name}
                                                        </td>
                                                        <td className='p-0' style={{ textAlign: "center", border: "1px solid #000", minWidth: "20%", maxWidth: "33%" }}>
                                                            {tablesection.result}
                                                        </td>
                                                        <td className='p-0' style={{ textAlign: "center", border: "1px solid #000", minWidth: "20%", maxWidth: "33%" }}>
                                                            {tablesection.norma}
                                                        </td>
                                                        {
                                                            tablecolumns && tablecolumns[index] && (tablecolumns[index].col4).length > 1 ?
                                                                <td className='p-0' style={{ textAlign: "center", border: "1px solid #000" }}>
                                                                    {tablesection.additionalone}
                                                                </td> : ""
                                                        }
                                                        {
                                                            tablecolumns && tablecolumns[index] && (tablecolumns[index].col5).length > 1 ?
                                                                <td className='p-0' style={{ textAlign: "center", border: "1px solid #000" }}>
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
            </div>
        </div>
    )
};
