import { useState, useEffect } from 'react'
import clsx from 'clsx'
import { IconButton, TextField, Button, Toolbar, Tooltip, Typography, useMediaQuery } from '@material-ui/core'
import { lighten, makeStyles } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'
import CancelIcon from '@material-ui/icons/Cancel';
import FilterListIcon from '@material-ui/icons/FilterList';
import Box from '@material-ui/core/Box';
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import firebase, { auth } from "../../config/firebase";
import Popover from '@material-ui/core/Popover';
import PopupState, { bindPopover, bindTrigger, usePopupState } from 'material-ui-popup-state';
import Divider from '@material-ui/core/Divider';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useAuthState } from "react-firebase-hooks/auth";

import { List, ListItem, ListItemText } from '@material-ui/core'

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
        display: 'flex',
        flexWrap: 'wrap'
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: '1 1 100%',
    },
    btn: { marginRight: 4, flexGrow: 1, marginTop: 4 },
    btnss: { marginRight: 4, flexGrow: 1, marginTop: 4, height: '25px', lineHeight: '25px' },
}));
const useStyles = makeStyles({
    option: {
        fontSize: 15,
        '& > span': {
            marginRight: 10,
            fontSize: 18,
        },
    },
});

const EnhancedTableToolbar = ({ setstatuss, statuss, orders, refresh, numSelected, handleSearch, handleSort, drivers }) => {
    const classes = useToolbarStyles();
    const [user, loading, error] = useAuthState(auth);
    const classess = useStyles();
    const query = useMediaQuery('(max-width:480px)')
    const querys = useMediaQuery('(max-width:1100px)')
    const setOpen = () => {
    }
    const [searchVal, setSearchVal] = useState('')
    const [searchType, setSearchType] = useState('Order ID')
    const getitems = localStorage.getItem('status')
    const [status, setStatus] = useState(!getitems ? 'New' : getitems)
    const [driverss, loading2, error2] = useCollectionDataOnce(
        firebase.firestore().collection("drivers")
    );
    const dri = driverss?.filter(el => {
        drivers.filter(data => {
            if (data === el.name) {
                return el
            }
        })
    })

    useEffect(() => {
        localStorage.setItem('status', status)
        const getitem = localStorage.getItem('status')
        setstatuss(getitem)
    }, [status])
    useEffect(() => {
        if (searchType == "Driver name") {
            handleSearch(searchVal, searchType)
        }
    }, [searchVal])

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch(searchVal, searchType)
        }
    }

    const onCompanyChange = (event, value, reason) => {
        if (reason === "clear") {
            handleSearch("", searchType)
        } else if (reason == 'select-option') {
            handleSearch(event.target.outerText, searchType)
        }

    };
    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                    <>
                        {user.accessLevel == "Admin" && (
                            <>
                                {searchType == "Order ID" ? (
                                    <Autocomplete
                                        id="country-select-demo"
                                        className="iii"
                                        options={orders}
                                        classes={{
                                            option: classess.option,
                                        }}
                                        onChange={onCompanyChange}
                                        autoHighlight
                                        getOptionLabel={(option) => option.id}
                                        renderOption={(option) => (
                                            <>
                                                <span>{option.id}</span>
                                            </>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label={searchType}
                                                id="outlined-name"
                                                size={querys ? "small" : ""}
                                                value={searchVal}
                                                onKeyDown={handleKeyDown}
                                                onChange={(e) => setSearchVal(e.target.value)}
                                                variant="outlined"
                                                inputProps={{
                                                    ...params.inputProps,
                                                    autoComplete: 'new-password', // disable autocomplete and autofill
                                                }}
                                            />
                                        )}
                                    />
                                ) : (
                                        <TextField
                                            fullWidth={false}
                                            id="outlined-name"
                                            label={searchType}
                                            value={searchVal}
                                            onKeyDown={handleKeyDown}
                                            onChange={(e) => setSearchVal(e.target.value)}
                                            variant="outlined"
                                            InputProps={searchVal != '' ? {
                                                endAdornment:
                                                    <IconButton
                                                        style={{ marginRight: '-0.5em' }}
                                                        aria-label="delete" onClick={() => {
                                                            setSearchVal('');
                                                            handleSearch('')
                                                        }}>
                                                        <CancelIcon />
                                                    </IconButton>
                                            } : null}
                                        >
                                        </TextField>
                                    )}

                            </>
                        )}
                        {user.accessLevel == "Admin" && (
                            <>
                                {numSelected > 0 ? (
                                    <Tooltip title="Delete">
                                        <IconButton aria-label="delete">
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                ) : (
                                        <>
                                            <PopupState variant="popover" popupId="popup">
                                                {(popupState) => {
                                                    return (
                                                        <>
                                                            <Tooltip title="Options" style={{ marginLeft: '1em', marginRight: '60px' }}>
                                                                <IconButton aria-label="filter list" {...bindTrigger(popupState)}>
                                                                    <FilterListIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Popover
                                                                PaperProps={
                                                                    {
                                                                        style: {
                                                                            minWidth: '300px!important'
                                                                        }
                                                                    }
                                                                }
                                                                {...bindPopover(popupState)}
                                                                anchorOrigin={{
                                                                    vertical: 'bottom',
                                                                    horizontal: 'center',
                                                                }}
                                                                transformOrigin={{
                                                                    vertical: 'top',
                                                                    horizontal: 'center',
                                                                }}
                                                            >

                                                                <Box p={2}>
                                                                    <Typography variant={'button'} display={"block"} gutterBottom>Search by</Typography>
                                                                    <List disablePadding>
                                                                        <ListItem button onClick={() => { setSearchType('Order ID'); popupState.close() }}>
                                                                            <ListItemText>Order ID</ListItemText>
                                                                        </ListItem>
                                                                        {/* <ListItem button onClick={() => { setSearchType('Driver name'); popupState.close() }}>
                                            <ListItemText>Driver name</ListItemText>
                                        </ListItem> */}
                                                                        <ListItem button onClick={() => { setSearchType("Broker name"); popupState.close() }}>
                                                                            <ListItemText>Broker name</ListItemText>
                                                                        </ListItem>
                                                                        <ListItem button onClick={() => { setSearchType('Pickup name'); popupState.close() }}>
                                                                            <ListItemText>Pickup name</ListItemText>
                                                                        </ListItem>
                                                                        <ListItem button onClick={() => { setSearchType('Pickup address'); popupState.close() }}>
                                                                            <ListItemText>Pickup address</ListItemText>
                                                                        </ListItem>
                                                                        <ListItem button onClick={() => { setSearchType('Delivery name'); popupState.close() }}>
                                                                            <ListItemText>Delivery name</ListItemText>
                                                                        </ListItem>
                                                                        <ListItem button onClick={() => { setSearchType('Delivery address'); popupState.close() }}>
                                                                            <ListItemText>Delivery address</ListItemText>
                                                                        </ListItem>
                                                                    </List>
                                                                    <Divider />
                                                                </Box>
                                                                <Box p={2} style={{ display: 'flex', flexDirection: 'column' }}>
                                                                    <Typography variant={'button'} display={"block"} gutterBottom>Sort by</Typography>
                                                                    <List disablePadding>
                                                                        <ListItem button onClick={() => { handleSort('DESC'); popupState.close() }}>
                                                                            <ListItemText>Newest</ListItemText>
                                                                        </ListItem>
                                                                        <ListItem button onClick={() => {
                                                                            handleSort('ASC');
                                                                            popupState.close()
                                                                        }}>
                                                                            <ListItemText>Oldest</ListItemText>
                                                                        </ListItem>
                                                                    </List>
                                                                    <Divider />
                                                                </Box>
                                                                <Box p={2}>
                                                                    <Typography variant={'button'} display={"block"} gutterBottom>Drivers</Typography>
                                                                    <List disablePadding>

                                                                        {drivers?.map(driver => {
                                                                            return <ListItem button onClick={() => { setSearchType('Driver name'); setSearchVal(driver); popupState.close() }}>
                                                                                <ListItemText>{driver}</ListItemText>
                                                                            </ListItem>
                                                                        })}
                                                                    </List>
                                                                </Box>
                                                            </Popover>
                                                        </>
                                                    )
                                                }}
                                            </PopupState>
                                        </>
                                    )}
                            </>
                        )}
                    </>
                )}


            <Button style={{ background: status == 'New' ? '#5d5da7' : "", color: status == 'New' ? 'white' : '', fontWeight: 'bold',padding:'0', border: status == 'New' ? '3px solid #ffb03c' : '' }} className={querys === false ? classes.btn : classes.btnss} variant={status == 'New' ? 'contained' : 'outlined'} onClick={() => {
                localStorage.setItem('status', "New")
                setStatus('New')
                refresh()
            }}>New</Button>
            <Button style={{ background: status == 'In Transit' ? '#ab9f1f' : '', color: status == 'In Transit' ? 'white' : '', fontWeight: 'bold',padding:'0', border: status == 'In Transit' ? '3px solid #ffb03c' : '' }} className={querys === false ? classes.btn : classes.btnss} variant={status == 'In Transit' ? 'contained' : 'outlined'} onClick={() => {
                localStorage.setItem('status', "In Transit")
                setStatus('In Transit')
                refresh()
            }}>In Transit</Button>
            {/* {status != "Delivered" && ( */}
            <Button style={{ background: status == 'Delivered' ? '#559355' : '', color: status == 'Delivered' ? 'white' : '', fontWeight: 'bold',padding:'0', border: status == 'Delivered' ? '3px solid #ffb03c' : '' }} className={querys === false ? classes.btn : classes.btnss} variant={status == 'Delivered' ? 'contained' : 'outlined'} onClick={() => {
                localStorage.setItem('status', "Delivered")
                setStatus('Delivered')
                refresh()
            }}>Delivered</Button>
            {user.accessLevel == "Admin" && (
                <>
                    <Button style={{ background: status == 'Invoiced' ? '#9fa941' : "", color: status == 'Invoiced' ? 'white' : '', fontWeight: 'bold',padding:'0', border: status == 'Invoiced' ? '3px solid #ffb03c' : '' }} className={querys === false ? classes.btn : classes.btnss} variant={status == 'Invoiced' ? 'contained' : 'outlined'} onClick={() => {
                        localStorage.setItem('status', "Invoiced")
                        setStatus('Invoiced')
                    }}>Invoiced</Button>
                    <Button style={{ background: status == 'Paid' ? '#2e8ab3' : '', color: status == 'Paid' ? 'white' : '', fontWeight: 'bold',padding:'0', border: status == 'Paid' ? '3px solid #ffb03c' : '' }} className={querys === false ? classes.btn : classes.btnss} variant={status == 'Paid' ? 'contained' : 'outlined'} onClick={() => {
                        localStorage.setItem('status', "Paid")
                        setStatus('Paid')
                        refresh()
                    }}>Paid</Button>
                    <Button style={{ background: status == 'Canceled/TONU' ? 'rgb(65 89 100)' : '', color: status == 'Canceled/TONU' ? 'white' : '',padding:'0', fontWeight: 'bold', border: status == 'Canceled/TONU' ? '3px solid #ffb03c' : '' }} className={querys === false ? classes.btn : classes.btnss} variant={status == 'Canceled/TONU' ? 'contained' : 'outlined'} onClick={() => {
                        localStorage.setItem('status', "Canceled/TONU")
                        setStatus('Canceled/TONU')
                        refresh()
                    }}>Canceled/TONU</Button>
                    <Button style={{ background: status == 'oldPaid' ? 'rgba(107, 47, 175, 0.86)' : '', color: status == 'oldPaid' ? 'white' : '',padding:'0', fontWeight: 'bold', border: status == 'oldPaid' ? '3px solid #ffb03c' : '' }} className={querys === false ? classes.btn : classes.btnss} variant={status == 'oldPaid' ? 'contained' : 'outlined'} onClick={() => {
                        localStorage.setItem('status', "oldPaid")
                        setStatus('oldPaid')
                    }}>Archived</Button>
                </>
            )}
        </Toolbar>
    );
};

export default EnhancedTableToolbar