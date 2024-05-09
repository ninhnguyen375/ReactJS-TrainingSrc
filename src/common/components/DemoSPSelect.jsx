import React, { useMemo, useState } from 'react'
import { getItemsService } from '../services'
import lists from '../lists'
import { filterOption, handleError } from '../helpers'
import _ from 'lodash'
import { Select, Spin } from 'antd'

const DemoSPSelect = () => {
  const [loadingFilterUser, setLoadingFilterUser] = useState(false)
  const [users, setUsers] = useState([])

  const getUsersGPID = async (searchValue) => {
    setLoadingFilterUser(true)

    try {
      let filter = `ActiveNo eq 1`

      if (searchValue) {
        filter += `and (substringof('${searchValue}', Title) or substringof('${searchValue}', FullName))`
      }

      let data = await getItemsService(lists.UsersGPID, { top: 10, filter })

      setUsers(data.value)
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
        {users.map((user) => (
          <Select.Option
            filter1={user.FullName}
            filter2={user.Title}
            key={user.ID}
            value={user.ID}
            item={user}>
            {user.FullName}
          </Select.Option>
        ))}
      </Select>
    </div>
  )
}

export default DemoSPSelect
