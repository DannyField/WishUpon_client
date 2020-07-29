import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./Home";
import Signup from "./SignUp";
import Login from "./Login";
import NoMatch from "./NoMatch";
import Wishes from "./Wishes";
import Wish from "./Wish";
import CreateWish from "./CreateWish";
import EditWish from "./EditWish";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "./Dashboard";
import Navbar from "../shared/Navbar";
import "../stylesheets/App.scss";
import Room from "../shared/Room";
import About from "./About";


class App extends React.Component {
  
  render() {
    return (
      <>
        <Navbar />
        <Switch>
          <ProtectedRoute exact path="/dashboard" component={Dashboard} />
          <ProtectedRoute exact path="/wishes/create" component={CreateWish} />
          <ProtectedRoute exact path="/wishes/:id/edit" component={EditWish} />
          <Route exact path="/wishes/:id" component={Wish} />
          <ProtectedRoute exact path="/wishes" component={Wishes} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/sign-up" component={Signup} />
          <Route exact path="/" component={Home} />
          <Route exact path="/room" component={Room} />
          <Route exact path="/about" component={About} />
          <Route component={NoMatch} />
        </Switch>
        {/* <Footer /> */}
      </>
    );
  }
}

export default App;
