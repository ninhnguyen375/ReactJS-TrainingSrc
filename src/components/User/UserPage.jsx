import { Button, Modal, Popconfirm, Table, Tag } from 'antd'
import React, { useState } from 'react'
import lists from '../../common/lists'
import {
  deleteListItemService,
  getItemsService,
  updateListItemService
} from '../../common/services'
import { handleError } from '../../common/helpers'
import SPPagination from '../../common/components/SPPagination'
import UserForm from './UserForm'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo, faLock, faPenToSquare, faUnlock } from '@fortawesome/free-solid-svg-icons'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons/faTrashCan'

const UserPage = () => {
  // states
  const [users, setUsers] = useState()
  const [selectedUser, setSelectedUser] = useState({
    item: null,
    mode: 'new'
  })
  const [isShowCreateUser, setIsShowCreateUser] = useState(false)
  const [isShowEditUser, setIsShowEditUser] = useState(false)
  const [isShowViewDetail, setIsViewDetail] = useState(false)
  const [loading, setLoading] = useState(false)

  // useEffect(() => {
  //   handleGetAccounts()
  // }, [])

  //table column
  const columns = [
    {
      title: 'GPID',
      dataIndex: 'Title',
      key: 'Title'
    },
    {
      title: 'Full Name',
      dataIndex: 'FullName',
      key: 'FullName'
    },
    {
      title: 'First Name',
      dataIndex: 'FirstName',
      key: 'FirstName'
    },
    {
      title: 'Last Name',
      dataIndex: 'LastName',
      key: 'LastName'
    },
    {
      title: 'Email',
      dataIndex: 'Email',
      key: 'Email'
    },
    {
      title: 'Phone',
      dataIndex: 'Phone',
      key: 'Phone'
    },
    {
      title: 'Status Active',
      dataIndex: 'IsActive',
      key: 'IsActive',
      render: (status) => {
        let color = ''
        let statusTitle = ''
        if (status) {
          statusTitle = 'Active'
          color = 'green'
        } else {
          statusTitle = 'Inactive'
          color = 'red'
        }
        return (
          <Tag color={color} key={statusTitle}>
            {statusTitle}
          </Tag>
        )
      }
    },
    {
      title: 'Action',
      key: 'Action',
      render: (_, item) => (
        <div key={item.ID}>
          <Button
            onClick={() => {
              setSelectedUser({
                item: item,
                mode: 'view'
              })
              setIsViewDetail(true)
            }}
            icon={<FontAwesomeIcon icon={faCircleInfo} />}
            className="bg-amber-300 bg-opacity-60 text-black m-1"></Button>
          <Button
            icon={<FontAwesomeIcon icon={faPenToSquare} />}
            className="bg-sky-400 bg-opacity-60 text-black m-1"
            onClick={() => {
              setSelectedUser({
                item: item,
                mode: 'edit'
              })
              setIsShowEditUser(true)
            }}></Button>
          <Popconfirm
            onConfirm={() => handleClickDeleteUser(item)}
            title="Delete item"
            description="Confirm delete item">
            <Button
              icon={<FontAwesomeIcon icon={faTrashCan} />}
              className="bg-red-400 bg-opacity-70 text-black m-1"></Button>
          </Popconfirm>
          <Popconfirm
            onConfirm={() => handleClickBlockUser(item)}
            title="Block item"
            description="Confirm block item">
            <Button
              icon={
                item?.IsActive ? (
                  <FontAwesomeIcon icon={faLock} />
                ) : (
                  <FontAwesomeIcon icon={faUnlock} />
                )
              }
              className="bg-yellow-400 bg-opacity-70 text-black m-1"></Button>
          </Popconfirm>
        </div>
      )
    }
  ]

  const handleGetUsers = async () => {
    setLoading(true)
    try {
      let data = await getItemsService(lists.Users, {
        orderBy: 'ID desc'
      })

      setUsers(data.value)
      setLoading(false)

      return data
    } catch (error) {
      handleError(error)
    }
    setLoading(false)
  }

  const handleClickCreateUser = () => {
    setSelectedUser({
      item: null,
      mode: 'new'
    })
    setIsShowCreateUser(true)
  }

  const handleClickDeleteUser = async (item) => {
    await deleteListItemService(lists.Users, item.ID)

    handleGetUsers()
  }

  const handleClickBlockUser = async (item) => {
    await updateListItemService(lists.Users, item.ID, {
      IsActive: !item.IsActive
    })
    handleGetUsers()
  }

  return (
    <div>
      <div className="flex justify-end m-4 gap-2">
        <Button
          icon={<i className="fa-solid fa-plus"></i>}
          type="primary"
          onClick={handleClickCreateUser}>
          Add User
        </Button>
      </div>
      <Table
        scroll={{ x: 370 }}
        dataSource={users}
        rowKey={(r) => r.ID}
        loading={loading}
        columns={columns}
      />
      <SPPagination
        getItems={handleGetUsers}
        setItems={setUsers}
        items={users}
        setLoading={setLoading}
      />

      <Modal
        destroyOnClose
        title={
          selectedUser.mode === 'new'
            ? 'Create User'
            : selectedUser.mode === 'edit'
            ? 'Edit User'
            : 'View User'
        }
        open={
          selectedUser.mode === 'new'
            ? isShowCreateUser
            : selectedUser.mode === 'edit'
            ? isShowEditUser
            : isShowViewDetail
        }
        footer={[]}
        onCancel={() => {
          selectedUser.mode === 'new'
            ? setIsShowCreateUser(false)
            : selectedUser.mode === 'edit'
            ? setIsShowEditUser(false)
            : setIsViewDetail(false)
        }}>
        <UserForm
          mode={selectedUser.mode}
          item={selectedUser.item}
          onSubmit={() => {
            // console.log('returnValues:', returnValues)
            handleGetUsers()
            selectedUser.mode === 'new'
              ? setIsShowCreateUser(false)
              : selectedUser.mode === 'edit'
              ? setIsShowEditUser(false)
              : setIsViewDetail(false)
          }}
          onCancel={() => {
            selectedUser.mode === 'new'
              ? setIsShowCreateUser(false)
              : selectedUser.mode === 'edit'
              ? setIsShowEditUser(false)
              : setIsViewDetail(false)
          }}
        />
      </Modal>
    </div>
  )
}

export default UserPage
