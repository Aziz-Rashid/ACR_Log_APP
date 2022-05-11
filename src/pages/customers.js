import React, { useState, useEffect } from 'react'
import { useCollectionData } from "react-firebase-hooks/firestore";
import firebase from '../config/firebase'
import { Table, Button, Menu, Dropdown, Modal, Input, notification } from 'antd';
import { MoreOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import CsvDownloader from 'react-csv-downloader';
import Link from 'next/link'

const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Address', dataIndex: 'Address', key: 'Address' },
    { title: 'City', dataIndex: 'city', key: 'city' },
    { title: 'State', dataIndex: 'state', key: 'state' },
    { title: 'Zip', dataIndex: 'zip', key: 'zip' },
    { title: 'Notes', dataIndex: 'notes', key: 'notes' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'Phone2', dataIndex: 'phone2', key: 'phone2' },
    { title: 'Contact Person', dataIndex: 'person', key: 'person' },
    { title: 'Menu', dataIndex: 'menu', key: 'menu' },
];

export default function CustomersPage({ user }) {
    const { confirm } = Modal;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisible2, setIsModalVisible2] = useState(false);
    const [isModalVisible3, setIsModalVisible3] = useState(false);
    const [loadings, setLoading] = useState(false)
    const [loadings2, setLoading2] = useState(false)
    const [search, setsearch] = useState('')
    const [notesid, setnotesid] = useState('')
    const [notes, setnotes] = useState('')
    const [editCutomer, setEditCustomer] = useState('')
    const [ids, setids] = useState('')
    const [newcustomeradd, setNewCustomer] = useState({
        name: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        phone: "",
        phone2: "",
        phones2: ""
    })
    const onChangeHangler = (e) => {
        setNewCustomer({
            ...newcustomeradd,
            [e.target.name]: e.target.value
        })
    }
    const onChangeHangler2 = (e) => {
        setEditCustomer({
            ...editCutomer,
            [e.target.name]: e.target.value
        })
    }
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const showModal2 = () => {
        setIsModalVisible2(true);
    };

    const handleCancel2 = () => {
        setIsModalVisible2(false);
    };
    const handleCancel3 = () => {
        setnotes('')
        setIsModalVisible3(false);
    };
    const [Customers, loading, error] = useCollectionData(
        firebase.firestore().collection("customers")
    );
    const openNotification = placement => {
        notification.success({
            message: `Notification`,
            description:
                'You have added New Customer Successfully! Thank you.',
            placement,
        });
    };
    const deleteCallback = (id) => {
        firebase
            .firestore()
            .collection("customers")
            .doc(id)
            .delete()
            .then(() => {
                console.log('delete')
            });
    };
    function showConfirm(id, name) {
        confirm({
            title: `Do you Want to delete ${name} Customer ?`,
            icon: <ExclamationCircleOutlined />,
            onOk() {
                deleteCallback(id);
            },
            onCancel() {
                console.log('Cancel');
            },
            okText: "Yes",
            cancelText: "No"
        });
    }

    const addNewCustomer = () => {
        if (newcustomeradd.name !== "") {
            setLoading(true)
            const id = `${Math.random() * Math.random() * 6}`
            const createdDate = new Date()
            const esttime = new Date()
            const customer = { id, estTime2: esttime, estTime: esttime, createdDate, name: newcustomeradd.name, email: newcustomeradd.email, address: newcustomeradd.address, city: newcustomeradd.city, state: newcustomeradd.state, zip: newcustomeradd.zip, phone: newcustomeradd.phone, history: [], contactPerson: newcustomeradd.phone2, phone2: newcustomeradd.phones2 }
            firebase.firestore().collection('customers').doc(id).set(customer).then(
                () => {
                    openNotification('bottomRight')
                    setLoading(false)
                    handleCancel()
                }
            ).catch((err) => console.log(err))
        } else {
            console.log("error ")
        }
    }
    const editCustomesr = () => {
        if (editCutomer.name !== "") {
            let idw;
            let newid;
            if (editCutomer?.id) {
                newid = editCutomer?.id
                idw = editCutomer?.id
            } else {
                newid = ids
                idw = `${Math.random() * Math.random() * 6}`
            }
            setLoading(true)
            const customer = { ...editCutomer, id: idw, name: editCutomer.name, email: editCutomer.email, address: editCutomer.address, city: editCutomer.city, state: editCutomer.state, zip: editCutomer.zip, phone: editCutomer.phone, history: editCutomer.history, contactPerson: editCutomer.contactPerson, phone2: editCutomer.phone2 }
            firebase.firestore().collection('customers').doc(idw).set(customer).then(
                () => {
                    if (editCutomer.id == undefined) {
                        deleteCallback(editCutomer.name)
                    }
                    openNotification('bottomRight')
                    setLoading(false)
                    handleCancel2()
                }
            ).catch((err) => console.log(err))
        } else {
            console.log("error ")
        }
    }

    const newarr = Customers?.length && Customers.map(el => {
        if (el.name.toLowerCase().includes(search.toLowerCase())) {
            return {
                key: Math.random() * 6 * 3,
                name: el.name,
                estsort: el?.estTime?.seconds ? el.estTime : new Date(el.estTime),
                est: el?.estTime?.seconds ? new Date(el?.estTime?.seconds * 1000).toLocaleDateString() : el.estTime == "Invalid Date" ? "no date" : new Date(el?.estTime).toLocaleDateString(),
                est2: el?.estTime2?.seconds ? new Date(el?.estTime2?.seconds * 1000).toLocaleDateString() : new Date(el.estTime2).toLocaleDateString() == "Invalid Date" ? el.estTime2 : new Date(el.estTime2).toLocaleDateString(),
                Address: el.address,
                email: el.email,
                city: el.city,
                state: el.state,
                phone2: el.phone2,
                history: el.history,
                person: el.contactPerson,
                notes: el?.notes?.length ? <span style={{ color: 'blue' }}>Notes</span> : null,
                notesData: el?.notes,
                zip: el.zip,
                phone: el.phone,
                menu: <Dropdown style={{ cursor: 'pointer' }} overlay={<Menu>
                    <Menu.Item key="1">
                        <p syle={{ margin: '0px' }} onClick={() => {
                            if (el.id) {
                                showConfirm(el.id, el.name)
                            } else {
                                showConfirm(el.name, el.name)
                            }
                        }}>
                            Delete Customer
                            </p>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <p syle={{ margin: '0px' }} onClick={() => {
                            setEditCustomer('')
                            setEditCustomer(el)
                            setids(el.name)
                            showModal2()
                        }}>
                            Edit Customer
                            </p>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <p syle={{ margin: '0px' }} onClick={() => {
                            if (el.id) {
                                setIsModalVisible3(true)
                                setnotesid(el)
                            } else {
                                setIsModalVisible3(true)
                                setnotesid(el)
                            }
                        }}>
                            Add Notes
                            </p>
                    </Menu.Item>
                </Menu >} placement="bottomCenter" >
                    <MoreOutlined />
                </Dropdown >
            }
        }
    })
    newarr?.sort(function (a, b) {
        return new Date(b?.estsort?.seconds * 1000) - new Date(a?.estsort?.seconds * 1000);
    });

    const columnsa = [
        { displayName: 'Name', id: 'name' },
        { displayName: 'Email', id: 'email' },
        { displayName: 'Address', id: 'Address' },
        { displayName: 'City', id: 'city' },
        { displayName: 'State', id: 'state' },
        { displayName: 'Zip', id: 'zip' },
        { displayName: 'Phone', id: 'phone' },
        { displayName: 'Contact Person', id: 'person' },
    ];
    const asyncFnComputeDate = () => {
        return Promise.resolve(newarr);
    };
    const addnotes = () => {
        let notesadded = notesid
        const notesdata = {
            id: Math.random() * 6,
            user: user.email,
            note: notes,
            time: new Date()
        }

        if (notesadded?.notes?.length == undefined) {
            notesadded.notes = []
            notesadded.notes.push(notesdata)
            if (notesadded.id) {
                firebase.firestore().collection('customers').doc(notesadded.id).set(notesadded)
                setnotes('')
            } else {
                firebase.firestore().collection('customers').doc(notesadded.name).set(notesadded)
                setnotes('')
            }
        } else {
            notesadded.notes.push(notesdata)
            if (notesadded.id) {
                firebase.firestore().collection('customers').doc(notesadded.id).set(notesadded)
                setnotes('')
            } else {
                firebase.firestore().collection('customers').doc(notesadded.name).set(notesadded)
                setnotes('')
            }
        }
        setIsModalVisible3(false)
    }
    const { TextArea } = Input;

    return (
        <React.Fragment>
            <div className="ajawa">
                <div>
                    <h1 className="heasea" style={{ color: '#3d4052', fontStyle: 'normal', margin: '0px', fontWeight: 'bold' }}>Customers</h1>
                </div>
                <div className="smakak">
                    <div>
                        <Button onClick={showModal} type="primary" >Add New Customers</Button>
                    </div>
                    <div>
                        <CsvDownloader
                            filename="Customers"
                            extension=".csv"
                            separator=";"
                            className="nansah"
                            columns={columnsa}
                            datas={asyncFnComputeDate}
                            text="Generate Csv" />
                    </div>
                </div>

            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Input value={search} onChange={(e) => setsearch(e.target.value)} className="inputs" placeholder="Search Customer Name...." type="text" />
            </div>
            <div className="jajawawa">
                <Table
                    columns={columns}
                    expandable={{
                        expandedRowRender: (record, i) => {
                            return (
                                <>
                                    <div>
                                        {record?.notesData?.length && (
                                            <h3 style={{ color: '#3d4052', fontWeight: 'bold' }}>Notes</h3>
                                        )}
                                        <p>{record?.notesData?.map(el => (
                                            <>
                                                <div>
                                                    <p>{el.note}<span style={{ paddingLeft: '30px' }}> By {el.user} at {new Date(el.time.seconds * 1000).toLocaleString()}</span></p>
                                                </div>
                                            </>
                                        ))}</p>
                                    </div>
                                    <h3 key={i} style={{ color: '#3d4052', fontWeight: 'bold' }}>Customer Order Details</h3>
                                    {record?.history?.sort((a, b) => new Date(b?.date) - new Date(a?.date)).map((el, index) => (
                                        <>

                                            <div className="iaiasw" key={index}>
                                                <div>
                                                    <p style={{ fontWeight: 'bold', color: '#3d4052', margin: '0px' }}>Order # {index + 1}</p>
                                                </div>
                                                <div>
                                                    <p className="datessw">Date: {new Date(el.date).toLocaleDateString()}</p>
                                                </div>
                                                <div>
                                                    <p className="datessw">Order ID:<Link href={`orders/${el.id}`}><span className="az">{el.id}</span></Link> </p>
                                                </div>
                                            </div>

                                        </>
                                    ))}

                                </>
                            )
                        },
                        rowExpandable: record => record?.history?.length || record?.notesData?.length,
                    }}
                    bordered={true}
                    loading={loading}
                    dataSource={newarr}
                />
            </div>
            <Modal confirmLoading={loadings} okText={"Save"} title="New Customer" visible={isModalVisible} onOk={addNewCustomer} onCancel={handleCancel}>
                <p style={{ margin: '0px' }} className="para">Name<span className="optional">(Required)</span></p>
                <Input name="name" value={newcustomeradd.name} onChange={(e) => onChangeHangler(e)} className="input" placeholder="Name...." type="text" />
                <p className="para">Email <span className="optional">(Optional)</span></p>
                <Input name="email" value={newcustomeradd.email} onChange={(e) => onChangeHangler(e)} className="input" placeholder="Email...." type="text" />
                <p className="para">Phone<span className="optional">(Optional)</span></p>
                <Input name="phone" value={newcustomeradd.phone} onChange={(e) => onChangeHangler(e)} className="input" placeholder="Phone Number...." type="number" />
                <p className="para">Phone2<span className="optional">(Optional)</span></p>
                <Input name="phones2" value={newcustomeradd.phones2} onChange={(e) => onChangeHangler(e)} className="input" placeholder="Phone Number...." type="number" />
                <p className="para">Contact Person<span className="optional">(Optional)</span></p>
                <Input name="phone2" value={newcustomeradd.phone2} onChange={(e) => onChangeHangler(e)} className="input" placeholder="Contact Person...." type="text" />
                <p className="para">Address <span className="optional">(Optional)</span></p>
                <Input name="address" value={newcustomeradd.address} onChange={(e) => onChangeHangler(e)} className="input" placeholder="Address...." type="text" />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ width: '48%' }}>
                        <p className="para">City<span className="optional">(Optional)</span></p>
                        <Input name="city" value={newcustomeradd.city} onChange={(e) => onChangeHangler(e)} className="input" placeholder="City...." type="text" />
                    </div>
                    <div style={{ width: '48%' }}>
                        <p className="para">State<span className="optional">(Optional)</span></p>
                        <Input name="state" value={newcustomeradd.state} onChange={(e) => onChangeHangler(e)} className="input" placeholder="State...." type="text" />
                    </div>
                </div>
                <p className="para">Zip<span className="optional">(Optional)</span></p>
                <Input name="zip" value={newcustomeradd.zip} onChange={(e) => onChangeHangler(e)} className="input" placeholder="Zip ...." type="text" />
            </Modal>
            <Modal confirmLoading={loadings} title="Edit Customer" okText={"Save"} visible={isModalVisible2} onOk={editCustomesr} onCancel={handleCancel2}>
                <p style={{ margin: '0px' }} className="para">Name<span className="optional">(Required)</span></p>
                <Input name="name" value={editCutomer.name} onChange={(e) => onChangeHangler2(e)} className="input" placeholder="Name...." type="text" />
                <p className="para">Email <span className="optional">(Optional)</span></p>
                <Input name="email" value={editCutomer.email} onChange={(e) => onChangeHangler2(e)} className="input" placeholder="Email...." type="email" />
                <p className="para">Phone<span className="optional">(Optional)</span></p>
                <Input name="phone" value={editCutomer.phone} onChange={(e) => onChangeHangler2(e)} className="input" placeholder="Phone Number...." type="number" />
                <p className="para">Phone2<span className="optional">(Optional)</span></p>
                <Input name="phone2" value={editCutomer.phone2} onChange={(e) => onChangeHangler2(e)} className="input" placeholder="Phone Number...." type="number" />
                <p className="para">contactPerson<span className="optional">(Optional)</span></p>
                <Input name="contactPerson" value={editCutomer.contactPerson} onChange={(e) => onChangeHangler2(e)} className="input" placeholder="contactPerson...." type="text" />
                <p className="para">Address <span className="optional">(Optional)</span></p>
                <Input name="address" value={editCutomer.address} onChange={(e) => onChangeHangler2(e)} className="input" placeholder="Address...." type="text" />
                <p className="para">City<span className="optional">(Optional)</span></p>
                <Input name="city" value={editCutomer.city} onChange={(e) => onChangeHangler2(e)} className="input" placeholder="City...." type="text" />
                <p className="para">State<span className="optional">(Optional)</span></p>
                <Input name="state" value={editCutomer.state} onChange={(e) => onChangeHangler2(e)} className="input" placeholder="State...." type="text" />
                <p className="para">Zip<span className="optional">(Optional)</span></p>
                <Input name="zip" value={editCutomer.zip} onChange={(e) => onChangeHangler2(e)} className="input" placeholder="Zip ...." type="text" />
            </Modal>
            <Modal confirmLoading={loadings2} title="Add Notes" okText={"Save"} visible={isModalVisible3} onOk={addnotes} onCancel={handleCancel3}>
                <p style={{ margin: '0px' }} className="para">Notes<span className="optional">(Required)</span></p>
                {/* <Input  placeholder="Notes...." type="text" /> */}
                <TextArea className="input" value={notes} onChange={(e) => setnotes(e.target.value)}
                    placeholder="Notes"
                    autoSize={{ minRows: 2, maxRows: 6 }}
                />
            </Modal>
        </React.Fragment>
    );
}