import { useEffect, useRef, useState } from "react";
import ModalComponent from "./shared/ModalComponent";
import { createPortal } from "react-dom";
import { API_KEY } from "./apiKey";
import ContactForm from "./components/ContactForm";
import ContactDisplay from "./components/ContactDisplay";
import NavBar from "./components/navbar";
import MyButton from "./shared/MyButton";
const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalFormMode, setModalFormMode] = useState("");
  const [isLogging, setIsLogging] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  const emailRef = useRef();
  const passwordRef = useRef();

  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  // à gitignorer dans apiKey.js
  const BASE_DB_URL =
    "https://repertoire-bb645-default-rtdb.europe-west1.firebasedatabase.app/";

  const submitFormHandler = async (event) => {
    event.preventDefault();

    let BASE_URL = "";

    if (isLogging) {
      // à gitignorer dans apiKey.js
      BASE_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
    } else {
      // à gitignorer dans apiKey.js
      BASE_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
    }

    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailRef.current.value,
          password: passwordRef.current.value,
          returnSecureToken: true,
        }),

        //emailref.currrent.value = ""
        //passwordRef.current.value = ""
      });

      if (!response.ok) {
        throw new Error("Il y a eu une erreur !");
      }

      const data = await response.json();

      localStorage.setItem("token", data.idToken);

      emailRef.current.value = "";
      passwordRef.current.value = "";

      setIsLogged(true);
      setModalVisible(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  const addContactHandler = async (contact) => {
    if(isLogged){
    console.log(contact);
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await fetch(
          `${BASE_DB_URL}contacts.json?auth=${token}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(contact),
          }
        );

        if (!response.ok) {
          throw new Error("Il y a eu un problème !");
        }

        const data = await response.json();
        setContacts([...contacts, { id: data.name, ...contact }]);
        //setSelectedContactAndFormMode=("")
        refreshContacts();
      }
    } catch (error) {
      console.error(error.message);
      }
    }
  };

  const refreshContacts = async () => {
    try {
      const response = await fetch(`${BASE_DB_URL}contacts.json`);

      if (!response.ok) {
        throw new Error("Il y a eu une erreur lors de la requête GET !");
      }

      const data = await response.json();

      const tmpContacts = [];
      for (const key in data) {
        tmpContacts.push({ id: key, ...data[key] });
      }
      console.log(tmpContacts);
      setContacts(tmpContacts);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    refreshContacts();
  }, []);

  const deleteContactHandler = async (contactId) => {
    if(isLogged){
    if (window.confirm("Etes-vous sûr ?")) {
      const contactFound = contacts.find((contact) => contact.id === contactId);
      if (contactFound) {
        try {
          const token = localStorage.getItem("token");
          if (token) {
            const response = await fetch(
              `${BASE_DB_URL}contacts/${contactId}.json?auth=${token}`,
              {
                method: "DELETE",
              }
            );

            if (!response.ok) {
              throw new Error("Erreur lors de la requête DELETE !");
            }

            setContacts([
              ...contacts.filter((contact) => contact !== contactFound),
            ]);
          }
        } catch (error) {
          console.error(error.message);
          }
        }
      }
    }
  };

  const sortedContacts = () => {
    return contacts.sort((a, b) => a.name - b.name);
  };

  const logOutHandler = () => {
    localStorage.removeItem("token");
    setIsLogged(false);
  };

  const setSelectedContactAndFormMode = ({ contactId, mode }) => {
    console.log(contacts);
    const foundContact = contacts.find((c) => c.id === contactId);
    setSelectedContact(foundContact);
    setModalFormMode(mode);
  };

  const editContactHandler = async (contact) => {
    if(isLogged){
    if (window.confirm("Etes-vous sûr ?")) {
      const { id: contactId, ...values } = contact;
      const contactFound = contacts.find((contact) => contact.id === contactId);
      if (contactFound) {
        try {
          const token = localStorage.getItem("token");
          const newContactValues = {
            ...values,
          };

          if (token) {
            const response = await fetch(
              `${BASE_DB_URL}contacts/${contactId}.json?auth=${token}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(newContactValues),
              }
            );

            if (!response.ok) {
              throw new Error("Erreur lors de la requête PATCH !");
            }

            const data = await response.json();

            console.log(data);

            setContacts([
              ...contacts.filter((contact) => contact !== contactFound),
              newContactValues,
            ]);
          }
        } catch (error) {
          console.error(error.message);
          }
        }
      }
    }
  };

  return (
    <>
      {modalFormMode === "add" &&
        createPortal(
          <ModalComponent closeModal={() => setModalFormMode("")}>
            <div className="col-8 mx-auto text-center">
              <div className="bg-dark text-light rounded p-3">
                <div className="d-flex justify-content-between align-items center ">
                  <button
                    onClick={() => setModalFormMode("")}
                    className="btn btn-outline-light rounded-circle  mx-auto"
                  >
                    <i className="bi bi-x"></i>
                  </button>
                </div>
                <hr />
                <ContactForm
                  mode="add"
                  addContact={addContactHandler}
                  contact={selectedContact}
                />
              </div>
            </div>
          </ModalComponent>,
          document.getElementById("modal-root")
        )}
      {modalFormMode === "edit" &&
        createPortal(
          <ModalComponent closeModal={() => setModalFormMode("")}>
            <div className="col-8 mx-auto text-center">
              <div className="bg-dark text-light rounded p-3">
                <div className="d-flex justify-content-between align-items center ">
                  <button
                    onClick={() => setModalFormMode("")}
                    className="btn btn-outline-light rounded-circle  mx-auto"
                  >
                    <i className="bi bi-x"></i>
                  </button>
                </div>
                <hr />
                <ContactForm
                  mode="edit"
                  editContact={editContactHandler}
                  contact={selectedContact}
                />
              </div>
            </div>
          </ModalComponent>,
          document.getElementById("modal-root")
        )}
      {modalFormMode === "delete" &&
        createPortal(
          <ModalComponent closeModal={() => setModalFormMode("")}>
            <div className="col-8 mx-auto text-center">
              <div className="bg-dark text-light rounded p-3">
                <div className="d-flex justify-content-between align-items center ">
                  <button
                    onClick={() => setModalFormMode("")}
                    className="btn btn-outline-light rounded-circle  mx-auto"
                  >
                    <i className="bi bi-x"></i>
                  </button>
                </div>
                <hr />
                <ContactForm
                  mode="delete"
                  contact={selectedContact}
                  deleteContact={deleteContactHandler}
                />
              </div>
            </div>
          </ModalComponent>,
          document.getElementById("modal-root")
        )}
      <NavBar>
        <button
          className="btn btn-primary"
          onClick={() => (isLogged ? logOutHandler() : setModalVisible(true))}
        >
          {isLogged ? "Déconnexion" : "Connexion"}
        </button>
      </NavBar>
      {modalVisible &&
        createPortal(
          <ModalComponent closeModal={() => setModalVisible(false)}>
            <div className="d-flex justify-content-between align-items center">
              <h3>{isLogging ? "Se connecter" : "S'inscrire"}</h3>
              <button
                onClick={() => setModalVisible(false)}
                className="btn btn-outline-dark rounded-circle"
              >
                <i className="bi bi-x"></i>
              </button>
            </div>
            <hr />
            <form onSubmit={submitFormHandler}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email :{" "}
                </label>
                <input
                  type="text"
                  required
                  ref={emailRef}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password :{" "}
                </label>
                <input
                  type="password"
                  required
                  ref={passwordRef}
                  className="form-control"
                />
              </div>
              <div className="text-end">
                <button
                  type="button"
                  className="btn btn-info me-2"
                  onClick={() => setIsLogging(!isLogging)}
                >
                   Changer vers {isLogging ? "S'inscrire" : "Se connecter"}{/*<span className="hand">☛</span> */}
                </button>
                <button className="btn btn-primary">
                  {isLogging ? "Se connecter" : "S'inscrire"}
                </button>
              </div>
            </form>
          </ModalComponent>,
          document.getElementById("modal-root")
        )}
      <div className="container">
        <div className="row g-2 py-3">
          <div className="col-8 offset-2">
            <div className="bg-dark text-light rounded p-3">
              <div className="d-flex justify-content-between align-items-center">
                <h1>
                  <i className="bi bi-person-lines-fill"></i> Rep_App
                </h1>
                <div>
                  {isLogged && <button
                    className="btn btn-success me-2"
                    onClick={() =>
                      setSelectedContactAndFormMode({ mode: "add" })
                    }
                  >
                    <i className="bi bi-pencil"></i> Ajouter un contact
                  </button>}
                </div>
              </div>
              <hr />
              {contacts.length === 0 ? (
                <p>Il n'y a pas de contacts dans la base de données !</p>
              ) : (
                sortedContacts().map((contact) => (
                  <ContactDisplay
                    key={contact.id}
                    contact={contact}
                    isLogged={isLogged}
                    contacts={sortedContacts()}
                    deleteContact={deleteContactHandler}
                    setSelectedContactAndFormMode={
                      setSelectedContactAndFormMode
                    }
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
