import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./Login";
import "./App.css";
import Signup from "./Signup";
import Home from "./Home";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./PrivateRoute";
import { AppProvider } from "./contexts/AppContext";
import Profile from "./Profile";
import Logout from "./Logout";

const THEME = createMuiTheme({
  typography: {
    fontFamily: "Poppins",
  },
  palette: {
    primary: {
      main: "#71c9ce",
    },
  },
});

function App() {
  return (
    <Router>
      <div className="app">
        <ThemeProvider theme={THEME}>
          <AuthProvider>
            <Switch>
              <Route exact path="/" component={Login} />
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />
              <Route path="/logout" component={Logout} /> 
              <AppProvider>
                <PrivateRoute path="/home" component={Home} />
                <PrivateRoute path="/profile" component={Profile} />
              </AppProvider>
            </Switch>
          </AuthProvider>
        </ThemeProvider>
      </div>
    </Router>
  );
}

export default App;
