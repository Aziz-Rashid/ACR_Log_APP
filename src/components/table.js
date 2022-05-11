import React, { useMemo,useState,useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import Paper from '@material-ui/core/Paper';
import styl from '../../styles/Home.module.css'
import { DatePicker, Space } from 'antd';
import firebase from '../config/firebase'
import {
  TextField
} from "@material-ui/core";
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: 'rgb(61, 64, 82)',
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const useStyles = makeStyles({
  table: {
    minWidth: 200,

  },
});

export default function Tables({ so, from2, to2, setFrom2, setTo2, drivers }) {
  const classes = useStyles();
  var total = 0;
  so?.map(el => {
    total = parseFloat(total) + parseFloat(el?.price)
  })
  const dateFormatList = 'MM/DD/YYYY'
  const [get, setget] = useState(0)
  const [settings2, loading2, error2] = useCollectionDataOnce(
    firebase.firestore().collection('fee')
  )
  useEffect(() => {
    if (settings2?.length) {
      setget(settings2[0]?.factoryfee)
    }
  }, [loading2])

  let result = so.reduce((c, v) => {
    c[v.driver.name] = (c[v.driver.name] || 0) + parseFloat(v.price);
    return c;
  }, {});
  const sym = useMemo(() => {
    let initialValue = 0
    return so?.reduce(
      (previousValue, currentValue) => previousValue + Number(currentValue.price) || 0
      , initialValue
    )
  }, [so]);
  const sortable = Object.entries(result)
    .sort(([, a], [, b]) => b - a)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
    const aara = Number(sym) / 100 * Number(get)
    const fila = so?.filter(el => el.driver.name == 'Emmanuel Valentin' ? true : false)
    console.log(fila)
  return (
    <>
      {/* <h1 className="k">Monthly Company Revenue ${total.toFixed(2)}</h1> */}
      <div style={{ marginBottom: 10, textAlign: 'center' }}>
        <Space size={12}>
          <DatePicker format={dateFormatList} placeholder="Start-Date" style={{ height: '35px', width: '100%' }} onChange={(evt) => setFrom2(evt?._d)} />
          <DatePicker format={dateFormatList} placeholder="End-Date" style={{ height: '35px', width: '100%' }} onChange={(evt) => setTo2(evt?._d)} />
        </Space>
      </div>
      <TableContainer component={Paper} className={styl.hj}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Driver Name</StyledTableCell>
              <StyledTableCell> <span>Factoring Fees: ${aara}</span></StyledTableCell>
              <StyledTableCell align="right"><span>Total Income: ${total.toFixed(2)}</span></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>

            {Object.keys(sortable).map(function (key, index) {
              return (
                <StyledTableRow key={index}>
                  <StyledTableCell component="th" scope="row">{key}</StyledTableCell>
                  <StyledTableCell component="th" scope="row"></StyledTableCell>
                  <StyledTableCell align="right">${sortable[key].toFixed(2)}</StyledTableCell>
                </StyledTableRow>
              )
            })}
            <StyledTableRow>
              <StyledTableCell component="th" scope="row"></StyledTableCell>
              <StyledTableCell align="right"></StyledTableCell>
              <StyledTableCell align="right"></StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
