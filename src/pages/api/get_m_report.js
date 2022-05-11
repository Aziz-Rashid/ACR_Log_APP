import excel from "exceljs";
const generateExcel = (reportOrders) => {
  const wb = new excel.Workbook();
  const ws = wb.addWorksheet("Repair Records");
  ws.columns = [
    { header: "Unit ID", key: "unit", width: 15 },
    { header: "Date", key: "date", width: 10 },
    { header: "Year", key: "year", width: 15 },
    { header: "Make", key: "make", width: 10 },
    { header: "Model", key: "modle", width: 20 },
    { header: "Unit Mileage", key: "mileage", width: 20 },
    { header: "Repair Date", key: "rdate", width: 20 },
    { header: "Doing Repairings", key: "repair", width: 20 },
    { header: "Repair Note", key: "note", width: 25 },
    { header: "Parts", key: "parts", width: 25 },
    { header: "Notes", key: "notes", width: 25 },
    { header: "Status", key: "status", width: 25 },
  ];

  var orders = reportOrders?.map((order) => {
    const { Repair, createdDate, notes, parts, repairdate, repairnotes, status, vehicle } = order;
    const a = Repair?.map(el => el)
    const b = a?.join()
    const c = notes?.map(el => `${el.value} ${el.user}`)
    const d = c?.join()
    return {
      ...order,
      unit: vehicle.vinNumber,
      date: new Date(createdDate?.seconds * 1000).toLocaleDateString(),
      year: vehicle.year,
      make: vehicle.make,
      modle: vehicle.modle,
      mileage: vehicle.milage,
      rdate: new Date(repairdate?.seconds * 1000).toLocaleDateString(),
      repair: b,
      note: repairnotes == null ? "Repair Notes Not Added For this Repair" : repairnotes,
      parts: parts == null ? "Parts Not Added For this Repair" : parts,
      notes: d,
      status: status,
    };
  });
  ws.addRows(orders);
  return wb;
};

export default async (req, res) => {
  const { reportOrders } = req.body;
  const excel = generateExcel(reportOrders);
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "attachment; filename=" + "report.xlsx");
  excel.xlsx.write(res).then(() => res.status(200).end()).catch((err) => console.log(err));
};
