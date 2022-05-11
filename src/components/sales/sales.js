import React, { useState } from 'react'
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Table, Button, Modal, Input, Switch } from 'antd';
import firebase from '../../config/firebase'
import { ExclamationCircleOutlined } from '@ant-design/icons';

export default function DriversPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editCutomer, seteditCutomer] = useState('')
  const { confirm } = Modal
  const [dispatcher, loading, error] = useCollectionData(
    firebase.firestore().collection("sales")
  );
  const deleteCallback = (id) => {
    firebase
      .firestore()
      .collection("sales")
      .doc(id)
      .delete()
      .then(() => {
        console.log('delete')
      });
  };
  const saveEdituser = () => {
    if (editCutomer != '') {
      firebase
        .firestore()
        .collection("sales")
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
      title: `Do you Want to delete ${id} Sales ?`,
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
  const onChange = (el) => {
    firebase
      .firestore()
      .collection("sales")
      .doc(el.name)
      .set({
        ...el,
        approve:el.approve == false ? true : false
      })
      .then(() => {
        console.log('Saved')
      });
  }
  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phoneNo', key: 'phone' },
    { title: 'Edit', dataIndex: 'edit', key: 'edit' },
    { title: 'Delete', dataIndex: 'delete', key: 'delete' },
  ];
  const data = dispatcher && dispatcher.map(el => {
    return {
      name: el.username,
      email: el.email,
      phoneNo: `+${el.phoneNo}`,
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
        pagination={false}
        bordered={true}
      />
      <Modal title="Edit User" visible={isModalVisible} onOk={saveEdituser} onCancel={handleCancel}>
        <p style={{ margin: '0px' }} className="para">Name<span className="optional">(Required)</span></p>
        <Input name="username" value={editCutomer.username} onChange={(e) => onChangeHangler2(e)} className="input" placeholder="Name...." type="text" />
        <p className="para">Email <span className="optional">(Required)</span></p>
        <Input name="email" value={editCutomer.email} onChange={(e) => onChangeHangler2(e)} className="input" placeholder="Email...." type="email" />
        <p className="para">Phone <span className="optional">(Required)</span></p>
        <Input name="phoneNo" value={editCutomer.phoneNo} onChange={(e) => onChangeHangler2(e)} className="input" placeholder="Email...." type="email" />
      </Modal>
    </>

  );
}
