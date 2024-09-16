// InvoicePage.tsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "./api/supabaseClient";
import { generateInvoicePDF } from "./utils/pdfUtils";


type Payment = {
  id: number;
  apartment: number;
  amount: number;
  date: string;
  description: string;
  status: string;
};

const InvoicePage = () => {
  const { apartment, description } = useParams<{
    apartment: string;
    description: string;
  }>();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayment = async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("apartment", parseInt(apartment!))
        .eq("description", description)
        .single();

      if (error) {
        console.error("Error fetching payment:", error.message);
      } else {
        setPayment(data);
      }
      setLoading(false);
    };

    fetchPayment();
  }, [apartment, description]);

  const handleDownload = () => {
    if (payment) {
      generateInvoicePDF(payment);
    }
  };

  if (loading) {
    return <div>جاري التحميل...</div>; // "Loading..." in Arabic
  }

  if (!payment) {
    return <div>لم يتم العثور على الفاتورة لهذه الشقة والوصف المحدد.</div>; // "Invoice not found for the specified apartment and description."
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-2 py-12 lg:px-8 w-2/3 m-auto">
      <h1 className="text-center mt-20">
        فاتورة الشقة رقم {payment.apartment}
      </h1>
      <button
        onClick={handleDownload}
        className="p-2 bg-blue-500 text-white rounded mt-5"
      >
        تحميل الفاتورة
      </button>
      <Link to="/" className="p-2 text-blue-500 rounded mt-5">
        العوده الى الصفحه الرئيسية
      </Link>
    </div>
  );
};

export default InvoicePage;
