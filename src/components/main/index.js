import React from 'react';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListAlt from '@material-ui/icons/ListAlt';
import BusinessCenter from '@material-ui/icons/BusinessCenter';
import AccountBox from '@material-ui/icons/AccountBox';
import AddCircle from '@material-ui/icons/AddCircle';
import ExitToApp from '@material-ui/icons/ExitToApp';
import ArchiveIcon from '@material-ui/icons/Archive';
import AssessmentIcon from '@material-ui/icons/Assessment';
import SettingsIcon from '@material-ui/icons/Settings';
import FaceIcon from '@material-ui/icons/Face';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { auth } from '../../config/firebase';
import { useRouter } from 'next/router';
import BuildIcon from '@material-ui/icons/Build';
import TransferWithinAStationIcon from '@material-ui/icons/TransferWithinAStation';
import PeopleIcon from '@material-ui/icons/People';
import EmojiTransportationIcon from '@material-ui/icons/EmojiTransportation';
import DeleteIcon from '@material-ui/icons/Delete';
import Main from './Main';
import DashboardIcon from '@material-ui/icons/Dashboard';


const signOut = (
  <div>
    <ListItem button onClick={() => auth.signOut()}>
      <ListItemIcon>
        <ExitToApp style={{ color: "white" }} />
      </ListItemIcon>
      <ListItemText primary='Sign Out' />
    </ListItem>
  </div>
);

export function DriverMain(props) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const Markup = (
    <React.Fragment>
      <List>
        <ListItem button
          onClick={() => {
            handleDrawerClose()
            router.push('/')
          }}>
          <ListItemIcon>
            <DashboardIcon style={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText primary='Dashboard' />
        </ListItem>
      </List>
      <Divider />
      <List onClick={() => {
        handleDrawerClose()
      }}>{signOut}</List>
    </React.Fragment>
  );
  return (
    <Main
      handleDrawerClose={handleDrawerClose} open={open} setOpen={setOpen}
      DrawerMarkup={Markup}
      name={props?.user?.displayName?.split(' ')}
      {...props}
    />
  );
}
export function MechanicMain(props) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const Markup = (
    <React.Fragment>
      <List>
        <ListItem button
          onClick={() => {
            handleDrawerClose()
            router.push('/customers')
          }}>
          <ListItemIcon>
            <PeopleIcon style={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText primary='Customers' />
        </ListItem>
      </List>
      <Divider />
      <List>{signOut}</List>
    </React.Fragment>
  );
  return (
    <Main
      handleDrawerClose={handleDrawerClose}
      open={open}
      setOpen={setOpen}
      DrawerMarkup={Markup}
      name={props?.user?.email?.split(' ')}
      {...props}
    />
  );
}

