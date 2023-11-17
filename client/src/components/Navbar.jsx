import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { ButtonLink } from "./ui/ButtonLink";

export function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  console.log(isAuthenticated, user)

  return (
    <nav className="bg-zinc-700 my-3 py-5 px-10 rounded-lg flex justify-between items-center">
      <h1 className="text-2xl font-bold">
        <Link to={isAuthenticated ? "/tasks" : "/"}>Gestor de Tareas</Link>
      </h1>
      <div className="flex flex-grow items-center justify-center"> {/* Utiliza flex-grow y justify-center para centrar */}
        {isAuthenticated && (
          <div className="text-center">
            Welcome {user.username}
          </div>
        )}
      </div>
      <ul className="flex gap-x-2">
        {isAuthenticated ? (
          <>
            {/* <li>
              <ButtonLink to="/add-task">Add Task</ButtonLink>
            </li> */}
            <li className="bg-indigo-500 px-4 py-1 rounded-md">
              <Link to="/" onClick={() => logout()}>
                Logout
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <ButtonLink to="/login">Login</ButtonLink>
            </li>
            <li>
              <ButtonLink to="/register">Register</ButtonLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
