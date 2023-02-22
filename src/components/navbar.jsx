import MyButton from "../shared/MyButton";

const NavBar = (props) => {
  // const navbar = props.navbar

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark ">
      <div className="container-fluid">
        <span className="text-light" style={{ cursor: "pointer" }}>
          <i className="bi bi-person-lines-fill"></i> Rep_App
        </span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ">
            <li className="nav-item ">
              <a className="nav-link active" aria-current="page" href="#">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Link
              </a>
            </li>
          </ul>
          {props.children}
          {/* <MyButton extraClasses="ms-2" variant="success"><i className="bi bi-globe"></i> Submit</MyButton> */}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
