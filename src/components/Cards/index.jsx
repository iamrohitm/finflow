import React from 'react'
import './styles.css'
import { Card, Row } from 'antd'
import Button from '../Button'; 

const Cards = ({showExpenseModal, showIncomeModal}) => {
  return (
    <div>
       <Row
            style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                justifyContent: "space-between",
            }}
        >
            <Card variant={true} className='my-card'>
                <h2>Current Balance</h2>
                <p>₹0</p>
                <Button text='Reset Balance' blue={true} />
            </Card>

            <Card variant={true} className='my-card'>
                <h2>Total Income</h2>
                <p>₹0</p>
                <Button text='Add Income' blue={true} onClick={showIncomeModal} />
            </Card>

            <Card variant={true} className='my-card'>
                <h2>Total Expenses</h2>
                <p>₹0</p>
                <Button text='Add Expense' blue={true} onClick={showExpenseModal} />
            </Card>
        </Row>
    </div>
  )
}

export default Cards
