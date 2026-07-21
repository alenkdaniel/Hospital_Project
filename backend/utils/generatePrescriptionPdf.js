import PDFDocument from "pdfkit";

// ======================================
// GENERATE PRESCRIPTION PDF
// ======================================

const generatePrescriptionPdf = async (appointment) => {
  const doc = new PDFDocument({
    margin: 50,
    size: "A4",
  });

  // ======================================
  // STORE PDF BUFFER
  // ======================================

  const buffers = [];

  doc.on("data", (chunk) => {
    buffers.push(chunk);
  });

  return new Promise((resolve, reject) => {

    doc.on("end", () => {
  resolve(Buffer.concat(buffers));
});

doc.on("error", (error) => {
  reject(error);
});

// ======================================
// HOSPITAL HEADER
// ======================================

doc
  .fontSize(22)
  .font("Helvetica-Bold")
  .text(appointment.hospital.name, {
    align: "center",
  });

doc.moveDown();

doc
  .fontSize(11)
  .font("Helvetica")
  .text(`Address : ${appointment.hospital.address || "-"}`);

doc.text(`Generated On : ${new Date().toLocaleDateString()}`);

doc.moveDown(2);

// ======================================
// APPOINTMENT DETAILS
// ======================================

doc
  .fontSize(11)
  .font("Helvetica");

doc.text(
  `Appointment No : ${appointment.booking.appointmentNumber}`
);

doc.text(
  `Appointment Date : ${new Date(
    appointment.appointmentDate
  ).toLocaleDateString()}`
);

doc.moveDown();

// ======================================
// PATIENT DETAILS
// ======================================

doc
  .fontSize(16)
  .font("Helvetica-Bold")
  .text("Patient Details");

doc.moveDown(0.5);

doc
  .fontSize(12)
  .font("Helvetica");

doc.text(`Name : ${appointment.patient.name}`);

doc.text(`Phone : ${appointment.patient.phone}`);

doc.text(`Gender : ${appointment.patient.gender}`);

doc.moveDown();
// ======================================
// DOCTOR DETAILS
// ======================================

doc
  .fontSize(16)
  .font("Helvetica-Bold")
  .text("Doctor Details");

doc.moveDown(0.5);

doc
  .fontSize(12)
  .font("Helvetica");

doc.text(`Doctor : Dr. ${appointment.doctor.name}`);

doc.text(
  `Specialization : ${appointment.doctor.specialization}`
);

doc.moveDown();


// ======================================
// DIAGNOSIS
// ======================================

doc
  .fontSize(16)
  .font("Helvetica-Bold")
  .text("Diagnosis");

doc.moveDown(0.5);

doc
  .fontSize(12)
  .font("Helvetica")
  .text(
    appointment.consultation.diagnosis || "No diagnosis provided"
  );

doc.moveDown();

// ======================================
// MEDICINES
// ======================================

doc
  .fontSize(16)
  .font("Helvetica-Bold")
  .text("Medicines");

doc.moveDown();

if (appointment.consultation.medicines.length === 0) {

  doc
    .fontSize(12)
    .font("Helvetica")
    .text("No medicines prescribed");

  doc.moveDown();

} else {

  const tableTop = doc.y;

  const col1 = 50;
  const col2 = 220;
  const col3 = 320;
  const col4 = 440;

  doc
    .fontSize(11)
    .font("Helvetica-Bold");

  doc.text("Medicine", col1, tableTop);
  doc.text("Dosage", col2, tableTop);
  doc.text("Frequency", col3, tableTop);
  doc.text("Duration", col4, tableTop);

  doc
    .moveTo(50, tableTop + 18)
    .lineTo(550, tableTop + 18)
    .stroke();

  let y = tableTop + 28;

  doc.font("Helvetica");

  appointment.consultation.medicines.forEach((item) => {

    doc.text(item.medicine?.name || "-", col1, y);

    doc.text(item.dosage || "-", col2, y);

    doc.text(item.frequency || "-", col3, y);

    doc.text(item.duration || "-", col4, y);

    y += 22;
  });

  doc.moveDown(3);
}

// ======================================
// MEDICAL TESTS
// ======================================

doc
  .fontSize(16)
  .font("Helvetica-Bold")
  .text("Medical Tests");

doc.moveDown();

if (appointment.consultation.tests.length === 0) {

  doc
    .fontSize(12)
    .font("Helvetica")
    .text("No medical tests recommended");

  doc.moveDown();

} else {

  const testTop = doc.y;

  doc
    .fontSize(11)
    .font("Helvetica-Bold");

  doc.text("Medical Test", 50, testTop);

  doc.text("Status", 330, testTop);

  doc
    .moveTo(50, testTop + 18)
    .lineTo(550, testTop + 18)
    .stroke();

  let testY = testTop + 28;

  doc.font("Helvetica");

  appointment.consultation.tests.forEach((item) => {

    doc.text(
      item.test?.name || "-",
      50,
      testY
    );

    doc.text(
      item.status,
      330,
      testY
    );

    testY += 22;
  });

  doc.moveDown(3);
}

// ======================================
// REMARKS
// ======================================

doc
  .fontSize(16)
  .font("Helvetica-Bold")
  .text("Remarks");

doc.moveDown(0.5);

doc
  .fontSize(12)
  .font("Helvetica")
  .text(
    appointment.consultation.remarks || "No remarks"
  );

doc.moveDown();

// ======================================
// FOLLOW-UP
// ======================================

doc
  .fontSize(16)
  .font("Helvetica-Bold")
  .text("Follow-up");

doc.moveDown(0.5);

doc
  .fontSize(12)
  .font("Helvetica")
  .text(
    appointment.consultation.followUpDate
      ? new Date(
          appointment.consultation.followUpDate
        ).toLocaleDateString()
      : "Not Required"
  );

doc.moveDown(2);

// ======================================
// SIGNATURE
// ======================================

doc
  .fontSize(16)
  .font("Helvetica-Bold")
  .text("Doctor");

doc.moveDown();

doc
  .fontSize(12)
  .font("Helvetica")
  .text(`Dr. ${appointment.doctor.name}`);

doc.text(
  appointment.doctor.specialization
);

doc.moveDown();

doc.text(
  "______________________________"
);

doc.text("Doctor Signature");

doc.moveDown();

doc
  .fontSize(10)
  .fillColor("gray")
  .text(
    "This prescription was generated electronically by the Healthcare Management System.",
    {
      align: "center",
    }
  );

doc.fillColor("black");

// ======================================
// FINISH PDF
// ======================================

doc.end();
    
  });
};

export default generatePrescriptionPdf;