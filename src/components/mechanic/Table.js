import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import firebase from "../../config/firebase";
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import { useRouter } from 'next/router';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { Menu as Menus, Dropdown } from 'antd';
import { Select } from 'antd'
const ITEM_HEIGHT = 48;
const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
});

function Row(props) {
    const { row,setDrivers2,seta,a } = props;
    const classes = useRowStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const router = useRouter();
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const deleteOrder = (id) => {
        firebase
            .firestore()
            .collection("Equipments")
            .doc(id)
            .delete()
            .then(() => {
                seta(!a)
            });
    };
 
    return (

        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell align="left">{row.unit}</TableCell>
                <TableCell align="left">{new Date(row?.date.seconds * 1000).toLocaleDateString()}</TableCell>
                <TableCell align="left">{row.vinNumber}</TableCell>
                <TableCell align="left">{row.milage}</TableCell>
                <TableCell align="left">{row.modle}</TableCell>
                <TableCell align="left">{row.year}</TableCell>
                <TableCell align="left">{row.color}</TableCell>
                <div>
                    <IconButton
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="long-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                            style: {
                                maxHeight: ITEM_HEIGHT * 4.5,
                                width: '20ch',
                            },
                        }}
                    >
                        <MenuItem onClick={() => {
                            router.push(`/edit/${row.unit}`)
                            handleClose()
                        }}>
                            Edit
                            </MenuItem>
                        <MenuItem onClick={() => {
                            deleteOrder(row.unit)
                            handleClose()
                        }}>
                            Delete
                            </MenuItem>
                    </Menu>
                </div>
            </TableRow>
        </React.Fragment>
    );
}


export default function Tables() {
    const [drivers2, setDrivers2] = useState([]);
    const query = useMediaQuery('(max-width:1000px)')
    const [search, setSeach] = useState('')
    const [open, setOpen] = React.useState(false);
    const [togle, setTogle] = useState('')
    const [vehicles, setvehicles] = useState([])
    const Option = Select.Option
    const router = useRouter()
    const [a,seta] = useState(false)
    const getDrivers2 = () => {
        firebase
            .firestore()
            .collection("Equipments")
            .get()
            .then((querySnapshot) => {
                var customersCol = [];
                querySnapshot.forEach((doc) => {
                    customersCol.push(doc.data());
                });
                setDrivers2(customersCol);
            });
    };
    useEffect(getDrivers2, []);
    useEffect(getDrivers2, [a]);

    const deleteOrder = (id) => {
        firebase
            .firestore()
            .collection("Equipments")
            .doc(id)
            .delete()
            .then(() => {
                seta(!a)
            });
    };
    drivers2.sort(function (a, b) {
        return new Date(b?.date?.seconds) - new Date(a?.date?.seconds);
    });
    return (
        <>
        {query === false ? (
        <TableContainer component={Paper} >
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell style={{ width: '16.6%' }} align="left">Unit#</TableCell>
                        <TableCell style={{ width: '16.6%' }} align="left">Date</TableCell>
                        <TableCell style={{ width: '16.6%' }} align="left">Vin Number</TableCell>
                        <TableCell style={{ width: '16.6%' }} align="left">Milage</TableCell>
                        <TableCell style={{ width: '16.6%' }} align="left">Model</TableCell>
                        <TableCell style={{ width: '16.6%' }} align="left">Year</TableCell>
                        <TableCell style={{ width: '16.6%' }} align="left">Color</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {drivers2.map((row, i) => (
                        <Row key={i} row={row} setDrivers2={setDrivers2} seta={seta} a={a} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        ): (
            <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                {/* <Input style={{width:'20%',height:'30px'}} placeholder="Search ReapairCode...." value={search} onChange={(e) => setSeach(e.target.value)} /> */}
                <Select defaultValue={search === "" ? "Select Unit" : search} onChange={(e) => setSeach(e)}>
                    {drivers2.map(el => (
                        <Option key={el.unit}>{el.unit}</Option>
                    ))}
                </Select>
            </div>
            {drivers2?.map((row, i) => {
                if (row?.unit?.toLowerCase().includes(search.toLowerCase())) {
                    return (
                        <div key={i}>
                            <ul style={{ boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px', listStyleType: 'none', border: '1px solid lightgray', padding: '0', borderLeft: '2px solid rgb(61, 64, 82)' }} key={i} onClick={() => setOpen(!open)}>
                                <li style={{ width: '100%', display: 'flex', borderBottom: '1px solid #cab7b7', paddingLeft: '10px' }}><span style={{ width: '50%', margin: 'auto' }} onClick={() => setTogle(i)} ><b>Unit#</b></span><span style={{ width: '50%', textAlign: 'right', paddingRight: '10px' }}>{row?.unit}</span>
                                    <span>
                                        <Dropdown overlay=
                                            {
                                                <Menus>
                                                    <Menus.Item key="0">
                                                        <p onClick={() => router.push(`/edit/${row.unit}`)}>Edit</p>
                                                    </Menus.Item>
                                                    <Menus.Item key="1">
                                                        <p onClick={() => deleteOrder(row?.unit)}>Delete</p>
                                                    </Menus.Item>
                                                </Menus>
                                            } trigger={['click']} onClick={() => togle === "" ? setTogle('') : setTogle('')}>
                                            <IconButton
                                                style={{ padding: '0' }}
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                        </Dropdown>
                                    </span>
                                </li>
                                <li onClick={() => setTogle(i)} style={{ width: '100%', display: 'flex', borderBottom: '1px solid #cab7b7', paddingLeft: '10px' }}><span style={{ width: '50%', margin: 'auto' }}><b>Date</b></span><span style={{ width: '50%', textAlign: 'right', paddingRight: '10px' }}>{new Date(row?.date.seconds * 1000).toLocaleDateString()}</span></li>
                                {open === true && togle === i && (
                                    <>
                                        <li style={{ width: '100%', display: 'flex', borderBottom: '1px solid #cab7b7', paddingLeft: '10px' }}><span style={{ width: '50%', margin: 'auto' }}><b>Milage</b></span><span style={{ width: '50%', textAlign: 'right', paddingRight: '10px' }}>{row?.milage}</span></li>
                                        <li style={{ width: '100%', display: 'flex', borderBottom: '1px solid #cab7b7', paddingLeft: '10px' }}><span style={{ width: '50%', margin: 'auto' }}><b>Model</b></span><span style={{ width: '50%', textAlign: 'right', paddingRight: '10px' }}>{row?.modle}</span></li>
                                        <li style={{ width: '100%', display: 'flex', borderBottom: '1px solid #cab7b7', paddingLeft: '10px' }}><span style={{ width: '50%', margin: 'auto' }}><b>Color</b></span><span style={{ width: '50%', textAlign: 'right', paddingRight: '10px' }}>{row?.color}</span></li>
                                        <li style={{ width: '100%', display: 'flex', borderBottom: '1px solid #cab7b7', paddingLeft: '10px' }}><span style={{ width: '50%', margin: 'auto' }}><b>Vin Number</b></span><span style={{ width: '50%', textAlign: 'right', letterSpacing: '-1px', paddingRight: '10px' }}>{row?.vinNumber}</span></li>
                                        <li style={{ width: '100%', display: 'flex', borderBottom: '1px solid #cab7b7', paddingLeft: '10px' }}><span style={{ width: '50%', margin: 'auto' }}><b>Year</b></span><span style={{ width: '50%', textAlign: 'right', paddingRight: '10px' }}>{row.year}</span></li>
                                    </>
                                )}
                            </ul>
                        </div>
                    )
                }
            })}

        </div>
        )}
        </>
    );
}
