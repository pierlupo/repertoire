import { useEffect, useRef, useState } from "react";
import ModalComponent from "./shared/ModalComponent";
import { createPortal } from "react-dom";
import { API_KEY } from "./apiKey";
import ContactForm from "./components/ContactForm";
import ContactDisplay from "./components/ContactDisplay";
import NavBar from "./components/navbar";
import MyButton from "./components/shared/MyButton";
const App = () => {

  const [modalVisible, setModalVisible] = useState(false)
  const [modalFormVisible, setModalFormVisible] = useState(false)
  const [isLogging, setIsLogging] = useState(false)
  const [isLogged, setIsLogged] = useState(false)

  const emailRef = useRef()
  const passwordRef = useRef()

  const [contacts, setContacts] = useState([])

  const BASE_DB_URL = "https://repertoire-bb645-default-rtdb.europe-west1.firebasedatabase.app/"

  const submitFormHandler = async (event) => {
    event.preventDefault()

    let BASE_URL = ""

    

    if (isLogging) {
      BASE_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`

    } else {
      BASE_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`
    }

    try {

      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body : JSON.stringify({
          email: emailRef.current.value,
          password: passwordRef.current.value,
          returnSecureToken: true
        })
      })
  
      if(!response.ok) {
        throw new Error("Il y a eu une erreur !")
      } 

      const data = await response.json()
      
      localStorage.setItem('token', data.idToken)

      emailRef.current.value = ""
      passwordRef.current.value = ""

      setIsLogged(true)
      setModalVisible(false)
    } catch (error) {
      console.error(error.message);
    }
  }

  const addContactHandler = async (contact) => {
    console.log(contact)
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const response = await fetch(`${BASE_DB_URL}contacts.json?auth=${token}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body : JSON.stringify(contact)
        })

        if (!response.ok) {
          throw new Error("Il y a eu un problème !")
        }

        const data = await response.json()
        setContacts([...contacts, {id: data.name, ...contact}])
        refreshContacts()

      }
    } catch (error) {
      console.error(error.message);
    }
  }

  const refreshContacts = async () => {
    try {
      const response = await fetch(`${BASE_DB_URL}contacts.json`)

      if (!response.ok) {
        throw new Error("Il y a eu une erreur lors de la requête GET !")
      }

      const data = await response.json()

      const tmpContacts = []
      for (const key in data) {
        tmpContacts.push({id: key, ...data[key]})
      }
      console.log(tmpContacts);
      setContacts(tmpContacts)

    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    refreshContacts()
  }, [])


  const deleteContactHandler = async (contactId) => {
      if(window.confirm("Etes-vous sûr ?")) {
      const contactFound = contacts.find(contact => contact.id === contactId)
      if (contactFound) {
        try {
          const token = localStorage.getItem('token')
          if (token) {
            const response = await fetch(`${BASE_DB_URL}contacts/${contactId}.json?auth=${token}`, {
              method: "DELETE"
            })
  
            if (!response.ok) {
              throw new Error("Erreur lors de la requête DELETE !")
            }
  
            setContacts([...contacts.filter(contact => contact !== contactFound)])
          }
        } catch (error) {
          console.error(error.message);
        }

      }
    }
  }

  const sortedContacts = () => {
    return contacts.sort((a, b) => a.name - b.name)

  }

  const logOutHandler = () => {
    localStorage.removeItem('token')
    setIsLogged(false)
  }

  return (
    <>
    <NavBar><button className="btn btn-primary" onClick={() => isLogged ? logOutHandler() : setModalVisible(true)}>{isLogged ? 'Log Out' : 'Connexion'}</button></NavBar>
    {modalVisible && createPortal(<ModalComponent closeModal={() => setModalVisible(false)}>
      
      <div className="d-flex justify-content-between align-items center">
      <h3>{isLogging ? 'Sign In' : 'Sign Up'}</h3>
      <button onClick={() =>setModalVisible(false)} className="btn btn-outline-dark rounded-circle"><i className="bi bi-x"></i></button>
      </div>
      <hr />
      <form onSubmit={submitFormHandler}>
      <div className="mb-3">
          <label htmlFor="email" className="form-label">Email : </label>
          <input type="text" required ref={emailRef} className="form-control" />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password : </label>
          <input type="password" required ref={passwordRef} className="form-control" />
        </div>
        <div className="text-end">
          <button type="button" className="btn btn-outline-info me-2" onClick={() => setIsLogging(!isLogging)}>Switch to {isLogging ? 'Sign Up' : 'Sign In'}</button>
          <button className="btn btn-primary">{isLogging ? 'Sign In' : 'Sign Up'}</button>
        </div>
      </form>
    </ModalComponent>, document.getElementById("modal-root"))}

    {modalFormVisible && createPortal(<ModalComponent closeModal={() => setModalFormVisible(false)}>

      <div className="col-8 mx-auto text-center">
        <div className="bg-dark text-light rounded p-3">
        <div className="d-flex justify-content-between align-items center ">
      <button onClick={() =>setModalFormVisible(false)} className="btn btn-outline-light rounded-circle  mx-auto"><i className="bi bi-x"></i></button>
      </div>
      <hr />
          <ContactForm addContact={addContactHandler} />
        </div>
      </div>
      
      </ ModalComponent>, document.getElementById("modal-root"))}
      <div className="container">
    <div className="row g-2 py-3">
      <div className="col-8">
        <div className="bg-dark text-light rounded p-3">
          <div className="d-flex justify-content-between align-items-center">
          <h1>RepApp</h1>
          <div><button className="btn btn-outline-success me-2"  onClick={() =>setModalFormVisible(true)} ><i className="bi bi-pencil"></i> Ajouter un contact</button></div>
          </div>
          <hr />
          {contacts.length === 0 ? 
            <p>Il n'y a pas de contacts dans la base de données !</p> : 
             sortedContacts().map(contact => <ContactDisplay key={contact.id} contact={contact} deleteContact={deleteContactHandler} />)}
        </div>
      </div>
    </div>
  </div>
  </>
);
}


export default App;