export function DispatcherMain(props) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const Markup = (
    <React.Fragment>
      <List>
        <div>
          <ListItem button onClick={() => {
            handleDrawerClose()
            router.push('/')
          }}>
            <ListItemIcon>
              <DashboardIcon style={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary='Dashboard' />
          </ListItem>
          <ListItem button
            onClick={() => {
              handleDrawerClose()
              router.push('/orders/new_order')
            }}>
            <ListItemIcon>
              <AddCircle style={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary='New Order' />
          </ListItem>
          <ListItem button
            onClick={() => {
              handleDrawerClose()
              router.push('/customers')
            }}>
            <ListItemIcon>
              <PeopleIcon style={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary='Customers' />
          </ListItem>
          <ListItem button
            onClick={() => {
              handleDrawerClose()
              router.push('/brokers')
            }}>
            <ListItemIcon>
              <BusinessCenter style={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary='Brokers' />
          </ListItem>
        </div>
      </List>
      <Divider />
      <List>
        <div>
          <ListItem button
            onClick={() => {
              handleDrawerClose()
              router.push('/delete_order')
            }}>
            <ListItemIcon>
              <DeleteIcon style={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary='Deleted Orders' />
          </ListItem>
          <ListItem button
            onClick={() => {
              handleDrawerClose()
              router.push('/fleet')
            }}>
            <ListItemIcon>
              <EmojiTransportationIcon style={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary='Fleet' />
          </ListItem>
          <ListItem button
            onClick={() => {
              handleDrawerClose()
              router.push('/user')
            }}>
            <ListItemIcon>
              <PeopleIcon style={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary='Users' />
          </ListItem>
          <ListItem button
            onClick={() => {
              handleDrawerClose()
              router.push('/reports')
            }}>
            <ListItemIcon>
              <AssessmentIcon style={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary='Reports' />
          </ListItem>
        </div>
      </List>
      <Divider />
      <List onClick={() => {
        handleDrawerClose()
      }}>{signOut}</List>
    </React.Fragment>
  );
  return <Main handleDrawerClose={handleDrawerClose} open={open} setOpen={setOpen} name={props?.user?.name} DrawerMarkup={Markup} {...props} />;
}

export function AdminMain(props) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const Markup = (
    <React.Fragment>
      <List>
        <div>
          <ListItem button onClick={() => {
            handleDrawerClose()
            router.push('/')
          }}>
            <ListItemIcon>
              <DashboardIcon style={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary='Dashboard' />
          </ListItem>
          <ListItem button
            onClick={() => {
              handleDrawerClose()
              router.push('/orders/new_order')
            }}>
            <ListItemIcon>
              <AddCircle style={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary='New Order' />
          </ListItem>
          <ListItem button
            onClick={() => {
              handleDrawerClose()
              router.push('/customers')
            }}>
            <ListItemIcon>
              <b style={{ color: "white" }}>CU</b>
            </ListItemIcon>
            <ListItemText primary='Customers' />
          </ListItem>
          <ListItem button
            onClick={() => {
              handleDrawerClose()
              router.push('/brokers')
            }}>
            <ListItemIcon>
              <b style={{ color: "white" }}>BR</b>
            </ListItemIcon>
            <ListItemText primary='Brokers' />
          </ListItem>
        </div>
      </List>
      <List>
        <div>
          <ListItem button
            onClick={() => {
              handleDrawerClose()
              router.push('/delete_order')
            }}>
            <ListItemIcon>
              <DeleteIcon style={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary='Deleted Orders' />
          </ListItem>
        </div>
      </List>
      <List>
        <div>
          <ListItem button
            onClick={() => {
              handleDrawerClose()
              router.push('/reports')
            }}>
            <ListItemIcon>
              <AssessmentIcon style={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary='Reports' />
          </ListItem>
          <ListItem button
            onClick={() => {
              handleDrawerClose()
              router.push('/settings')
            }}>
            <ListItemIcon>
              <SettingsIcon style={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary='Settings' />
          </ListItem>
        </div>
      </List>
      <Divider />
      <Divider />
      <ListItem button
        onClick={() => {
          handleDrawerClose()
          router.push('/mechanic_dashboard')
        }}>
        <ListItemIcon>
          <BuildIcon style={{ color: "white" }} />
        </ListItemIcon>
        <ListItemText primary='Repairs' />
      </ListItem>
      <ListItem button
        onClick={() => {
          handleDrawerClose()
          router.push('/fleet')
        }}>
        <ListItemIcon>
          <EmojiTransportationIcon style={{ color: "white" }} />
        </ListItemIcon>
        <ListItemText primary='Fleet' />
      </ListItem>
      {/* <ListItem button
        onClick={() => {
          handleDrawerClose()
          router.push('/parts')
        }}>
        <ListItemIcon>
          <EmojiTransportationIcon style={{ color: "white" }} />
        </ListItemIcon>
        <ListItemText primary='Parts' />
      </ListItem> */}
      <Divider />
      <ListItem button
        onClick={() => {
          handleDrawerClose()
          router.push('/user')
        }}>
        <ListItemIcon>
          <PeopleIcon style={{ color: "white" }} />
        </ListItemIcon>
        <ListItemText primary='Users' />
      </ListItem>
      {/* <ListItem button
        onClick={() => {
          handleDrawerClose()
          router.push('/signup')
        }}>
        <ListItemIcon>
          <PersonAddIcon style={{ color: "white" }} />
        </ListItemIcon>
        <ListItemText primary='Signup' />
      </ListItem> */}
      <Divider />
      <Divider />
      <List onClick={() => {
        handleDrawerClose()
      }}>{signOut}</List>
    </React.Fragment>
  );
  return <Main handleDrawerClose={handleDrawerClose} open={open} setOpen={setOpen} name={'Admin'} DrawerMarkup={Markup} {...props} />;
}
