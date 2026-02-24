import React from 'react'
import ReactDOM from 'react-dom/client'
import { ApplicationViews } from './components/ApplicationViews'
import './index.css'
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// -3 darker: #030303 // primary.dark
// -2 darker: #070707
// -1 shade darker: #111111
// primary.main: #1B1B1B
// +1 shade lighter: #252525
// +2 shades lighter: #2f2f2f
// +3 lighter: #383838
// +4 lighter: #424242
// +5 lighter: #4c4c4c // primary.light
// +6 lighter: #565656
// +7 lighter: #606060
// +8 lighter: #696969
// +9 lighter: #737373
// +10 lighter: #7d7d7d

const theme = createTheme({
  palette: {
    action: { active: "#21C3AC"},
    common: {
      black: "#030303", lightOrange: "#fff8e2", orange: "#FDB85F", darkOrange: "#F06213", gray: "#59585D", white: "#E8E8E8", lightGray: "#A6A6A6", lightGreen: "#77736f", offwhite: "#f3fadd", shadowPrimaryLight: "#aeaeae", shadowPrimaryDark: "#030303" },
    background: { default: "#252525", paper: "#1B1B1B" }, // paper and p.main are the same by intent
    primary: { main: "#1B1B1B", light: "#424242", dark: "#030303" },
    // light mode: primary: { main: "#E8E8E8", light: "#F0F0F0", dark: "#D7D7D7" },
    secondary: { main: "#21C3AC", dark: "#2C8B6A" },  // another option for dark: "#204242"
    // light mode: background: { default: "#F6F6F6" },
    success: { main: "#7c4a96", light: "#D99EE5", dark: "#602884" },
    error: { main: "#FDB85F", light: "#EADDA8", dark: "#F06213"},
    // text: { primary: "#E8E8E8", secondary: "#D7D7D7" },
    text: { primary: "#696969", secondary: "#7d7d7d" },
    // light mode: text: { primary: "", secondary: "" }
  },
  typography: {
    fontFamily: " 'Overpass', sans-serif",
    h1: { fontSize: "2rem", fontWeight: 800 },
    h2: { fontSize: "1.5rem", fontWeight: 600 },
    h3: { fontSize: "1.25rem", fontWeight: 400 },
    body1: { fontSize: "1rem" },
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <React.StrictMode>
        <ApplicationViews />
      </React.StrictMode>
  </ThemeProvider>
)
