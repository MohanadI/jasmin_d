import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { generateInvoicePDF } from "./utils/pdfUtils";
import { supabase } from "./api/supabaseClient";

type Payment = {
  id: number;
  apartment: number;
  amount: number;
  date: string;
  description: string;
  status: string;
};

function App() {
  const [apartment, setApartment] = useState("");
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePaymentSearch = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("apartment", parseInt(apartment));

    if (error) {
      console.error("Error searching payments:", error.message);
      return;
    }
    setIsLoading(false);
    setHasSearched(true);
    setFilteredPayments(data);
  };

  useEffect(() => {
    setFilteredPayments([]);
    setHasSearched(false);
  }, [apartment]);
  
  const monthToArabicOutput = (input: string) => {
    const [month, year] = input.split("-");
    const monthNames: { [key: string]: string } = {
      January: "01",
      February: "02",
      March: "03",
      April: "04",
      May: "05",
      June: "06",
      July: "07",
      August: "08",
      September: "09",
      October: "10",
      November: "11",
      December: "12",
    };

    return `عن شهر ${monthNames[month]}-${year}`;
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-2 py-12 lg:px-8">
      <h1 className="text-3xl font-bold text-center underline">الياسمين د</h1>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="jasmin_d"
            src="./mark.svg"
            className="mx-auto h-14 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            شاشة الفواتير
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handlePaymentSearch} className="space-y-6">
            <div>
              <label
                htmlFor="apartment_number"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                رقم الشقة
              </label>
              <div className="mt-2">
                <input
                  id="apartment_number"
                  name="apartment_number"
                  type="number"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                افحص الفواتير
                {isLoading && <img className="mr-2" src="./loader.svg" />}
              </button>
            </div>
          </form>
        </div>

        {filteredPayments.length > 0 && (
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <h3 className="text-xl font-bold text-center">قائمة المدفوعات</h3>
            <ul className="mt-4 space-y-2">
              {filteredPayments.map((payment: any) => (
                <li
                  key={payment.id}
                  className="border p-2 rounded-md columns-2"
                  style={
                    payment.status === "paid"
                      ? { backgroundColor: "#eeffef" }
                      : { backgroundColor: "#ffe3e1" }
                  }
                >
                  <p>المبلغ: {payment.amount} &#8362;</p>
                  <p>التاريخ: {payment.date}</p>
                  <p>
                    تحميل الفاتوره:{" "}
                    <button
                      className="text-blue-500 align-middle"
                      onClick={() => generateInvoicePDF(payment)}
                    >
                      <img
                        alt="download"
                        src="./download.svg"
                        className="mx-auto h-6 w-auto"
                      />
                    </button>
                  </p>
                  <p>الوصف: {monthToArabicOutput(payment.description)}</p>
                  <p>
                    الحاله: {payment.status === "paid" ? "مدفوع" : "غير مدفوع"}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
        {hasSearched && filteredPayments.length === 0 && (
          <h3 className="p-12 text-center bg-slate-100 mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
            {/* No Results Founds */}
            لا يوجد فواتير
          </h3>
        )}
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm text-center">
          <Link to="/admin" className="text-indigo-600 hover:text-indigo-500">
            تسجيل الدخول كمسؤول
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;
