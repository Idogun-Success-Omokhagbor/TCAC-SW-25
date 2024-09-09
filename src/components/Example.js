import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logout, selectUser, selectIsAuthenticated, selectAuthError, clearError } from '../slices/authSlice';

const AuthComponent = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authError = useSelector(selectAuthError);

  const handleLogin = (email, password) => {
    dispatch(loginUser({ email, password }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user.name}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <form onSubmit={(e) => e.preventDefault() && handleLogin(email, password)}>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="submit">Login</button>
          {authError && <p>{authError}</p>}
        </form>
      )}
    </div>
  );
};

export default AuthComponent;
