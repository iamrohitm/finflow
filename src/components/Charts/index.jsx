import { Line, Pie } from '@ant-design/charts';
import React from 'react'


const ChartComponent = ({sortedTransactions}) => {
    const data = sortedTransactions.map((item)=>{
        return {date: item.date, amount: item.amount}
    });

    const spendingData = sortedTransactions.filter(
        transaction => transaction.type === "expense"
    );

    let finalSpendings = spendingData.reduce((acc,obj)=>{
        let key = obj.tag;
        if(!acc[key]){
            acc[key] = {tag: obj.tag, amount: obj.amount};
        }else{
            acc[key].amount += obj.amount;
        }
        return acc;
    },{});

    let newSpendings = [
        {tag: 'food', amount: 0},
        {tag: 'education', amount: 0},
        {tag: 'office', amount: 0},
    ]

    spendingData.forEach((item)=>{
        if(item.tag == 'food'){
            newSpendings[0].amount += item.amount;
        }else  if(item.tag == 'education'){
            newSpendings[1].amount += item.amount;
        }else{
            newSpendings[2].amount += item.amount;
        }
    })

    const config = {
        data,
        xField: 'date',
        yField: 'amount',
        height: 280
    };

    const spendingConfig = {
        data: newSpendings,
        angleField: 'amount',
        colorField: 'tag',
        height: 280
    };

    let chart;
    let pieChart;
    return (
        <div className='charts-wrapper'>
            <div className='chart-box'>
                <h2 className='chart-title'>Your Analytics</h2>
                <Line {...config} />
            </div>
            <div className='chart-box'>
                <h2 className='chart-title'>Your Spendings</h2>
                <Pie {...spendingConfig} />
            </div>
        </div>
    )
}

export default ChartComponent
