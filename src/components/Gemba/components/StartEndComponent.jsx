import React from 'react'

const StartEndComponent = () => {
  return (
    <div className="flex justify-between items-center p-1 bg-blue-200">
      <div className="block items-center">
        <div className="mr-2">
          <span className="italic ml-2">Bắt đầu:</span>
        </div>
        <div>
          <span className="italic ml-2">Kết thúc:</span>
        </div>
      </div>

      <div className="flex items-center">
        <div className="text-center">
          <div className="bg-white rounded-lg p-2 shadow">00:00:00</div>
        </div>
      </div>
    </div>
  )
}

export default StartEndComponent
