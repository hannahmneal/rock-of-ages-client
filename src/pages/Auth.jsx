import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthForm } from "../components/AuthForm";
import { USER_NOT_FOUND_FEEDBACK, USER_EXISTS_FEEDBACK } from "../constants"

export const Auth = () => {
  const apiUrl = import.meta.env.VITE_API_URL
  const navigate = useNavigate()
  const [showAlert, setShowAlert] = useState(false)
  const [loginFormSelected, setLoginFormSelected] = useState(true)
  const [alertFeedback, setAlertFeedback] = useState(null)
  const [email, setEmail] = useState(undefined)
  const [password, setPassword] = useState(undefined)
  const [firstName, setFirstName] = useState(undefined)
  const [lastName, setLastName] = useState(undefined)

  const buildAuthRequestBody = () => ({
    email,
    password,
    ...(loginFormSelected === "register" && {
      first_name: firstName,
      last_name: lastName,

    })
  })

  const handleAuth = (e) => {
    e.preventDefault()
    console.log({ email, password, mode: loginFormSelected ? "login" : "register" });

    const endpoint = () => loginFormSelected === "login" ? "login" : "register"

      fetch(`${apiUrl}/${endpoint()}`, {
        method: "POST",
        body: JSON.stringify(buildAuthRequestBody()),
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => res.json())
      .then((authInfo) => {
        if (authInfo.valid || (authInfo.valid && authInfo.token)) {
          localStorage.setItem("rock_token", JSON.stringify(authInfo))
          navigate("/")
        }
        else {
          setShowAlert(true)
          if (loginFormSelected === "login") {
            setAlertFeedback(`User with email ${email} does not exist. Please register.`)
          }
          else {
            setAlertFeedback(`A user with the email ${email} already exists. Please log in.`)
          }
        }
      })
  }

  return(
    <main
      style={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <AuthForm
        handleAuth={handleAuth}
        loginFormSelected={loginFormSelected}
        setLoginFormSelected={setLoginFormSelected}
        email={email}
        setEmail={setEmail}
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        password={password}
        setPassword={setPassword}
      />
      {showAlert && (
        <p>{alertFeedback}</p>
      )}
    </main>
  );
}
