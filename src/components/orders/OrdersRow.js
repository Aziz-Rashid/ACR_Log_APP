import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { notification } from 'antd';
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import Details from './OrderRowDetails';
import { useRouter } from 'next/router';
import { Modal } from 'antd';
import { useAuthState } from "react-firebase-hooks/auth";
import { WarningOutlined } from '@ant-design/icons';
import { useTheme } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import MoreIcon from '@material-ui/icons/MoreHoriz';
import TextField from '@material-ui/core/TextField';
import { Divider, Popover } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import firebase, { auth } from '../../config/firebase';
import { Dialog, Select, MenuItem, DialogContent, DialogActions, Button, InputLabel } from '@material-ui/core';
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';
import { html } from '../../config/invoice.js';
import Handlebars from 'handlebars';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { Progress, Input, Radio } from 'antd'

const { confirm } = Modal;

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={1}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}
export function Row({ order_id, archeive, rowObj, deleteCallback, level, refresh, deletorder }) {
  const [user, loading, error] = useAuthState(auth);
  const [row, setRow] = React.useState(rowObj);
  const display = query ? 'block' : 'flex';
  const mTop = () => {
    if (order_id) return '-46px';
    else return '-37px';
  };
  const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: 'white',
      flexGrow: 1,
      position: 'relative',
    },
    fab2: {
      position: '',
      float: 'right',
      marginBottom: 25,
    },
    alert: {
      margin: '0.5em 0',
    },
    fab: {
      width: 'fit-content',
      float: 'right',
      marginTop: mTop(),
      paddingRight: 13,
      '&>*': {
        fontWeight: 530,
      },
    },
    dialog: {
      padding: 8,
    },
    label: {
      marginBottom: 4,
    },
  }));
  const useRowStyles = makeStyles({
    root: {
      position: 'relative',
      '& > *': {
        borderBottom: 'unset',
      },
    },
    div: { marginTop: '0!important' },
    inline: { display: 'inline' },
    th: {
      display: display,
      alignItems: 'center',
      paddingRight: 40,
      justifyContent: 'flex-start',
      '& > *': {
        marginRight: 8,
      },
      '& > div': {
        marginTop: 1,
      },
    },
    chipContainer: {
      width: '90%',
      display: 'flex',
      '& > *': {
        marginRight: 8,
      },
    },
    New: {
      color: 'white',
      backgroundColor: 'turquoise',
    },
    Loaded: {
      backgroundColor: 'yellow',
    },
    Paid: {
      color: 'white',
      backgroundColor: '#0cdc0c',
    },
    Delivered: {
      color: 'white',
      backgroundColor: '#3f51b5',
    },
    Det: {
      color: 'white',
      backgroundColor: '#d60f0f',
    },
    Notes: {
      color: 'white',
      backgroundColor: '#d6860f',
    },
    price: {
      color: 'white',
      backgroundColor: 'blue',
    },
    driver: {
      color: 'white',
      backgroundColor: 'darkcyan',
    },
    route: { color: 'black', backgroundColor: 'aliceblue' },
    broker: {},
  });
  const [openAcc, setOpenAc] = React.useState(false);
  const classes = useRowStyles();
  const [btnRef, setBtn] = React.useState(null);
  const router = useRouter();
  const archive = router.pathname.includes('archive');
  var col;
  if (archive) col = 'archive';
  else col = 'orders';
  const classes2 = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [edit, setEdit] = React.useState(false);
  const [alert, setAlert] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [method, setMethod] = React.useState('');
  const [method2, setMethod2] = React.useState('');
  const [notes2, setnotes2] = React.useState('')
  const [partiallyPaid, setPartiallyPaid] = React.useState('')
  const [driverss, loading2, error2] = useCollectionDataOnce(
    firebase.firestore().collection("drivers")
  );
  const [userss, loadissng, errossr] = useAuthState(auth);
  const newfilterdata = driverss?.filter(e => {
    if (e.email === userss.email) {
      return true
    }
  })
  const methods = [
    'Cash',
    'Check',
    'Factoring Company',
    'Comcheck',
    'Credit Card',
    'Direct Deposit',
    'Other',
  ];
  const [notes, setNotes] = React.useState(row?.paymentNotes);
  const [del, setDel] = React.useState(0);
  const [layoverDescription, setLayoverDescription] = React.useState('')
  const [lumperDesc, setLumperDesc] = React.useState('Paid by Driver')
  const [lumperPrice, setLumperPrice] = React.useState(0)
  const [itemDescription, setItemDescription] = React.useState('');
  const [itemPrice, setItemPrice] = React.useState(0);
  const [itemHours, setItemHours] = React.useState(0);
  const [layoverPrice, setLayoverPrice] = React.useState(0)
  const [tonu, setTonu] = React.useState(false);
  const [stops, setStops] = React.useState(false);
  const detailsRef = React.createRef();
  var fnstateObj = row;
  const query = useMediaQuery('(max-width:532px)');
  const isMobile = useMediaQuery('(max-width:700px)');


  const handleChangeIndex = (index) => {
    setValue(index);
  };
  const customerInitialState = {
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    userEmail: user?.email
  };
  const [notesDialog, setNotesDialog] = React.useState(false);
  const [orderNotes, setOrderNotes] = React.useState('');

  const [modalOpen2, setModalOpen2] = React.useState(false)
  const [cancelTonyNotes2, setcancelTonyNotes2] = React.useState('');

  const cenceledtonot2 =
  {
    UndoNotes: cancelTonyNotes2,
    date: new Date(),
    userEmail: user?.name == undefined ? user?.displayName : user?.name
  }

  const CenceledTonu2 = () => {
    if (cancelTonyNotes2 != '') {
      var o = row;
      o.CanceledTonuUndo = cenceledtonot2;
      o.cancelTonuStatus = false;
      firebase
        .firestore()
        .collection('orders')
        .doc(row?.id)
        .set(o)
        .then(() => {
          setModalOpen2(false);
          setcancelTonyNotes2('')
        });
    }
  }


  const [modalOpen, setModalOpen] = React.useState(false)
  const [cancelTonyNotes, setcancelTonyNotes] = React.useState('');

  const cenceledtonot =
  {
    cencelNotes: cancelTonyNotes,
    date: new Date(),
    userEmail: user?.name == undefined ? user?.displayName : user?.name
  }

  const CenceledTonu = () => {
    if (cancelTonyNotes != '') {
      var o = row;
      o.CanceledTonu = cenceledtonot;
      o.cancelTonuStatus = true;
      firebase
        .firestore()
        .collection('orders')
        .doc(row?.id)
        .set(o)
        .then(() => {
          setModalOpen(false);
          setcancelTonyNotes('')
        });
    }
  }

  const jjs =
  {
    orderNotes,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    userEmail: user?.name == undefined ? user?.displayName : user?.name
  }


  const handleNotes = () => {
    var o = row;
    o.orderNotes = row?.orderNotes === undefined ? [jjs] : [jjs, ...row?.orderNotes];
    firebase
      .firestore()
      .collection('orders')
      .doc(row?.id)
      .set(o)
      .then(() => {
        setNotesDialog(false);
        setOrderNotes('')
      });

  };
  const handleNotesbilling = () => {
    var o = row;
    o.orderNotes = row?.orderNotes === undefined ? [jjs] : [jjs, ...row?.orderNotes];
    firebase
      .firestore()
      .collection('orders')
      .doc(row?.id)
      .set(o)
      .then(() => {
        stopHandler(true)
        setNotesDialog(false);
        setOrderNotes('')
      });

  };
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [isModalVisible3, setIsModalVisible3] = React.useState(false);
  const [isModalVisible4, setIsModalVisible4] = React.useState(false);
  const [isModalVisible2, setIsModalVisible2] = React.useState(false);
  const [detentionsdata, setdetantion] = React.useState(false)
  const [layoverdata, setlayovers] = React.useState(false)
  const [lumberdata, setlumpers] = React.useState(false)

  const [det, setDet] = React.useState(false);
  const [Layover, setLayover] = React.useState(false)
  const [Lumper, setLumper] = React.useState(false)
  const handleItem = () => {
    if (itemDescription != '') {
      var dets = row?.dets || [];
      const det = { item: itemDescription, price: itemPrice, hours: itemHours };
      dets.push(det);
      var o = row;
      o.dets = dets;
      firebase
        .firestore()
        .collection('orders')
        .doc(row?.id)
        .set(o)
        .then(() => {
          setRow(o);
          setDet(false);
          setItemHours(0)
          setItemPrice(0)
          setItemDescription('')
        });
    }
  };
  const handleItem2 = () => {
    if (layoverDescription != '') {
      var news = row?.news || [];
      const det2 = { desc: layoverDescription, layprice: layoverPrice };
      news.push(det2);
      var o = row;
      o.news = news;
      firebase
        .firestore()
        .collection('orders')
        .doc(row?.id)
        .set(o)
        .then(() => {
          setRow(o);
          setLayover(false);
          setLayoverDescription('')
          setLayoverPrice(0)
        });
    }
  };

  const handleItem3 = () => {
    if (lumperDesc != '') {
      var lumper = row?.lumper || [];
      const lumpers = { desc: lumperDesc, lumperprice: lumperPrice };
      lumper.push(lumpers);
      var o = row;
      o.lumper = lumper;
      firebase
        .firestore()
        .collection('orders')
        .doc(row?.id)
        .set(o)
        .then(() => {
          setRow(o);
          setLumper(false);
          setLumperPrice(0)
          setLumperDesc('')
        });
    }
  };
  const removeDets = () => {
    let o = row;
    o.dets = [];
    firebase
      .firestore()
      .collection('orders')
      .doc(row?.id)
      .set(o)
      .then(() => {
        refresh();
      });
  };
  const removeLayover = () => {
    let o = row;
    o.news = [];
    firebase
      .firestore()
      .collection('orders')
      .doc(row?.id)
      .set(o)
      .then(() => {
        refresh();
      });
  };
  const removeLumper = () => {
    let o = row;
    o.lumper = [];
    firebase
      .firestore()
      .collection('orders')
      .doc(row?.id)
      .set(o)
      .then(() => {
        refresh();
      });
  };


  /////////  PDF Codes    ////////




  const [image, setImage] = React.useState(null);
  const [url, setUrl] = React.useState("");
  const [progress, setProgress] = React.useState(0);
  const [errors, setErrors] = React.useState("");
  const [filess, setFiless] = React.useState(false)
  const [togle1, settogle1] = React.useState(false)
  const [filename1, setfilename1] = React.useState("" || row?.pdf_Order_Name_1)





  const [image2, setImage2] = React.useState(null);
  const [url2, setUrl2] = React.useState("");
  const [progress2, setProgress2] = React.useState(0);
  const [errors2, setErrors2] = React.useState("");
  const [filename2, setfilename2] = React.useState("" || row?.pdf_Order_Name_2)
  const [togle2, settogle2] = React.useState(false)


  const [image3, setImage3] = React.useState(null);
  const [url3, setUrl3] = React.useState("");
  const [progress3, setProgress3] = React.useState(0);
  const [errors3, setErrors3] = React.useState("");
  const [filename3, setfilename3] = React.useState("" || row?.pdf_Order_Name_3)
  const [togle3, settogle3] = React.useState(false)

  const [image4, setImage4] = React.useState(null);
  const [url4, setUrl4] = React.useState("");
  const [progress4, setProgress4] = React.useState(0);
  const [errors4, setErrors4] = React.useState("");
  const [filename4, setfilename4] = React.useState("" || row?.pdf_Order_Name_4)
  const [togle4, settogle4] = React.useState(false)





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
      const uploadTask = firebase.storage().ref(`orderDescPDF/${row?.id}`).put(image);
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
          firebase.storage().ref("orderDescPDF")
            .child(`${row?.id}`)
            .getDownloadURL()
            .then(url => {
              setUrl(url);
              setProgress(0);
              setImage('')
              openNotification6("bottomRight")
            });
        }
      );
    } else {
      setErrors("Error please choose an image to upload");
    }
  };
  React.useEffect(() => {
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
      const uploadTask = firebase.storage().ref(`orderDescPDF/${row?.id}second`).put(image2);
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
          firebase.storage().ref("orderDescPDF")
            .child(`${row?.id}second`)
            .getDownloadURL()
            .then(url => {
              setUrl2(url);
              setProgress2(0);
              setImage2('')
              openNotification7("bottomRight")
            });
        }
      );
    } else {
      setErrors2("Error please choose an image to upload");
    }
  };
  React.useEffect(() => {
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
      const uploadTask = firebase.storage().ref(`orderDescPDF/${row?.id}third`).put(image3);
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
          firebase.storage().ref("orderDescPDF")
            .child(`${row?.id}third`)
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
  React.useEffect(() => {
    handleUpdate3()
  }, [image3])

  const handChange4 = e => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file["type"];
      const validImageTypes = ["application/pdf"];
      if (validImageTypes.includes(fileType)) {
        setErrors4("");
        setImage4(file);
        setUrl4("")
      } else {
        setErrors4("Please select an image to upload");
      }
    }
  };


  const handleUpdate4 = () => {
    if (image4) {
      const uploadTask = firebase.storage().ref(`orderDescPDF/${row?.id}fourth`).put(image4);
      uploadTask.on(
        "state_changed",
        snapshot => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress4(progress);
        },
        error => {
          setErrors4(error);
        },
        () => {
          firebase.storage().ref("orderDescPDF")
            .child(`${row?.id}fourth`)
            .getDownloadURL()
            .then(url => {
              setUrl4(url);
              setProgress4(0);
              setImage4('')
            });
        }
      );
    } else {
      setErrors4("Error please choose an image to upload");
    }
  };
  React.useEffect(() => {
    handleUpdate4()
  }, [image4])



  const AddPdfinOrder = () => {
    let o = row;
    o.pdf_Order_1 = url !== "" ? url : row?.pdf_Order_1 !== undefined && row?.pdf_Order_1 !== null ? row?.pdf_Order_1 : null;
    o.pdf_Order_2 = url2 !== "" ? url2 : row?.pdf_Order_2 !== undefined && row?.pdf_Order_2 !== null ? row?.pdf_Order_2 : null;
    o.pdf_Order_3 = url3 !== "" ? url3 : row?.pdf_Order_3 !== undefined && row?.pdf_Order_3 !== null ? row?.pdf_Order_3 : null;
    o.pdf_Order_4 = url4 !== "" ? url4 : row?.pdf_Order_4 !== undefined && row?.pdf_Order_4 !== null ? row?.pdf_Order_4 : null;
    o.pdf_Order_Name_1 = filename1 === "" || filename1 === undefined ? null : filename1;
    o.pdf_Order_Name_2 = filename2 === "" || filename2 === undefined ? null : filename2;
    o.pdf_Order_Name_3 = filename3 === "" || filename3 === undefined ? null : filename3;
    o.pdf_Order_Name_4 = filename4 === "" || filename4 === undefined ? null : filename4;
    o.pdf_uploadUser = user?.email
    firebase
      .firestore()
      .collection('orders')
      .doc(row?.id)
      .set(o)
      .then(() => {
        refresh();
      });
  };



  const stopHandler = (val) => {
    var o = row;
    o.stop = val;
    firebase
      .firestore()
      .collection('orders')
      .doc(row?.id)
      .set(o)
      .then(() => {
        setIsModalVisible(false)

      });
  };

  const handleTonu = () => {
    let o = row;
    o.tonuVal = itemPrice;
    o.tonu = true;
    firebase
      .firestore()
      .collection('orders')
      .doc(row?.id)
      .set(o)
      .then(() => {
        setRow(o);
        setTonu(false);
      });
  };

  const removeTonu = () => {
    let o = row;
    o.tonuVal = 0;
    o.tonu = false;
    firebase
      .firestore()
      .collection('orders')
      .doc(row?.id)
      .set(o)
      .then(() => {
        refresh();
      });
  };

  const duplicate = () => {
    firebase
      .firestore()
      .collection('orders')
      .doc(`test${row?.id}`)
      .set({ ...row, id: `test${row?.id}` })
      .then(() => refresh());
  };
  const [use, setuse] = React.useState(user?.email)
  React.useEffect(() => {
  }, [use])
  const progressOrder = () => {
    var status;
    var deliveryTime;
    var pickupTime;
    var paidTime;
    switch (row?.status) {
      case 'New': {
        pickupTime = new Date()
        status = 'In Transit'
        break;
      }
      case 'In Transit': {
        deliveryTime = new Date()
        status = 'Delivered'
        break;
      }
      case 'Delivered': {
        status = 'Paid';
        paidTime = new Date()
        row.paymentNotes = notes;
        row.paymentMethod = method;
        break;
      }
    }
    firebase
      .firestore()
      .collection('orders')
      .doc(row?.id)
      .set({
        ...row,
        useremail: row?.useremail === null ? use : row?.useremail,
        status: status,
        pTime: row?.pTime === null || row?.pTime === undefined ? new Date() : row?.pTime,
        paidTime: status === 'Paid' && row?.paidTime === null ? new Date() : row?.paidTime !== null ? row?.paidTime : null,
        dTime: row?.status === 'In Transit' ? new Date() : null,
        paiduser: row?.paiduser == null && status === 'Paid' ? use : row?.paiduser !== undefined ? row?.paiduser : null,
        deliveruser: row?.deliveruser == null && status === 'Delivered' ? use : row?.deliveruser !== undefined ? row?.deliveruser : null,

      })
      .then(() => refresh());
  };

  let pp = 0
  const mm = row?.partial != "" && row?.partial != undefined && row?.partial?.map(el => {
    pp = pp + parseFloat(el.partialprice)
    return pp
  })

  let ddp = 0
  const detension = row?.dets?.map(el => {
    ddp = ddp + parseFloat(el.price)
  })
  let lm = 0
  const lumperr = row?.lumper?.map(el => {
    lm = lm + parseFloat(el.lumperprice)
  })

  let lma = 0
  const layoverss = row?.news?.map(el => {
    lma = lma + parseFloat(el.layprice)
  })
  var ton;
  if (row?.tonuVal != undefined) {
    ton = parseFloat(row?.tonuVal)
  } else {
    ton = 0
  }
  let paidlogic = 0
  paidlogic = Number(paidlogic) + Number(pp) + Number(partiallyPaid);

  let price;
  if (row?.tonu == undefined) {
    price = parseFloat(row?.price) + ddp + lm + lma;
  } else {
    price = ton;
  }
  const getpricea = () => {
    const gata = Number(price) - Number(paidlogic)
    return gata.toFixed(2)
  }

  const markAs = (as) => {
    var status;
    switch (as) {
      case 'new': {
        status = 'New';
        break;
      }
      case 'intransit': {
        status = 'In Transit';
        break;
      }
      case 'delivered': {
        status = 'Delivered';
        break;
      }
      case 'paid': {
        status = paidlogic >= price ? 'Paid' : 'Delivered';
        break;
      }
    }
    setuse(user?.email)
    let partialarr = {
      whoPaid: user.email,
      currentTime: new Date().toLocaleString(),
      partialprice: partiallyPaid,
      paymentMethod: method,
      paymentnot: notes
    }
    if (partiallyPaid != '') {
      var o = row;
      o.partial = row?.partial === undefined ? [partialarr] : [partialarr, ...row?.partial];
    }
    firebase
      .firestore()
      .collection('orders')
      .doc(row?.id)
      .set({
        ...row,
        paiduser: row?.paiduser == null && status === 'Paid' ? use : row?.paiduser !== undefined ? row?.paiduser : null,
        deliveruser: row?.deliveruser == null && status === 'Delivered' ? use : row?.deliveruser !== undefined ? row?.deliveruser : null,
        status: status,
        partiallyPaids: partiallyPaid != "" ? true : false,
        useremail: row?.useremail === null || row?.useremail === undefined ? use || user?.email : row?.useremail,
        pTime: row?.pTime === null || row?.pTime === undefined ? new Date() : row?.pTime,
        dTime: status === 'Delivered' && row?.dTime === null || row?.dTime === undefined ? new Date() : row?.dTime,
        paidTime: status === 'Paid' && row?.paidTime === null || row?.paidTime === undefined ? new Date() : row?.paidTime,
        partial: o?.partial == undefined ? "" : o?.partial,
        removePaymentStatus: false,
      })
      .then(() => refresh());
  };
  const markAsPaid = () => {
    setOpen(true);
  };
  const [open2, setOpen2] = React.useState(false)
  const markAsPaid2 = () => {
    setOpen2(true);
  };
  const archiveOrder = () => {
    firebase.firestore().collection('archive').doc(row?.id).set(row);
    firebase.firestore().collection('orders').doc(row?.id).delete();
    router.push('orders/archive');
  };
  const restoreOrder = () => {
    firebase
      .firestore()
      .collection('orders')
      .doc(row?.id)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          firebase.firestore().collection('archive').doc(row?.id).delete();
          firebase
            .firestore()
            .collection('orders')
            .doc(row?.id)
            .set(row)
            .then(() => {
              router.push('/orders');
            });
        }
      });
  };

  const deleteResourceHistory = (collection, resource, id) => {
    row[resource].name = row[resource].name.replace(/[^a-zA-Z ]/g, "")
    firebase
      .firestore()
      .collection(collection)
      .doc(row[resource].name)
      .get()
      .then((doc) => {
        try {
          var data = doc.data();
          var history = data.history;

          history.map((item) => {
            if (item.id == id) history.splice(history.indexOf(item), 1);
          });
          data.history = history;
          firebase
            .firestore()
            .collection(collection)
            .doc(row[resource].name)
            .set(data);
        } catch (e) {
          console.log(e);
        }
      });

  }



  const deleteHistory = (row) => {
    deleteResourceHistory('brokers', 'broker', row?.id);
    deleteResourceHistory('drivers', 'driver', row?.id);
    deleteResourceHistory('customers', 'pickup', row?.id);
    deleteResourceHistory('customers', 'delivery', row?.id);
  };
  const openNotification = placement => {
    notification.success({
      message: `Notification Delete Order ID ${row?.id} `,
      description:
        `Thank you for Deleting Order ID ${row?.id} Successfully`,
      placement,
    });
  };
  const openNotification2 = (placement, status) => {
    notification.success({
      message: `Notification Order ID ${row?.id} `,
      description:
        `Thank you for Mark as ${status} Order ID ${row?.id} Successfully`,
      placement,
    });
  };
  const openNotification3 = (placement) => {
    notification.success({
      message: `Notification Invoice ${row?.id} `,
      description:
        `Thank you for Download Invoice of Order ID ${row?.id} Successfully`,
      placement,
    });
  };
  const openNotification4 = (placement) => {
    notification.success({
      message: `Notification Change Status `,
      description:
        `Thank you for Change status of Order ID ${row?.id} Successfully`,
      placement,
    });
  };
  const openNotification5 = (placement) => {
    notification.success({
      message: `Notification Archive Order `,
      description:
        `Thank you for Archive Order ID ${row?.id} Successfully`,
      placement,
    });
  };
  const openNotification6 = (placement) => {
    notification.success({
      message: `Notification PDF `,
      description:
        `Thank you for Added PDF in Order ID ${row?.id} Successfully`,
      placement,
    });
  };
  const openNotification7 = (placement) => {
    notification.success({
      message: `Notification PDF_2 `,
      description:
        `Thank you for Added PDF_2 Order ID ${row?.id} Successfully`,
      placement,
    });
  };
  const delete_Order_firbase = (popup) => {
    popup.close();
    firebase
      .firestore()
      .collection('Delete_Orders')
      .doc(row?.id)
      .delete()
      .then(() => {
        deleteHistory(row);
        openNotification("bottomRight")
        refresh();
      });
  };
  const deleteOrder = (popup) => {
    popup.close();
    firebase.firestore().collection('Delete_Orders').doc(row?.id).set(row);
    firebase.firestore().collection('orders').doc(row?.id).delete();
    router.push('/');
  };
  const UndoOrder = (popup) => {
    popup.close();
    firebase.firestore().collection('orders').doc(row?.id).set(row);
    firebase.firestore().collection('Delete_Orders').doc(row?.id).delete();
    router.push('/');
  };

  const rowPrice = (() => {
    var ret = 0;
    if (row?.tonuVal > 0) ret = parseFloat(row?.tonuVal);
    else {
      row?.dets?.map((det) => (ret += parseFloat(det.price)));
      row?.news?.map((det) => (ret += parseFloat(det.layprice)));
      row?.lumper?.map((det) => (ret += parseFloat(det.lumperprice)));
      ret += parseFloat(row?.price);
    }
    return ret.toFixed(2);
  })();
  const tonuDiff = (() => {
    var ret = 0;
    if (row?.tonuVal > 0) ret = parseFloat(row?.price) - parseFloat(row?.tonuVal);
    return ret;
  })();
  const downloadInvoice = (e) => {
    if (window) {
      const template = Handlebars.compile(html);
      const pdf = require('html2pdf.js');
      pdf(
        template({
          ...row,
          rowPrice: rowPrice,
          tonuDiff: tonuDiff,
          date: new Date(row?.date.seconds * 1000).toLocaleDateString(),
        }),
        {
          filename: `${row?.id}.pdf`,
          html2canvas: { scale: 2 },
          jsPDF: { format: 'a4' },
        }
      );
      firebase
        .firestore()
        .collection(col)
        .doc(row?.id)
        .set({ ...row, invoiced: true })
        .then
        ();
    }
    fetch(`/api/invoice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: "test",
        content: "Testing Content"
      }),
    }).then(async res => {
      if (res.status === 200) {
        const blob = await res.blob();
        const file = new Blob(
          [blob],
          { type: 'application/pdf' }
        );
        //Build a URL from the file
        const fileURL = URL.createObjectURL(file);
        //Open the URL on new Window
        window.open(fileURL);
      }
    })
  };
  const markasInvoiced = (popup) => {
    popup.close()
    const newdatess = new Date()
    firebase
      .firestore()
      .collection('orders')
      .doc(row?.id)
      .set({ ...row, invoiced: true, invoiceCreated: user?.name == undefined ? user?.displayName : user?.name, invoicedTime: newdatess })
      .then
      ();
  }

  function showConfirmNEW(popupState) {
    popupState.close();
    for (let i = 0; i < 1; i += 1) {
      setTimeout(() => {
        confirm({
          icon: <WarningOutlined />,
          content: <p>Do you want to mark Order  {row?.id} as NEW? </p>,
          onOk() {
            if (i == 0) {
              markAs('new');
              openNotification2("bottomRight", "New")
              popupState.close();
            }
          },
          onCancel() {
            popupState.close();
          },
          okText: "Yes",
          cancelText: "No"
        });
      }, i * 500);
    }
  }
  function showConfirmTrainsit(popupState) {
    popupState.close();
    for (let i = 0; i < 1; i += 1) {
      setTimeout(() => {
        confirm({
          icon: <WarningOutlined />,
          content: <p>Do you want to mark Order {row?.id}  as Transit? </p>,
          onOk() {
            if (i == 0) {
              markAs('intransit');
              openNotification2("bottomRight", "In Transit")
              popupState.close();
            }
          },
          onCancel() {
            popupState.close();
          },
          okText: "Yes",
          cancelText: "No"
        });
      }, i * 500);
    }
  }
  function showConfirmDeleivered(popupState) {
    popupState.close();
    for (let i = 0; i < 1; i += 1) {
      setTimeout(() => {
        confirm({
          icon: <WarningOutlined />,
          content: <p>Do you want to mark Order {row?.id} as Delivered? </p>,
          onOk() {
            if (i == 0) {
              markAs('delivered');
              openNotification2("bottomRight", "Delivered")
              popupState.close();
            }
          },
          onCancel() {
            popupState.close();
          },
          okText: "Yes",
          cancelText: "No"
        });
      }, i * 500);
    }
  }


  function showConfirm23(popupState) {
    popupState.close();
    for (let i = 0; i < 1; i += 1) {
      setTimeout(() => {
        confirm({
          icon: <WarningOutlined />,
          content: <p>Are you Sure? You want to Mark {row?.id} Order as Invoiced: </p>,
          onOk() {
            if (i == 0) {
              markasInvoiced(popupState);
            }
          },
          onCancel() {
            popupState.close();
          },
        });
      }, i * 500);
    }
  }

  function showConfirm(popupState) {
    popupState.close();
    for (let i = 0; i < 1; i += 1) {
      setTimeout(() => {
        confirm({
          icon: <WarningOutlined />,
          content: <p>Are you Sure? You want to Delete this orderID: {row?.id}</p>,
          onOk() {
            if (i == 0) {
              deleteOrder(popupState);
            }
          },
          onCancel() {
            popupState.close();
          },
          okText: "Yes",
          cancelText: "No"

        });
      }, i * 500);
    }
  }

  function showConfirmUndo(popupState) {
    popupState.close();
    for (let i = 0; i < 1; i += 1) {
      setTimeout(() => {
        confirm({
          icon: <WarningOutlined />,
          content: <p>Are you Sure? You want to Undo this orderID: {row?.id}</p>,
          onOk() {
            if (i == 0) {
              UndoOrder(popupState);
            }
          },
          onCancel() {
            popupState.close();
          },
        });
      }, i * 500);
    }
  }

  function PermanentDelete(popupState) {
    popupState.close();
    for (let i = 0; i < 1; i += 1) {
      setTimeout(() => {
        confirm({
          icon: <WarningOutlined />,
          content: <p>Are you Sure? You want Permanent Delete this orderID: {row?.id}</p>,
          onOk() {
            if (i == 0) {
              delete_Order_firbase(popupState);
            }
          },
          onCancel() {
            popupState.close();
          },
        });
      }, i * 500);
    }
  }
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (detentionsdata) {
      handleItem()
    } else if (layoverdata) {
      handleItem2()
    } else if (lumberdata) {
      handleItem3()
    } else {
      localStorage.removeItem('modal')
      localStorage.removeItem('id')
      markAs('delivered');
      setIsModalVisible(false);
    }
  };
  const handleOk3 = () => {
    if (orderNotes != '') {
      handleNotesbilling()
    }
  };
  const handleCancel3 = () => {
    setIsModalVisible3(false)
  };
  const handleOk4 = () => {
    if (orderNotes != '') {
      handleNotes()
    }
  };
  const handleCancel4 = () => {
    setIsModalVisible4(false)
  };

  const handleCancel = () => {
    setdetantion(false)
    setlayovers(false)
    setlumpers(false)
    localStorage.removeItem('modal')
    localStorage.removeItem('id')
    setIsModalVisible(false);

  };

  const handleCancel2 = () => {
    setIsModalVisible2(false);

  };

  const deleiverpopup = () => {
    confirm({
      icon: <WarningOutlined />,
      cancelText: "No",
      okText: "Yes",
      content: <p>Do you need to add Detention,Layover,Lumper to this order {row?.id}?</p>,
      onOk() {
        localStorage.setItem('modal', true)
        localStorage.setItem('id', row?.id)
        showModal()
      },
      onCancel() {
        markAs('delivered');
        openNotification2("bottomRight", "Delivered")
      },
    });
  }
  React.useEffect(() => {
    const storage = localStorage.getItem('modal')
    const ids = localStorage.getItem('id')
    if (ids == row?.id) {
      if (storage) {
        setIsModalVisible(true)
      }
    }
  }, [row])

  const mobileItem = () => {
    return (
      <>
        {
          deletorder === undefined && (
            <>
              {isMobile === true ? (
                <div style={{ margin: '0 10px' }}>
                  <PopupState variant="popover" popupId="popup"  >
                    {(popupState) => {
                      return (
                        <>
                          <IconButton
                            size="small"
                            // color="primary"

                            aria-label="add"
                            {...bindTrigger(popupState)}
                          >
                            {/* iconn */}
                            <MoreIcon />
                          </IconButton>

                          <Popover
                            PaperProps={{
                              style: {
                                minWidth: '300px!important',
                              },
                            }}
                            {...bindPopover(popupState)}
                            anchorOrigin={{
                              vertical: 'center',
                              horizontal: 'center',
                            }}
                            transformOrigin={{
                              vertical: 'bottom',
                              horizontal: 'right',
                            }}
                          >
                            <Box
                              p={0}
                              style={{ display: 'flex', flexDirection: 'column' }}
                            >
                              <List disablePadding>
                                {level != 'Admin' ? (
                                  <>
                                    <ListItem
                                      button
                                      disabled={row?.status == 'New' ? true : false}
                                      onClick={() => {
                                        showConfirmNEW(popupState)
                                      }}
                                    >
                                      <ListItemText>Mark as New</ListItemText>
                                    </ListItem>
                                    <ListItem
                                      button
                                      disabled={row?.status == 'In Transit' ? true : false}
                                      onClick={() => {
                                        showConfirmTrainsit(popupState)
                                      }}
                                    >
                                      <ListItemText>Mark as In Transit</ListItemText>
                                    </ListItem>
                                    <ListItem
                                      button
                                      disabled={row?.status == 'Delivered' ? true : false}
                                      onClick={() => {
                                        showConfirmDeleivered(popupState)
                                      }}
                                    >
                                      <ListItemText>Mark as Delivered</ListItemText>
                                    </ListItem>
                                  </>
                                ) : null}

                                {level == 'Admin' ? (
                                  <>
                                    <ListItem
                                      button
                                      disabled={row?.status == 'New' ? true : false}
                                      onClick={() => {
                                        markAs('new');
                                        openNotification2("bottomRight", "New")
                                        popupState.close();
                                      }}
                                    >
                                      <ListItemText>Mark as New</ListItemText>
                                    </ListItem>
                                    <ListItem
                                      button
                                      disabled={row?.status == 'In Transit' ? true : false}
                                      onClick={() => {
                                        markAs('intransit');
                                        openNotification2("bottomRight", "In Transit")
                                        popupState.close();
                                      }}
                                    >
                                      <ListItemText>Mark as In Transit</ListItemText>
                                    </ListItem>
                                    <ListItem
                                      button
                                      disabled={row?.status == 'Delivered' ? true : false}
                                      onClick={() => {
                                        deleiverpopup()
                                        popupState.close();
                                      }}
                                    >
                                      <ListItemText>Mark as Delivered</ListItemText>
                                    </ListItem>
                                    <ListItem
                                      button
                                      disabled={row?.status == 'Paid' ? true : false}
                                      onClick={() => {
                                        markAsPaid();
                                        openNotification2("bottomRight", "Paid")
                                        popupState.close();
                                      }}
                                    >
                                      <ListItemText>Mark as paid</ListItemText>
                                    </ListItem>
                                    <ListItem
                                      button
                                      onClick={() => {
                                        showConfirm23()
                                        popupState.close();
                                      }}
                                    >
                                      <ListItemText>Mark as Invoiced</ListItemText>
                                    </ListItem>
                                    <ListItem
                                      button
                                      onClick={() => {
                                        downloadInvoice();
                                        openNotification3("bottomRight")
                                        popupState.close();
                                      }}
                                    >
                                      <ListItemText>Download Invoice</ListItemText>
                                    </ListItem>
                                    {row.partiallyPaids == true ? (
                                      <ListItem
                                        button
                                        onClick={() => {
                                          RemovePriceConfirm(popupState);
                                        }}
                                      >
                                        <ListItemText>Remove Payment</ListItemText>
                                      </ListItem>
                                    ) : null}


                                    {row?.cancelTonuStatus == undefined || row?.cancelTonuStatus == false || row?.cancelTonuStatus == null ? (
                                      <ListItem
                                        button
                                        onClick={() => {
                                          popupState.close()
                                          setModalOpen(true)
                                        }}
                                      >
                                        <ListItemText>Mark as Canceled/TONU</ListItemText>
                                      </ListItem>
                                    ) : null}
                                    {row.cancelTonuStatus == true && (
                                      <ListItem
                                        button
                                        onClick={() => {
                                          popupState.close()
                                          setModalOpen2(true)
                                        }}
                                      >
                                        <ListItemText>Mark as Undo Canceled/TONU</ListItemText>
                                      </ListItem>
                                    )}
                                  </>
                                ) : null}
                                {level == 'Admin' ? (
                                  <ListItem
                                    button
                                    onClick={() => {
                                      // setFiless(true)
                                      isModalVisible2(true)
                                      popupState.close();

                                    }}
                                  >
                                    <ListItemText>Add PDF</ListItemText>
                                  </ListItem>
                                ) : null}
                              </List>
                            </Box>
                            <Divider></Divider>
                            {level == 'Admin' ? (
                              <Box p={0}>
                                <List disablePadding>
                                  {archive ? null : (
                                    <ListItem
                                      button
                                      onClick={() => {
                                        router.push(`/orders/edit/${row?.id}`);
                                      }}
                                    >
                                      <ListItemText>Edit Order</ListItemText>
                                    </ListItem>
                                  )}

                                  <ListItem button>
                                    <ListItemText><span onClick={() => showConfirm(popupState)}>Delete Order</span></ListItemText>
                                  </ListItem>
                                </List>
                                <ListItem
                                  button
                                  disabled={row?.status == 'Paid' ? true : false}
                                  onClick={() => {
                                    setIsModalVisible4(true);
                                    popupState.close();
                                  }}
                                >
                                  <ListItemText>Add order notes</ListItemText>
                                </ListItem>
                              </Box>
                            ) : null}
                            {level == 'Admin' && (
                              <>
                                {row?.stop == false || row?.stop == undefined ? (
                                  <ListItem
                                    button
                                    onClick={() => {
                                      setIsModalVisible3(true)
                                      popupState.close();
                                    }}
                                  >
                                    <ListItemText>Stop Billing</ListItemText>
                                  </ListItem>
                                ) : null}
                                {row?.stop === true &&
                                  <ListItem
                                    button
                                    onClick={() => {
                                      stopHandler(false)
                                      popupState.close();
                                    }}
                                  >
                                    <ListItemText>Start Billing</ListItemText>
                                  </ListItem>}
                              </>
                            )}


                            <Divider />
                            {level == 'Admin' ? (
                              <>
                                <Box p={0}>
                                  <Divider />
                                  <ListItem
                                    button
                                    disabled={row?.status == 'Paid' ? true : false}
                                    onClick={() => {
                                      setDet(true);
                                      popupState.close();
                                    }}
                                  >
                                    <ListItemText>Add order detention</ListItemText>
                                  </ListItem>
                                  <Divider />
                                  {/* {row?.news?.length > 0 ? null : ( */}
                                  <ListItem
                                    button
                                    disabled={row?.status == 'Paid' ? true : false}
                                    onClick={() => {
                                      setLayover(true);
                                      popupState.close();
                                    }}
                                  >
                                    <ListItemText>Add Layover</ListItemText>
                                  </ListItem>
                                  {/* )} */}
                                  {/* {row?.lumper?.length > 0 ? null : ( */}
                                  <ListItem
                                    button
                                    disabled={row?.status == 'Paid' ? true : false}
                                    onClick={() => {
                                      setLumper(true);
                                      popupState.close();
                                    }}
                                  >
                                    <ListItemText>Add Lumper Fee</ListItemText>
                                  </ListItem>
                                  {/* )} */}

                                  {row?.tonu == true ? (
                                    <ListItem
                                      button
                                      disabled={row?.status == 'Paid' ? true : false}
                                      onClick={() => {
                                        removeTonu();
                                        popupState.close();
                                      }}
                                    >
                                      <ListItemText>Remove TONU</ListItemText>
                                    </ListItem>
                                  ) : (
                                      <ListItem
                                        button
                                        disabled={row?.status == 'Paid' ? true : false}
                                        onClick={() => {
                                          setTonu(true);
                                          setItemDescription('Truck Order Not Used');
                                          popupState.close();
                                        }}
                                      >
                                        <ListItemText>TONU</ListItemText>
                                      </ListItem>
                                    )}
                                  {row?.dets?.length > 0 ? (
                                    <ListItem
                                      button
                                      disabled={row?.status == 'Paid' ? true : false}
                                      onClick={() => {
                                        removeDets();
                                        popupState.close();
                                      }}
                                    >
                                      <ListItemText>
                                        Remove order detention
                                  </ListItemText>
                                    </ListItem>
                                  ) : null}
                                  {row?.news?.length > 0 ? (
                                    <ListItem
                                      button
                                      disabled={row?.status == 'Paid' ? true : false}
                                      onClick={() => {
                                        removeLayover();
                                        popupState.close();
                                      }}
                                    >
                                      <ListItemText>
                                        Remove order Layover
                                    </ListItemText>
                                    </ListItem>
                                  ) : null}
                                  {row?.lumper?.length > 0 ? (
                                    <ListItem
                                      button
                                      disabled={row?.status == 'Paid' ? true : false}
                                      onClick={() => {
                                        removeLumper();
                                        popupState.close();
                                      }}
                                    >
                                      <ListItemText>
                                        Remove Lumper Fee
                                </ListItemText>
                                    </ListItem>
                                  ) : null}


                                  {archive ? (
                                    <ListItem
                                      button
                                      onClick={() => {
                                        restoreOrder();
                                        popupState.close();
                                      }}
                                    >
                                      <ListItemText>Restore Order</ListItemText>
                                    </ListItem>
                                  ) : (
                                      <ListItem
                                        button
                                        onClick={() => {
                                          archiveOrder();
                                          openNotification5("bottomRight")
                                          popupState.close();
                                        }}
                                      >
                                        <ListItemText>Archive Order</ListItemText>
                                      </ListItem>
                                    )}
                                </Box>
                                <Divider></Divider>
                              </>
                            ) : null}
                          </Popover>
                        </>
                      );
                    }}
                  </PopupState>

                  <Dialog
                    className={classes2.dialog}
                    open={open}
                    onClose={() => setOpen(false)}
                  >
                    <DialogContent>
                      <div style={{ marginBottom: 10 }}>
                        <InputLabel className={classes2.label}>
                          Payment Method(Required)
                                 </InputLabel>
                        <Select
                          variant={'outlined'}
                          value={method}
                          fullWidth
                          required
                          onChange={(event) => setMethod(event.target.value)}
                        >
                          {methods.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </div>
                      <TextField
                        id="standard-number"
                        label="Amount Received ( including factoring fee)"
                        type="number"
                        variant={'outlined'}
                        fullWidth
                        required
                        value={partiallyPaid}
                        onChange={(e) => setPartiallyPaid(e.target.value)}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        style={{ marginBottom: '5px' }}
                      />
                      <InputLabel className={classes2.label}>Payment Notes(Optional)</InputLabel>
                      <TextField
                        variant={'outlined'}
                        fullWidth
                        multiline
                        required
                        rows={3}
                        value={notes}
                        onChange={(event) => setNotes(event.target.value)}
                      ></TextField>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        color={'primary'}
                        fullWidth
                        onClick={() => {
                          if (partiallyPaid != "" && method != "") {
                            markAs('paid');
                            openNotification2("bottomRight", "Paid")
                            setOpen(false);

                          }
                        }}
                      >
                        Mark as paid
                                 </Button>
                    </DialogActions>
                  </Dialog>


                  <Dialog
                    className={classes2.dialog}
                    open={det}
                    onClose={() => setDet(false)}
                  >
                    <DialogContent style={{ padding: 8, paddingBottom: 0 }}>
                      <TextField
                        variant={'outlined'}
                        label={'Notes'}
                        value={itemDescription}
                        onChange={(event) => setItemDescription(event.target.value)}
                      />
                      <TextField
                        style={{ marginLeft: 8 }}
                        variant={'outlined'}
                        label={'Price'}
                        type={'number'}
                        value={itemPrice}
                        onChange={(event) => setItemPrice(event.target.value)}
                      />
                      <TextField
                        variant={'outlined'}
                        label={'Detention Hours'}
                        style={{ width: '100%', marginTop: '20px' }}
                        type={'number'}
                        value={itemHours}
                        onChange={(event) => setItemHours(event.target.value)}
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button
                        color={'primary'}
                        variant={'outlined'}
                        fullWidth
                        onClick={() => handleItem()}
                      >
                        Add
                        </Button>
                    </DialogActions>
                  </Dialog>


                  {/* ////////// */}
                  <Modal title="Attched PDF" okText="Save PDF" visible={isModalVisible2} onOk={() => AddPdfinOrder()} onCancel={handleCancel2}>

                    {row?.pdf_Order_1 != null || row?.pdf_Order_1 != undefined ? <a style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }} href={row?.pdf_Order_1} target="_blank"> View-PDF-1</a> : null}<br />
                    <Input placeholder="Enter your File Name" value={filename1} onChange={(e) => setfilename1(e.target.value)} />
                    <input type="file" style={{ backgroundColor: 'beige', marginTop: '10px' }} onChange={handChange} />
                    {togle1 === false ? (
                      <IconButton
                        style={{ marginRight: "-0.5em" }}
                        aria-label="delete"
                        onClick={() => {
                          settogle1(!togle1)
                        }}
                      >
                        <AddCircleIcon />
                      </IconButton>

                    ) : (
                        <IconButton
                          style={{ marginRight: "-0.5em" }}
                          aria-label="delete"
                          onClick={() => {
                            settogle1(!togle1)
                          }}
                        >
                          <RemoveCircleIcon />
                        </IconButton>
                      )}
                    <br />
                    {progress !== 0 && <Progress style={{ width: '100%', textAlign: 'center' }} type="circle" percent={progress} format={() => progress !== 100 ? progress : 'Done'} />}

                    {togle1 === true && (
                      <>
                        <Divider />
                        <Input style={{ marginTop: '20px' }} placeholder="Enter your File Name" value={filename2} onChange={(e) => setfilename2(e.target.value)} />
                        {row?.pdf_Order_2 != null || row?.pdf_Order_2 != undefined ? <a style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }} href={row?.pdf_Order_2} target="_blank">View-PDF-2</a> : null}<br />
                      </>
                    )}
                    <br />
                    {togle1 === true && <input type="file" style={{ backgroundColor: 'beige', marginTop: '10px' }} onChange={handChange2} />}
                    {togle2 === false ? (
                      <>
                        {togle1 === true && togle2 === false && (
                          <IconButton
                            style={{ marginRight: "-0.5em" }}
                            aria-label="delete"
                            onClick={() => {
                              settogle2(!togle2)
                            }}
                          >
                            <AddCircleIcon />
                          </IconButton>
                        )}
                      </>
                    ) : (
                        <IconButton
                          style={{ marginRight: "-0.5em" }}
                          aria-label="delete"
                          onClick={() => {
                            settogle2(!togle2)
                            settogle1(!togle1)

                          }}
                        >
                          <RemoveCircleIcon />
                        </IconButton>
                      )}
                    {progress2 !== 0 && <Progress style={{ width: '100%', textAlign: 'center' }} type="circle" percent={progress2} format={() => progress2 !== 100 ? progress2 : 'Done'} />}


                    <br />
                    {togle2 === true && (
                      <>
                        <Divider />

                        <Input style={{ marginTop: '20px' }} placeholder="Enter your File Name" value={filename3} onChange={(e) => setfilename3(e.target.value)} />
                        {row?.pdf_Order_4 != null || row?.pdf_Order_4 != undefined ? <a style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }} href={row?.pdf_Order_3} target="_blank">View-PDF 3</a> : null}<br />
                      </>
                    )}
                    <br />
                    {togle2 === true && <input type="file" style={{ backgroundColor: 'beige', marginTop: '10px' }} onChange={handChange3} />}
                    {togle4 === false ? (
                      <>
                        {togle2 === true && (
                          <IconButton
                            style={{ marginRight: "-0.5em" }}
                            aria-label="delete"
                            onClick={() => {
                              settogle4(!togle4)
                            }}
                          >
                            <AddCircleIcon />
                          </IconButton>
                        )}
                      </>
                    ) : (
                        <IconButton
                          style={{ marginRight: "-0.5em" }}
                          aria-label="delete"
                          onClick={() => {
                            settogle4(!togle4)
                            settogle3(!togle3)

                          }}
                        >
                          <RemoveCircleIcon />
                        </IconButton>
                      )}
                    {progress3 !== 0 && <Progress style={{ width: '100%', textAlign: 'center' }} type="circle" percent={progress3} format={() => progress3 !== 100 ? progress3 : 'Done'} />}

                    <br />
                    {togle4 === true && (
                      <>
                        <Divider />

                        <Input style={{ marginTop: '20px' }} placeholder="Enter your File Name" value={filename4} onChange={(e) => setfilename4(e.target.value)} />
                        {row?.pdf_Order_3 != null || row?.pdf_Order_3 != undefined ? <a style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }} href={row?.pdf_Order_4} target="_blank">View-PDF-4</a> : null}<br />
                      </>
                    )}
                    <br />
                    {togle4 === true && <input type="file" style={{ backgroundColor: 'beige', marginTop: '10px' }} onChange={handChange4} />}
                    {togle3 === false && (
                      <>
                        {togle4 === true && togle3 === false && (
                          <IconButton
                            style={{ marginRight: "-0.5em" }}
                            aria-label="delete"
                            onClick={() => {
                              settogle4(!togle1)
                              settogle3(!togle2)
                            }}
                          >
                            <RemoveCircleIcon />
                          </IconButton>
                        )}
                      </>
                    )}
                    {progress4 !== 0 && <Progress style={{ width: '100%', textAlign: 'center' }} type="circle" percent={progress4} format={() => progress4 !== 100 ? progress4 : 'Done'} />}
                  </Modal>
                  {/* //////// */}
                  <Dialog
                    className={classes2.dialog}
                    open={Layover}
                    onClose={() => setLayover(false)}
                  >
                    <DialogContent style={{ padding: 8, paddingBottom: 0 }}>
                      <TextField
                        variant={'outlined'}
                        label={'Notes'}
                        value={layoverDescription}
                        onChange={(event) => setLayoverDescription(event.target.value)}
                      />
                      <TextField
                        style={{ marginLeft: 8 }}
                        variant={'outlined'}
                        label={'Price'}
                        type={'number'}
                        value={layoverPrice}
                        onChange={(event) => setLayoverPrice(event.target.value)}
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button
                        color={'primary'}
                        variant={'outlined'}
                        fullWidth
                        onClick={() => handleItem2()}
                      >
                        Add
                               </Button>
                    </DialogActions>
                  </Dialog>
                  {/* ..... */}
                  <Dialog
                    className={classes2.dialog}
                    open={Lumper}
                    onClose={() => setLumper(false)}
                  >
                    <DialogContent style={{ padding: 8, paddingBottom: 0 }}>
                      {/* <TextField
                            variant={'outlined'}
                            label={'Notes'}
                            value={lumperDesc}
                            onChange={(event) => setLumperDesc(event.target.value)}
                          /> */}
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Radio.Group onChange={(event) => setLumperDesc(event.target.value)} value={lumperDesc}>
                          <Radio value={"Paid by Driver"}>Paid by Driver</Radio>
                          <Radio value={"Paid by Company"}>Paid by Company</Radio>
                        </Radio.Group>
                        <TextField
                          style={{ marginLeft: 8 }}
                          variant={'outlined'}
                          label={'Price'}
                          type={'number'}
                          value={lumperPrice}
                          onChange={(event) => setLumperPrice(event.target.value)}
                        />
                      </div>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        className="sta" color={'primary'}
                        variant={'outlined'}
                        fullWidth
                        onClick={() => handleItem3()}
                      >
                        Add Lumper Fee
                          </Button>
                    </DialogActions>
                  </Dialog>

                  <Dialog
                    className={classes2.dialog}
                    open={tonu}
                    onClose={() => setTonu(false)}
                  >
                    <DialogContent style={{ padding: 8, paddingBottom: 0 }}>
                      <TextField
                        variant={'outlined'}
                        label={'Item Price'}
                        type={'number'}
                        value={itemPrice}
                        onChange={(event) => setItemPrice(event.target.value)}
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button
                        color={'primary'}
                        variant={'outlined'}
                        fullWidth
                        onClick={() => handleTonu()}
                      >
                        Set
                                </Button>
                    </DialogActions>
                  </Dialog>
                  <Dialog
                    className={classes2.dialog}
                    open={notesDialog}
                    onClose={() => setNotesDialog(false)}
                  >
                    <DialogContent style={{ padding: 8, paddingBottom: 0 }}>
                      <TextField
                        variant={'outlined'}
                        fullWidth
                        multiline
                        label={'Notes'}
                        name="ordernotes"
                        value={orderNotes}
                        onChange={(event) => setOrderNotes(event.target.value)}
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button
                        color={'primary'}
                        variant={'outlined'}
                        fullWidth
                        onClick={() => handleNotes()}
                      >
                        Add Order Notes
                             </Button>
                    </DialogActions>
                  </Dialog>
                </div>
              ) : null}
            </>
          )
        }
      </>
    )
  }
  const RemovePriceNotification = (placement) => {
    notification.success({
      message: `Notification ${row?.id} `,
      description:
        `Remove ${row?.id} order Successfully!`,
      placement,
    });
  };
  const [removePayments, setRemovePayment] = useState('')
  const [removePrice, setRemovePrice] = useState('')
  const [removePaymentPopup, setRemovePaymentPopup] = useState(false)
  const removeusers = user?.name == undefined ? user?.displayName : user?.name;
  const removePayment = (popup) => {
    const removepaym = { RemovePayment: removePayments, user: removeusers, time: new Date() };
    var o = row;
    o.removePayment = removepaym;
    o.status = 'Delivered'
    o.removePaymentStatus = true;
    o.invoiced = null;
    o.partiallyPaids = false;
    o.partial = [];
    firebase
      .firestore()
      .collection('orders')
      .doc(row?.id)
      .set(o)
      .then(() => {
        RemovePriceNotification('bottom')
        setRemovePayment('');
        setRemovePrice('');
        setRemovePaymentPopup(false)
      });
  };
  function RemovePriceConfirm(popupState) {
    popupState.close();
    for (let i = 0; i < 1; i += 1) {
      setTimeout(() => {
        confirm({
          icon: <WarningOutlined />,
          content: <p>Are you Sure? You want to Remove order {row?.id} payment </p>,
          onOk() {
            if (i == 0) {
              setRemovePaymentPopup(true)
            }
          },
          onCancel() {
            console.log("close")
          },
          okText: "Yes",
          cancelText: "No"
        });
      }, i * 500);
    }
  }

  return (
    <React.Fragment>
      <Modal maskClosable={false} okText={"Remove Payment"} title={row?.id} visible={removePaymentPopup} onOk={removePayment} onCancel={() => setRemovePaymentPopup(false)}>
        <h2 style={{ color: '#3d4052', fontStyle: 'italic' }}>Remove Order Payment</h2>
        <TextField
          variant={'outlined'}
          style={{ width: '100%' }}
          label={'Notes'}
          value={removePayments}
          onChange={(event) => setRemovePayment(event.target.value)}
        />
      </Modal>

      <Modal maskClosable={false} okText={detentionsdata ? "Add Detention" : layoverdata ? "Add Layover" : lumberdata ? "Add Lumper fee" : "Mark as Delivered"} title={row?.id} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        {!detentionsdata && !layoverdata && !lumberdata && (
          <>
            <button className="btnaha" onClick={() => {
              setdetantion(true)
            }}>Add Order Detention</button> <br />
            <button className="btnaha" onClick={() => {
              setlayovers(true)
            }}>Add Order Layover</button> <br />
            <button className="btnaha" onClick={() => {
              setlumpers(true)
            }}>Add Lumper Fee</button>
          </>
        )}
        {detentionsdata && (
          <>
            <h1>Detention</h1>
            <TextField
              variant={'outlined'}
              style={{ width: '48%', marginRight: '10px' }}
              label={'Notes'}
              value={itemDescription}
              onChange={(event) => setItemDescription(event.target.value)}
            />
            <TextField
              variant={'outlined'}
              label={'Price'}
              style={{ width: '48%' }}
              type={'number'}
              value={itemPrice}
              onChange={(event) => setItemPrice(event.target.value)}
            />
            <TextField
              variant={'outlined'}
              label={'Detention Hours'}
              style={{ width: '100%', marginTop: '20px' }}
              type={'number'}
              value={itemHours}
              onChange={(event) => setItemHours(event.target.value)}
            />
          </>
        )}
        {layoverdata && (
          <>
            <h1>Layover</h1>
            <TextField
              variant={'outlined'}
              label={'Notes'}
              style={{ width: '48%', marginRight: 8 }}
              value={layoverDescription}
              onChange={(event) => setLayoverDescription(event.target.value)}
            />
            <TextField
              style={{ width: '48%', marginLeft: 8 }}
              variant={'outlined'}
              label={'Price'}
              type={'number'}
              value={layoverPrice}
              onChange={(event) => setLayoverPrice(event.target.value)}
            />
          </>
        )}
        {lumberdata && (
          <>
            <h1>Lumper Fee</h1>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Radio.Group onChange={(event) => setLumperDesc(event.target.value)} value={lumperDesc}>
                <Radio value={"Paid by Driver"}>Paid by Driver</Radio>
                <Radio value={"Paid by Company"}>Paid by Company</Radio>
              </Radio.Group>
              <TextField
                style={{ marginLeft: 8 }}
                variant={'outlined'}
                label={'Price'}
                type={'number'}
                value={lumperPrice}
                onChange={(event) => setLumperPrice(event.target.value)}
              />
            </div>

          </>
        )}
      </Modal>


      <Modal maskClosable={false} okText={"Mark as stop billing"} title={row?.id} visible={isModalVisible3} onOk={handleOk3} onCancel={handleCancel3}>
        <h2 style={{ color: '#3d4052', fontStyle: 'italic' }}>Stop Billing Order Notes.</h2>
        <TextField
          variant={'outlined'}
          style={{ width: '100%' }}
          label={'Notes'}
          value={orderNotes}
          onChange={(event) => setOrderNotes(event.target.value)}
        />
      </Modal>

      <Modal maskClosable={false} okText={"Mark as Canceled/TONU"} title={row?.id} visible={modalOpen} onOk={CenceledTonu} onCancel={() => setModalOpen(true)}>
        <h2 style={{ color: '#3d4052', fontWeight: 'bold' }}>Canceled/TONU Notes.</h2>
        <TextField
          variant={'outlined'}
          style={{ width: '100%' }}
          label={'Canceled/TONU'}
          value={cancelTonyNotes}
          onChange={(event) => setcancelTonyNotes(event.target.value)}
        />
      </Modal>
      <Modal maskClosable={false} okText={"Mark as Canceled/TONU"} title={row?.id} visible={modalOpen} onOk={CenceledTonu} onCancel={() => setModalOpen(false)}>
        <h2 style={{ color: '#3d4052', fontWeight: 'bold' }}>Canceled/TONU Notes.</h2>
        <TextField
          variant={'outlined'}
          style={{ width: '100%' }}
          label={'Canceled/TONU'}
          value={cancelTonyNotes}
          onChange={(event) => setcancelTonyNotes(event.target.value)}
        />
      </Modal>
      <Modal maskClosable={false} okText={"Mark as Undo Canceled/TONU"} title={row?.id} visible={modalOpen2} onOk={CenceledTonu2} onCancel={() => setModalOpen2(false)}>
        <h2 style={{ color: '#3d4052', fontWeight: 'bold' }}>Undo Canceled/TONU Notes.</h2>
        <TextField
          variant={'outlined'}
          style={{ width: '100%' }}
          label={'Undo Canceled/TONU'}
          value={cancelTonyNotes2}
          onChange={(event) => setcancelTonyNotes2(event.target.value)}
        />
      </Modal>

      <Modal maskClosable={false} okText={"Add Order Notes"} title={row?.id} visible={isModalVisible4} onOk={handleOk4} onCancel={handleCancel4}>
        <h2 style={{ color: '#3d4052', fontStyle: 'italic' }}>Order Notes.</h2>
        <TextField
          variant={'outlined'}
          style={{ width: '100%' }}
          label={'Notes'}
          value={orderNotes}
          onChange={(event) => setOrderNotes(event.target.value)}
        />
      </Modal>


      <TableRow className={classes.root}>
        <TableCell
          align={'left'}
          component="th"
          scope="row"
        >
          <div className={user?.accessLevel === "User" ? "orderwidthuser" : "orderwidth"} style={{ display: 'flex', justifyContent: 'space-between' }}>
            {level == 'Admin' ? (
              <div className={`${row?.invoiced == true && isMobile ? "cy" : "order"} ${row.status == "New" ? "orderid" : row.status == "In Transit" ? "orderid" :""}`} onClick={() => setOpenAc(!openAcc)}>
                <span className="orderwi" style={{ fontWeight: 'bolder' }}><b>{row?.id}</b></span>
              </div>
            ) : null}
            {level == 'Admin' ? (
              <>
                <div className={`${row?.invoiced == true && isMobile ? "cys" : "date"} ${row.status == "New" ? "orderdate" : row.status == "In Transit" ? "orderdate" :""}`} onClick={() => setOpenAc(!openAcc)}>
                  {new Date(row?.date?.seconds * 1000)?.toLocaleDateString() == 'Invalid Date' ? new Date().toLocaleDateString() : new Date(row?.date?.seconds * 1000)?.toLocaleDateString()}
                  {isMobile == true ? (
                    <>
                      {row?.partial !== undefined && row?.partial !== "" && row?.status != 'Paid' ? (
                        <div className={row?.invoiced == true && isMobile ? "cysssz" : ""}>
                          <span style={{ paddingTop: '3px', paddingBottom: '3px', color: 'red', fontWeight: 'bold', borderRadius: '5px', padding: '0px' }}>
                            <span>$</span>{rowPrice}/ <span>$</span>{getpricea()}
                          </span>
                        </div>
                      ) : (
                          <div className={row?.invoiced == true && isMobile ? "cysssz" : ""}>
                            <span style={{ width: "20%", padding: '2px 5spx', color: 'red', fontWeight: 'bold', borderRadius: '5px' }}>
                              <span>$</span>
                              {rowPrice}
                            </span>
                          </div>
                        )}
                    </>
                  ) : null}
                </div>
                <div onClick={() => setOpenAc(!openAcc)} className={`${row?.status == "In Transit" && isMobile ? "citytransit" : row?.invoiced == true && isMobile ? "cyss" : "city"} ${row.status == "New" ? "orderaddre" : row.status == "In Transit" ? "orderaddre" :""} `}>
                  {row?.pickup?.city}.{row?.pickup?.state} <br /> {row?.delivery?.city}.{row?.delivery?.state}
                </div>

                <div
                  className={`${row?.invoiced == true && isMobile ? "cysss" : "driver"} ${row.status == "New" ? "orderdriver" : row.status == "In Transit" ? "orderdriver" :""}`}
                >
                  <span style={{ color: row?.driver.name == "TO ASSIGN DRIVER" ? "red" : "", fontWeight: row?.driver.name == "TO ASSIGN DRIVER" ? 'bold' : "" }}>
                    {row?.driver.name}
                    <p style={{color:'black',fontWeight:'normal'}}> {row?.pickup?.datn == undefined ? (
                  <>
                    {row?.pickup?.estTime?.seconds !== undefined ? new Date(row?.pickup?.estTime?.seconds * 1000).toLocaleDateString() :""}{" - "}
                  </>
                ) : (
                    <>
                      {row?.pickup?.datn}{' - '}
                    </>
                  )}
                   {row?.delivery?.datn == undefined ? (
                  <>
                    {row?.delivery?.estTime?.seconds !== undefined ? new Date(row?.delivery?.estTime?.seconds * 1000).toLocaleDateString() : ""}
                  </>
                ) : (
                    <>
                      {row?.delivery?.datn}
                    </>
                  )}
                  </p>
                  </span>
                  {mobileItem()}
                </div>

                {isMobile === false ? (
                  <>
                    {row?.partial !== undefined && row?.partial !== "" && row?.status != 'Paid' ? (
                      <div onClick={() => setOpenAc(!openAcc)} className={row?.invoiced == true && isMobile ? "cysssz" : "price"}>
                        <span>
                          <span>$</span>
                          {rowPrice} / <span>$</span>{getpricea()}
                        </span>
                      </div>
                    ) : (
                        <div onClick={() => setOpenAc(!openAcc)} className={row?.invoiced == true && isMobile ? "cysssz" : "price"}>
                          <span>
                            <span>$</span>
                            {rowPrice}
                          </span>
                        </div>
                      )}
                  </>
                ) : null}

                <div
                  className="inv"
                  onClick={() => setOpenAc(!openAcc)}
                >
                  {row?.partial !== undefined && row?.partial !== "" && row?.partial?.length ? (
                    <button
                      className="invbt"
                      style={{
                        background: "#b93b4e",
                        display:
                          row?.status != 'Paid'
                            ? ''
                            : 'none',
                      }}
                    >
                      {row?.status != 'Paid' && "Partial"}
                    </button>
                  ) : null}
                </div>
                <div
                  className="tonu"
                  onClick={() => setOpenAc(!openAcc)}
                >
                  <button
                    className="tonubt"
                    style={{
                      display: row?.tonu == true ? '' : 'none',
                    }}
                  >
                    {row?.tonu == true && 'TONU'}
                  </button>
                </div>
                <div

                  className="tonua"
                  onClick={() => setOpenAc(!openAcc)}
                >
                  <span
                    style={{
                      display: row?.removePaymentStatus == true ? '' : 'none',
                    }}
                  >
                    {row?.removePaymentStatus == true && <img width="40px" height="40px" src="/credit-card-remove.png" />}
                  </span>
                </div>

                {/* )} */}
                <div
                  className="note"
                  onClick={() => setOpenAc(!openAcc)}
                >
                  {row?.orderNotes != '' &&
                    row?.orderNotes != undefined &&
                    <button className="notebt">
                      NOTES
                  </button>
                  }
                </div>
                <div
                  className="stop"
                  onClick={() => setOpenAc(!openAcc)}
                >
                  {row?.stop === true &&
                    <img src="Stop.png" alt="check" width="30px" />
                  }
                  {row?.stop === false &&
                    <button className="go">Go</button>
                  }
                </div>
                <div
                  className="lumper"
                  onClick={() => setOpenAc(!openAcc)}
                >
                  {row?.lumper?.length > 0 && (
                    <button
                      className="lumperbt"
                    >
                      <b>Lumper</b>
                    </button>
                  )}
                </div>
                <div
                  className="det"
                  onClick={() => setOpenAc(!openAcc)}
                >
                  {row?.dets?.length > 0 && (
                    <button
                      className="detbt"
                    >
                      <b>Detention</b>
                    </button>
                  )}
                </div>
                <div
                  className="lay"
                  onClick={() => setOpenAc(!openAcc)}
                >
                  {row?.news?.length > 0 && (
                    <button
                      className="laybt"
                    >
                      <b>Layover</b>
                    </button>
                  )}
                </div>
              </>
            ) : (
                <>
                  {isMobile == true ? (
                    <>
                      <div onClick={() => setOpenAc(!openAcc)}>
                        <span>
                          <b>{row?.id}</b>
                        </span>
                      </div>
                      <div onClick={() => setOpenAc(!openAcc)}>
                        {newfilterdata?.length && newfilterdata?.map(el => {
                          if (el.approve === false) {
                            return (
                              <span>
                                <span>$</span>
                                {rowPrice}
                              </span>
                            )
                          }
                        })}
                      </div>
                      <div onClick={() => setOpenAc(!openAcc)}>
                        <span>
                          {row?.pickup?.city}.{row?.pickup?.state} - {row?.delivery?.city}.{row?.delivery?.state}
                        </span>
                      </div>
                      <div>
                        {mobileItem()}
                      </div>
                    </>
                  ) : null}

                  {isMobile == false ? (
                    <>
                      <div onClick={() => setOpenAc(!openAcc)}>
                        <span>
                          <b>{row?.id}</b>
                        </span>
                      </div>
                      <div onClick={() => setOpenAc(!openAcc)}>
                        <span>
                          {new Date(row?.date?.seconds * 1000)?.toLocaleDateString() == 'Invalid Date' ? new Date().toLocaleDateString() : new Date(row?.date?.seconds * 1000)?.toLocaleDateString()}
                        </span>
                      </div>
                      <div onClick={() => setOpenAc(!openAcc)}>
                        <span>
                          {row?.pickup?.city}.{row?.pickup?.state} - {row?.delivery?.city}.{row?.delivery?.state}
                        </span>
                      </div>
                      <div onClick={() => setOpenAc(!openAcc)}>
                        {newfilterdata?.length && newfilterdata?.map(el => {
                          if (el.approve === false) {
                            return (
                              <div className="price">
                                <span>
                                  <span>$</span>
                                  {rowPrice}
                                </span>
                              </div>
                            )
                          }
                        })}
                      </div>
                    </>
                  ) : null}
                </>
              )}
            {deletorder !== undefined && (
              <>
                {isMobile === true ? (
                  <>
                    <div style={{ margin: '0 10px' }}>
                      <PopupState variant="popover" popupId="popup"  >
                        {(popupState) => {
                          return (
                            <>
                              <IconButton
                                size="small"

                                aria-label="add"
                                {...bindTrigger(popupState)}
                              >
                                <MoreIcon />
                              </IconButton>

                              <Popover
                                PaperProps={{
                                  style: {
                                    minWidth: '300px!important',
                                  },
                                }}
                                {...bindPopover(popupState)}
                                anchorOrigin={{
                                  vertical: 'center',
                                  horizontal: 'center',
                                }}
                                transformOrigin={{
                                  vertical: 'bottom',
                                  horizontal: 'right',
                                }}
                              >
                                {level == 'Admin' ? (
                                  <Box p={0}>
                                    <List disablePadding>
                                      {archive ? null : (
                                        <ListItem
                                          button
                                          onClick={() => PermanentDelete(popupState)}
                                        >
                                          <ListItemText>Delete Order</ListItemText>
                                        </ListItem>
                                      )}
                                      <ListItem button>
                                        <ListItemText><span onClick={() => showConfirmUndo(popupState)}>Undo Order</span></ListItemText>
                                      </ListItem>
                                    </List>
                                  </Box>
                                ) : null}
                              </Popover>
                            </>
                          )
                        }}
                      </PopupState>
                    </div>
                  </>
                ) : null}
              </>
            )}


            {deletorder !== undefined && (
              <>
                {isMobile === false ? (
                  <div style={{ margin: '0 10px' }} className="mo">
                    <PopupState variant="popover" popupId="popup"  >
                      {(popupState) => {
                        return (
                          <>
                            <IconButton
                              size="small"
                              // color="primary"

                              aria-label="add"
                              {...bindTrigger(popupState)}
                            >
                              {/* iconn */}
                              <MoreIcon />
                            </IconButton>

                            <Popover
                              PaperProps={{
                                style: {
                                  minWidth: '300px!important',
                                },
                              }}
                              {...bindPopover(popupState)}
                              anchorOrigin={{
                                vertical: 'center',
                                horizontal: 'center',
                              }}
                              transformOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                              }}
                            >
                              {level == 'Admin' ? (
                                <Box p={0}>
                                  <List disablePadding>
                                    {archive ? null : (
                                      <ListItem
                                        button
                                        onClick={() => PermanentDelete(popupState)}
                                      >
                                        <ListItemText>Delete Order</ListItemText>
                                      </ListItem>
                                    )}
                                    <ListItem button>
                                      <ListItemText><span onClick={() => showConfirmUndo(popupState)}>Undo Order</span></ListItemText>
                                    </ListItem>

                                  </List>
                                </Box>
                              ) : null}
                            </Popover>
                          </>
                        );
                      }}
                    </PopupState>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </TableCell>



        {/* //////////////////////////////////////// For Dekstop////////////////////////////////////// */}
        {deletorder == undefined && (
          <>
            {isMobile === false ? (
              <div style={{ margin: '0 10px' }} className="mo">
                <PopupState variant="popover" popupId="popup"  >
                  {(popupState) => {
                    return (
                      <>
                        <IconButton
                          size="small"
                          // color="primary"

                          aria-label="add"
                          {...bindTrigger(popupState)}
                        >
                          {/* iconn */}
                          <MoreIcon />
                        </IconButton>

                        <Popover
                          PaperProps={{
                            style: {
                              minWidth: '300px!important',
                            },
                          }}
                          {...bindPopover(popupState)}
                          anchorOrigin={{
                            vertical: 'center',
                            horizontal: 'center',
                          }}
                          transformOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                          }}
                        >
                          <Box
                            p={0}
                            style={{ display: 'flex', flexDirection: 'column' }}
                          >
                            <List disablePadding>
                              {level != 'Admin' ? (
                                <>
                                  <ListItem
                                    button
                                    disabled={row?.status == 'New' ? true : false}
                                    onClick={() => {
                                      showConfirmNEW(popupState)
                                    }}
                                  >
                                    <ListItemText>Mark as New</ListItemText>
                                  </ListItem>
                                  <ListItem
                                    button
                                    disabled={row?.status == 'In Transit' ? true : false}
                                    onClick={() => {
                                      showConfirmTrainsit(popupState)
                                    }}
                                  >
                                    <ListItemText>Mark as In Transit</ListItemText>
                                  </ListItem>
                                  <ListItem
                                    button
                                    disabled={row?.status == 'Delivered' ? true : false}
                                    onClick={() => {
                                      showConfirmDeleivered(popupState)
                                    }}
                                  >
                                    <ListItemText>Mark as Delivered</ListItemText>
                                  </ListItem>
                                </>
                              ) : null}


                              {level == 'Admin' ? (
                                <>
                                  <ListItem
                                    button
                                    disabled={row?.status == 'New' ? true : false}
                                    onClick={() => {
                                      markAs('new');
                                      openNotification2("bottomRight", "New")
                                      popupState.close();
                                    }}
                                  >
                                    <ListItemText>Mark as New</ListItemText>
                                  </ListItem>
                                  <ListItem
                                    button
                                    disabled={row?.status == 'In Transit' ? true : false}
                                    onClick={() => {
                                      markAs('intransit');
                                      openNotification2("bottomRight", "In Transit")
                                      popupState.close();
                                    }}
                                  >
                                    <ListItemText>Mark as In Transit</ListItemText>
                                  </ListItem>
                                  <ListItem
                                    button
                                    disabled={row?.status == 'Delivered' ? true : false}
                                    onClick={() => {
                                      // markAs('delivered');
                                      deleiverpopup()
                                      // openNotification2("bottomRight", "Delivered")
                                      popupState.close();
                                    }}
                                  >
                                    <ListItemText>Mark as Delivered</ListItemText>
                                  </ListItem>

                                  <ListItem
                                    button
                                    disabled={row?.status == 'Paid' ? true : false}
                                    onClick={() => {
                                      markAsPaid();
                                      popupState.close();
                                    }}
                                  >
                                    <ListItemText>Mark as paid</ListItemText>
                                  </ListItem>
                                  <ListItem
                                    button
                                    onClick={() => {
                                      showConfirm23(popupState)
                                      // popupState.close();
                                    }}
                                  >
                                    <ListItemText>Mark as Invoiced</ListItemText>
                                  </ListItem>
                                  {row.partiallyPaids == true ? (
                                    <ListItem
                                      button
                                      onClick={() => {
                                        RemovePriceConfirm(popupState);
                                      }}
                                    >
                                      <ListItemText>Remove Payment</ListItemText>
                                    </ListItem>
                                  ) : null}
                                  {row?.cancelTonuStatus == undefined || row?.cancelTonuStatus == false || row?.cancelTonuStatus == null ? (
                                    <ListItem
                                      button
                                      onClick={() => {
                                        popupState.close()
                                        setModalOpen(true)
                                      }}
                                    >
                                      <ListItemText>Mark as Canceled/TONU</ListItemText>
                                    </ListItem>
                                  ) : null}
                                  {row.cancelTonuStatus == true && (
                                    <ListItem
                                      button
                                      onClick={() => {
                                        popupState.close()
                                        setModalOpen2(true)
                                      }}
                                    >
                                      <ListItemText>Mark as Undo Canceled/TONU</ListItemText>
                                    </ListItem>
                                  )}


                                  <ListItem
                                    button
                                    onClick={() => {
                                      downloadInvoice();
                                      openNotification3("bottomRight")
                                      popupState.close();
                                    }}
                                  >
                                    <ListItemText>Download Invoice</ListItemText>
                                  </ListItem>
                                </>
                              ) : null}
                              {level == 'Admin' ? (
                                <ListItem
                                  button
                                  onClick={() => {
                                    // setFiless(true)
                                    setIsModalVisible2(true)
                                    popupState.close();

                                  }}
                                >
                                  <ListItemText>Add PDF</ListItemText>
                                </ListItem>
                              ) : (
                                  <>
                                    {userss?.accessLevel == "Admin" && ( /////////// User  to Admin
                                      <>
                                        {newfilterdata?.length && newfilterdata?.map(el => {
                                          if (el.approve === false) {
                                            return (
                                              <ListItem
                                                button
                                                onClick={() => {
                                                  setIsModalVisible2(true)
                                                  popupState.close();

                                                }}
                                              >
                                                <ListItemText>Add PDF</ListItemText>
                                              </ListItem>
                                            )
                                          }
                                        })}
                                      </>
                                    )}
                                  </>
                                )}
                            </List>
                          </Box>
                          <Divider></Divider>
                          {level == 'Admin' ? (
                            <Box p={0}>
                              <List disablePadding>
                                {archive ? null : (
                                  <ListItem
                                    button
                                    onClick={() => {
                                      router.push(`/orders/edit/${row?.id}`);
                                    }}
                                  >
                                    <ListItemText>Edit Order</ListItemText>
                                  </ListItem>
                                )}
                                <ListItem button>
                                  <ListItemText><span onClick={() => showConfirm(popupState)}>Delete Order</span></ListItemText>
                                </ListItem>
                              </List>
                              <ListItem
                                button
                                disabled={row?.status == 'Paid' ? true : false}
                                onClick={() => {
                                  setIsModalVisible4(true);
                                  popupState.close();
                                }}
                              >
                                <ListItemText>Add order notes</ListItemText>
                              </ListItem>
                            </Box>
                          ) : null}
                          {level == 'Admin' && (
                            <>
                              {row?.stop == false || row?.stop == undefined ? (
                                <ListItem
                                  button
                                  onClick={() => {
                                    setIsModalVisible3(true)
                                    popupState.close();
                                  }}
                                >
                                  <ListItemText>Stop Billing</ListItemText>
                                </ListItem>
                              ) : null}
                              {row?.stop === true &&
                                <ListItem
                                  button
                                  onClick={() => {
                                    stopHandler(false)
                                    popupState.close();
                                  }}
                                >
                                  <ListItemText>Start Billing</ListItemText>
                                </ListItem>}
                            </>
                          )}

                          <Divider />
                          {level == 'Admin' ? (
                            <>
                              <Box p={0}>

                                <Divider />
                                <ListItem
                                  button
                                  disabled={row?.status == 'Paid' ? true : false}
                                  onClick={() => {
                                    setDet(true);
                                    popupState.close();
                                  }}
                                >
                                  <ListItemText>Add order detention</ListItemText>
                                </ListItem>
                                <Divider />
                                {/* {row?.news?.length > 0 ? null : ( */}
                                <ListItem
                                  button
                                  disabled={row?.status == 'Paid' ? true : false}
                                  onClick={() => {
                                    setLayover(true);
                                    popupState.close();
                                  }}
                                >
                                  <ListItemText>Add Layover</ListItemText>
                                </ListItem>
                                {/* )} */}
                                {/* {row?.lumper?.length > 0 ? null : ( */}
                                <ListItem
                                  button
                                  disabled={row?.status == 'Paid' ? true : false}
                                  onClick={() => {
                                    setLumper(true);
                                    popupState.close();
                                  }}
                                >
                                  <ListItemText>Add Lumper Fee</ListItemText>
                                </ListItem>
                                {/* )} */}

                                {row?.tonu == true ? (
                                  <ListItem
                                    button
                                    disabled={row?.status == 'Paid' ? true : false}
                                    onClick={() => {
                                      removeTonu();
                                      popupState.close();
                                    }}
                                  >
                                    <ListItemText>Remove TONU</ListItemText>
                                  </ListItem>
                                ) : (
                                    <ListItem
                                      button
                                      disabled={row?.status == 'Paid' ? true : false}
                                      onClick={() => {
                                        setTonu(true);
                                        setItemDescription('Truck Order Not Used');
                                        popupState.close();
                                      }}
                                    >
                                      <ListItemText>TONU</ListItemText>
                                    </ListItem>
                                  )}
                                {row?.dets?.length > 0 ? (
                                  <ListItem
                                    button
                                    disabled={row?.status == 'Paid' ? true : false}
                                    onClick={() => {
                                      removeDets();
                                      popupState.close();
                                    }}
                                  >
                                    <ListItemText>
                                      Remove order detention
                        </ListItemText>
                                  </ListItem>
                                ) : null}
                                {row?.news?.length > 0 ? (
                                  <ListItem
                                    button
                                    disabled={row?.status == 'Paid' ? true : false}
                                    onClick={() => {
                                      removeLayover();
                                      popupState.close();
                                    }}
                                  >
                                    <ListItemText>
                                      Remove order Layover
                        </ListItemText>
                                  </ListItem>
                                ) : null}
                                {row?.lumper?.length > 0 ? (
                                  <ListItem
                                    button
                                    disabled={row?.status == 'Paid' ? true : false}
                                    onClick={() => {
                                      removeLumper();
                                      popupState.close();
                                    }}
                                  >
                                    <ListItemText>
                                      Remove Lumper Fee
                        </ListItemText>
                                  </ListItem>
                                ) : null}


                                {archive ? (
                                  <ListItem
                                    button
                                    onClick={() => {
                                      restoreOrder();
                                      popupState.close();
                                    }}
                                  >
                                    <ListItemText>Restore Order</ListItemText>
                                  </ListItem>
                                ) : (
                                    <ListItem
                                      button
                                      onClick={() => {
                                        archiveOrder();
                                        openNotification5("bottomRight")
                                        popupState.close();
                                      }}
                                    >
                                      <ListItemText>Archive Order</ListItemText>
                                    </ListItem>
                                  )}
                              </Box>
                              <Divider></Divider>
                            </>
                          ) : null}
                        </Popover>
                      </>
                    );
                  }}
                </PopupState>

                <Dialog
                  className={classes2.dialog}
                  open={open2}
                  onClose={() => setOpen2(false)}
                >
                  <DialogContent>
                    <div style={{ marginBottom: 10 }}>
                      <InputLabel className={classes2.label}>
                        Payment Method
                      </InputLabel>
                      <Select
                        variant={'outlined'}
                        value={method2}
                        fullWidth
                        onChange={(event) => setMethod2(event.target.value)}
                      >
                        {methods.map((item) => (
                          <MenuItem key={item} value={item}>
                            {item}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                    <TextField
                      id="standard-number"
                      label="Partially Payment"
                      type="number"
                      variant={'outlined'}
                      fullWidth
                      value={partiallyPaid}
                      onChange={(e) => setPartiallyPaid(e.target.value)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      style={{ marginBottom: '5px' }}
                    />
                    <TextField
                      variant={'outlined'}
                      fullWidth
                      label="Partially Payment Notes"
                      multiline
                      rows={3}
                      value={notes2}
                      onChange={(event) => setnotes2(event.target.value)}
                    ></TextField>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      color={'primary'}
                      fullWidth
                      onClick={() => {
                        markAs('paid');
                        // setOpen2(false);
                      }}
                    >
                      Partially Paid
                  </Button>
                  </DialogActions>
                </Dialog>
                <Dialog
                  className={classes2.dialog}
                  open={open}
                  onClose={() => setOpen(false)}
                >
                  <DialogContent>
                    <div style={{ marginBottom: 10 }}>
                      <InputLabel className={classes2.label}>
                        Payment Method (Required)
                      </InputLabel>
                      <Select
                        variant={'outlined'}
                        value={method}
                        fullWidth
                        required
                        onChange={(event) => setMethod(event.target.value)}
                      >
                        {methods.map((item) => (
                          <MenuItem key={item} value={item}>
                            {item}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                    <TextField
                      id="standard-number"
                      label="Amount Received ( including factoring fee) "
                      type="number"
                      variant={'outlined'}
                      fullWidth
                      required
                      value={partiallyPaid}
                      onChange={(e) => setPartiallyPaid(e.target.value)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      style={{ marginBottom: '5px' }}
                    />
                    <InputLabel className={classes2.label}>Payment Notes (Optional)</InputLabel>
                    <TextField
                      variant={'outlined'}
                      fullWidth
                      multiline
                      required
                      rows={3}
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                    ></TextField>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      color={'primary'}
                      fullWidth
                      onClick={() => {
                        if (partiallyPaid != "" && method != "") {
                          markAs('paid');
                          openNotification2("bottomRight", "Paid")
                          setOpen(false);

                        }
                      }}
                    >
                      Mark as paid
                  </Button>
                  </DialogActions>
                </Dialog>
                <Dialog
                  className={classes2.dialog}
                  open={det}
                  onClose={() => setDet(false)}
                >
                  <DialogContent style={{ padding: 8, paddingBottom: 0 }}>
                    <TextField
                      variant={'outlined'}
                      label={'Notes'}
                      value={itemDescription}
                      onChange={(event) => setItemDescription(event.target.value)}
                    />
                    <TextField
                      style={{ marginLeft: 8 }}
                      variant={'outlined'}
                      label={'Price'}
                      type={'number'}
                      value={itemPrice}
                      onChange={(event) => setItemPrice(event.target.value)}
                    />
                    <TextField
                      variant={'outlined'}
                      label={'Detention Hours'}
                      style={{ width: '100%', marginTop: '20px' }}
                      type={'number'}
                      value={itemHours}
                      onChange={(event) => setItemHours(event.target.value)}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button
                      color={'primary'}
                      variant={'outlined'}
                      fullWidth
                      onClick={() => handleItem()}
                    >
                      Add
                     </Button>
                  </DialogActions>
                </Dialog>


                {/* ////////// */}
                <Modal title="Attched PDF" okText="Save PDF" visible={isModalVisible2} onOk={() => AddPdfinOrder()} onCancel={handleCancel2}>

                  {row?.pdf_Order_1 != null || row?.pdf_Order_1 != undefined ? <a style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }} href={row?.pdf_Order_1} target="_blank"> View-PDF-1</a> : null}<br />
                  <Input placeholder="Enter your File Name" value={filename1} onChange={(e) => setfilename1(e.target.value)} />
                  <input type="file" style={{ backgroundColor: 'beige', marginTop: '10px' }} onChange={handChange} />
                  {togle1 === false ? (
                    <IconButton
                      style={{ marginRight: "-0.5em" }}
                      aria-label="delete"
                      onClick={() => {
                        settogle1(!togle1)
                      }}
                    >
                      <AddCircleIcon />
                    </IconButton>

                  ) : (
                      <IconButton
                        style={{ marginRight: "-0.5em" }}
                        aria-label="delete"
                        onClick={() => {
                          settogle1(!togle1)
                        }}
                      >
                        <RemoveCircleIcon />
                      </IconButton>
                    )}
                  <br />
                  {progress !== 0 && <Progress style={{ width: '100%', textAlign: 'center' }} type="circle" percent={progress} format={() => progress !== 100 ? progress : 'Done'} />}

                  {togle1 === true && (
                    <>
                      <Divider />
                      <Input style={{ marginTop: '20px' }} placeholder="Enter your File Name" value={filename2} onChange={(e) => setfilename2(e.target.value)} />
                      {row?.pdf_Order_2 != null || row?.pdf_Order_2 != undefined ? <a style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }} href={row?.pdf_Order_2} target="_blank">View-PDF-2</a> : null}<br />
                    </>
                  )}
                  <br />
                  {togle1 === true && <input type="file" style={{ backgroundColor: 'beige', marginTop: '10px' }} onChange={handChange2} />}
                  {togle2 === false ? (
                    <>
                      {togle1 === true && togle2 === false && (
                        <IconButton
                          style={{ marginRight: "-0.5em" }}
                          aria-label="delete"
                          onClick={() => {
                            settogle2(!togle2)
                          }}
                        >
                          <AddCircleIcon />
                        </IconButton>
                      )}
                    </>
                  ) : (
                      <IconButton
                        style={{ marginRight: "-0.5em" }}
                        aria-label="delete"
                        onClick={() => {
                          settogle2(!togle2)
                          settogle1(!togle1)

                        }}
                      >
                        <RemoveCircleIcon />
                      </IconButton>
                    )}
                  {progress2 !== 0 && <Progress style={{ width: '100%', textAlign: 'center' }} type="circle" percent={progress2} format={() => progress2 !== 100 ? progress2 : 'Done'} />}


                  <br />
                  {togle2 === true && (
                    <>
                      <Divider />

                      <Input style={{ marginTop: '20px' }} placeholder="Enter your File Name" value={filename3} onChange={(e) => setfilename3(e.target.value)} />
                      {row?.pdf_Order_4 != null || row?.pdf_Order_4 != undefined ? <a style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }} href={row?.pdf_Order_3} target="_blank">View-PDF 3</a> : null}<br />
                    </>
                  )}
                  <br />
                  {togle2 === true && <input type="file" style={{ backgroundColor: 'beige', marginTop: '10px' }} onChange={handChange3} />}
                  {togle4 === false ? (
                    <>
                      {togle2 === true && (
                        <IconButton
                          style={{ marginRight: "-0.5em" }}
                          aria-label="delete"
                          onClick={() => {
                            settogle4(!togle4)
                          }}
                        >
                          <AddCircleIcon />
                        </IconButton>
                      )}
                    </>
                  ) : (
                      <IconButton
                        style={{ marginRight: "-0.5em" }}
                        aria-label="delete"
                        onClick={() => {
                          settogle4(!togle4)
                          settogle3(!togle3)

                        }}
                      >
                        <RemoveCircleIcon />
                      </IconButton>
                    )}
                  {progress3 !== 0 && <Progress style={{ width: '100%', textAlign: 'center' }} type="circle" percent={progress3} format={() => progress3 !== 100 ? progress3 : 'Done'} />}

                  <br />
                  {togle4 === true && (
                    <>
                      <Divider />

                      <Input style={{ marginTop: '20px' }} placeholder="Enter your File Name" value={filename4} onChange={(e) => setfilename4(e.target.value)} />
                      {row?.pdf_Order_3 != null || row?.pdf_Order_3 != undefined ? <a style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }} href={row?.pdf_Order_4} target="_blank">View-PDF-4</a> : null}<br />
                    </>
                  )}
                  <br />
                  {togle4 === true && <input type="file" style={{ backgroundColor: 'beige', marginTop: '10px' }} onChange={handChange4} />}
                  {togle3 === false && (
                    <>
                      {togle4 === true && togle3 === false && (
                        <IconButton
                          style={{ marginRight: "-0.5em" }}
                          aria-label="delete"
                          onClick={() => {
                            settogle4(!togle1)
                            settogle3(!togle2)
                          }}
                        >
                          <RemoveCircleIcon />
                        </IconButton>
                      )}
                    </>
                  )}
                  {progress4 !== 0 && <Progress style={{ width: '100%', textAlign: 'center' }} type="circle" percent={progress4} format={() => progress4 !== 100 ? progress4 : 'Done'} />}
                </Modal>

                {/* //////// */}
                <Dialog
                  className={classes2.dialog}
                  open={Layover}
                  onClose={() => setLayover(false)}
                >
                  <DialogContent style={{ padding: 8, paddingBottom: 0 }}>
                    <TextField
                      variant={'outlined'}
                      label={'Notes'}
                      value={layoverDescription}
                      onChange={(event) => setLayoverDescription(event.target.value)}
                    />
                    <TextField
                      style={{ marginLeft: 8 }}
                      variant={'outlined'}
                      label={'Price'}
                      type={'number'}
                      value={layoverPrice}
                      onChange={(event) => setLayoverPrice(event.target.value)}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button
                      color={'primary'}
                      variant={'outlined'}
                      fullWidth
                      onClick={() => handleItem2()}
                    >
                      Add
                  </Button>
                  </DialogActions>
                </Dialog>
                {/* ..... */}
                <Dialog
                  className={classes2.dialog}
                  open={Lumper}
                  onClose={() => setLumper(false)}
                >
                  <DialogContent style={{ padding: 8, paddingBottom: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Radio.Group onChange={(event) => setLumperDesc(event.target.value)} value={lumperDesc}>
                        <Radio value={"Paid by Driver"}>Paid by Driver</Radio>
                        <Radio value={"Paid by Company"}>Paid by Company</Radio>
                      </Radio.Group>
                      <TextField
                        style={{ marginLeft: 8 }}
                        variant={'outlined'}
                        label={'Price'}
                        type={'number'}
                        value={lumperPrice}
                        onChange={(event) => setLumperPrice(event.target.value)}
                      />
                    </div>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      color={'primary'}
                      variant={'outlined'}
                      fullWidth
                      onClick={() => handleItem3()}
                    >
                      Add Lumper Fee
                   </Button>
                  </DialogActions>
                </Dialog>

                <Dialog
                  className={classes2.dialog}
                  open={tonu}
                  onClose={() => setTonu(false)}
                >
                  <DialogContent style={{ padding: 8, paddingBottom: 0 }}>
                    <TextField
                      variant={'outlined'}
                      label={'Item Price'}
                      type={'number'}
                      value={itemPrice}
                      onChange={(event) => setItemPrice(event.target.value)}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button
                      color={'primary'}
                      variant={'outlined'}
                      fullWidth
                      onClick={() => handleTonu()}
                    >
                      Set
                   </Button>
                  </DialogActions>
                </Dialog>
                <Dialog
                  className={classes2.dialog}
                  open={notesDialog}
                  onClose={() => setNotesDialog(false)}
                >
                  <DialogContent style={{ padding: 8, paddingBottom: 0 }}>
                    <TextField
                      variant={'outlined'}
                      fullWidth
                      multiline
                      label={'Notes'}
                      name="ordernotes"
                      value={orderNotes}
                      onChange={(event) => setOrderNotes(event.target.value)}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button
                      color={'primary'}
                      variant={'outlined'}
                      fullWidth
                      onClick={() => handleNotes()}
                    >
                      Add Order Notes
        </Button>
                  </DialogActions>
                </Dialog>
              </div>
            ) : null}
          </>
        )}

        {/* //////////////Deskstop End //////////////////// */}

      </TableRow>
      <TableRow>
        <TableCell style={{ padding: '0 1px' }} colSpan={6}>
          <Collapse
            in={openAcc}
            timeout="auto"
            unmountOnExit
            style={{ paddingBottom: 10 }}
          >
            <div className={classes.root}>
              {alert ? (
                <Alert
                  className={classes.alert}
                  onClose={() => setAlert(false)}
                >
                  Saved
                </Alert>
              ) : null}

              <Details
                level={level}
                handleChangeIndex={handleChangeIndex}
                row={row}
                value={value}
                theme={theme}
                query={query}
                edit={edit}
                refresh={refresh}
                callback={(stateObj) => {
                  fnstateObj = stateObj;
                }}
              ></Details>
            </div>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment >
  );
}
