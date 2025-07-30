import React from 'react'
import PendingRecordsSalesView from './PendingRecordSalesView'

const PendingRecordSalesViewWrapper = ({No}: {No: string}) => {
  return (
    <div>
      <PendingRecordsSalesView No={No} />
    </div>
  )
}

export default PendingRecordSalesViewWrapper
