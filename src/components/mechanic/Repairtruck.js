import React, { useState } from 'react';
import { Table, Alert, Menu, Dropdown, Modal, Input, Radio } from 'antd'
import { MoreOutlined, ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase, { auth } from '../../config/firebase'
const columns = [
    { title: 'Unit ID', dataIndex: 'Unitid', key: 'unit' },
    { title: 'Date', dataIndex: 'repairdate', key: 'repairdate' },
    { title: 'License', dataIndex: 'licence', key: 'licence' },
    { title: 'Vehicle Type', dataIndex: 'type', key: 'type' },
    { title: 'Vehicle Info', dataIndex: 'vinfo', key: 'vinfo' },
    { title: 'Repairs', dataIndex: 'repair', key: 'repair' },
    { title: 'Unit Mileage', dataIndex: 'Mileage', key: 'Mileage' },
    { title: 'Notes', dataIndex: 'notes', key: 'notes' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Menu', dataIndex: 'menu', key: 'menu' },
];
const columns2 = [
    { title: 'Unit ID', dataIndex: 'Unitid', key: 'unit' },
    { title: 'Date', dataIndex: 'repairdate', key: 'repairdate' },
    { title: 'License', dataIndex: 'licence', key: 'licence' },
    { title: 'Unit Type', dataIndex: 'type', key: 'type' },
    { title: 'Unit Category', dataIndex: 'category', key: 'category' },
    { title: 'Reefer Unit', dataIndex: 'reefermaketype', key: 'reefermaketype' },
    { title: 'Vehicle Info', dataIndex: 'vinfo', key: 'vinfo' },
    { title: 'Repairs', dataIndex: 'repair', key: 'repair' },
    { title: 'Notes', dataIndex: 'notes', key: 'notes' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Menu', dataIndex: 'menu', key: 'menu' },
];

export default function Repair({ status }) {
    const { confirm } = Modal;
    const [id, setid] = useState('')
    const [values, setValue] = React.useState("Any");
    const router = useRouter()
    const [repairorder, loading, error] = useCollectionData(
        firebase.firestore().collection("Repairs").where('id', '==', id)
    );
    const [user, loadingss, errorss] = useAuthState(auth);
    const [isModalVisible2, setIsModalVisible2] = useState(false);
    const [val, setval] = useState('')
    const [mechanic, loadings, errors] = useCollectionData(
        firebase.firestore().collection("Repairs").where('status', '==', status)
    );

    const deleteCallback = (id) => {
        firebase
            .firestore()
            .collection("Repairs")
            .doc(id)
            .delete()
            .then(() => {
                console.log('delete')
            });
    };

    function showConfirm(i, id) {
        confirm({
            title: `Do you Want to delete ${id} repair ?`,
            icon: <ExclamationCircleOutlined />,
            onOk() {
                deleteCallback(i);
            },
            onCancel() {
                console.log('Cancel');
            },
            okText: "Yes",
            cancelText: "No"
        });
    }
    let newarr = mechanic?.map(el => {
        function MarkasComfirm(i, id, name) {
            confirm({
                title: `Do you Want to Mark ${name} as Completed ?`,
                icon: <ExclamationCircleOutlined />,
                onOk() {
                    Changestatus(i, id);
                },
                onCancel() {
                    console.log('Cancel');
                },
                okText: "Yes",
                cancelText: "No"
            });
        }
        function MarkasPending(i, id, name) {
            confirm({
                title: `Do you Want to Mark ${name} as Pending ?`,
                icon: <ExclamationCircleOutlined />,
                onOk() {
                    Changestatus(i, id);
                },
                onCancel() {
                    console.log('Cancel');
                },
                okText: "Yes",
                cancelText: "No"
            });
        }
        const Changestatus = (id, item) => {
            let o = el;
            o.status = item;
            firebase
                .firestore()
                .collection('Repairs')
                .doc(id)
                .set(o)
                .then(() => {
                    console.log("working")
                });
        };
        if (values == "Any") {
            console.log()
            return {
                key: Math.random() * 6 * 3,
                licence: el.vehicle.licence,
                Unitid: el.vehiclenumber,
                date: el.createdDate,
                type: el.vehicle.type,
                category: el?.vehicle.category,
                reefermaketype: el?.vehicle.reefermaketype,
                repairdate: new Date(el.repairdate.seconds * 1000).toLocaleDateString(),
                vinfo: `${el.vehicle.year} ${el.vehicle.make} ${el.vehicle.modle} ${el.vehicle.color}`,
                repair: el.Repair?.map(el => <div>{el}</div>),
                Mileage: el.vehicle.milage,
                status: el.status == "done" ? "Completed" : "Pending",
                parts: el.parts,
                repairnotes: el.repairnotes,
                menu: <Dropdown style={{ cursor: 'pointer' }} overlay={<Menu>
                    {el.status == "pending" && (
                        <Menu.Item key="4">
                            <p syle={{ margin: '0px' }} onClick={() => MarkasComfirm(el.id, "done", el.vehiclenumber)}>
                                Mark as Completed
                            </p>
                        </Menu.Item>
                    )}
                    {el.status == "done" && (
                        <Menu.Item key="5">
                            <p syle={{ margin: '0px' }} onClick={() => MarkasPending(el.id, "pending", el.vehiclenumber)}>
                                Mark as Pending
                            </p>
                        </Menu.Item>
                    )}
                    <Menu.Item key="1">
                        <p syle={{ margin: '0px' }} onClick={() => showConfirm(el.id, el.vehiclenumber)}>
                            Delete Repair
                            </p>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <p syle={{ margin: '0px' }} onClick={() => router.push(`/edit/${el.id}`)}>
                            Edit Repair
                            </p>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <p syle={{ margin: '0px' }} onClick={() => openModel2(el.id)}>
                            Add Notes
                            </p>
                    </Menu.Item>
                </Menu>} placement="bottomCenter">
                    <MoreOutlined />
                </Dropdown>,
                notes: el.notes.length ? <p style={{ color: 'blue', cursor: 'pointer' }} onClick={() => openModel2(el.id)}>View Notes</p> : null
            }
        } else if (values == el.vehicle.type) {
            return {
                key: Math.random() * 6 * 3,
                licence: el.vehicle.licence,
                Unitid: el.vehiclenumber,
                date: el.createdDate,
                type: el.vehicle.type,
                category: el?.vehicle.category,
                reefermaketype: el?.vehicle.reefermaketype,
                repairdate: new Date(el.repairdate.seconds * 1000).toLocaleDateString(),
                vinfo: `${el.vehicle.year} ${el.vehicle.make} ${el.vehicle.modle} ${el.vehicle.color}`,
                repair: el.Repair?.map(el => `${el},`),
                Mileage: el.vehicle.milage,
                status: el.status == "done" ? "Completed" : "Pending",
                parts: el.parts,
                repairnotes: el.repairnotes,
                menu: <Dropdown style={{ cursor: 'pointer' }} overlay={<Menu>
                    {el.status == "pending" && (
                        <Menu.Item key="4">
                            <p syle={{ margin: '0px' }} onClick={() => MarkasComfirm(el.id, "done", el.vehiclenumber)}>
                                Mark as Completed
                            </p>
                        </Menu.Item>
                    )}
                    {el.status == "done" && (
                        <Menu.Item key="5">
                            <p syle={{ margin: '0px' }} onClick={() => MarkasPending(el.id, "pending", el.vehiclenumber)}>
                                Mark as Pending
                            </p>
                        </Menu.Item>
                    )}
                    <Menu.Item key="1">
                        <p syle={{ margin: '0px' }} onClick={() => showConfirm(el.id, el.vehiclenumber)}>
                            Delete Repair
                            </p>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <p syle={{ margin: '0px' }} onClick={() => router.push(`/edit/${el.id}`)}>
                            Edit Repair
                            </p>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <p syle={{ margin: '0px' }} onClick={() => openModel2(el.id)}>
                            Add Notes
                            </p>
                    </Menu.Item>
                </Menu>} placement="bottomCenter">
                    <MoreOutlined />
                </Dropdown>,
                notes: el.notes.length ? <p style={{ color: 'blue', cursor: 'pointer' }} onClick={() => openModel2(el.id)}>View Notes</p> : null
            }
        }
    })
    const arr = newarr?.filter(el => el?.key != undefined ? true : false)
    arr?.sort(function (a, b) {
        return new Date(b?.date.seconds * 1000) - new Date(a?.date.seconds * 1000);
    });
    const getfirebaseorder = (e) => {
        e.preventDefault()
        let newsa = repairorder?.length ? repairorder[0] : {}
        const username =  user.name == undefined ? user.displayName : user.name;
        const data = {
            user: username,
            value: val,
            time: new Date()
        }
        newsa.notes.push(data)
        firebase.firestore().collection('Repairs').doc(id).set(newsa).then(
            () => {
                setval('')
                console.log("success")
            }
        ).catch((err) => console.log(err))
    }

    const handleCancel2 = () => {
        setIsModalVisible2(false);
    };
    const openModel2 = (e) => {
        setid(e)
        setIsModalVisible2(true);
    }

    const deletenotes = (item) => {
        let newsa = repairorder?.length ? repairorder[0] : {}
        const filterItem = repairorder.map(el => el.notes.filter(items => items.value != item.value))
        newsa.notes = filterItem[0]
        firebase.firestore().collection('Repairs').doc(id).set(newsa).then(
            () => {
                setval('')
                console.log("success")
            }
        ).catch((err) => console.log(err))
    }
    const onChange = e => {
        setValue(e.target.value);
    };
    const usernames =  user.name == undefined ? user.displayName : user.name;

    return (
        <React.Fragment>
            <Radio.Group onChange={onChange} value={values}>
                <Radio value={"Any"}>Any</Radio>
                <Radio value={"Truck"}>Truck</Radio>
                <Radio value={"Trailer"}>Trailer</Radio>
            </Radio.Group>
            <Table
                columns={values == "Trailer" || values == "Any" ? columns2 :  columns}
                expandable={{
                    expandedRowRender: record => {
                        return (
                            <>
                                {record?.repairnotes != null ? (
                                    <>
                                        <p style={{ color: 'rebeccapurple', margin: '0px', fontSize: '18px' }}>Repair Notes</p>
                                        <p>{record?.repairnotes}</p>
                                    </>
                                ) : <Alert message="Repair Notes Not added for this Repair" type="warning" />}
                                {record?.parts != null ? (
                                    <>
                                        <p style={{ color: 'rebeccapurple', margin: '0px', fontSize: '18px' }}>Parts Needed</p>
                                        <p>{record.parts}</p>
                                    </>
                                ) : <Alert style={{ marginTop: '10px' }} message="Parts Not added For this Repair" type="warning" />}
                            </>
                        )
                    },
                    rowExpandable: record => {
                        if (record?.repairnotes == null && record?.parts == null) {
                            return false
                        } else {
                            return true
                        }
                    },
                }}

                loading={loadings}
                dataSource={arr}
                bordered={true}
            />
            <Modal title="Notes" visible={isModalVisible2} cancelText="Close" okText={"Send"} onOk={getfirebaseorder} onCancel={handleCancel2}>
                <form onSubmit={getfirebaseorder}>
                    <div className="chatss">
                        {repairorder?.map(el => (
                            <>
                                {el?.notes?.length ? el?.notes?.map(item => 
                                {
                                    return(
                                    <>
                                        {item.user != usernames ? (
                                            <div className="aswass">
                                                <h1 className="hahahaha">{item.value}<span className="wqaa">{item.user} {new Date(item.time.seconds * 1000).toLocaleString()}</span></h1>
                                            </div>
                                        ) : (
                                                <>
                                                    {item.user == usernames ? (
                                                        <div className="aswassss">
                                                            <h1 className="hahahaha">{item.value}<span className="wqaas">{item.user} {new Date(item.time.seconds * 1000).toLocaleString()} <DeleteOutlined onClick={() => deletenotes(item)} /></span></h1>
                                                        </div>
                                                    ) : null}
                                                </>
                                            )}
                                    </>
                                )}) : null}
                            </>
                        ))}
                    </div>
                    <Input value={val} onChange={(e) => setval(e.target.value)} placeholder="Add your Notes" type="text" className="input" />
                </form>
            </Modal>
        </React.Fragment>
    );
}