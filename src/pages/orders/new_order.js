import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import MaskedInput from 'react-text-mask';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import { Progress, DatePicker, TimePicker } from 'antd'
import { notification } from 'antd';
import { FormHelperText, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Divider, InputAdornment } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import Alert from '@material-ui/lab/Alert';
import NumberFormat from 'react-number-format';
import firebase from '../../config/firebase';
import moment from 'moment';
import { usStates } from '../../config/usStates';
import { Switch, Button as Btnsss } from 'antd';
import { useCollectionData,useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import AddBrokerForm from '../../components/brokers/AddBrokerForm';
import AddDriverForm from '../../components/drivers/AddDriverForm';
import EditIcon from '@material-ui/icons/Edit';

const Accordion = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles((theme) => ({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
}))(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      marginBottom: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    '&:last-child': {
      marginRight: 0,
    },
    '& > div': {},
  },
}))(MuiAccordionDetails);

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange(values);
      }}
      thousandSeparator
      isNumericString
      prefix="$"
    />
  );
}
function TextMaskCustom(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[
        '(',
        /[1-9]/,
        /\d/,
        /\d/,
        ')',
        ' ',
        /\d/,
        /\d/,
        /\d/,
        '-',
        /\d/,
        /\d/,
        /\d/,
        /\d/,
      ]}
      placeholderChar={'\u2000'}
      showMask
    />
  );
}

TextMaskCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
};

