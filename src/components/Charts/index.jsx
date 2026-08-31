import { Line } from '@ant-design/charts';
import React from 'react'

const CHART_COLORS = ['#2970ff', '#60a5fa', '#34d399', '#fbbf24', '#f97316', '#8b5cf6', '#ec4899', '#14b8a6'];

const getExpenseColor = (tag, index) => {
    if (!tag || tag === 'No expenses yet') return '#dfe7f7';
    return CHART_COLORS[index % CHART_COLORS.length];
};

const ChartComponent = ({ sortedTransactions }) => {
    const dailyBalance = new Map();

    const sortedByDate = [...sortedTransactions].sort((a, b) => new Date(a.date) - new Date(b.date));

    sortedByDate.forEach((item) => {
        const value = Number(item.amount) || 0;
        const delta = item.type === 'income' ? value : -value;
        const previousValue = dailyBalance.get(item.date) || 0;
        dailyBalance.set(item.date, previousValue + delta);
    });

    const balanceTrend = [];
    let cumulativeBalance = 0;

    Array.from(dailyBalance.entries())
        .sort(([a], [b]) => new Date(a) - new Date(b))
        .forEach(([date, delta]) => {
            cumulativeBalance += delta;
            balanceTrend.push({
                date,
                balance: Number(cumulativeBalance.toFixed(2)),
            });
        });

    const expenseGroups = sortedTransactions.reduce((acc, item) => {
        if (item.type !== 'expense') return acc;

        const tag = item.tag || 'other';
        const amount = Number(item.amount) || 0;

        if (amount <= 0) return acc;

        if (!acc[tag]) {
            acc[tag] = { tag, amount: 0 };
        }

        acc[tag].amount += amount;
        return acc;
    }, {});

    const spendingChartData = Object.values(expenseGroups).length
        ? Object.values(expenseGroups).map((item, index) => ({
            tag: String(item.tag || 'Other'),
            amount: Number(item.amount) || 0,
            color: getExpenseColor(item.tag, index),
          }))
        : [{ tag: 'No expenses yet', amount: 1, color: '#dfe7f7' }];

    const hasExpenseData = spendingChartData.some((item) => item.tag !== 'No expenses yet' && Number(item.amount) > 0);
    const displayChartData = hasExpenseData ? spendingChartData : [{ tag: 'No expenses yet', amount: 1, color: '#cbd5e1' }];
    const totalSpent = displayChartData.reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const pieGradient = (() => {
        if (!totalSpent) {
            return 'conic-gradient(#cbd5e1 0 100%)';
        }

        let start = 0;
        const segments = displayChartData.map((item) => {
            const value = Number(item.amount) || 0;
            const percentage = (value / totalSpent) * 100;
            const end = start + percentage;
            const segment = `${item.color} ${start}% ${end}%`;
            start = end;
            return segment;
        });

        return `conic-gradient(${segments.join(', ')})`;
    })();

    const config = {
        data: balanceTrend.length ? balanceTrend : [{ date: new Date().toISOString().slice(0, 10), balance: 0 }],
        xField: 'date',
        yField: 'balance',
        height: 280,
        smooth: true,
        point: {
            size: 4,
            shape: 'circle',
            style: {
                fill: '#2970ff',
                stroke: '#fff',
                lineWidth: 2,
            },
        },
        lineStyle: {
            stroke: '#2970ff',
            lineWidth: 3,
        },
        tooltip: {
            showMarkers: true,
        },
    };

    return (
        <div className='charts-wrapper'>
            <div className='chart-box'>
                <h2 className='chart-title'>Your Analytics</h2>
                <Line {...config} />
            </div>
            <div className='chart-box'>
                <h2 className='chart-title'>Your Spendings</h2>
                <div className='expense-donut-card'>
                    <div className='expense-donut' style={{ background: pieGradient }}>
                        <div className='expense-donut-center'>
                            <span>Total</span>
                            <strong>₹{totalSpent}</strong>
                        </div>
                    </div>

                    <div className='expense-legend'>
                        {displayChartData.map((item, index) => (
                            <div key={`${item.tag}-${index}`} className='expense-legend-item'>
                                <span
                                    className='expense-legend-color'
                                    style={{ background: getExpenseColor(item.tag, index) }}
                                />
                                <span className='expense-legend-label'>{item.tag}</span>
                                <span className='expense-legend-amount'>₹{Number(item.amount || 0)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChartComponent
