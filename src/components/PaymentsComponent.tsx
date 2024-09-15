import { useState, useEffect } from "react";
import { generateInvoicePDF } from "../utils/pdfUtils";
import { supabase } from "../api/supabaseClient";

type Payment = {
  id: number;
  apartment: number;
  amount: number;
  date: string;
  description: string;
  status: string;
};

const PaymentsComponent = () => {
  const [apartment, setApartment] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const resetForm = () => {
    setApartment("");
    setAmount("");
    setDate("");
    setDescription("");
    setStatus("");
  };

  const fetchPayments = async () => {
    const { data, error } = await supabase.from("payments").select("*"); // You can customize the columns if necessary

    if (error) {
      console.error("Error fetching payments:", error.message);
      return;
    }

    setPayments(data); // Set the payments data to state
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handlePaymentSubmit = async (e: any) => {
    e.preventDefault();

    const { error } = await supabase
      .from("payments")
      .insert([{ apartment, amount, date, description, status }]);

    if (error) {
      console.error("Error submitting payment:", error.message);
      return;
    }

    fetchPayments();
    resetForm();
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    resetForm(); // Reset the form when the modal is closed
    setIsModalOpen(false); // Close the modal
  };

  const getMonthOptions = () => {
    const currentYear = new Date().getFullYear();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return monthNames.map((month, index) => {
      const value = `${month}-${currentYear}`;
      return (
        <option key={index} value={value}>
          {value}
        </option>
      );
    });
  };

  const filteredPayments = payments.filter(
    (payment) =>
      payment.apartment?.toString().includes(searchQuery) ||
      payment.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeletePayment = async (paymentId: number) => {
    const { error } = await supabase
      .from("payments")
      .delete()
      .eq("id", paymentId); // Delete the record where the id matches

    if (error) {
      console.error("Error deleting payment:", error.message);
      return;
    }

    fetchPayments(); // Refresh the payments list after deletion
  };

  return (
    <div className="payment-component">
      <h2 className="font-bold mb-2 text-[18px]">قائمة الفواتير</h2>
      <div className="flex flex-row justify-between">
        <input
          type="text"
          placeholder="ابحث باستخدام رقم الشقة أو الوصف"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded text-sm w-1/3"
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="mb-4 p-2 bg-blue-500 text-white rounded text-sm"
        >
          اضف دفعة جديدة
        </button>
      </div>

      <div className="overflow-x-auto sm:overflow-x-hidden">
        <table className="table-auto border-separate w-full sm:rounded-lg">
          <thead>
            <tr className="text-center bg-gray-100">
              <th className="py-2 px-4 border-b top-0 bg-white z-10 sticky right-0">
                رقم الشقة
              </th>
              <th className="py-2 px-4 border-b bg-gray:300">المبلغ</th>
              <th className="py-2 px-4 border-b bg-gray:300">التاريخ</th>
              <th className="py-2 px-4 border-b bg-gray:300">الوصف</th>
              <th className="py-2 px-4 border-b bg-gray:300">الحاله</th>
              <th className="py-2 px-4 border-b bg-gray:300">خيارات </th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment: Payment) => (
                <tr key={payment.id} className="text-center hover:bg-gray-200">
                  <td className="py-2 px-4 border-b top-0 bg-white z-10 sticky right-0">
                    {payment.apartment}
                  </td>
                  <td className="py-2 px-4 border-b bg-gray:300">
                    {payment.amount}
                  </td>
                  <td className="py-2 px-4 border-b bg-gray:300">
                    {payment.date}
                  </td>
                  <td className="py-2 px-4 border-b bg-gray:300">
                    {payment.description}
                  </td>
                  <td className="py-2 px-4 border-b bg-gray:300">
                    {payment.status === "paid" ? "مدفوع" : "غير مدفوع"}
                  </td>
                  <td className="py-2 px-4 border-b bg-gray:300">
                    <button
                      className="text-blue-500"
                      onClick={() => generateInvoicePDF(payment)}
                    >
                      <img
                        alt="download"
                        src="./src/assets/download.svg"
                        className="mx-auto h-6 w-auto"
                      />
                    </button>
                    <button
                      className="text-blue-500"
                      onClick={() => handleDeletePayment(payment.id)}
                    >
                      <img
                        alt="delete"
                        src="./src/assets/delete.svg"
                        className="mx-auto h-6 w-auto"
                      />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-2 px-4 border-b text-center">
                  لا يوجد مدفوعات
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
            <form onSubmit={handlePaymentSubmit}>
              <div className="mb-4">
                <label className="block mb-2">رقم الشقة</label>
                <input
                  type="text"
                  required
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
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
                <select
                  value={description}
                  required
                  onChange={(e) => setDescription(e.target.value)}
                  className="p-2 border border-gray-300 rounded w-full"
                >
                  <option value="">اختر الشهر</option>
                  {getMonthOptions()}
                </select>
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

export default PaymentsComponent;
