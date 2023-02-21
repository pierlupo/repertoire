const ContactDisplay = (props) => {
    const contact = props.contact
  
  
    return (
      <div className="border border-info rounded p-3 my-2">
        <div className="d-flex align-items-center">
          <h5>{contact.name}{contact.firstname}</h5>
        </div>
          <hr />
        
        <div className="d-flex justify-content-between align-items-center">
          <button className="btn btn-warning" onClick={() => props.editContact(contact.id)}>Edit</button>
          <button className="btn btn-danger" onClick={() => props.deleteContact(contact.id)}>Delete</button>
        </div>
      </div>
    )
  }
  
  export default ContactDisplay