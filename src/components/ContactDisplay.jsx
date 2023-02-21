import "../index.css"

const ContactDisplay = (props) => {
  const contact = props.contact
  let avatarURL = contact.avatar
  
    return (
      <>
      <div className="border border-info rounded p-3 my-2">
        <div className="displayInfo">
          <div className="infoContainer">
          <h5>{contact.firstname} {contact.name}</h5>
          <ul>
            <li>{contact.birthdate}</li>
            <li>{contact.age} ans</li>
            <li>{contact.email}</li>
            <li>{contact.tel}</li>
          </ul>
          </div>
          <div className="imageContainer">
            <img src={avatarURL} alt="une image" id="pictures" className="picture"></img>
          </div>
        </div>
          <hr />
        <div className="d-flex justify-content-between align-items-center">
          
          <button className="btn btn-warning" onClick={() => props.setSelectedContactAndFormMode({contactId: contact.id, mode: "edit"})}><i className="bi bi-trash"></i>Edit</button>
          <button className="btn btn-danger" onClick={() => props.setSelectedContactAndFormMode({contactId: contact.id, mode: "delete"})}><i className="bi bi-trash"></i>Delete</button>
        </div>
      </div>
      </>
    )
  }
  
  export default ContactDisplay