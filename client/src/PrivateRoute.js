import React from "react";
import { Redirect, Route } from "react-router";
import { useAuth } from "./contexts/AuthContext";

export default function PrivateRoute({ component: Component, ...rest }) {
  const { currentUser } = useAuth();
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!currentUser) {
          return <Redirect to="/login" />;
        } else {
          return <Component {...props} />;
        }
      }}
    ></Route>
  );
}
