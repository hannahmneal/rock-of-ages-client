import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthForm } from "../components/AuthForm";
import { USER_NOT_FOUND_FEEDBACK, USER_EXISTS_FEEDBACK } from "../constants"
import { useTheme } from "@mui/material";

export const Auth = () => {
  const theme = useTheme()
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
    ...(loginFormSelected === false && {
      first_name: firstName,
      last_name: lastName,

    })
  })

  const handleAuth = (e) => {
    e.preventDefault()
    console.log({ email, password, mode: loginFormSelected ? "login" : "register" });

    let endpoint;
    if (loginFormSelected === true) {
      endpoint = "login"
    }
    if (!loginFormSelected) {
      endpoint = "register"
    }
    console.log(`endpoint: ${endpoint}`);

      fetch(`${apiUrl}/${endpoint}`, {
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
          if (loginFormSelected === true) {
            setAlertFeedback(`404: Not Found.\nUser with email ${email} does not exist. Please register.`)
          }
          else {
            setAlertFeedback(`409: Conflict.\nA user with the email ${email} already exists. Please log in.`)
          }
        }
      })
  }

  return(
    <main
      style={{
        alignItems: 'center',
        display: 'flex',
        height: '100vh',
        justifyContent: 'center',
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
      >
        {showAlert && (
          <h3 style={{ color: theme.palette.error.dark}}>{alertFeedback}</h3>
        )}
      </AuthForm>
    </main>
  );
}
