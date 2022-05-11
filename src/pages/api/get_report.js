import { addWeeks } from "date-fns/fp";
import excel from "exceljs";
const generateExcel = (reportOrders) => {
  const wb = new excel.Workbook();
  const ws = wb.addWorksheet("Orders");
  ws.columns = [
    { header: "Load ID", key: "id", width: 10 },
    { header: "Date", key: "date", width:  10},
    { header: "Broker", key: "brname", width: 10 },
    { header: "Driver", key: "drname", width: 10 },
    { header: "Load Info", key: "description", width: 10 },
    { header: "Pickup Address", key: "paddress", width: 10 },
    { header: "Pickup City", key: "pcity", width: 10 },
    { header: "Pickup State", key: "pstate", width: 10 },
    { header: "Pickup Zip", key: "pzip" },
    { header: "Pickeup Time", key: "ptimes", width: 10 },
    { header: "Delivery Address", key: "daddress", width: 10 },
    { header: "Delivery City", key: "dcity", width: 10 },
    { header: "Delivery State", key: "dstate", width: 10 },
    { header: "Delivery ZIP", key: "dzip", width: 10 },
    { header: "Delivery Time", key: "dtimes", width: 10 },
    { header: "Payment Notes", key: "paymentNotes", width: 10 },
    { header: "Payment Method", key: "paymentMethod", width: 10 },
    { header: "Price", key: "price", width: 10 },
    { header: "Detention Price", key: "detentionPay", width: 10 },
    { header: "Layover Price", key: "Layoverprice", width: 10 },
    { header: "Lumper Price", key: "Lumperprice", width: 10 },
    { header: "Dispatcher", key: "diname", width: 10 },
    { header: "Dispatcher Note", key: "dinote", width: 10 },
    { header: "Invoiced", key: "invoiced", width: 10 },
    // { header: "Order Notes", key: "Notes", width: 20 },
    { header: "Order Detention", key: "detention", width: 10 },
    { header: "Lumper Notes", key: "LumperNotes", width: 10 },
    { header: "Order Layover", key: "layover", width: 10 },
    { header: "Status", key: "status" },
  ];

  var total = 0;
  var detentiontotal = 0;
  var layovers = 0;
  var Lumperfee = 0;
  var orders = reportOrders?.map((order) => {
    const { pickup, delivery, driver, dispatcher, broker, date, price,news,dets,orderNotes,lumper,tonuVal } = order;
    let aa;
    let ab;
    let lump;
    let a = news?.forEach(element => aa = element.layprice)
    dets?.forEach(element => ab = element.price)
    lumper?.forEach(element => lump = element.lumperprice)
    const p = pickup;
    const d = delivery;
    let tprice = tonuVal !== undefined && tonuVal
    tprice = tprice == 0 ? parseFloat(price) : tonuVal
    // tprice =  dets === undefined || ab === undefined ? parseFloat(tprice) : parseFloat(tprice) + parseFloat(ab)
    // tprice =  lumper === undefined || lump === undefined ? parseFloat(tprice) : parseFloat(tprice) + parseFloat(lump)
    total = total +  parseFloat(tprice);
    detentiontotal = ab === undefined ? detentiontotal :  detentiontotal +  parseFloat(ab);
    layovers = aa === undefined ? layovers :  layovers +  parseFloat(aa);
    Lumperfee = lump === undefined ? Lumperfee :  Lumperfee +  parseFloat(lump);
    let arr = news?.map(item => item.desc)
    const desc = arr?.join()
    let arr2 = dets?.map(item => item.item)
    const desc2 = arr2?.join()
    // const no = orderNotes?.map(el => el !== undefined ? el.orderNotes : "")
    // const asss = no?.join()
    const ll = lumper?.map(el => el !== []  && el !== undefined ? el.desc : "")
    const aw = ll?.join()
    ab = ab !== undefined ? parseFloat(ab)?.toFixed(2) : null
    lump = lump !== undefined ? parseFloat(lump)?.toFixed(2) : null
    aa = aa !== undefined ? parseFloat(aa)?.toFixed(2) : null
    return {
      ...order,
      brname: broker.name,
      date: new Date(date?.seconds * 1000).toLocaleDateString(),
      price: `$${tprice}` ,
      drname: driver.name,
      paddress: p.address,
      pcity: p.city,
      pstate: p.state,
      pzip: p.zip,
      daddress: d.address,
      dcity: d.city,
      dstate: d.state,
      dzip: d.zip,
      layover: desc,
      detention: desc2,
      // Notes: asss,
      LumperNotes: aw,
      detentionPay: ab,
      Lumperprice: lump,
      Layoverprice: aa,
      diname: dispatcher?.name,
      dinote: dispatcher?.note,
      dtimes: new Date(d.estTime).toLocaleDateString(),
      ptimes: new Date(p.estTime).toLocaleDateString()
    };
  });
  ws.addRows(orders);
  ws.addRow({ price: `$${total.toFixed(2)}`,detentionPay: `$${detentiontotal.toFixed(2)}`,Lumperprice: `$${Lumperfee.toFixed(2)}`,Layoverprice: `$${layovers.toFixed(2)}`});
  return wb;
};
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
}
export default async (req, res) => {
  const { reportOrders } =  req.body;
  const excel =  generateExcel(reportOrders);
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "attachment; filename=" + "report.xlsx");
  excel.xlsx.write(res).then(() => res.status(200).end()).catch((err) => console.log(err));
};

