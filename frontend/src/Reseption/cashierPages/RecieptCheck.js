import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useParams, useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { Loader } from "../components/Loader";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";
import { toast } from "react-toastify";
import QRCode from "qrcode";

toast.configure();
export const RecieptCheck = () => {
  //Avtorizatsiyani olish
  const auth = useContext(AuthContext);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const clientId = useParams().id;
  const connectorId = useParams().connector;
  const today =
    new Date().getDate().toString() +
    "." +
    (new Date().getMonth() + 1).toString() +
    "." +
    new Date().getFullYear().toString() +
    " " +
    new Date().getHours().toString() +
    ":" +
    new Date().getMinutes().toString() +
    ":" +
    new Date().getSeconds().toString();

  let unpaid = 0;
  let paid = 0;
  let price = 0;
  let k = 0;
  let l = 0;
  const [client, setClient] = useState();
  const { loading, request, error, clearError } = useHttp();
  const [sections, setSections] = useState();

  const getClient = useCallback(async () => {
    try {
      const data = await request(
        `/api/clients/reseption/${clientId}`,
        "GET",
        null,
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      setClient(data);
    } catch (e) {}
  }, [request, clientId, auth]);

  const notify = (e) => {
    toast.error(e);
  };

  const [baseUrl, setBasuUrl] = useState();
  const getBaseUrl = useCallback(async () => {
    try {
      const fetch = await request(`/api/clienthistorys/url`, "GET", null);
      setBasuUrl(fetch);
      // window.location.reload()
    } catch (e) {
      notify(e);
    }
  }, [request, setBasuUrl]);

  const [logo, setLogo] = useState();
  const getLogo = useCallback(async () => {
    try {
      const data = await request("/api/companylogo/", "GET", null);
      setLogo(data[0]);
    } catch (e) {
      notify(e);
    }
  }, [request, setLogo]);

  // =================================================================================
  // =================================================================================
  // Servislar bo'limi
  const [services, setServices] = useState();
  const getServices = useCallback(async () => {
    try {
      const data = await request(
        `/api/service/reseption/${connectorId}`,
        "GET",
        null,
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      setServices(data);
    } catch (e) {}
  }, [request, connectorId, auth, setServices]);
  // =================================================================================
  // =================================================================================

  const getSections = useCallback(async () => {
    try {
      const data = await request(
        `/api/section/reseptionid/${clientId}/${connectorId}`,
        "GET",
        null,
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      setSections(data);
    } catch (e) {}
  }, [request, clientId, auth]);
  const [oldPayments, setOldPayments] = useState();

  const getOldPayments = useCallback(async () => {
    try {
      const fetch = await request(
        `/api/payment/cashier/${connectorId}`,
        "GET",
        null,
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      let sum = fetch.reduce((summ, payment) => {
        return summ + payment.cash + payment.card + payment.transfer;
      }, 0);
      setOldPayments(sum);
    } catch (e) {
      notify(e);
    }
  }, [request, connectorId, auth, setOldPayments]);
  const [sale, setSale] = useState();
  const getSale = useCallback(async () => {
    try {
      const fetch = await request(`/api/sale/${connectorId}`, "GET", null, {
        Authorization: `Bearer ${auth.token}`,
      });
      setSale(fetch[0]);
    } catch (e) {
      notify(e);
    }
  }, [request, auth, setSale, connectorId]);
  const [qr, setQr] = useState();

  const [t, setT] = useState();
  const [connector, setConnector] = useState();

  const getConnector = useCallback(async () => {
    try {
      const data = await request(
        `/api/connector/${connectorId && connectorId}`,
        "GET",
        null,
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      setConnector(data);
    } catch (e) {
      notify(e);
    }
  }, [request, setConnector, connectorId, auth]);
  useEffect(() => {
    if (client) {
      QRCode.toDataURL(`${baseUrl}/clienthistorys/${client._id}`).then(
        (data) => {
          setQr(data);
        }
      );
    }
    if (error) {
      notify(error);
      clearError();
    }
    if (!t) {
      setT(1);
      getSections();
      getServices();
      getClient();
      getOldPayments();
      getSale();
      getLogo();
      getBaseUrl();
      getConnector();
    }
  }, [
    QRCode,
    t,
    client,
    error,
    clearError,
    getSale,
    setT,
    getLogo,
    getSections,
    getServices,
    getBaseUrl,
    getClient,
    getOldPayments,
    getConnector,
  ]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <div ref={componentRef}>
        <div className="container px-5">
          <div className="row">
            <table className="table ">
              <tbody>
                <tr>
                  <td>
                    <ul className="list-unstyled  text-start ms-3 mb-0">
                      <li
                        className=""
                        style={{ fontSize: "10pt", fontFamily: "times" }}
                      >
                        <strong
                          style={{ fontSize: "10pt", fontFamily: "times" }}
                        >
                          {" "}
                          {logo && logo.companyname}
                        </strong>
                      </li>
                      <li style={{ fontSize: "10pt", fontFamily: "times" }}>
                        <strong
                          style={{ fontSize: "10pt", fontFamily: "times" }}
                        >
                          Manzil:{" "}
                        </strong>{" "}
                        {logo && logo.address}
                      </li>
                      <li style={{ fontSize: "10pt", fontFamily: "times" }}>
                        <strong
                          style={{ fontSize: "10pt", fontFamily: "times" }}
                        >
                          Bank:{" "}
                        </strong>{" "}
                        {logo && logo.bank}
                      </li>
                      <li style={{ fontSize: "10pt", fontFamily: "times" }}>
                        {" "}
                        <strong
                          style={{ fontSize: "10pt", fontFamily: "times" }}
                        >
                          MFO:{" "}
                        </strong>{" "}
                        {logo && logo.mfo}
                      </li>
                      <li style={{ textAlign: "", fontSize: "10pt" }}>
                        <strong
                          style={{ fontSize: "10pt", fontFamily: "times" }}
                        >
                          INN:
                        </strong>{" "}
                        {logo && logo.inn}
                      </li>
                      <li style={{ textAlign: "", fontSize: "10pt" }}>
                        <strong
                          style={{ fontSize: "10pt", fontFamily: "times" }}
                        >
                          Hisob raqam:{" "}
                        </strong>{" "}
                        {logo && logo.accountnumber}
                      </li>
                      <li style={{ textAlign: "", fontSize: "10pt" }}>
                        <strong
                          style={{ fontSize: "10pt", fontFamily: "times" }}
                        >
                          Telefon raqam:{" "}
                        </strong>
                        {logo && logo.phone1 !== null ? "+" + logo.phone1 : ""}{" "}
                        <br />
                        {logo && logo.phone2 !== null
                          ? "+" + logo.phone2
                          : ""}{" "}
                        <br />
                        {logo && logo.phone3 !== null
                          ? "+" + logo.phone3
                          : ""}{" "}
                        <br />
                      </li>
                    </ul>
                  </td>
                  <td className="text-center">
                    <img
                      className="me-3"
                      width="200"
                      src={logo && logo.logo}
                      alt="logo"
                    />
                    <br />
                    {connector && connector.probirka ? (
                      <h6
                        className="d-inline-block"
                        style={{ fontSize: "27pt", fontFamily: "times" }}
                      >
                        NAMUNA: {connector && connector.probirka}
                      </h6>
                    ) : (
                      ""
                    )}
                    <div className="ms-3 fs-5">
                      {" "}
                      {connector &&
                        new Date(connector.bronDay).toLocaleDateString() +
                          " " +
                          new Date(connector.bronDay).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="text-end">
                    <img
                      width="140"
                      className="me-3 mt-4"
                      src={qr && qr}
                      alt="QR"
                    />
                    <br />
                    <p className="pe-3 me-1 mb-0" style={{ fontSize: "10pt" }}>
                      Bu yerni skanerlang
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="row">
            <div className="col-2">
              <div className="invoice-from ps-4">
                <h6
                  className="d-inline-block"
                  style={{
                    textTransform: "uppercase",
                    fontFamily: "times",
                    fontSize: "17pt",
                  }}
                >
                  ID: {client && client.id}
                </h6>
              </div>
            </div>
            <div className="col-4">
              <div className="invoice-from text-center">
                <h6
                  className="d-inline-block"
                  style={{ fontSize: "17pt", fontFamily: "times" }}
                >
                  F.I.O: {client && client.lastname}{" "}
                  {client && client.firstname} {client && client.fathername}
                </h6>
              </div>
            </div>
            <div className="col-3">
              <div className="invoice-from text-center">
                <h6
                  className="d-inline-block"
                  style={{ fontSize: "17pt", fontFamily: "times" }}
                >
                  Yil: {client && new Date(client.born).toLocaleDateString()}
                </h6>
              </div>
            </div>
            <div className="col-3">
              <div className="invoice-from text-end pe-4">
                <h6
                  className="d-inline-block"
                  style={{ fontSize: "17pt", fontFamily: "times" }}
                >
                  Tel: {client && "+" + client.phone}
                </h6>
              </div>
            </div>

            <div className="col-lg-12">
              <div
                className="table-responsive"
                style={{ overflow: "hidden", outline: "none" }}
                tabindex="0"
              >
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th
                        className="text-center fs-6 py-1"
                        style={{ fontSize: "10pt", fontFamily: "times" }}
                      >
                        №
                      </th>
                      <th
                        className="text-center fs-6 py-1"
                        style={{ fontSize: "10pt", fontFamily: "times" }}
                      >
                        Bo'lim
                      </th>
                      <th
                        className="text-center fs-6 py-1"
                        style={{ fontSize: "10pt", fontFamily: "times" }}
                      >
                        Xizmat narxi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sections &&
                      sections.map((section, key) => {
                        k++;
                        price = price + section.price;
                        return (
                          <tr>
                            <td
                              style={{
                                fontSize: "15pt",
                                fontFamily: "times",
                              }}
                              className="py-1"
                            >
                              {key + 1}
                            </td>
                            <td
                              style={{
                                fontSize: "15pt",
                                fontFamily: "times",
                              }}
                              className="text-start px-2 py-1"
                            >
                              {/* <span className=''>{section.name} </span> */}
                              <span className="text-uppercase fw-bold">
                                {section.subname}
                              </span>
                            </td>
                            <td
                              style={{
                                fontSize: "15pt",
                                fontFamily: "times",
                              }}
                              className="text-center py-1"
                            >
                              {section.price}
                            </td>
                          </tr>
                        );
                      })}
                    {services &&
                      services.map((service) => {
                        k++;
                        price = price + (service.price - service.priceCashier);
                        return (
                          <tr>
                            <td
                              className="py-1"
                              style={{
                                fontSize: "13pt",
                                fontFamily: "times",
                              }}
                            >
                              {k}
                            </td>
                            <td
                              style={{
                                fontSize: "13pt",
                                fontFamily: "times",
                              }}
                              className="text-start px-2 py-1"
                            >
                              {service.name} {service.type}
                            </td>
                            <td
                              style={{
                                fontSize: "13pt",
                                fontFamily: "times",
                              }}
                              className="text-center py-1"
                            >
                              {service.pieces} (dona)
                            </td>
                            <td
                              style={{
                                fontSize: "13pt",
                                fontFamily: "times",
                              }}
                              className="text-center py-1"
                            >
                              {service.price - service.priceCashier}
                            </td>
                          </tr>
                        );
                      })}
                    <tr className="bg-white">
                      <td
                        style={{
                          fontSize: "13pt",
                          fontFamily: "times",
                        }}
                        className="text-end pe-5 py-1"
                        colSpan={2}
                      >
                        Jami to'lov:
                      </td>
                      <td
                        style={{
                          fontSize: "13pt",
                          fontFamily: "times",
                        }}
                        className="text-center py-1"
                      >
                        {(sections &&
                          sections.reduce((summ, section) => {
                            return summ + section.priceCashier;
                          }, 0)) +
                          (services &&
                            services.reduce((summ, service) => {
                              return summ + service.priceCashier;
                            }, 0))}
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <td
                        className="text-end pe-5 py-1"
                        style={{
                          fontSize: "13pt",
                          fontFamily: "times",
                        }}
                        colSpan={2}
                      >
                        To'langan:
                      </td>
                      <td
                        style={{
                          fontSize: "13pt",
                          fontFamily: "times",
                        }}
                        className="text-center py-1"
                      >
                        {oldPayments && oldPayments}
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <td
                        style={{
                          fontSize: "13pt",
                          fontFamily: "times",
                        }}
                        className="text-end pe-5 py-1"
                        colSpan={2}
                      >
                        Chegirma:
                      </td>
                      <td
                        style={{
                          fontSize: "13pt",
                          fontFamily: "times",
                        }}
                        className="text-center py-1"
                      >
                        {sale && sale.summa}
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <td
                        style={{
                          fontSize: "13pt",
                          fontFamily: "times",
                        }}
                        colSpan={2}
                        className="text-end pe-5 py-1"
                      >
                        Qarz summasi:
                      </td>
                      <td
                        style={{
                          fontSize: "13pt",
                          fontFamily: "times",
                        }}
                        className="text-center py-1"
                      >
                        {(sections &&
                          sections.reduce((summ, section) => {
                            return summ + section.priceCashier;
                          }, 0)) +
                          (services &&
                            services.reduce((summ, service) => {
                              return summ + service.priceCashier;
                            }, 0)) -
                          oldPayments -
                          (sale && sale.summa)}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className=" fs-5">Mijoz imzosi: ________________</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ border: "2px dashed black", margin: "50px 0" }}></div>
        <div className="container px-5">
          <div className="row">
            <table className="table ">
              <tbody>
                <tr>
                  <td>
                    <ul className="list-unstyled  text-start ms-3 mb-0">
                      <li
                        className=""
                        style={{ fontSize: "10pt", fontFamily: "times" }}
                      >
                        <strong
                          style={{ fontSize: "10pt", fontFamily: "times" }}
                        >
                          {" "}
                          {logo && logo.companyname}
                        </strong>
                      </li>
                      <li style={{ fontSize: "10pt", fontFamily: "times" }}>
                        <strong
                          style={{ fontSize: "10pt", fontFamily: "times" }}
                        >
                          Manzil:{" "}
                        </strong>{" "}
                        {logo && logo.address}
                      </li>
                      <li style={{ fontSize: "10pt", fontFamily: "times" }}>
                        <strong
                          style={{ fontSize: "10pt", fontFamily: "times" }}
                        >
                          Bank:{" "}
                        </strong>{" "}
                        {logo && logo.bank}
                      </li>
                      <li style={{ fontSize: "10pt", fontFamily: "times" }}>
                        {" "}
                        <strong
                          style={{ fontSize: "10pt", fontFamily: "times" }}
                        >
                          MFO:{" "}
                        </strong>{" "}
                        {logo && logo.mfo}
                      </li>
                      <li style={{ textAlign: "", fontSize: "10pt" }}>
                        <strong
                          style={{ fontSize: "10pt", fontFamily: "times" }}
                        >
                          INN:
                        </strong>{" "}
                        {logo && logo.inn}
                      </li>
                      <li style={{ textAlign: "", fontSize: "10pt" }}>
                        <strong
                          style={{ fontSize: "10pt", fontFamily: "times" }}
                        >
                          Hisob raqam:{" "}
                        </strong>{" "}
                        {logo && logo.accountnumber}
                      </li>
                      <li style={{ textAlign: "", fontSize: "10pt" }}>
                        <strong
                          style={{ fontSize: "10pt", fontFamily: "times" }}
                        >
                          Telefon raqam:{" "}
                        </strong>
                        {logo && logo.phone1 !== null ? "+" + logo.phone1 : ""}{" "}
                        <br />
                        {logo && logo.phone2 !== null
                          ? "+" + logo.phone2
                          : ""}{" "}
                        <br />
                        {logo && logo.phone3 !== null
                          ? "+" + logo.phone3
                          : ""}{" "}
                        <br />
                      </li>
                    </ul>
                  </td>
                  <td className="text-center">
                    <img
                      className="me-3"
                      width="200"
                      src={logo && logo.logo}
                      alt="logo"
                    />
                    <br />
                    {connector && connector.probirka ? (
                      <h6
                        className="d-inline-block"
                        style={{ fontSize: "27pt", fontFamily: "times" }}
                      >
                        NAMUNA: {connector && connector.probirka}
                      </h6>
                    ) : (
                      ""
                    )}
                    <div className="ms-3 fs-5">
                      {" "}
                      {connector &&
                        new Date(connector.bronDay).toLocaleDateString() +
                          " " +
                          new Date(connector.bronDay).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="text-end">
                    <img
                      width="140"
                      className="me-3 mt-4"
                      src={qr && qr}
                      alt="QR"
                    />
                    <br />
                    <p className="pe-3 me-1 mb-0" style={{ fontSize: "10pt" }}>
                      Bu yerni skanerlang
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="row">
            <div className="col-2">
              <div className="invoice-from ps-4">
                <h6
                  className="d-inline-block"
                  style={{
                    textTransform: "uppercase",
                    fontFamily: "times",
                    fontSize: "17pt",
                  }}
                >
                  ID: {client && client.id}
                </h6>
              </div>
            </div>
            <div className="col-4">
              <div className="invoice-from text-center">
                <h6
                  className="d-inline-block"
                  style={{ fontSize: "17pt", fontFamily: "times" }}
                >
                  F.I.O: {client && client.lastname}{" "}
                  {client && client.firstname} {client && client.fathername}
                </h6>
              </div>
            </div>
            <div className="col-3">
              <div className="invoice-from text-center">
                <h6
                  className="d-inline-block"
                  style={{ fontSize: "17pt", fontFamily: "times" }}
                >
                  Yil: {client && new Date(client.born).toLocaleDateString()}
                </h6>
              </div>
            </div>
            <div className="col-3">
              <div className="invoice-from text-end pe-4">
                <h6
                  className="d-inline-block"
                  style={{ fontSize: "17pt", fontFamily: "times" }}
                >
                  Tel: {client && "+" + client.phone}
                </h6>
              </div>
            </div>

            <div className="col-lg-12">
              <div
                className="table-responsive"
                style={{ overflow: "hidden", outline: "none" }}
                tabindex="0"
              >
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th
                        className="text-center fs-6 py-1"
                        style={{ fontSize: "10pt", fontFamily: "times" }}
                      >
                        №
                      </th>
                      <th
                        className="text-center fs-6 py-1"
                        style={{ fontSize: "10pt", fontFamily: "times" }}
                      >
                        Bo'lim
                      </th>
                      <th
                        className="text-center fs-6 py-1"
                        style={{ fontSize: "10pt", fontFamily: "times" }}
                      >
                        Xizmat narxi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sections &&
                      sections.map((section, key) => {
                        k++;
                        price = price + section.price;
                        return (
                          <tr>
                            <td
                              style={{
                                fontSize: "15pt",
                                fontFamily: "times",
                              }}
                              className="py-1"
                            >
                              {key + 1}
                            </td>
                            <td
                              style={{
                                fontSize: "13pt",
                                fontFamily: "times",
                              }}
                              className="text-start px-2 py-1"
                            >
                              {/* <span className=''>{section.name} </span> */}
                              <span className="text-uppercase fw-bold">
                                {section.subname}
                              </span>
                            </td>
                            <td
                              style={{
                                fontSize: "13pt",
                                fontFamily: "times",
                              }}
                              className="text-center py-1"
                            >
                              {section.price}
                            </td>
                          </tr>
                        );
                      })}
                    {services &&
                      services.map((service) => {
                        k++;
                        price = price + (service.price - service.priceCashier);
                        return (
                          <tr>
                            <td
                              className="py-1"
                              style={{
                                fontSize: "13pt",
                                fontFamily: "times",
                              }}
                            >
                              {k}
                            </td>
                            <td
                              style={{
                                fontSize: "13pt",
                                fontFamily: "times",
                              }}
                              className="text-start px-2 py-1"
                            >
                              {service.name} {service.type}
                            </td>
                            <td
                              style={{
                                fontSize: "13pt",
                                fontFamily: "times",
                              }}
                              className="text-center py-1"
                            >
                              {service.pieces} (dona)
                            </td>
                            <td
                              style={{
                                fontSize: "13pt",
                                fontFamily: "times",
                              }}
                              className="text-center py-1"
                            >
                              {service.price - service.priceCashier}
                            </td>
                          </tr>
                        );
                      })}
                    <tr className="bg-white">
                      <td
                        style={{
                          fontSize: "13pt",
                          fontFamily: "times",
                        }}
                        className="text-end pe-5 py-1"
                        colSpan={2}
                      >
                        Jami to'lov:
                      </td>
                      <td
                        style={{
                          fontSize: "13pt",
                          fontFamily: "times",
                        }}
                        className="text-center py-1"
                      >
                        {(sections &&
                          sections.reduce((summ, section) => {
                            return summ + section.priceCashier;
                          }, 0)) +
                          (services &&
                            services.reduce((summ, service) => {
                              return summ + service.priceCashier;
                            }, 0))}
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <td
                        style={{
                          fontSize: "13pt",
                          fontFamily: "times",
                        }}
                        className="text-end pe-5 py-1"
                        colSpan={2}
                      >
                        To'langan:
                      </td>
                      <td
                        style={{
                          fontSize: "13pt",
                          fontFamily: "times",
                        }}
                        className="text-center py-1"
                      >
                        {oldPayments && oldPayments}
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <td
                        style={{
                          fontSize: "13pt",
                          fontFamily: "times",
                        }}
                        className="text-end pe-5 py-1"
                        colSpan={2}
                      >
                        Chegirma:
                      </td>
                      <td
                        style={{
                          fontSize: "13pt",
                          fontFamily: "times",
                        }}
                        className="text-center py-1"
                      >
                        {sale && sale.summa}
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <td
                        style={{
                          fontSize: "13pt",
                          fontFamily: "times",
                        }}
                        colSpan={2}
                        className="text-end pe-5 py-1"
                      >
                        Qarz summasi:
                      </td>
                      <td
                        style={{
                          fontSize: "13pt",
                          fontFamily: "times",
                        }}
                        className="text-center py-1"
                      >
                        {(sections &&
                          sections.reduce((summ, section) => {
                            return summ + section.priceCashier;
                          }, 0)) +
                          (services &&
                            services.reduce((summ, service) => {
                              return summ + service.priceCashier;
                            }, 0)) -
                          oldPayments -
                          (sale && sale.summa)}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className=" fs-5">Mijoz imzosi: ________________</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="text-center w-100"
        style={{ position: "fixed", bottom: "20px" }}
      >
        <button onClick={handlePrint} className="btn btn-primary px-5">
          Print
        </button>
      </div>
    </div>
    // <div style={{ width: "110mm", margin: "0 auto" }}>
    //   <div ref={componentRef}>
    //     <div
    //       style={{ width: "108mm", fontFamily: "monospace", fontSize: "10pt" }}
    //       className="px-3"
    //     >
    //       {/* <div className='text-center'>
    //                     <img src={logo && logo.logo} width="250px" />
    //                 </div> */}
    //       <div className="row">
    //         <div className="col-12 text-center border-bottom border-dark">
    //           {logo && logo.companyname}
    //         </div>
    //       </div>
    //       <div className="row">
    //         <div className="col-12">{new Date().toLocaleString()}</div>
    //       </div>
    //       <div className="row">
    //         <div className="col-6">Manzil:</div>
    //         <div className="col-6 text-end fw-bold">{logo && logo.address}</div>
    //       </div>
    //       <div className="row border-bottom">
    //         <div className="col-6">Telefon:</div>
    //         <div className="col-6 text-end fw-bold">+{logo && logo.phone1}</div>
    //       </div>
    //       <div className="row">
    //         <div className="col-6">Bank:</div>
    //         <div className="col-6 text-end fw-bold">{logo && logo.bank}</div>
    //       </div>
    //       <div className="row">
    //         <div className="col-6">MFO:</div>
    //         <div className="col-6 text-end fw-bold">{logo && logo.mfo}</div>
    //       </div>
    //       <div className="row">
    //         <div className="col-6">INN:</div>
    //         <div className="col-6 text-end fw-bold">{logo && logo.inn}</div>
    //       </div>
    //       <div className="row border-bottom">
    //         <div className="col-6">Hisob raqam:</div>
    //         <div className="col-6 text-end fw-bold">
    //           {logo && logo.accountnumber}
    //         </div>
    //       </div>
    //       <div className="row">
    //         <div className="col-6">F.I.O:</div>
    //         <div className="col-6 text-end fw-bold">
    //           {client && client.lastname} {client && client.firstname}{" "}
    //           {client && client.fathername}
    //         </div>
    //       </div>
    //       <div className="row border-bottom border-dark">
    //         <div className="col-6">ID:</div>
    //         <div className="col-6 text-end fw-bold">{client && client.id}</div>
    //       </div>
    //       <div className="row fs-6 ">
    //         <div className="col-6">To'lov summasi:</div>
    //         <div className="col-6 text-end fw-bold">
    //           {(sections &&
    //             sections.reduce((summ, section) => {
    //               return summ + section.priceCashier;
    //             }, 0)) +
    //             (services &&
    //               services.reduce((summ, service) => {
    //                 return summ + service.priceCashier;
    //               }, 0))}{" "}
    //           so'm
    //         </div>
    //       </div>
    //       <div className="row fs-6">
    //         <div className="col-6">Chegirma:</div>
    //         <div className="col-6 text-end fw-bold">
    //           {sale && sale.summa} so'm
    //         </div>
    //       </div>
    //       <div className="row fs-6">
    //         <div className="col-6">To'langan summa:</div>
    //         <div className="col-6 text-end fw-bold">
    //           {oldPayments && oldPayments} so'm
    //         </div>
    //       </div>
    //       <div className="row fs-6 mb-5">
    //         <div className="col-6">Qarz summa:</div>
    //         <div className="col-6 text-end fw-bold">
    //           {(sections &&
    //             sections.reduce((summ, section) => {
    //               return summ + section.priceCashier;
    //             }, 0)) +
    //             (services &&
    //               services.reduce((summ, service) => {
    //                 return summ + service.priceCashier;
    //               }, 0)) -
    //             oldPayments -
    //             (sale && sale.summa)}{" "}
    //           so'm
    //         </div>
    //       </div>
    //       <div
    //         style={{ border: "1px  dashed black", marginTop: "100px" }}
    //       ></div>
    //       <div
    //         style={{ border: "1px  dashed black", marginTop: "100px" }}
    //       ></div>
    //     </div>
    //   </div>
    //   <div
    //     className=""
    //     style={{ position: "fixed", bottom: "20px", width: "110mm" }}
    //   >
    //     <div className="row w-100">
    //       <div className=" col-12 text-center">
    //         <button onClick={handlePrint} className="btn btn-primary px-5">
    //           Print
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};
