import { Col, Modal, Row, Table } from "react-bootstrap";
import DashboardSidebarComponent from "../AdminDashboardSidebarComponent";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ModelsService from "../../services/AdminModelsService";
import Student from "../../models/Student";
import { CircularSpinner } from "infinity-spinners";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import School from "../../models/School";
import { decodeToken } from "react-jwt";

function AdminStudentsComponent() {
  const [students, setStudents] = useState<Student[]>([]);
  const [school, setSchool] = useState<School>();
  var token: string = "";
  const navigate = useNavigate();
  const [isDisabled, setIsDisabled] = useState(false);

  if (localStorage.getItem("superadmin")) {
    navigate("/superadmin/dashboard");
  } else if (localStorage.getItem("admin")) {
    token = localStorage.getItem("admin") as string;
  } else if (localStorage.getItem("student")) {
    navigate("/home");
  }

  const [isLoading, setIsLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");

  useEffect(() => {
    const decodedToken: any = decodeToken(token);
    ModelsService.School(token, decodedToken.sub)
      .then((response) => {
        setSchool(response.data);
        ModelsService.listStudents(token, response.data.id)
          .then((response) => {
            setStudents(response.data);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleShow = (id: string, name: string) => {
    setShow(true);
    setStudentId(id);
    setStudentName(name);
  };
  const handleClose = () => setShow(false);

  const handleDelete = (id: string) => {
    setIsDisabled(true);
    ModelsService.deleteStudent(token, id, school!.id)
      .then((response) => {
        console.log(response);
        handleClose();
        setIsDisabled(false);
        enqueueSnackbar("Student deleted successfully.", {
          variant: "success",
          autoHideDuration: 2000,
          transitionDuration: 300,
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          preventDuplicate: true,
        });
        ModelsService.listStudents(token, school!.id)
          .then((response) => {
            setStudents(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
        setIsDisabled(false);
        enqueueSnackbar("Failed to delete student", {
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

  const studentsArray = Object.values(students);
  const studentsCount = studentsArray.length;

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Student[]>(students);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const results = students.filter(
      (student) =>
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm, students]);

  const filteredStudents = searchTerm ? searchResults : studentsArray;

  return (
    <>
      <SnackbarProvider maxSnack={4} />
      <Row className="row2">
        <Col className="col-md-2">
          <DashboardSidebarComponent option={"students"} />
        </Col>
        <Col className="col2">
          <div className="table-entity">
            <div className="header">
              <span style={{ fontSize: "1.5rem" }}>Students Table</span>
              <span style={{ fontSize: "1.2rem" }}>
                {studentsCount} {studentsCount > 1 ? "rows" : "row"}
              </span>
            </div>
            <div className="table-bar2">
              <div>Search</div>
              <input
                type="text"
                placeholder="Email, first name, or last name"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            {isLoading ? (
              <div className="no-data">
                <CircularSpinner color="#000" size={60} speed={2} weight={3} />
              </div>
            ) : studentsCount === 0 ? (
              <div className="no-data">No Data.</div>
            ) : (
              <div className="table-table">
                <Table>
                  <thead>
                    <tr>
                      <th>CNE</th>
                      <th>NUM APOGEE</th>
                      <th>FIRST NAME</th>
                      <th>LAST NAME</th>
                      <th>PROFILE IMAGE</th>
                      <th>SCHOOL</th>
                      <th>EMAIL</th>
                      <th>EDIT/DELETE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student.id}>
                        <td>
                          {student.cne.length > 3
                            ? student.cne.slice(0, 3) + "..."
                            : student.cne}
                        </td>
                        <td>
                          {student.numApogee!.toString().length > 10
                            ? student.numApogee.toString().slice(0, 10) + "..."
                            : student.numApogee.toString()}
                        </td>
                        <td>
                          {student.firstName.length > 10
                            ? student.firstName.slice(0, 10) + "..."
                            : student.firstName}
                        </td>
                        <td>
                          {student.lastName.length > 9
                            ? student.lastName.slice(0, 9) + "..."
                            : student.lastName}
                        </td>
                        <td>
                          {student.profileImage.length > 13
                            ? student.profileImage.slice(0, 13) + "..."
                            : student.profileImage}
                        </td>
                        <td>
                          {student.school.schoolName.length > 6
                            ? student.school.schoolName.slice(0, 6) + "..."
                            : student.school.schoolName}
                        </td>
                        <td>
                          {student.email.length > 5
                            ? student.email.slice(0, 5) + "..."
                            : student.email}
                        </td>
                        <td>
                          <div className="modify">
                            <button
                              className="btn btn-edit"
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/admin/upstudent/${
                                    students.indexOf(student) + 1
                                  }`,
                                  { state: { student } }
                                )
                              }
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-delete"
                              type="button"
                              onClick={() =>
                                handleShow(
                                  student.id,
                                  student.firstName + " " + student.lastName
                                )
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </div>
          <button
            className="btn btn-add3"
            type="button"
            onClick={() => navigate("/admin/addstudent")}
          >
            Add Student
          </button>
        </Col>
      </Row>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Delete Student with name {studentName}?</Modal.Body>
        <Modal.Footer>
          <button
            className="btn modal-cancel"
            type="button"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className="btn modal-confirm"
            type="button"
            onClick={() => handleDelete(studentId)}
            disabled={isDisabled}
          >
            Confirm
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AdminStudentsComponent;
