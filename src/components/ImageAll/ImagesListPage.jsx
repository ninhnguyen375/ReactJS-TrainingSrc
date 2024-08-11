import React, { useEffect, useState } from 'react'
import { Space, Table } from 'antd'
import { getItemsService } from '../../common/services'
import lists from '../../common/lists'
import AllImagesOfRecord from '../../common/components/AllImagesOfRecord'

const ImagesListPage = () => {
  const [recordID, setRecordID] = useState()
  const [todoList, setTodoList] = useState([])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'ID',
      key: 'ID'
    },
    {
      title: 'Title',
      dataIndex: 'Title',
      key: 'Title'
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => setRecordID(record.ID)}>Edit </a>
        </Space>
      )
    }
  ]

  const getTodoList = async () => {
    let data = await getItemsService(lists.ImageTestList)
    //data = data.value
    const dataSource = data.value.map((item) => ({ ...item, key: item.ID }))
    setTodoList(dataSource)
  }

  useEffect(() => {
    getTodoList()
  }, [])

  return (
    <div>
      <h1>List Item</h1>
      <Table
        dataSource={todoList}
        columns={columns}
        pagination={{
          pageSize: 5
        }}></Table>
      <h1>List Image of ID {recordID}</h1>

      <br></br>
      {recordID ? (
        <AllImagesOfRecord
          //list={lists.ImageTestList}
          listName={'ImageTestList'}
          storeID={recordID}
          mode={'Edit'}
        />
      ) : null}
    </div>
  )
}

export default ImagesListPage
