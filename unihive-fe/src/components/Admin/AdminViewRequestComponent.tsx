import { Col, Modal, Row } from "react-bootstrap";
import DashboardSidebarComponent from "../AdminDashboardSidebarComponent";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ModelsService from "../../services/AdminModelsService";
import School from "../../models/School";
import Request from "../../models/Request";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";
import { CircularSpinner } from "infinity-spinners";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { decodeToken } from "react-jwt";

function AdminViewRequestComponent() {
  const { id } = useParams();
  const { state } = useLocation();
  const [school, setSchool] = useState<School>();
  const [request, setRequest] = useState<Request>(state.request);
  var token: string = "";
  const navigate = useNavigate();
  const [isDisabled1, setIsDisabled1] = useState(false);
  const [isDisabled2, setIsDisabled2] = useState(false);

  if (localStorage.getItem("superadmin")) {
    navigate("/superadmin/dashboard");
  } else if (localStorage.getItem("admin")) {
    token = localStorage.getItem("admin") as string;
  } else if (localStorage.getItem("student")) {
    navigate("/home");
  }

  const [isLoading, setIsLoading] = useState(true);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const decodedToken: any = decodeToken(token);
        const schoolResponse = await ModelsService.School(
          token,
          decodedToken.sub
        );
        setSchool(schoolResponse.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleShow1 = () => setShow1(true);
  const handleClose1 = () => setShow1(false);
  const handleShow2 = () => setShow2(true);
  const handleClose2 = () => setShow2(false);
  const handleShow3 = () => setShow3(true);
  const handleClose3 = () => setShow3(false);

  const handleReject = () => {
    setIsDisabled1(true);
    ModelsService.deleteRequest(token, request.id, school!.id)
      .then((response) => {
        console.log(response);
        handleClose1();
        enqueueSnackbar("Request rejected successfully.", {
          variant: "success",
          autoHideDuration: 1000,
          transitionDuration: 300,
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          preventDuplicate: true,
          onClose: () => {
            navigate("/admin/requests");
          },
        });
      })
      .catch((error) => {
        console.error(error);
        setIsDisabled1(false);
        enqueueSnackbar("Failed to reject request", {
          variant: "error",
          autoHideDuration: 2000,
          transitionDuration: 300,
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          preventDuplicate: true,
        });
      });
  };

  const handleAccept = () => {
    setIsDisabled2(true);
    ModelsService.acceptRequest(token, request.id, school!.id)
      .then((response) => {
        console.log(response);
        handleClose2();
        enqueueSnackbar("Request accepted successfully.", {
          variant: "success",
          autoHideDuration: 1000,
          transitionDuration: 300,
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          preventDuplicate: true,
          onClose: () => {
            navigate("/admin/requests");
          },
        });
      })
      .catch((error) => {
        console.error(error);
        setIsDisabled2(false);
        enqueueSnackbar("Failed to update request", {
          variant: "error",
          autoHideDuration: 2000,
          transitionDuration: 300,
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          preventDuplicate: true,
        });
      });
  };

  var strId = String(id);

  if (strId[strId.length - 1] === "1") {
    strId += "st";
  } else if (strId[strId.length - 1] === "2") {
    strId += "nd";
  } else if (strId[strId.length - 1] === "3") {
    strId += "rd";
  } else {
    strId += "th";
  }

  return (
    <>
      <SnackbarProvider maxSnack={4} />
      <Row className="row2">
        <Col className="col-md-2">
          <DashboardSidebarComponent option={"viewrequest"} />
        </Col>
        <Col className="col2">
          <div className="table-entity-add">
            <div className="header">
              <span style={{ fontSize: "1.5rem" }}>{strId + " Row"}</span>
            </div>
            {isLoading ? (
              <div className="is-loading">
                <CircularSpinner color="#000" size={60} speed={2} weight={3} />
              </div>
            ) : (
              <div className="req-entity">
                <form>
                  <div className="info">
                    <div className="info-row">
                      ID
                      <input type="text" value={request.id} disabled />
                    </div>
                    <div className="info-row">
                      FIRST NAME
                      <input
                        type="text"
                        placeholder="first name"
                        value={request.firstName}
                        disabled
                      />
                    </div>
                    <div className="info-row">
                      LAST NAME
                      <input
                        type="text"
                        placeholder="last name"
                        value={request.lastName}
                        disabled
                      />
                    </div>
                    <div className="info-row">
                      CNE
                      <input
                        type="text"
                        placeholder="cne"
                        value={request.cne}
                        disabled
                      />
                    </div>
                    <div className="info-row">
                      NUM APOGEE
                      <input
                        type="number"
                        placeholder="num  apogee"
                        value={request.numApogee}
                        disabled
                      />
                    </div>
                    <div className="info-row">
                      EMAIL
                      <input
                        type="text"
                        placeholder="email"
                        value={request.email}
                        disabled
                      />
                    </div>
                    <div className="info-row">
                      PASSWORD
                      <input
                        type="text"
                        placeholder="password"
                        value={request.password}
                        disabled
                      />
                    </div>
                    <div className="info-btns">
                      <button
                        className="btn save-update"
                        type="button"
                        onClick={handleShow2}
                      >
                        Accept
                      </button>
                      <button
                        className="btn delete"
                        type="button"
                        onClick={handleShow1}
                      >
                        Reject
                      </button>
                      <button
                        className="btn cancel-update"
                        type="button"
                        onClick={() => navigate("/admin/requests")}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
                <div className="school-card">
                  <div className="sc-img">
                    <img src={request.schoolCard} alt="" />
                  </div>
                  <div className="sc-title">
                    <span>SCHOOL CARD</span>
                    <div className="sc-title-btn">
                      <button
                        className="btn fs"
                        type="button"
                        onClick={handleShow3}
                      >
                        <ArrowsPointingOutIcon
                          width={20}
                          height={20}
                          color="black"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Col>
      </Row>
      <Modal show={show1} onHide={handleClose1} centered>
        <Modal.Header>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Reject Request with student name {request.firstName}{" "}
          {request.lastName}?
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn modal-cancel"
            type="button"
            onClick={handleClose1}
          >
            Cancel
          </button>
          <button
            className="btn modal-confirm"
            type="button"
            onClick={handleReject}
            disabled={isDisabled1}
          >
            Confirm
          </button>
        </Modal.Footer>
      </Modal>
      <Modal show={show2} onHide={handleClose2} centered>
        <Modal.Header>
          <Modal.Title className="title2">Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Accept Request with student name {request.firstName}{" "}
          {request.lastName}?
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn modal-cancel"
            type="button"
            onClick={handleClose2}
          >
            Cancel
          </button>
          <button
            className="btn modal-confirm-2"
            type="button"
            onClick={handleAccept}
            disabled={isDisabled2}
          >
            Confirm
          </button>
        </Modal.Footer>
      </Modal>
      <Modal
        className="modal-img-cont"
        show={show3}
        onHide={handleClose3}
        centered
      >
        <Modal.Body className="modal-img">
          <img src={request.schoolCard} alt="" />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AdminViewRequestComponent;