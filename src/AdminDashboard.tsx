import { useState } from "react";
import PaymentsComponent from "./components/PaymentsComponent";
import ExpensesComponent from "./components/ExpensesComponent";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./Providers/AuthProvider";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("payments");
  const navigate = useNavigate();
  const { logoutCallback } = useAuth();

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };
  const handleLogout = async () => {
    await fetch("/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    localStorage.removeItem("token");
    logoutCallback();
    navigate("/admin");
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
        <img
          alt="Your Company"
          src="./src/assets/mark.svg"
          className="mx-auto h-10 w-auto"
        />
        <h1 className="font-bold mb-2 text-[26px] lg:text-2xl 4xl:text-[26px]">
          الياسمين د - لوحة التحكم
        </h1>
        <button
          className="bg-red-300 mb-4 p-1 rounded text-white text-xs w-32"
          onClick={handleLogout}
        >
          تسجيل خروج
        </button>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mt-4 mb-6">
        <button
          className={`p-2 text-sm font-bold border-b-2 ${
            activeTab === "payments"
              ? "border-blue-500 text-blue-500"
              : "border-transparent text-gray-600"
          } mx-4 focus:outline-none`}
          onClick={() => handleTabClick("payments")}
        >
          الفواتير
        </button>
        <button
          className={`p-2 text-sm font-bold border-b-2 ${
            activeTab === "expenses"
              ? "border-blue-500 text-blue-500"
              : "border-transparent text-gray-600"
          } mx-4 focus:outline-none`}
          onClick={() => handleTabClick("expenses")}
        >
          المصروفات
        </button>
      </div>

      {/* Content */}
      <div className="mt-4">
        {activeTab === "payments" && <PaymentsComponent />}
        {activeTab === "expenses" && <ExpensesComponent />}
      </div>
    </div>
  );
};

export default AdminDashboard;
