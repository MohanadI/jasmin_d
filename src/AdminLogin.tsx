import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./Providers/AuthProvider";
import { supabase } from "./api/supabaseClient";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const navigate = useNavigate();
  const { loginCallback } = useAuth();

  const handleLogin = async (e:any) => {
    e.preventDefault();
    const { data } = await supabase.auth.signInWithPassword({
      email: username,
      password: password,
    });
    if (data.user) {
      localStorage.setItem("token", data.session.access_token);
      loginCallback();
      navigate("/admin-dashboard"); // Redirect to the admin dashboard
    } else {
      setErrors("خطأ في اسم المستخدم أو كلمة المرور");
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Link to={"/"}>
          <img
            alt="Your Company"
            src="./mark.svg"
            className="mx-auto h-10 w-auto"
          />
        </Link>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              اسم المستخدم
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="email"
                className="block w-full rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                كلمة المرور
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="block w-full rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            {errors && <div className="text-red-500 text-sm">{errors}</div>}
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              دخول كمسؤول
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
