import { useRef } from "react"

const ContactForm = (props) => {
  const contact = props.contact

  //console.log(contact);
  
  const nameRef = useRef()
  const firstnameRef = useRef()
  const birthdateRef = useRef()
  const ageRef = useRef()
  const emailRef = useRef()
  const telRef = useRef()
  const avatarRef = useRef()

  const submitFormHandler = (event) => {
    event.preventDefault()

    const name = nameRef.current.value
    const firstname = firstnameRef.current.value
    const birthdate = birthdateRef.current.value
    const age = ageRef.current.value
    const email = emailRef.current.value
    const tel = telRef.current.value
    const avatar = avatarRef.current.value

    const newContact = {
        name,
        firstname,
        birthdate,
        age,
        email,
        tel,
        avatar
    }

    nameRef.current.value = ""
    firstnameRef.current.value = ""
    birthdateRef.current.value = ""
    ageRef.current.value = ""
    emailRef.current.value = ""
    telRef.current.value = ""
    avatarRef.current.value = ""
    
    if (props.mode === "add") {
      props.addContact(newContact)
    } else if (props.mode === "edit") {
      props.editContact({...newContact, id: contact.id})
    } else if (props.mode === "delete") {
      props.deleteContact(contact.id)
    }

  }

  return (
    <>
      <h3>ContactForm</h3>
      <hr />
      <form onSubmit={submitFormHandler}>
      <div className="mb-3">
          <label htmlFor="name" className="form-label">Nom: </label>
          <input type="text" required id="name" ref={nameRef} className="form-control" defaultValue={contact?.name} />
        </div>
        <div className="mb-3">
          <label htmlFor="firstname" className="form-label">Prénom: </label>
          <input type="text" required id="firstname" ref={firstnameRef} className="form-control" defaultValue={contact?.firstname} />
        </div>
        <div className="mb-3">
          <label htmlFor="birthdate" className="form-label">Date de naissance: </label>
          <input type="date" required id="birthdate" ref={birthdateRef} className="form-control" defaultValue={contact?.birthdate} />
        </div>
        <div className="mb-3">
          <label htmlFor="age" className="form-label">Âge: </label>
          <input type="number" required id="age" ref={ageRef} className="form-control" defaultValue={contact?.age} />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email: </label>
          <input type="email" required id="email" ref={emailRef} className="form-control" defaultValue={contact?.email} />
        </div>
        <div className="mb-3">
          <label htmlFor="tel" className="form-label">Téléphone: </label>
          <input type="tel" required id="tel" ref={telRef} className="form-control" defaultValue={contact?.tel} />
          {/* pattern="[0-9]{2}/[0-9]{2}/[0-9]{2}/[0-9]{2}/[0-9]{2}" */}
        </div> 
        <div className="mb-3">
          <label htmlFor="avatar" className="form-label">Avatar: </label>
          <input type="text" required id="avatar" ref={avatarRef} className="form-control" defaultValue={contact?.avatar} />
        </div>
        <div className="mx-auto">
          <button className="btn btn-outline-light"><i className="bi bi-send"></i> Envoyer</button>
        </div>
      </form>
    </>
  )
}

export default ContactForm