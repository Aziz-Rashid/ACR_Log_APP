import React, { useState } from 'react'
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Table, Button, Modal,Input } from 'antd';
import firebase from '../../config/firebase'
import { ExclamationCircleOutlined } from '@ant-design/icons';
function DriversTable() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editCutomer,seteditCutomer] = useState('')
    const {confirm} = Modal
    const [dispatcher, loading, error] = useCollectionData(
        firebase.firestore().collection("dispatchers")
    );
    const deleteCallback = (id) => {
        firebase
            .firestore()
            .collection("dispatchers")
            .doc(id)
            .delete()
            .then(() => {
                console.log('delete')
            });
    };
    const saveEdituser = () => {
        if(editCutomer != ''){
            firebase
                .firestore()
                .collection("dispatchers")
                .doc(editCutomer.name)
                .set(editCutomer)
                .then(() => {
                    setIsModalVisible(false);
                    console.log('Saved')
                });
        }
    };
    function showConfirm(id) {
        confirm({
            title: `Do you Want to delete ${id} Dispatcher ?`,
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
    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Phone', dataIndex: 'phone', key: 'phone' },
        { title: 'Edit', dataIndex: 'edit', key: 'edit' },
        { title: 'Delete', dataIndex: 'delete', key: 'delete' },
    ];
    const data = dispatcher && dispatcher.map(el => {
        return {
            name: el.name,
            email: el.email,
            phone: `+1${el.phoneNo}`,
            edit: <Button onClick={() => {
                seteditCutomer(el)
                setIsModalVisible(true)
            }} type="ghost">Edit</Button>,
            delete: <Button onClick={() => {
                showConfirm(el.name)
            }} type="primary">Delete</Button>
        }
    })

    const handleCancel = () => {
        setIsModalVisible(false);
    };
   
    const onChangeHangler2 = (e) => {
        seteditCutomer({
            ...editCutomer,
            [e.target.name]: e.target.value
        })
    }
    return (
        <>
            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                bordered={true}
            />
            <Modal title="Edit User" visible={isModalVisible} onOk={saveEdituser} onCancel={handleCancel}>
                <p style={{ margin: '0px' }} className="para">Name<span className="optional">(Required)</span></p>
                <Input name="name" disabled value={editCutomer.name} onChange={(e) => onChangeHangler2(e)} className="input" placeholder="Name...." type="text" />
                <p className="para">Email <span className="optional">(Required)</span></p>
                <Input name="email" value={editCutomer.email} onChange={(e) => onChangeHangler2(e)} className="input" placeholder="Email...." type="email" />
                <p className="para">Phone <span className="optional">(Required)</span></p>
                <Input name="phoneNo" value={editCutomer.phoneNo} onChange={(e) => onChangeHangler2(e)} className="input" placeholder="Email...." type="email" />
            </Modal>
        </>
    );
}

export default DriversTable