import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import CorporateSecurityPage from "./pages/security/corporate/index";
import PersonSecurityPage from "./pages/security/person/index";
import CorporateCapital from "./pages/capital/corporate/index";
import PersonCapital from "./pages/capital/person/index";

import CorporateSecurityOpen from "./pages/security/corporate/open";
import CorporateSecurityMakeup from "./pages/security/corporate/makeup";
import CorporateSecurityLoss from "./pages/security/corporate/loss";
import CorporateSecurityCancel from "./pages/security/corporate/cancel";

import PersonSecurityOpen from "./pages/security/person/open";
import PersonSecurityMakeup from "./pages/security/person/makeup";
import PersonSecurityLoss from "./pages/security/person/loss";
import PersonSecurityCancel from "./pages/security/person/cancel";


export default function App() {
  return (
    <Router >
      <div>
        {/* A <Routes> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/users" element={<Users />} />

          <Route path="/security/corporate" element={<CorporateSecurityPage />} />
          <Route path="/security/corporate/open" element={<CorporateSecurityOpen />} />
          <Route path="/security/corporate/loss" element={<CorporateSecurityLoss />} />
          <Route path="/security/corporate/cancel" element={<CorporateSecurityCancel />} />
          <Route path="/security/corporate/makeup" element={<CorporateSecurityMakeup />} />


          <Route path="/security/person" element={<PersonSecurityPage />} />
          <Route path="/security/person/open" element={<PersonSecurityOpen />} />
          <Route path="/security/person/loss" element={<PersonSecurityLoss />} />
          <Route path="/security/person/cancel" element={<PersonSecurityCancel />} />
          <Route path="/security/person/makeup" element={<PersonSecurityMakeup />} />

          <Route path="/capital/corporate" element={<CorporateCapital />} />
          <Route path="/capital/person" element={<PersonCapital />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <h2>Here is Home</h2>
  )
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}






