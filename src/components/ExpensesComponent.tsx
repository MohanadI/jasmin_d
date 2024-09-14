import { useEffect, useState } from "react";

type Expense = {
  id: number;
  amount: number;
  date: string;
  description: string;
  category: string;
  status: string;
};

const ExpensesComponent = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchExpenses = async () => {
    const response = await fetch("/expenses"); // Adjust this URL if necessary
    const data = await response.json();
    setExpenses(data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleExpenseSubmit = async (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const headers = new Headers();
    headers.append("Authorization", token || "");
    headers.append("Content-Type", "application/json");

    await fetch("/expense", {
      method: "POST",
      headers,
      body: JSON.stringify({ description, amount, date, category, status }),
    });
    fetchExpenses();
    setIsModalOpen(false); // Close the modal
    resetForm(); // Reset the form after submission
  };

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setDate("");
    setCategory("");
    setStatus("");
  };

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.description?.toString().includes(searchQuery) ||
      expense.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCloseModal = () => {
    resetForm(); // Reset the form when the modal is closed
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="expenses-component">
      <h2 className="font-bold mb-2 text-[18px]">قائمة المصروفات</h2>
      <div className="flex flex-row justify-between">
        <input
          type="text"
          placeholder="ابحث باستخدام التصنيف او التاريخ"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded text-sm w-1/3"
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="mb-4 p-2 bg-blue-500 text-white rounded text-sm"
        >
          اضف مصروفات جديدة
        </button>
      </div>
      <div className="overflow-x-auto sm:overflow-x-hidden">
        <table className="table-auto border-separate w-full sm:rounded-lg">
          <thead>
            <tr className="text-center bg-gray-100">
              <th className="py-2 px-4 border-b top-0 bg-white z-10 sticky right-0">
                التصنيف
              </th>
              <th className="py-2 px-4 border-b bg-gray:300">المبلغ</th>
              <th className="py-2 px-4 border-b bg-gray:300">التاريخ</th>
              <th className="py-2 px-4 border-b bg-gray:300">الوصف</th>
              <th className="py-2 px-4 border-b bg-gray:300">الحاله</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length > 0 ? (
              filteredExpenses.map((expense: Expense) => (
                <tr key={expense.id} className="text-center hover:bg-gray-200">
                  <td className="py-2 px-4 border-b top-0 bg-white z-10 sticky right-0">
                    {expense.category}
                  </td>
                  <td className="py-2 px-4 border-b bg-gray:300">
                    {expense.amount}
                  </td>
                  <td className="py-2 px-4 border-b bg-gray:300">
                    {expense.date}
                  </td>
                  <td className="py-2 px-4 border-b bg-gray:300">
                    {expense.description}
                  </td>
                  <td className="py-2 px-4 border-b bg-gray:300">
                    {expense.status === "paid" ? "مدفوع" : "غير مدفوع"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-2 px-4 border-b text-center">
                  لا يوجد مصروفات
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white p-6 rounded shadow-lg w-2/4">
            <h2 className="text-xl mb-4">اضف دفعة جديده</h2>
            <form onSubmit={handleExpenseSubmit}>
              <div className="mb-4">
                <label className="block mb-2">التصنيف</label>
                <input
                  type="text"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">المبلغ</label>
                <input
                  type="text"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">التاريخ</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="p-2 border border-gray-300 text-right rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">الوصف</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="p-2 border border-gray-300 text-right rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">الحاله</label>
                <select
                  required
                  className="p-2 border border-gray-300 rounded w-full"
                  value={status}
                  name="status"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">اختر الحاله</option>
                  <option key="paid" value="paid">
                    مدفوع
                  </option>
                  <option key="unpaid" value="unpaid">
                    غير مدفوع
                  </option>
                </select>
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="p-2 bg-blue-500 text-white rounded"
                >
                  حفظ
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="mr-2 p-2 bg-gray-500 text-white rounded"
                >
                  الغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesComponent;
