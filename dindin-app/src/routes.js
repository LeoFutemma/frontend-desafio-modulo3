import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { getLocalStorage } from "./utils/storage";
import SignUp from "./pages/SignUp/index";
import SignIn from "./pages/SignIn/index";
import Main from "./pages/Main/index";

const PrivateRoute = ({ component: Component }) => {
  const token = getLocalStorage("token");
  return token ? Component : <Navigate to="/sign-in" />;
};

const MyRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/" element={<PrivateRoute component={<Main />} />} />
      </Routes>
    </Router>
  );
};

export default MyRoutes;
