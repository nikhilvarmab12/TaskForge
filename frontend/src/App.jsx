import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import Activity from "./pages/Activity";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>
<Route
  path="/activity"
  element={
    <ProtectedRoute>
      <Activity />
    </ProtectedRoute>
  }
/>
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route
  path="/reset-password"
  element={<ResetPassword />}
/>
      </Routes>

    </BrowserRouter>
  );
}

export default App;