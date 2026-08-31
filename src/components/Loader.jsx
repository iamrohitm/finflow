import React from 'react'

const Loader = () => {
  return (
    <div className='dashboard-skeleton'>
      <div className='skeleton-card-row'>
        <div className='skeleton-card' />
        <div className='skeleton-card' />
        <div className='skeleton-card' />
      </div>
      <div className='skeleton-chart-row'>
        <div className='skeleton-chart' />
        <div className='skeleton-chart' />
      </div>
      <div className='skeleton-table-row'>
        <div className='skeleton-table' />
      </div>
    </div>
  )
}

export default Loader
