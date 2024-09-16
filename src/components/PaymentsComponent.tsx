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
  const [searchDescription, setSearchDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<Payment | null>(null);

  const resetForm = () => {
    setApartment("");
    setAmount("");
    setDate("");
    setDescription("");
    setStatus("");
    setCurrentPayment(null);
  };

  const fetchPayments = async () => {
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Error fetching payments:", error.message);
      return;
    }

    setPayments(data);
  };

  const handlePaymentSearch = async () => {
    if (searchDescription === "" && searchQuery === "") return;

    try {
      let query = supabase.from("payments").select("*");

      if (searchQuery !== "") {
        query = query.eq("apartment", parseInt(searchQuery));
      }

      if (searchDescription !== "") {
        query = query.eq("description", searchDescription);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error searching payments:", error.message);
        return;
      }

      setPayments(data);
    } catch (err) {
      console.error("An unexpected error occurred:", err);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handlePaymentSubmit = async (e: any) => {
    e.preventDefault();

    const paymentData = {
      apartment: parseInt(apartment),
      amount: parseFloat(amount),
      date,
      description,
      status,
    };

    let error;

    if (currentPayment) {
      // **Update existing payment**
      const { error: updateError } = await supabase
        .from("payments")
        .update(paymentData)
        .eq("id", currentPayment.id);

      error = updateError;
    } else {
      // **Insert new payment**
      const { error: insertError } = await supabase
        .from("payments")
        .insert([paymentData]);

      error = insertError;
    }

    if (error) {
      console.error("Error submitting payment:", error.message);
      return;
    }

    fetchPayments();
    resetForm();
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  const handleEditPayment = (payment: Payment) => {
    setApartment(payment.apartment.toString());
    setAmount(payment.amount.toString());
    setDate(payment.date);
    setDescription(payment.description);
    setStatus(payment.status);
    setCurrentPayment(payment);
    setIsModalOpen(true);
  };

  // Updated handleDeletePayment function with confirmation
  const handleDeletePayment = async (paymentId: number) => {
    const confirmed = window.confirm("هل أنت متأكد أنك تريد حذف هذه الدفعة؟");
    if (!confirmed) return;

    const { error } = await supabase
      .from("payments")
      .delete()
      .eq("id", paymentId);

    if (error) {
      console.error("Error deleting payment:", error.message);
      return;
    }

    fetchPayments();
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

  const handleCreateMonthlyInvoices = async () => {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString("default", {
      month: "long",
    });
    const currentYear = currentDate.getFullYear();
    const currentDescription = `${currentMonth}-${currentYear}`;

    // **Check if invoices for the current month already exist**
    const { data: existingInvoices, error } = await supabase
      .from("payments")
      .select("*")
      .eq("description", currentDescription);

    if (error) {
      console.error("Error checking existing invoices:", error.message);
      return;
    }

    if (existingInvoices && existingInvoices.length > 0) {
      alert("الفواتير لهذا الشهر موجودة بالفعل.");
      return;
    }

    const apartments = [
      "101",
      "102",
      "103",
      "201",
      "202",
      "203",
      "301",
      "302",
      "303",
      "401",
      "402",
      "403",
      "501",
      "502",
      "503",
      "601",
    ];
    const defaultAmount = 100; // **Set the default amount**

    // **Prepare the invoices data**
    const invoices = apartments.map((apt) => ({
      apartment: apt,
      amount: defaultAmount,
      date: currentDate.toISOString().split("T")[0],
      description: currentDescription,
      status: "unpaid",
    }));

    // **Insert the invoices**
    const { error: insertError } = await supabase
      .from("payments")
      .insert(invoices);

    if (insertError) {
      console.error("Error creating invoices:", insertError.message);
      return;
    }

    alert("تم إنشاء الفواتير بنجاح لجميع الشقق.");
    fetchPayments();
  };

  return (
    <div className="payment-component">
      <h2 className="font-bold mb-2 text-[18px]">قائمة الفواتير</h2>
      <div className="grid grid-cols-3 grid-flow-col gap-2">
        <div className="">
          <input
            type="text"
            placeholder="ابحث باستخدام رقم الشقة"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4 p-2 border border-gray-300 rounded text-sm w-full"
          />
        </div>
        <div className="">
          <select
            value={searchDescription}
            required
            onChange={(e) => setSearchDescription(e.target.value)}
            className="p-2 border border-gray-300 rounded text-xs w-full"
          >
            <option value="">اختر الشهر</option>
            {getMonthOptions()}
          </select>
        </div>
        <div>
          <button
            className="mb-4 p-2 bg-blue-700 text-white rounded text-sm w-20"
            onClick={handlePaymentSearch}
          >
            ابحث
          </button>
          <button
            className="mb-4 mr-4 p-2 bg-gray-800 text-white rounded text-sm w-20"
            onClick={() => {
              fetchPayments();
              setSearchQuery("");
              setSearchDescription("");
            }}
          >
            اعاده ضبط
          </button>
        </div>
      </div>
      <button
        onClick={handleCreateMonthlyInvoices}
        className="mb-4 p-2 bg-gray-500 text-white rounded text-sm"
      >
        اصدار فواتير شهريه
      </button>
      <button
        onClick={() => {
          resetForm();
          setIsModalOpen(true);
        }}
        className="mb-4 p-2 bg-blue-500 text-white rounded text-sm mr-5"
      >
        اضف دفعة جديدة
      </button>

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
            {payments.length > 0
              ? payments.map((payment: Payment) => (
                  <tr
                    key={payment.id}
                    className="text-center hover:bg-gray-200"
                  >
                    <td className="py-2 px-4 border-b top-0 bg-white z-10 sticky right-0">
                      {payment.apartment}
                    </td>
                    <td className="py-2 px-4 border-b bg-gray:300">
                      {payment.amount} &#8362;
                    </td>
                    <td className="py-2 px-4 border-b bg-gray:300">
                      {payment.date}
                    </td>
                    <td className="py-2 px-4 border-b bg-gray:300">
                      {payment.description}
                    </td>
                    <td className="py-2 px-4 border-b bg-gray:300">
                      {payment.status !== "paid" ? (
                        <h4 className="bg-red-800 text-white">غير مدفوع</h4>
                      ) : (
                        <h4 className="bg-green-800 text-white">مدفوع</h4>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b bg-gray:300 flex justify-center space-x-2">
                      <button
                        className="text-blue-500 ml-2"
                        onClick={() => generateInvoicePDF(payment)}
                      >
                        <img
                          alt="download"
                          src="./download.svg"
                          className="mx-auto h-6 w-auto"
                        />
                      </button>
                      <button
                        className="text-blue-500"
                        onClick={() => handleEditPayment(payment)}
                      >
                        <img
                          alt="edit"
                          src="./edit.svg"
                          className="mx-auto h-6 w-auto"
                        />
                      </button>
                      <button
                        className="text-blue-500"
                        onClick={() => handleDeletePayment(payment.id)}
                      >
                        <img
                          alt="delete"
                          src="./delete.svg"
                          className="mx-auto h-6 w-auto"
                        />
                      </button>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
      {payments.length === 0 && (
        <h3 className="p-12 text-center bg-slate-100"> لا يوجد فواتير</h3>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white p-6 rounded shadow-lg md:w-2/4 w-full mr-2 ml-2">
            <h2 className="text-xl mb-4">
              {currentPayment ? "تعديل الدفعة" : "اضف دفعة جديده"}
            </h2>
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
                  {currentPayment ? "تحديث" : "حفظ"}
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
