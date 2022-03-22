import React, { useState, useMemo, useEffect} from 'react';
import './Router.scss';
import {
  Route,
  Routes
} from "react-router-dom";


function Router() {

  const [user, setUser] = useState(null);

  const value = useMemo( () =>
  ({user, setUser}), [user, setUser]);

  return (
    <div id="main">
      <Routes>
      </Routes>
    </div>
  );
}

export default Router;