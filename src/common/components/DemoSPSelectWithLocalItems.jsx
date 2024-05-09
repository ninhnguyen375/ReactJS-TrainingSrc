import React, { useMemo, useState } from 'react'
import { getItemsService } from '../services'
import lists from '../lists'
import { filterOption, handleError } from '../helpers'
import _ from 'lodash'
import { Select, Spin, Tag } from 'antd'

const DemoSPSelectWithLocalItems = () => {
  const [loadingFilterUser, setLoadingFilterUser] = useState(false)
  const [localUsers] = useState([
    { ID: 1, FullName: 'Custom 1', Title: '1' },
    { ID: 2, FullName: 'Custom 2', Title: '2' },
    { ID: 2, FullName: 'Custom 3', Title: '3' }
  ])
  const [filterUsers, setFilterUsers] = useState(localUsers)

  const getUsersGPID = async (filterGPID) => {
    setLoadingFilterUser(true)

    try {
      let filter = ''

      filter += `Title eq '${filterGPID}'`
      let data = await getItemsService(lists.UsersGPID, { top: 10, filter })

      setFilterUsers(_.uniq([...localUsers, ...data.value, ...data.value]))
    } catch (error) {
      handleError(error)
    }

    setLoadingFilterUser(false)
  }

  const handleFilterUser = useMemo(() => _.debounce(getUsersGPID, 500), [500])

  return (
    <div>
      <Select
        showSearch
        style={{ width: 200 }}
        filterOption={filterOption}
        notFoundContent={loadingFilterUser ? <Spin size="small" /> : null}
        onSearch={(value) => {
          setLoadingFilterUser(true)
          handleFilterUser(value)
        }}>
        {filterUsers.map((user) => (
          <Select.Option
            filter1={user.FullName}
            filter2={user.Title}
            key={user.ID}
            value={user.ID}
            item={user}>
            <Tag>{user.FullName}</Tag>
          </Select.Option>
        ))}
      </Select>
    </div>
  )
}

export default DemoSPSelectWithLocalItems
