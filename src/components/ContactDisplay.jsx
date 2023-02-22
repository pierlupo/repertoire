import "../index.css";

const ContactDisplay = (props) => {
  const contact = props.contact;
  const isLogged = props.isLogged;
  let avatarURL = contact.avatar;

  // const getContactAge = () => {
  //   const today = new Date()
  //   const todayCopy = new Date()
  //   const birthDate = new Date(contact.birthDate)
  //   todayCopy.setFullYear(birthDate.getFullYear())
  //   if (todayCopy > birthDate){
  //     return today.getFullYear() - birthDate.getFullYear() - 1
  //   } else {
  //     return today.getFullYear() - birthDate.getFullYear
  //   }
  // }

  return (
    <>
      <div className="border border-info rounded p-3 my-2">
        <div className="displayInfo">
          <div className="infoContainer">
            <h5>
              {contact.firstname} {contact.name}
            </h5>
            <ul>
              <li>{contact.birthdate}</li>
              {/* <li>{contact.age} ans</li> */}
              {/* <li>{getContactAge()} ans</li> */}
              <li>{contact.email}</li>
              <li>{contact.tel}</li>
            </ul>
          </div>
          <div className="imageContainer">
            <img
              src={avatarURL}
              alt="une image"
              id="pictures"
              className="picture"
            ></img>
          </div>
        </div>
        <hr />
        <div className="d-flex justify-content-between align-items-center">
          {isLogged && (
            <button
              className="btn btn-warning"
              onClick={() =>
                props.setSelectedContactAndFormMode({
                  contactId: contact.id,
                  mode: "edit",
                })
              }
            >
              <i className="bi bi-trash"></i>Edit
            </button>
          )}
          {isLogged && (
            <button
              className="btn btn-danger"
              onClick={() =>
                props.setSelectedContactAndFormMode({
                  contactId: contact.id,
                  mode: "delete",
                })
              }
            >
              <i className="bi bi-trash"></i>Delete
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ContactDisplay;
