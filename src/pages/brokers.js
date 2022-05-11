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
    { title: 'Contact Email', dataIndex: 'cemail', key: 'cemail' },
    { title: 'Phone', dataIndex: 'phone2', key: 'phone2' },
    { title: 'Address', dataIndex: 'Address', key: 'Address' },
    { title: 'City', dataIndex: 'city', key: 'city' },
    { title: 'State', dataIndex: 'state', key: 'state' },
    { title: 'Zip', dataIndex: 'zip', key: 'zip' },
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
        contactEmail: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        phoneNo: "",
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
    const [Brokers, loading, error] = useCollectionData(
        firebase.firestore().collection("brokers").orderBy('name',"desc")
    );
    const openNotification = placement => {
        notification.success({
            message: `Notification`,
            description:
                'You have added New Customer Successfully! Thank you.',
            placement,
        });
    };
    const openNotification2 = placement => {
        notification.success({
            message: `Notification`,
            description:
                'You have Edit Broker Successfully! Thank you.',
            placement,
        });
    };
    const deleteCallback = (id) => {
        firebase
            .firestore()
            .collection("brokers")
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
            const customer = {...newcustomeradd, history: [], block: false }
            firebase.firestore().collection('brokers').doc(newcustomeradd.name).set(customer).then(
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
            setLoading(true)
            const customer = { ...editCutomer}
            firebase.firestore().collection('brokers').doc(editCutomer.name).set(customer).then(
                () => {
                    openNotification2('bottomRight')
                    setLoading(false)
                    handleCancel2()
                }
            ).catch((err) => console.log(err))
        } else {
            console.log("error ")
        }
    }
    const blockBroker = (data) => {
        const brokerss = { ...data, block: true }
        if(data.id != undefined){
            firebase.firestore().collection('brokers').doc(data.id).set(brokerss)
        }else{
            firebase.firestore().collection('brokers').doc(data.name).set(brokerss)
        }
    }
    const UnblockBroker = (data) => {
        const brokerss = { ...data, block: false }
        if(data.id != undefined){
            firebase.firestore().collection('brokers').doc(data.id).set(brokerss)
        }else{
            firebase.firestore().collection('brokers').doc(data.name).set(brokerss)
        }
    }

    const newarr = Brokers?.length && Brokers.map(el => {
        if (el?.name?.toLowerCase().includes(search.toLowerCase())) {
            return {
                key: Math.random() * 6 * 3,
                names: el?.name,
                name: <span style={{ color: el.block == true ? 'red' : "", fontWeight: el.block == true ? 'bold' : "" }}>{el?.name}</span>,
                cemail: el?.contactEmail,
                Address: el.address,
                email: el.email,
                city: el.city,
                state: el.state,
                phone2: el.phoneNo,
                history: el.history,
                zip: el.zip,
                menu: <Dropdown style={{ cursor: 'pointer' }} overlay={<Menu>
                    <Menu.Item key="1">
                        <p syle={{ margin: '0px' }} onClick={() => {
                            if (el.id) {
                                showConfirm(el.id, el.name)
                            } else {
                                showConfirm(el.name, el.name)
                            }
                        }}>
                            Delete Broker
                            </p>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <p syle={{ margin: '0px' }} onClick={() => {
                            setEditCustomer('')
                            setEditCustomer(el)
                            setids(el.name)
                            showModal2()
                        }}>
                            Edit Broker
                            </p>
                    </Menu.Item>
                    {el.block == true && el.block != undefined && (
                        <Menu.Item key="4">
                            <p syle={{ margin: '0px' }} onClick={() => {
                                UnblockBroker(el)
                            }}>
                                UnBlock Broker
                            </p>
                        </Menu.Item>
                    )}
                    {el.block == undefined && (
                        <Menu.Item key="6">
                            <p syle={{ margin: '0px' }} onClick={() => {
                                blockBroker(el)
                            }}>
                                Block Broker
                            </p>
                        </Menu.Item>
                    )}
                    {el.block == false && el.block != undefined && (
                        <Menu.Item key="3">
                            <p syle={{ margin: '0px' }} onClick={() => {
                                blockBroker(el)
                            }}>
                                Block Broker
                            </p>
                        </Menu.Item>
                    )}
                </Menu >} placement="bottomCenter" >
                    <MoreOutlined />
                </Dropdown >
            }
        }
    })

  
    const columnsa = [
        { displayName: 'Name', id: 'names' },
        { displayName: 'Email', id: 'email' },
        { displayName: 'Contact Email', id: 'cemail' },
        { displayName: 'Phone', id: 'phone2' },
        { displayName: 'Address', id: 'Address' },
        { displayName: 'City', id: 'city' },
        { displayName: 'State', id: 'state' },
        { displayName: 'Zip', id: 'zip' },
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
                    <h1 className="heasea" style={{ color: '#3d4052', fontStyle: 'normal', margin: '0px', fontWeight: 'bold' }}>Brokers</h1>
                </div>
                <div className="smakak">
                    <div>
                        <Button onClick={showModal} type="primary" >Add New Broker</Button>
                    </div>
                    <div>
                        <CsvDownloader
                            filename="Broker"
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
                <Input value={search} onChange={(e) => setsearch(e.target.value)} className="inputs" placeholder="Search Broker Name...." type="text" />
            </div>
            <div className="jajawawa">
                <Table
                    columns={columns}
                    expandable={{
                        expandedRowRender: (record, i) => {
                            return (
                                <>
                                    <h3 key={i} style={{ color: '#3d4052', fontWeight: 'bold' }}>Broker Order Details</h3>
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
            <Modal confirmLoading={loadings} okText={"Save"} title="New Broker" visible={isModalVisible} onOk={addNewCustomer} onCancel={handleCancel}>
                <p style={{ margin: '0px' }} className="para">Name<span className="optional">(Required)</span></p>
                <Input name="name" value={newcustomeradd.name} onChange={(e) => onChangeHangler(e)} className="input" placeholder="Name...." type="text" />
                <p className="para">Email <span className="optional">(Optional)</span></p>
                <Input name="email" value={newcustomeradd.email} onChange={(e) => onChangeHangler(e)} className="input" placeholder="Email...." type="text" />
                <p className="para">Contact Email <span className="optional">(Optional)</span></p>
                <Input name="contactEmail" value={newcustomeradd.contactEmail} onChange={(e) => onChangeHangler(e)} className="input" placeholder="contact Email...." type="text" />
                <p className="para">Phone<span className="optional">(Optional)</span></p>
                <Input name="phoneNo" value={newcustomeradd.phoneNo} onChange={(e) => onChangeHangler(e)} className="input" placeholder="Phone Number...." type="number" />
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
            <Modal confirmLoading={loadings} title="Edit Broker" okText={"Save Broker"} visible={isModalVisible2} onOk={editCustomesr} onCancel={handleCancel2}>
                <p style={{ margin: '0px' }} className="para">Name<span className="optional">(Required)</span></p>
                <Input disabled name="name" value={editCutomer.name} onChange={(e) => onChangeHangler2(e)} className="input" placeholder="Name...." type="text" />
                <p className="para">Email <span className="optional">(Optional)</span></p>
                <Input name="email" value={editCutomer.email} onChange={(e) => onChangeHangler2(e)} className="input" placeholder="Email...." type="email" />
                <p className="para">Contact Email <span className="optional">(Optional)</span></p>
                <Input name="contactEmail" value={editCutomer.contactEmail} onChange={(e) => onChangeHangler2(e)} className="input" placeholder="Contact Email...." type="email" />
                <p className="para">Phone<span className="optional">(Optional)</span></p>
                <Input name="phoneNo" value={editCutomer.phoneNo} onChange={(e) => onChangeHangler2(e)} className="input" placeholder="Phone Number...." type="text" />
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
                <TextArea className="input" value={notes} onChange={(e) => setnotes(e.target.value)}
                    placeholder="Notes"
                    autoSize={{ minRows: 2, maxRows: 6 }}
                />
            </Modal>
        </React.Fragment>
    );
}