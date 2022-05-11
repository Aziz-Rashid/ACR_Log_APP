import React from "react";
import { useRouter } from "next/router";
import Login from "./login";
import '../../styles/globals.css'
import '../../styles/login.css'
import '../../styles/repair.css'
import 'antd/dist/antd.css';
import 'react-phone-input-2/lib/style.css'
//MATERIAL
import { AdminMain, DispatcherMain, DriverMain,MechanicMain } from "../components/main";

//FIREBASE
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import firebase, { auth } from "../config/firebase";

export default function App({ Component, pageProps }) {
  const dev = process.env.NODE_ENV == "development";
  //     if (!dev) console.log = () => {
  //     }
  const [user, loading, error] = useAuthState(auth);
  const [drivers, loading2, error2] = useCollectionDataOnce(
    firebase.firestore().collection("drivers")
  );
  
  const [Admin, loading6, error6] = useCollectionDataOnce(
    firebase.firestore().collection("Admin")
  );
  const [mechanics, loading4, error4] = useCollectionDataOnce(
    firebase.firestore().collection("mechanics")
  );
  const [dispatchers, loading3, error3] = useCollectionDataOnce(
    firebase.firestore().collection("dispatchers")
  );
  const [sales, loading5, error4s] = useCollectionDataOnce(
    firebase.firestore().collection("sales")
  );
  const [condition, setCondition] = React.useState({
    driver: false,
    dispatcher: false,
    mechanic:false,
    sales: false,
    Admin:false,
    name: null,
    obj: null,
  });

  React.useEffect(
    () =>
    Admin?.map((driver) => {
        if (driver.email == user?.email  && driver.email !== undefined && user?.email !== undefined) {
          setCondition({
            ...condition,
            driver: false,
            dispatcher: false,
            sales: false,
            mechanic:false,
            Admin: true,
            obj: driver,
          });
        }
      }),
    [user,loading6]
  );
  React.useEffect(
    () =>
      sales?.map((driver) => {
        if (driver.email == user?.email  && driver.email !== undefined && user?.email !== undefined) {
          setCondition({
            ...condition,
            driver: false,
            mechanic: false,
            sales: true,
            dispatcher: false,
            Admin:false,
            name: driver.name,
            obj: driver,
          });
        }
      }),
    [user,loading5]
  );

  React.useEffect(
    () =>
      drivers?.map((driver) => {
        if (driver.email == user?.email  && driver.email !== undefined && user?.email !== undefined) {
          setCondition({
            ...condition,
            driver: true,
            mechanic: false,
            dispatcher: false,
            sales: false,
            Admin:false,
            name: driver.name,
            obj: driver,
          });
        }
      }),
    [user,loading2]
  );
  React.useEffect(
    () =>
    mechanics?.map((driver) => {
        if (driver.email == user?.email && driver.email !== undefined && user?.email !== undefined) {
          setCondition({
            ...condition,
            mechanic: true,
            driver: false,
            dispatcher: false,
            sales: false,
            Admin:false,
            name: driver.name,
            obj: driver,
          });
        }
      }),
    [user,loading4]
  );
  React.useEffect(
    () =>
      dispatchers?.map((dispatcher) => {
        if (dispatcher.email == user?.email && dispatcher.email !== undefined && user?.email !== undefined) {
          setCondition({
            ...condition,
            dispatcher: true,
            mechanic: false,
            driver: false,
            Admin:false,
            name: dispatcher.name,
          });
        }
      }),
    [user,loading3]
  );
  const router = useRouter();
  // React.useEffect(()=>router.push('/'),[])

  if ((user != null || auth.currentUser != null) && !loading) {
    if (!loading6 && !loading3 && !loading4 && !loading2) {
      const adm = process.env.ADMIN_EMAILS.includes(user?.email);
      if (adm) {
        user.accessLevel = "Admin";
        user.dispatcher = false;
        return (
          <AdminMain Component={Component} pageProps={pageProps} user={user} />
        );
      }else if (
        (router.pathname == "/" || router.pathname.includes("orders")) &&
        condition.driver === true && condition.mechanic === false
      ) {
        //TODO: Routes access
        user.accessLevel = "User";
        user.name = condition.name;
        firebase
          .firestore()
          .collection("drivers")
          .doc(condition.name)
          .set({ ...condition.obj, verified: true });
        return (
          <DriverMain Component={Component} pageProps={pageProps} user={user} />
        );
      } 
      else if (condition.sales === true && condition.driver === false && condition.dispatcher === false) {
        user.accessLevel = "Sales";
        user.name = condition.name;
        return (
          <MechanicMain Component={Component} pageProps={pageProps} user={user} />
        );
      }
      else if (condition.dispatcher === true && condition.mechanic === false) {
        user.accessLevel = "Admin";
        user.dispatcher = true;
        user.name = condition.name;
        return (
          <DispatcherMain Component={Component} pageProps={pageProps} user={user} />
        );
      } else {
        return (
          <>
          {loading2 || loading || loading6 || loading4 || loading3 ? (
           <h1>Loading Please Wait .....</h1>
          ): (
            <>
            <button onClick={() => auth.signOut()}>Sign Out</button>
            <button
              onClick={() => window.location.reload()}
              style={{ marginLeft: 8 }}
            >
              Retry
            </button>
            </>
          )}
          </>
        );
      }
    } else return <></>;
  } else {
    return <Login />;
  }
}


