type Payment = {
  id: number;
  apartment: number;
  amount: number;
  date: string;
  description: string;
  status: string;
};

export const generateInvoicePDF = async (payment: Payment) => {
  try {
    // Dynamically import pdfMake and vfs_fonts
    var pdfMake = (await import("pdfmake/build/pdfmake")).default;
    var pdfFonts = (await import("pdfmake/build/vfs_fonts")).default;
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const docDefinition: any = {
      pageSize: "A4",
      pageOrientation: "portrait",
      content: [
        {
          text: "Jasmin D - Payment Invoice",
          style: "header",
          alignment: "center",
          margin: [0, 0, 0, 20],
        },
        {
          text: `Invoice Details`,
          style: "subheader",
          margin: [0, 10, 0, 15],
        },
        {
          columns: [
            {
              width: "50%",
              text: `Apartment Number: ${payment.apartment}`,
              style: "detailLabel",
            },
            {
              width: "50%",
              text: `Date: ${payment.date}`,
              style: "detailValue",
              alignment: "right",
            },
          ],
        },
        {
          columns: [
            {
              width: "50%",
              text: `Amount: ${payment.amount}`,
              style: "detailLabel",
            },
            {
              width: "50%",
              text: `Status: ${
                payment.status === "paid" ? "Paid" : "Not Paid"
              }`,
              style: "detailValue",
              alignment: "right",
            },
          ],
          margin: [0, 10, 0, 20],
        },
        {
          text: `Description:`,
          style: "subheader",
          margin: [0, 10, 0, 5],
        },
        {
          text: `Payment for - ${payment.description}`,
          style: "descriptionText",
          margin: [0, 0, 0, 20],
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: 515,
              y2: 0,
              lineWidth: 1,
              lineColor: "#E0E0E0",
            },
          ],
          margin: [0, 10, 0, 10],
        },
        {
          text: "Thank you for your payment!",
          style: "footer",
          alignment: "center",
          margin: [0, 10, 0, 0],
        },
      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true,
          color: "#4CAF50",
        },
        subheader: {
          fontSize: 16,
          bold: true,
          color: "#3B3B3B",
          decoration: "underline",
        },
        detailLabel: {
          fontSize: 14,
          bold: true,
          color: "#4CAF50",
        },
        detailValue: {
          fontSize: 14,
          color: "#333333",
        },
        descriptionText: {
          fontSize: 12,
          italics: true,
          color: "#555555",
        },
        footer: {
          fontSize: 12,
          italics: true,
          color: "#4CAF50",
        },
      },
    };

    // Create and download the PDF
    pdfMake
      .createPdf(docDefinition)
      .download(`invoice-${payment.apartment}-${payment.date}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};
