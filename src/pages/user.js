import React from 'react'
import DispatchersPage from '../components/dispatchers/dispatchers'
import Mechanics from '../components/mechanic/mechanic'
import DriversPage from '../components/drivers/driver'
import Sales from '../components/sales/sales'
import { Radio, Button } from 'antd'
import { useRouter } from 'next/router';

const Users = () => {
    const router = useRouter()
    const [value, setValue] = React.useState("Dispatchers");
    const onChange = e => {
        setValue(e.target.value);
    };
    const UserDashboar = () => {
        if (value == "Dispatchers") {
            return (
                <DispatchersPage />
            )
        } else if (value == "Mechanics") {
            return (
                <Mechanics />
            )
        } else if (value == "Drivers") {
            return (
                <DriversPage />
            )
        }else if (value == "Sales") {
            return (
                <Sales />
            )
        }
    }
    return (
        <div>
            <div className="displayflex">
                <div>
                    <h1 style={{ color: '#3d4052' }}>{value}</h1>
                </div>
                <div>
                    <Button type="primary" onClick={() => {
                        router.push('/signup')
                    }}>Sign Up</Button>
                </div>
            </div>
            <Radio.Group onChange={onChange} value={value}>
                <Radio value={"Dispatchers"}>Dispatcher</Radio>
                <Radio value={"Mechanics"}>Mechanic</Radio>
                <Radio value={"Drivers"}>Driver</Radio>
                <Radio value={"Sales"}>Sales</Radio>
            </Radio.Group>
            <div className="hawaw">
            {UserDashboar()}
            </div>
        </div>
    )
}
export default Users
