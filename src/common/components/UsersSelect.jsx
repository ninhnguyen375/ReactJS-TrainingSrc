import React, { useEffect, useState } from 'react'
import { Select } from 'antd'
import { debounce } from 'lodash'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'

import { getItemsService, getNextLinkService } from '../services'
import lists from '../lists'

const propTypes = {
  defaultSelectedUser: PropTypes.object,
  setSelectedUser: PropTypes.func
}

function UsersSelect({ defaultSelectedUser = {}, setSelectedUser }) {
  const [users, setUsers] = useState([])
  const [searchText, setSearchText] = useState('')
  const [loadingMore, setLoadingMore] = useState(false)
  const [nextLink, setNextLink] = useState(null)
  const [hasMore, setHasMore] = useState(null)

  const handleOnSearch = debounce(async (searchValue) => {
    setSearchText(searchValue)
    setUsers([])
    setNextLink(null)
  }, 400)

  const handleGetUsers = async () => {
    setLoadingMore(true)
    let resp
    if (nextLink) {
      resp = await getNextLinkService(nextLink)
    } else {
      resp = await getItemsService(lists.Users, {
        filter: `substringof('${searchText}',FullName) or substringof('${searchText}',Email)`
      })
    }
    setUsers((prev) => [...prev, ...resp.value])
    setNextLink(resp['odata.nextLink'])
    setHasMore(!!resp['odata.nextLink'])
    setLoadingMore(false)
  }

  useEffect(() => {
    if (searchText) {
      handleGetUsers()
    }
  }, [searchText])

  useEffect(() => {
    if (defaultSelectedUser) {
      setUsers([defaultSelectedUser])
    } else {
      setUsers([])
    }
  }, [defaultSelectedUser])

  const handleScroll = async (e) => {
    const { target } = e
    const isBottom = target.scrollTop + target.offsetHeight === target.scrollHeight
    if (isBottom && !loadingMore && hasMore) {
      await handleGetUsers()
    }
  }

  const handleOnChange = (value) => {
    const selectedUser = users.find((user) => user.ID === value)
    setSelectedUser(selectedUser)
  }

  return (
    <Select
      showSearch
      notFoundContent={null}
      filterOption={false}
      allowClear
      value={defaultSelectedUser ? defaultSelectedUser.ID : null}
      suffixIcon={<FontAwesomeIcon icon={faUser} />}
      onSearch={handleOnSearch}
      onPopupScroll={handleScroll}
      onChange={(value) => handleOnChange(value)}>
      {users.map((user) => (
        <Select.Option key={user.ID} value={user.ID}>
          {user.FullName}
        </Select.Option>
      ))}
    </Select>
  )
}

UsersSelect.propTypes = propTypes
export default UsersSelect
