import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLogged, setLogged] = useState(false);
  const [userName, setUserName] = useState("");

useEffect(() => {
  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    setLogged(!!token);
    setUserName(name || "");
  };
  checkLoginStatus();
  window.addEventListener("userLoggedIn", checkLoginStatus);
  window.addEventListener("userLoggedOut", checkLoginStatus);
  return () => {
    window.removeEventListener("userLoggedIn", checkLoginStatus);
    window.removeEventListener("userLoggedOut", checkLoginStatus);
  };
}, []);


const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("name");
  window.dispatchEvent(new Event("userLoggedOut")); // 👈 Notify logout
  setLogged(false);
  setUserName("");
  navigate("/login");
};


  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">JWT Auth</h1>
      <div className="flex items-center gap-4">
        {isLogged && <span className="font-medium">Hi, {userName}</span>}

        {!isLogged ? (
          <>
            <button onClick={() => navigate("/register")} className="hover:underline">Register</button>
            <button onClick={() => navigate("/login")} className="hover:underline">Login</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate("/forgot")} className="hover:underline">Update Password</button>
            <button onClick={handleLogout} className="bg-red-500 px-4 py-1 rounded hover:bg-red-600">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
