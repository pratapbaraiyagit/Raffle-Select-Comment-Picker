import { setupToken } from '../Helper/AuthTokenHelper';
import { Navigate } from 'react-router-dom';

const ProtectedRoutes = ({ children }) => {
  const Token = setupToken();

  if (Token == false) {
    return <Navigate to="/" replace={true} />;
  } else {
    return <children.type {...children.props} />;
  }
};

export default ProtectedRoutes;
