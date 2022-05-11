var express = require('express')
var app = express()
const excel = require("exceljs")
var cors = require('cors')
const bodyParser = require('body-parser');

app.use(cors())
app.use(bodyParser.json({
  limit: '50mb'
}));

app.use(bodyParser.urlencoded({
  limit: '50mb',
  parameterLimit: 100000,
  extended: true
}));


const generateExcel = (reportOrders) => {
  const wb = new excel.Workbook();
  const ws = wb.addWorksheet("Orders");
  ws.columns = [
    { header: "Load ID", key: "id", width: 10 },
    { header: "Date", key: "date", width: 10 },
    { header: "Broker", key: "brname", width: 10 },
    { header: "Driver", key: "drname", width: 10 },
    // { header: "Load Info", key: "description", width: 10 },
    { header: "Pickup Address", key: "paddress", width: 10 },
    { header: "Pickup City", key: "pcity", width: 10 },
    { header: "Pickup State", key: "pstate", width: 10 },
    { header: "Pickup Zip", key: "pzip" },
    { header: "Pickeup Time", key: "ptimes", width: 10 },
    { header: "Pickeup Stops", key: "pstop", width: 10 },
    { header: "Delivery Stops", key: "dstop", width: 10 },
    { header: "Total Stops", key: "tstop", width: 10 },
    { header: "Delivery Address", key: "daddress", width: 10 },
    { header: "Delivery City", key: "dcity", width: 10 },
    { header: "Delivery State", key: "dstate", width: 10 },
    { header: "Delivery ZIP", key: "dzip", width: 10 },
    { header: "Delivery Time", key: "dtimes", width: 10 },
    // { header: "Payment Notes", key: "paymentNotes", width: 10 },
    // { header: "Payment Method", key: "paymentMethod", width: 10 },
    { header: "Price", key: "price", width: 10 },
    { header: "Tonu", key: "tonu", width: 10 },
    { header: "Detention Price", key: "detentionPay", width: 10 },
    { header: "Layover Price", key: "Layoverprice", width: 10 },
    { header: "Lumper Price", key: "Lumperprice", width: 10 },
    { header: "Dispatcher", key: "diname", width: 10 },
    { header: "Dispatcher Note", key: "dinote", width: 10 },
    { header: "Invoiced", key: "invoiced", width: 10 },
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
    const { pickup,pickup2,delivery2, delivery, driver, dispatcher, broker, date, price, news, dets, lumper, tonuVal } = order;
    
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
    total = total + parseFloat(tprice);
    detentiontotal = ab === undefined ? detentiontotal : detentiontotal + parseFloat(ab);
    layovers = aa === undefined ? layovers : layovers + parseFloat(aa);
    Lumperfee = lump === undefined ? Lumperfee : Lumperfee + parseFloat(lump);
    let arr = news?.map(item => item.desc)
    const desc = arr?.join()
    let arr2 = dets?.map(item => item.item)
    const desc2 = arr2?.join()
    const ll = lumper?.map(el => el !== [] && el !== undefined ? el.desc : "")
    const aw = ll?.join()
    ab = ab !== undefined ? parseFloat(ab)?.toFixed(2) : null
    lump = lump !== undefined ? parseFloat(lump)?.toFixed(2) : null
    aa = aa !== undefined ? parseFloat(aa)?.toFixed(2) : null

    return {
      ...order,
      brname: broker.name,
      date: new Date(date?.seconds * 1000).toLocaleDateString(),
      price: `$${tprice}`,
      drname: driver.name,
      paddress: p.address,
      pcity: p.city,
      pstate: p.state,
      pzip: p.zip,
      daddress: d.address,
      dcity: d.city,
      dstate: d.state,
      dzip: d.zip,
      tonu: tonuVal !== undefined ? tonuVal : null,
      layover: desc,
      detention: desc2,
      LumperNotes: aw,
      detentionPay: ab,
      pstop:pickup2?.length,
      dstop:delivery2?.length,
      tstop: pickup2 != null && delivery2 != null ? pickup2?.length + delivery2?.length : pickup2 != null && delivery2 == null ? pickup2.length + 0 :pickup2 == null && delivery2 != null ? delivery2.length + 0 : null,
      Lumperprice: lump,
      Layoverprice: aa,
      diname: dispatcher?.name,
      dinote: dispatcher?.note,
      dtimes: d?.estTime?.seconds ? new Date(d.estTime.seconds * 1000).toLocaleDateString():new Date(d.estTime).toLocaleDateString(),
      ptimes: p?.estTime?.seconds ? new Date(p.estTime.seconds * 1000).toLocaleDateString() :new Date(p.estTime).toLocaleDateString()
    };
  });
  ws.addRows(orders);
  ws.addRow({ price: `$${total.toFixed(2)}`, detentionPay: `$${detentiontotal.toFixed(2)}`, Lumperprice: `$${Lumperfee.toFixed(2)}`, Layoverprice: `$${layovers.toFixed(2)}` });
  return wb;
};

app.post('/new', async function (req, res) {
  const { reportOrders } = req.body;
  const excel = generateExcel(reportOrders);
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "attachment; filename=" + "report.xlsx");
  excel.xlsx.write(res).then(() => res.status(200).end()).catch((err) => console.log(err));

})

let port = process.env.PORT || 8090;
app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});