const customerInitialState = {
  email: '',
  address: '',
  city: '',
  contactPerson: '',
  estTime: null,
  estTime2: null,
  name: '',
  phone: '',
  state: '',
  zip: '',
  ext: '',
};
export default function OrderForm({ order, ...props }) {
  const [edit, setEdit] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();
  const query = useMediaQuery('(max-width:768px)');
  const { user } = props;
  const classes = props.classes;
  const usercreateorder = order?.usercreateorder ? order?.usercreateorder : user.name == undefined ? user.displayName : user.name;
  const daws = order?.daws ? order?.daws : new Date();
  const [orderId, setId] = useState(order?.id || '');
  const [weight, setWeight] = useState(order?.weight || null);
  const [temprature, settemprature] = useState(order?.temprature || null);
  const [price, setPrice] = useState(order?.price || null);
  const [description, setDescription] = useState(order?.description || '');
  const [reference, setReference] = useState(order?.reference || '');
  const [po, setPo] = useState(order?.po || '');
  const [notes, setNotes] = useState(order?.notes || '');
  const [Statuss, setStatus] = useState(order?.status || 'New');
  const [time, setTime] = useState(order?.date?.seconds || order?.date || '')
  const [formErorrs, setFormErrors] = useState(false);
  const [toggle, settoggle] = useState(false)
  const [toggle2, settoggle2] = useState(false)

  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("" || order && order?.pdfurl);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState("");

  const [image2, setImage2] = useState(null);
  const [url2, setUrl2] = useState("" || order && order?.pdfurl2);
  const [progress2, setProgress2] = useState(0);
  const [errors2, setErrors2] = useState("");

  const [image3, setImage3] = useState(null);
  const [url3, setUrl3] = useState("" || order && order?.pdfurl3);
  const [progress3, setProgress3] = useState(0);
  const [errors3, setErrors3] = useState("");

  const [add, setAdd] = useState({
    driver: false,
    broker: false,
    customer: true,
  });
  const [alert, setAlert] = useState({
    driver: false,
    broker: false,
    customer: false,
  });

  const [pickup, setPickup] = useState(order?.pickup || customerInitialState);
  var [pickup2, setPickup2] = useState(order?.pickup2 || [Object.assign({}, customerInitialState)]);
  const [delivery, setDelivery] = useState(
    order?.delivery || customerInitialState
  );

  var [delivery2, setdelivery2] = useState(order?.delivery2 || [Object.assign({}, customerInitialState)]);

  const [brokers, loading, error] = useCollectionData(
    firebase.firestore().collection('brokers'),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const openNotification = placement => {
    notification.success({
      message: `Notification ${order ? "Edit order" : "New Order"}`,
      description:
        `Thank you for ${order ? `Edit Order Id ${orderId} Successfully` : `Adding New Order Id ${orderId} Successfully!!`} `,
      placement,
    });
  };
  const openNotification2 = placement => {
    notification.error({
      message: `Notification Error`,
      description:
        `Please Provide all required Input Fields Information Then, Try Again! `,
      placement,
    });
  };
  if (brokers) {
  }

  let [broker, setBroker] = useState(order?.broker || {});


  const [drivers, loading3, error3] = useCollectionData(
    firebase.firestore().collection('drivers')
  );
  const [driver, setDriver] = useState(order?.driver || {});
  const [paymentNotes, setPaymentNotes] = useState('');
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
  const [dryload, setDryload] = useState(false || order?.dryload)
  const [customerss, loading8, error8] = useCollectionData(
    firebase.firestore().collection('customers'));
  const pushToFirestore = (item, name, col) => {
    let id;
    id = `${Math.random() * Math.random() * 6}`
    const firestore = firebase.firestore();
    if (col == 'customers') {
      const filtercustomer = customerss?.filter(el => el.name == name ? true : false)
      const newarrfilter = filtercustomer != undefined && filtercustomer[0]
      if (filtercustomer.length && newarrfilter?.id != undefined) {
        newarrfilter.history.map(el => {
          item.history.push(el)
        })
        item = { ...item, id: newarrfilter?.id }
        firestore.collection(col).doc(newarrfilter?.id).set(item);
      } else if (filtercustomer.length && newarrfilter?.id == undefined) {
        newarrfilter.history.map(el => {
          item.history.push(el)
        })
        item = { ...item, id }
        firestore.collection(col).doc(id).set(item);
      } else if (filtercustomer.length == 0) {
        item = { ...item, id }
        firestore.collection(col).doc(id).set(item);
      }
    }
    if (col == 'drivers') {
      firestore.collection(col).doc(name).set(item);
    } else if (col == 'brokers') {
      firestore.collection(col).doc(name).set(item);
    }
  };
  const pushData = (orderInfo, arr) => {
    var c = 0;
    for (var item of arr) {
      try {
        item.history.push(orderInfo);
      } catch (e) {
        item.history = [orderInfo];
      }
      switch (c) {
        case 0:
          pushToFirestore(item, item.name, 'drivers');
          break;
        case 1:
          pushToFirestore(item, item.name, 'brokers');
          break;
        default:
          pushToFirestore(item, item.name, 'customers');
          break;
      }
      c += 1;
    }
  };
  const orderNotes = order?.orderNotes !== undefined ? order?.orderNotes : []
  const stop = order?.stop !== undefined ? order?.stop : ""
  const dets = order?.dets !== undefined ? order?.dets : []
  const news = order?.news !== undefined ? order?.news : []
  const lumper = order?.lumper !== undefined ? order?.lumper : []
  const pTime = order?.pTime || null;
  const dTime = order?.dTime || null;
  const paidTime = order?.paidTime || null;
  const useremail = order?.useremail || null;
  const paiduser = order?.paiduser || null;
  const deliveruser = order?.deliveruser || null;
  const pdf_Order_1 = order?.pdf_Order_1 || null;
  const pdf_Order_2 = order?.pdf_Order_2 || null;
  const pdf_Order_3 = order?.pdf_Order_3 || null;
  const pdf_uploadUser = order?.pdf_uploadUser || null;
  const invoiced = order?.invoiced || null;
  const invoiceCreated = order?.invoiceCreated || null;
  const invoicedTime = order?.invoicedTime || null;

  const cancelTonuStatus = order?.cancelTonuStatus || null
  const CanceledTonu = order?.CanceledTonu || null
  const CanceledTonuUndo = order?.CanceledTonuUndo || null

  const rempay = order?.removePayment || null
  const remstatus = order?.removePaymentStatus || null

  const newdatass = order
  const validateForm = () => {
    pickup.estTime = pickup.estTime == null ? new Date() : pickup.estTime
    delivery.estTime = delivery.estTime == null ? new Date() : delivery.estTime
    pickup.datn = pickup.estTime == null ? `${new Date().toLocaleDateString()}` : pickup?.estTime?.seconds ? `${new Date(pickup.estTime.seconds * 1000).toLocaleDateString()}`:`${new Date(pickup.estTime).toLocaleDateString()}`
    delivery.datn = delivery.estTime == null ? `${new Date().toLocaleDateString()}` : delivery?.estTime?.seconds ? `${new Date(delivery.estTime.seconds *1000).toLocaleDateString()}`: `${new Date(delivery.estTime).toLocaleDateString()}`
    pickup.datnTime = pickup.estTime2 == null ? null : pickup?.estTime2?.seconds ? `${new Date(pickup.estTime2.seconds * 1000).toLocaleTimeString()}` :  `${new Date(pickup.estTime2).toLocaleTimeString()}`
    delivery.datnTime = delivery.estTime2 == null ? null : delivery?.estTime2?.seconds ? new Date(delivery.estTime2.seconds * 1000).toLocaleTimeString() : `${new Date(delivery.estTime2).toLocaleTimeString()}`
    const order = {
      id: orderId,
      cancelTonuStatus,
      removePayment: rempay,
      removePaymentStatus: remstatus,
      CanceledTonu,
      CanceledTonuUndo,
      status: Statuss,
      statusCode: 0,
      weight,
      temprature,
      price,
      pickup2: toggle === true ? pickup2 : pickup2[0].name !== "" && pickup2[0].estTime !== null ? pickup2 : null,
      delivery2: toggle2 === true ? delivery2 : delivery2[0].name !== "" && delivery2[0].estTime !== null ? delivery2 : null,
      description,
      notes,
      usercreateorder,
      daws,
      po,
      dryload: dryload == undefined ? false : dryload,
      dets,
      news,
      pdfurl: url !== "" ? `${url}` : "",
      pdfurl2: url2 !== "" ? `${url2}` : "",
      pdfurl3: url3 !== "" ? `${url3}` : "",
      pdf_uploadUser,
      pTime,
      dTime,
      invoiced,
      invoiceCreated,
      invoicedTime,
      useremail,
      paiduser,
      pdf_Order_1,
      pdf_Order_2,
      pdf_Order_3,
      deliveruser,
      paidTime,
      stop,
      lumper,
      reference,
      pickup,
      delivery,
      driver,
      orderNotes,
      broker,
      paymentNotes,
      date: time === "" ? new Date() : new Date(time * 1000),
      files: {},
      paymentMethod: '',
    };
    if (user.dispatcher == true) {
      order.dispatcher = { name: user.name, email: user.email };
    } else {
      order.dispatcher = { name: 'Admin', email: user.email };
    }
    const orderInfo = { id: orderId, date: new Date().toLocaleString() };
    if (
      orderId !== undefined &&
      orderId !== '' &&
      driver.name !== '' &&
      broker.name !== '' &&
      pickup.name !== '' &&
      delivery.name !== '' &&
      driver.name !== undefined &&
      broker.name !== undefined &&
      pickup.estTime !== null &&
      delivery.estTime !== null
    ) {
      setFormErrors(false);
      if (newdatass == undefined) {
        pushData(orderInfo, [driver, broker, pickup, delivery]);
      }
      driver.history = [];
      broker.history = [];
      firebase
        .firestore()
        .collection('orders')
        .doc(orderId)
        .set(order)
        .then(() => {
          fetch('/api/order_added', {
            method: 'POST',
            body: JSON.stringify({
              order: order
            }),
          });
          openNotification("bottomRight")
          router.push(`/`);
        });
    } else {
      openNotification2("bottomRight")
    }
  };
  const handleDatePickup = (e) => {
    setPickup({ ...pickup, estTime: e._d })
  }
  const handleDateDelivery = (e) => {
    setDelivery({ ...delivery, estTime: e._d })
  }
  const handleTimePickup = (e) => {
    setPickup({ ...pickup, estTime2: e._d })
  }
  const handleTimeDelivery = (e) => {
    setDelivery({ ...delivery, estTime2: e._d })
  }
  const handlePickup = (event, val = null) => {
    if (val != null) {
      pickup.state = val.toString().toUpperCase();
      setPickup({ ...pickup });
    } else {
      pickup[event.target.name] = event.target.value;
      setPickup({ ...pickup });
    }
  };
  const handlePickup2 = ({ e, newVal = null, index, time }) => {
    if (newVal != null) {
      pickup2[index].state = newVal.toString().toUpperCase();
      setPickup2([...pickup2]);
    } else {
      time == "date" ? pickup2[index].estTime = e._d : pickup2[index].estTime = pickup2[index].estTime;
      time == "time" ? pickup2[index].estTime2 = e._d : pickup2[index].estTime2 = pickup2[index].estTime2;
      time == "date" ? pickup2[index].estTimest = `${new Date(e._d).toLocaleDateString()}` : pickup2[index].estTimest = pickup2[index].estTimest;
      time == "time" ? pickup2[index].estTime2st = `${new Date(e._d).toLocaleTimeString()}` : pickup2[index].estTime2st = pickup2[index].estTime2st;
      time == undefined ? pickup2[index][e?.target?.name] = e?.target?.value : null
      setPickup2([...pickup2]);
    }
  };
  const handleDelivery = (event, val = null) => {
    if (val != null) {
      delivery.state = val.toString().toUpperCase();
      setDelivery({ ...delivery });
    } else {
      delivery[event.target.name] = event.target.value;
      setDelivery({ ...delivery });
    }
  };
  const handleDeleivery2 = ({ e, newVal = null, index, time }) => {
    if (newVal != null) {
      delivery2[index].state = newVal.toString().toUpperCase();
      setdelivery2([...delivery2]);
    } else {
      time == "date" ? delivery2[index].estTime = e._d : delivery2[index].estTime = delivery2[index].estTime;
      time == "time" ? delivery2[index].estTime2 = e._d : delivery2[index].estTime2 = delivery2[index].estTime2;
      time == "date" ? delivery2[index].estTimest = `${new Date(e._d).toLocaleDateString()}` : delivery2[index].estTimest = delivery2[index].estTimest;
      time == "time" ? delivery2[index].estTime2st = `${new Date(e._d).toLocaleTimeString()}` : delivery2[index].estTime2st = delivery2[index].estTime2st;
      time == undefined ? delivery2[index][e?.target?.name] = e?.target?.value : null

      // delivery2[index][e?.target?.name] !== undefined && time == undefined || time !== undefined ?
      //   delivery2[index][e?.target?.name] = e?.target?.value : delivery2[index].estTime = e._d;
      // time !== undefined ? delivery2[index].estTime2 = e._d : null;
      setdelivery2([...delivery2]);
    }
  };

  const handChange = e => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file["type"];
      const validImageTypes = ["application/pdf"];
      if (validImageTypes.includes(fileType)) {
        setErrors("");
        setImage(file);
        setUrl("")
      } else {
        setErrors("Please select an image to upload");
      }
    }
  };

  const handleUpdate = () => {
    if (image) {
      const uploadTask = firebase.storage().ref(`orders/${orderId}`).put(image);
      uploadTask.on(
        "state_changed",
        snapshot => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        error => {
          setErrors(error);
        },
        () => {
          firebase.storage().ref("orders")
            .child(`${orderId}`)
            .getDownloadURL()
            .then(url => {
              setUrl(url);
              setProgress(0);
              setImage('')
            });
        }
      );
    } else {
      setErrors("Error please choose an image to upload");
    }
  };
  useEffect(() => {
    handleUpdate()
  }, [image])



  const handChange2 = e => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file["type"];
      const validImageTypes = ["application/pdf"];
      if (validImageTypes.includes(fileType)) {
        setErrors2("");
        setImage2(file);
        setUrl2("")
      } else {
        setErrors2("Please select an image to upload");
      }
    }
  };

  const handleUpdate2 = () => {
    if (image2) {
      const uploadTask = firebase.storage().ref(`orders/${orderId}second`).put(image2);
      uploadTask.on(
        "state_changed",
        snapshot => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress2(progress);
        },
        error => {
          setErrors2(error);
        },
        () => {
          firebase.storage().ref("orders")
            .child(`${orderId}second`)
            .getDownloadURL()
            .then(url => {
              setUrl2(url);
              setProgress2(0);
              setImage2('')
            });
        }
      );
    } else {
      setErrors2("Error please choose an image to upload");
    }
  };
  useEffect(() => {
    handleUpdate2()
  }, [image2])


  const handChange3 = e => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file["type"];
      const validImageTypes = ["application/pdf"];
      if (validImageTypes.includes(fileType)) {
        setErrors3("");
        setImage3(file);
        setUrl3("")
      } else {
        setErrors3("Please select an image to upload");
      }
    }
  };

  const handleUpdate3 = () => {
    if (image3) {
      const uploadTask = firebase.storage().ref(`orders/${orderId}third`).put(image3);
      uploadTask.on(
        "state_changed",
        snapshot => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress3(progress);
        },
        error => {
          setErrors3(error);
        },
        () => {
          firebase.storage().ref("orders")
            .child(`${orderId}third`)
            .getDownloadURL()
            .then(url => {
              setUrl3(url);
              setProgress3(0);
              setImage3('')
            });
        }
      );
    } else {
      setErrors3("Error please choose an image to upload");
    }
  };
  useEffect(() => {
    handleUpdate3()
  }, [image3])
  const [tog, settog] = useState(false)
  const [tog2, settog2] = useState(false)
  const tempp = [
    { temp: `+1` }, { temp: `+2` }, { temp: `+3` }, { temp: `+4` }, { temp: `+5` }, { temp: `+6` }, { temp: `+7` },
    { temp: `+8` }, { temp: `+9` }, { temp: `+10` }, { temp: `+11` }, { temp: `+12` }, { temp: `+13` }, { temp: `+14` }, { temp: `+15` },
    { temp: `+16` }, { temp: `+17` }, { temp: `+18` }, { temp: `+19` }, { temp: `+20` }, { temp: `+21` }, { temp: `+22` }, { temp: `+23` }, { temp: `+24` }, { temp: `+25` },
    { temp: `+26` }, { temp: `+27` }, { temp: `+28` }, { temp: `+29` }, { temp: `+30` }, { temp: `+31` }, { temp: `+32` }, { temp: `+33` }, { temp: `+34` },
    { temp: `+35` }, { temp: `+36` }, { temp: `+37` }, { temp: `+38` }, { temp: `+39` }, { temp: `+40` }, { temp: `+41` }, { temp: `+42` }, { temp: `+43` },
    { temp: `+44` }, { temp: `+45` }, { temp: `+46` }, { temp: `+47` }, { temp: `+48` }, { temp: `+49` }, { temp: `+50` }, { temp: `+51` }, { temp: `+52` },
    { temp: `+53` }, { temp: `+54` }, { temp: `+55` }, { temp: `+56` }, { temp: `+57` }, { temp: `+58` }, { temp: `+59` }, { temp: `+60` }, { temp: `+61` },
    { temp: `+62` }, { temp: `+63` }, { temp: `+64` }, { temp: `+65` }, { temp: `+66` }, { temp: `+67` }, { temp: `+68` }, { temp: `+69` },
    { temp: `+70` }, { temp: `+71` }, { temp: `+72` }, { temp: `+73` }, { temp: `+74` }, { temp: `+75` }]

  const tempp2 = [{ temp: `-25` }, { temp: `24` }, { temp: `-23` }, { temp: `-22` },
  { temp: `-21` }, { temp: `-20` }, { temp: `-19` }, { temp: `-18` }, { temp: `-17` }, { temp: `-16` }, { temp: `-15` },
  { temp: `-14` }, { temp: `-13` }, { temp: `-12` }, { temp: `-11` }, { temp: `-10` }, { temp: `-9` }, { temp: `-8` },
  { temp: `-7` }, { temp: `-6` }, { temp: `-5` }, { temp: `-4` }, { temp: `-3` }, { temp: `-2` }, { temp: `-1` }]

  function onChange(checked) {
    setDryload(checked);
  }
 

  return (
    <>
      <div style={{ display: 'flex', marginBottom: '0.5em' }}>
        <Typography
          component="h1"
          variant="h5"
          color="primary"
          gutterBottom
          style={{ marginBottom: 0, color: '#3d4052', fontStyle: 'normal', fontWeight: 'bold' }}
        >
          New Order
        </Typography>
      </div>
      <Divider style={{ marginBottom: '0.5em' }} />

      <Paper className={classes.paper} style={{ overflow: 'hidden' }}>
        <Grid container>
          <Grid item xs={12}>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Order Info</Typography>
              </AccordionSummary>
              <AccordionDetails style={query ? { flexDirection: 'row' } : null}>
                <Grid container spacing={1}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label={'Order ID (Required)'}
                      variant={'outlined'}
                      value={orderId}
                      style={{ width: '100%' }}
                      onChange={(event) => setId(event.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      type={'number'}
                      label={'Weight'}
                      variant={'outlined'}
                      style={{ width: '100%' }}
                      value={weight}
                      onChange={(event) => setWeight(event.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">lbs.</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label={'Pickup PO #'}
                      variant={'outlined'}
                      value={reference}
                      style={{ width: '100%' }}
                      onChange={(event) => setReference(event.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label={'Delivery PO #'}
                      variant={'outlined'}
                      style={{ width: '100%' }}
                      value={po}
                      onChange={(event) => setPo(event.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <TextField
                      label={'Order Description'}
                      variant={'outlined'}
                      value={description}
                      fullWidth
                      multiline
                      onChange={(event) => setDescription(event.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <InputLabel style={{ marginBottom: '0.8em' }}>
                      Temperature <span style={{ color: 'black' }}>(Optional)</span>
                    </InputLabel>
                    <Select
                      variant={'outlined'}
                      placeholder="Temperature"
                      value={temprature}
                      renderValue={(item) => `${item} ℉`}
                      fullWidth
                      onChange={(event) => settemprature(event.target.value)}
                    >
                      {tempp2.map(item => (
                        <MenuItem key={item.temp} value={item.temp}>
                          {item.temp} ℉
                        </MenuItem>
                      ))}
                      {tempp.map(item => (
                        <MenuItem key={item.temp} value={item.temp}>
                          {item.temp} ℉
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                  <Grid item xs={10} md={7}>
                    {alert.driver ? (
                      <Alert
                        color={'success'}
                        onClose={() => {
                          setAlert({ ...alert, driver: !alert.driver });
                        }}
                        style={{ margin: '0.5em 0' }}
                      >
                        Driver added!
                      </Alert>
                    ) : null}

                    <InputLabel style={{ marginBottom: '0.8em' }}>
                      Driver <span style={{ color: 'black' }}>(Required)</span>
                    </InputLabel>
                    <Select
                      variant={'outlined'}
                      value={driver}
                      renderValue={(item) => item.name}
                      fullWidth
                      onChange={(event) => setDriver(event.target.value)}
                    >
                      {drivers
                        ?.filter((driver) => driver.username != undefined)
                        .map((item) => (
                          <MenuItem key={item.username} value={item}>
                            {item.username}
                          </MenuItem>
                        ))}
                    </Select>
                  </Grid>
                  <IconButton
                    style={{
                      marginRight: '-0.5em',
                      marginTop: '1.5em',
                      height: '42px',
                    }}
                    aria-label="delete"
                    onClick={() => setAdd({ ...add, driver: !add.driver })}
                  >
                    {add.driver ? <CancelIcon /> : <AddCircleIcon />}
                  </IconButton>
                  {add.driver ? (
                    <AddDriverForm
                      callback={(driver) => {
                        setAdd({ ...add, driver: !add.driver });
                        setAlert({ ...alert, driver: !alert.driver });
                      }}
                    />
                  ) : null}
                  <Grid item xs={12} md={5}>
                    <span style={{ fontWeight: 'bold' }}>Dry Load</span> <Switch defaultChecked={dryload} onChange={onChange} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label={'Driver Notes'}
                      variant={'outlined'}
                      value={notes}
                      fullWidth
                      multiline
                      onChange={(event) => setNotes(event.target.value)}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Pick-up</Typography>
              </AccordionSummary>
              <AccordionDetails
              // style={
              //   query
              //     ? { flexDirection: 'column', flexWrap: 'wrap' }
              //     : { flexWrap: 'wrap' }
              // }
              >
                <Info handleTimePickup={handleTimePickup} resource={pickup} callback={handlePickup} handleDatess={handleDatePickup} />

                {pickup2.map((pickup2, index) => {
                  return (
                    <div style={{ display: toggle ? "" : "none" }}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography>Pick-up {index + 2}</Typography>
                      </AccordionSummary>
                      <Infos
                        key={index}
                        resource={pickup2}
                        index={index}
                        callback={handlePickup2}

                      />
                    </div>
                  );
                })}
                <IconButton
                  style={{ marginRight: "-0.5em" }}
                  aria-label="delete"
                  onClick={() => {
                    settoggle(true)
                    toggle === true &&
                      setPickup2([
                        ...pickup2,
                        Object.assign({}, customerInitialState),
                      ])
                  }}
                >
                  <AddCircleIcon />
                </IconButton>
                <IconButton
                  style={{ marginRight: "-0.5em" }}
                  aria-label="delete"
                  onClick={() => {
                    settoggle(false)
                    setPickup2([
                      Object.assign({}, customerInitialState),
                    ])
                  }}
                >
                  <RemoveCircleIcon />
                </IconButton>
              </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Delivery</Typography>
              </AccordionSummary>
              <AccordionDetails
                style={
                  query
                    ? {
                      borderBottom: '1px solid gainsboro',
                      flexDirection: 'column',
                      flexWrap: 'wrap',
                    }
                    : {
                      borderBottom: '1px solid gainsboro',
                      flexWrap: 'wrap',
                    }
                }
              >
                <Info handleTimePickup={handleTimeDelivery} resource={delivery} callback={handleDelivery} handleDatess={handleDateDelivery} />
                {delivery2.map((delivery2, index) => {
                  return (
                    <div style={{ display: toggle2 ? "" : "none" }}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography>Delivery {index + 2}</Typography>
                      </AccordionSummary>
                      <Infos
                        key={index}
                        resource={delivery2}
                        index={index}
                        callback={handleDeleivery2}
                      />
                    </div>
                  );
                })}
                <IconButton
                  style={{ marginRight: "-0.5em" }}
                  aria-label="delete"
                  onClick={() => {
                    settoggle2(true)
                    toggle2 === true &&
                      setdelivery2([
                        ...delivery2,
                        Object.assign({}, customerInitialState),
                      ])
                  }}
                >
                  <AddCircleIcon />
                </IconButton>
                <IconButton
                  style={{ marginRight: "-0.5em" }}
                  aria-label="delete"
                  onClick={() => {
                    settoggle2(false)
                    setdelivery2([
                      Object.assign({}, customerInitialState),
                    ])
                  }}
                >
                  <RemoveCircleIcon />
                </IconButton>
              </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Broker Info (Required)</Typography>
              </AccordionSummary>
              <AccordionDetails
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  flexDirection: 'column',
                }}
              >
                {alert.broker ? (
                  <Alert
                    color={'success'}
                    onClose={() => {
                      setAlert({ ...alert, broker: !alert.broker });
                    }}
                    style={{ margin: '0.5em 0' }}
                  >
                    Broker added!
                  </Alert>
                ) : null}

                <div style={{ width: '100%', display: 'flex' }}>
                  <Autocomplete
                    id="combo-box-demo"
                    onChange={(event, newVal) => setBroker(newVal)}
                    onInputChange={(event, newVal) => setBroker(newVal)}
                    fullWidth
                    options={brokers}
                    getOptionLabel={(option) =>
                      option.name ? option.name : 'no name'
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        label="Broker"
                        variant="outlined"
                      />
                    )}
                  />
                  {broker?.name ? (
                    <IconButton
                      style={{ marginRight: '-0.5em' }}
                      aria-label="delete"
                      onClick={() => {
                        setAdd({ ...add, broker: false });
                        setEdit(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  ) : null}

                  <IconButton
                    style={{ marginRight: '-0.5em' }}
                    aria-label="delete"
                  >
                    {add.broker || edit ? (
                      <CancelIcon
                        onClick={() => {
                          setAdd({ ...add, broker: false });
                          setEdit(false);
                        }}
                      />
                    ) : (
                        <AddCircleIcon
                          onClick={() => {
                            setAdd({ ...add, broker: true });
                            setEdit(false);
                          }}
                        />
                      )}
                  </IconButton>
                </div>
                {order != undefined && order?.broker.name == broker.name
                  ? `Currently selected: ${broker.name}`
                  : null}

                {broker != {} && broker?.factoring == false ? (
                  <FormHelperText style={{ color: 'red' }}>
                    This broker does not accept factoring
                  </FormHelperText>
                ) : null}
                {broker != {} && broker?.block == true ? (
                  <FormHelperText style={{ color: 'red', fontWeight: 'bold' }}>
                    This broker is not approved
                  </FormHelperText>
                ) : null}
                {add.broker ? (
                  <AddBrokerForm
                    callback={() => {
                      setAdd({ ...add, broker: !add.broker });
                      setAlert({ ...alert, broker: !alert.broker });
                    }}
                  />
                ) : null}
                {edit ? (
                  <AddBrokerForm
                    broker={broker}
                    callback={(broker) => {
                      setAlert({ ...alert, broker: !alert.broker });
                      setEdit(false);
                    }}
                  />
                ) : null}
                {alert.customer ? (
                  <Alert
                    color={'success'}
                    onClose={() => {
                      setAlert({ ...alert, customer: !alert.customer });
                    }}
                    style={{ margin: '0.5em 0' }}
                  >
                    Customer added!
                  </Alert>
                ) : null}
              </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Price</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={1}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      type={'number'}
                      label={'Price'}
                      variant={'outlined'}
                      value={price}
                      style={{ width: '100%' }}
                      onChange={(event) => {
                        setPrice(event.target.value);
                      }}
                    />
                  </Grid>
                  {/* <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      label={'Payment Notes'}
                      variant={'outlined'}
                      value={paymentNotes}
                      multiline
                      onChange={(event) => setPaymentNotes(event.target.value)}
                    />
                  </Grid> */}
                </Grid>
              </AccordionDetails>
            </Accordion>
            <div style={{ paddingLeft: '20px' }}>
              <h3>Attached File <span style={{ color: 'gray', fontSize: '16px' }}>(pdf only)</span></h3>
              {url && url !== "" && url !== "undefined" && <div><a style={{ fontSize: '18px', paddingLeft: '35px' }} href={url} target="_blank">View PDF</a></div>}
              {url2 && url2 !== "" && url2 !== "undefined" && <div><a style={{ fontSize: '18px', paddingLeft: '35px' }} href={url2} target="_blank">View PDF2</a></div>}
              {url3 && url3 !== "" && url3 !== "undefined" && <div><a style={{ fontSize: '18px', paddingLeft: '35px' }} href={url3} target="_blank">View PDF3</a></div>}
              <input type="file" style={{ backgroundColor: 'beige', marginTop: '10px' }} onChange={handChange} />
              {tog === false && (
                <IconButton
                  style={{ marginRight: "-0.5em" }}
                  aria-label="delete"
                  onClick={() => {
                    settog(true)
                  }}
                >
                  <AddCircleIcon />
                </IconButton>
              )}

              {tog === true && <div><input type="file" style={{ backgroundColor: 'beige', margin: '20px 0px' }} onChange={handChange2} />
                {tog === true && tog2 === false && (
                  <IconButton
                    style={{ marginRight: "-0.5em" }}
                    aria-label="delete"
                    onClick={() => {
                      settog2(true)
                    }}
                  >
                    <AddCircleIcon />
                  </IconButton>
                )}
                {tog2 === true && <div><input type="file" style={{ backgroundColor: 'beige' }} onChange={handChange3} /></div>}
              </div>}

            </div>
            {progress !== 0 && <Progress style={{ paddingLeft: '120px' }} type="circle" percent={progress} format={() => progress !== 100 ? progress : 'Done'} />}
            {progress2 !== 0 && <Progress style={{ paddingLeft: '120px' }} type="circle" percent={progress2} format={() => progress2 !== 100 ? progress2 : 'Done'} />}
            {progress3 !== 0 && <Progress style={{ paddingLeft: '120px' }} type="circle" percent={progress3} format={() => progress3 !== 100 ? progress3 : 'Done'} />}

            {formErorrs && (
              <Alert severity="error">Please provide required fields</Alert>
            )}
            <Btnsss
              className="Repairbtnss" type="primary"
              onClick={validateForm}
            >
              Submit
            </Btnsss>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}


function Infos({ resource, callback, index }) {
  const dateFormat = "MM-DD-YYYY";
  const newdataes = resource.estTime === null ? new Date().toLocaleDateString() : new Date(resource?.estTime?.seconds * 1000).toLocaleDateString()
  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12} lg={4}>
          <TextField
            label={"Business Name (Required)"}
            name={"name"}
            variant={"outlined"}
            value={resource.name}
            style={{ width: "100%" }}
            onChange={(e) => callback({ e, index })}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <TextField
            label={"Email"}
            name={"email"}
            variant={"outlined"}
            value={resource.email}
            style={{ width: "100%" }}
            onChange={(e) => callback({ e, index })}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <TextField
            label={"Address"}
            name={"address"}
            variant={"outlined"}
            style={{ width: "100%" }}
            value={resource.address}
            multiline
            onChange={(e) => callback({ e, index })}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <TextField
            label={"City"}
            name="city"
            variant={"outlined"}
            value={resource.city}
            style={{ width: "100%" }}
            onChange={(e) => callback({ e, index })}
          />
        </Grid>
        <Grid item xs={6} lg={2}>
          <Autocomplete
            id="combo-box-demo"
            name="state"
            onChange={(e, newVal) => callback({ e, newVal, index })}
            onInputChange={(e, newVal) => callback({ e, newVal, index })}
            value={resource.state}
            options={usStates}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label="State"
                variant="outlined"
              />
            )}
          />
        </Grid>
        <Grid item xs={6} lg={2}>
          <TextField
            label={"ZIP"}
            name="zip"
            variant={"outlined"}
            value={resource.zip}
            onChange={(e) => callback({ e, index })}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <TextField
            label={"Contact Person"}
            name={"contactPerson"}
            style={{ width: "100%" }}
            variant={"outlined"}
            value={resource.contactPerson}
            onChange={(e) => callback({ e, index })}
          />
        </Grid>
        <Grid item xs={12} lg={2}>
          <TextField
            fullWidth
            label={"Phone"}
            name={"phone"}
            variant={"outlined"}
            value={resource.phone}
            onChange={(e) => callback({ e, index })}
            style={{ marginRight: 8 }}
            InputProps={{ inputComponent: TextMaskCustom }}
          />
        </Grid>
        <Grid item xs={12} lg={2}>
          <TextField
            label={"Ext."}
            name={"ext"}
            variant={"outlined"}
            style={{ width: "100%" }}
            value={resource.ext}
            onChange={(e) => callback({ e, index })}
            defaultValue={"+1"}
          />
        </Grid>
        <Grid item xs={12} lg={2}>
          {/* <TextField
            id="datetime-local"
            label="Est. Time "
            type="datetime-local"
            defaultValue={resource.estTime}
            InputLabelProps={{
              shrink: true,
            }}
            name={"estTime"}
            value={resource.estTime}
            onChange={(e) => callback({ e, index })}
            style={{ width: "100%" }}
          /> */}
          {/* {resource?.estTime?.seconds !== undefined ? <b>{new Date(resource.estTime.seconds * 1000).toLocaleDateString()}</b> : null} */}
          <DatePicker
            defaultValue={moment(newdataes, dateFormat)} format={dateFormat}
            onChange={(e) => callback({ e, index, time: "date" })}
            style={{ width: '100%', height: '60%' }}
            name={'estTime'}
          />
        </Grid>
        <Grid item xs={12} lg={2}>
          {/* <TextField
            id="time"
            type="time"
            label={"Est Time 2"}
            defaultValue={resource.estTime2}
            InputLabelProps={{
              shrink: true,
            }}
            name={"estTime2"}
            value={resource.estTime2}
            onChange={(e) => callback({ e, index })}
            style={{ width: "50%" }}
          /> */}
          {resource?.estTime2?.seconds !== undefined ? <b>{new Date(resource.estTime2.seconds * 1000).toLocaleTimeString()}</b> : null}
          <TimePicker style={{ width: '100%', height: '60%' }} onChange={(e) => callback({ e, index, time: "time" })} />
        </Grid>
      </Grid>
    </>
  );
}

function Info({ resource, callback, handleDatess, handleTimePickup }) {
  const dateFormat = "MM-DD-YYYY";
  const newdataes = resource.estTime === null && resource.estTime2 == null ? new Date().toLocaleDateString() : new Date(resource?.estTime?.seconds * 1000).toLocaleDateString()

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12} lg={4}>
          <TextField
            label={'Business Name (Required)'}
            name={'name'}
            variant={'outlined'}
            value={resource.name}
            style={{ width: '100%' }}
            onChange={callback}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <TextField
            label={'Email'}
            name={'email'}
            variant={'outlined'}
            value={resource.email}
            style={{ width: '100%' }}
            onChange={callback}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <TextField
            label={'Address'}
            name={'address'}
            variant={'outlined'}
            style={{ width: '100%' }}
            value={resource.address}
            multiline
            onChange={callback}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <TextField
            label={'City'}
            name="city"
            variant={'outlined'}
            value={resource.city}
            style={{ width: '100%' }}
            onChange={callback}
          />
        </Grid>
        <Grid item xs={6} lg={2}>
          <Autocomplete
            id="combo-box-demo"
            name="state"
            onChange={(event, newVal) => callback(event, newVal)}
            onInputChange={(event, newVal) => callback(event, newVal)}
            value={resource.state}
            options={usStates}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label="State"
                variant="outlined"
              />
            )}
          />
        </Grid>
        <Grid item xs={6} lg={2}>
          <TextField
            label={'ZIP'}
            name="zip"
            variant={'outlined'}
            value={resource.zip}
            onChange={callback}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <TextField
            label={'Contact Person'}
            name={'contactPerson'}
            style={{ width: '100%' }}
            variant={'outlined'}
            value={resource.contactPerson}
            onChange={callback}
          />
        </Grid>
        <Grid item xs={12} lg={2}>
          <TextField
            fullWidth
            label={'Phone'}
            name={'phone'}
            variant={'outlined'}
            value={resource.phone}
            onChange={callback}
            style={{ marginRight: 8 }}
            InputProps={{ inputComponent: TextMaskCustom }}
          />
        </Grid>
        <Grid item xs={12} lg={2}>
          <TextField
            label={'Ext.'}
            name={'ext'}
            variant={'outlined'}
            style={{ width: '100%' }}
            value={resource.ext}
            onChange={callback}
            defaultValue={'+1'}
          />
        </Grid>
        <Grid item xs={12} lg={2}>

          {/* {resource?.estTime?.seconds !== undefined ? <b>{new Date(resource.estTime.seconds * 1000).toLocaleDateString()}</b> : null} */}
          <DatePicker
            defaultValue={moment(newdataes, dateFormat)} format={dateFormat}
            onChange={handleDatess}
            name={'estTime'}
            style={{ width: '100%', height: '60%' }}
          />
        </Grid>
        <Grid item xs={12} lg={2}>
          {/* <TextField
            id="time"
            type="time"
            label={"Est Time 2"}
            defaultValue={resource.estTime2}
            InputLabelProps={{
              shrink: true,
            }}
            name={"estTime2"}
            value={resource.estTime2}
            onChange={callback}
            style={{ width: "50%",marginLeft:'20px' }}
          /> */}
          {resource?.estTime2?.seconds !== undefined ? <b>{new Date(resource.estTime2.seconds * 1000).toLocaleTimeString()}</b> : null}
          <TimePicker style={{ width: '100%', height: '60%' }} onChange={handleTimePickup} />
        </Grid>
      </Grid>
    </>
  );
}
