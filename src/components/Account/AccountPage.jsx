import { Button, Modal, Popconfirm, Table, Tag } from 'antd'
import React, { useState } from 'react'
import lists from '../../common/lists'
import { getItemsService, updateListItemService } from '../../common/services'
import { handleError } from '../../common/helpers'
import SPPagination from '../../common/components/SPPagination'
import AccountDetail from './AccountDetail'
import ResetPasswordForm from './ResetPasswordForm'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'

const AccountPage = () => {
  // states
  const [accounts, setAccounts] = useState([])
  const [selectedAccount, setSelectedAccount] = useState({
    item: null,
    mode: 'new'
  })
  const [isShowCreateAccount, setIsShowCreateAccount] = useState(false)
  const [isShowEditAccount, setIsShowEditAccount] = useState(false)
  const [isResetPassword, setIsResetPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])

  // useEffect(() => {
  //   handleGetAccounts()
  // }, [])

  //table column
  const columns = [
    {
      title: 'ID',
      dataIndex: 'ID',
      key: 'ID',
      sorter: (a, b) => a.ID - b.ID
    },
    {
      title: 'Username',
      dataIndex: 'UserName',
      key: 'UserName'
    },
    {
      title: 'Password',
      dataIndex: 'Password',
      key: 'Password',
      render: (password) => {
        // Show only the first 10 characters of the password followed by an ellipsis
        const shortPassword = password.length > 10 ? password.substring(0, 10) + '...' : password
        return <span>{shortPassword}</span>
      }
    },
    {
      title: 'Role',
      dataIndex: 'Role',
      key: 'Role',
      render: (role) => {
        let color = ''
        if (role === 'admin') {
          color = 'red'
        } else {
          color = 'green'
        }
        return (
          <Tag color={color} key={role}>
            {role}
          </Tag>
        )
      },
      filters: [
        { text: 'Admin', value: 'admin' },
        { text: 'Contractor', value: 'contractor' }
      ],
      onFilter: (value, record) => record.Role.indexOf(value) === 0
    },
    {
      title: 'Status',
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
      },
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false }
      ],
      onFilter: (value, record) => record.IsActive === value
    },
    {
      title: 'Action',
      key: 'Action',
      render: (_, item) => (
        <div key={item.ID}>
          <Button
            icon={<FontAwesomeIcon icon={faKey} />}
            className="bg-amber-300 bg-opacity-60 text-black m-1"
            onClick={() => {
              setSelectedAccount({
                item: item,
                mode: 'edit'
              })
              setIsResetPassword(true)
            }}>
            Reset Password
          </Button>
          <Button
            icon={<FontAwesomeIcon icon={faPenToSquare} />}
            className="bg-sky-400 bg-opacity-60 text-black m-1"
            onClick={() => {
              setSelectedAccount({
                item: item,
                mode: 'edit'
              })
              setIsShowEditAccount(true)
            }}
            disabled={item.Role === 'admin' ? true : false}>
            Chỉnh sửa
          </Button>
          <Popconfirm
            onConfirm={() => handleClickDeleteAccount(item)}
            title="Delete item"
            description="Confirm delete item">
            <Button
              icon={<FontAwesomeIcon icon={faTrashCan} />}
              className="bg-red-400 bg-opacity-70 text-black m-1"
              disabled={item.Role === 'admin' ? true : false}>
              {item.IsActive ? 'Xóa' : 'Khôi phục'}
            </Button>
          </Popconfirm>
        </div>
      )
    }
  ]

  const handleGetAccounts = async () => {
    setLoading(true)
    try {
      let data = await getItemsService(lists.Accounts, {
        orderBy: 'ID desc'
      })

      setAccounts(data.value)
      setLoading(false)

      return data
    } catch (error) {
      handleError(error)
    }
    setLoading(false)
  }

  const handleClickCreateAccount = async () => {
    let users = await getItemsService(lists.Users)
    setUsers(users.value)
    setSelectedAccount({
      item: null,
      mode: 'new'
    })
    setIsShowCreateAccount(true)
  }

  const handleClickDeleteAccount = async (item) => {
    await updateListItemService(lists.Accounts, item.ID, {
      IsActive: !item.IsActive
    })
    handleGetAccounts()
  }

  return (
    <div>
      <div className="flex justify-end m-4">
        <Button
          icon={<i className="fa-solid fa-plus"></i>}
          type="primary"
          onClick={() => {
            handleClickCreateAccount()
          }}>
          Add Account
        </Button>
      </div>
      <Table dataSource={accounts} rowKey={(r) => r.ID} loading={loading} columns={columns} />
      <SPPagination
        getItems={handleGetAccounts}
        setItems={setAccounts}
        items={accounts}
        setLoading={setLoading}
      />

      <Modal
        destroyOnClose
        title={selectedAccount.mode === 'new' ? 'Create Account' : 'Edit Account'}
        open={selectedAccount.mode === 'new' ? isShowCreateAccount : isShowEditAccount}
        footer={[]}
        onCancel={() => {
          selectedAccount.mode === 'new'
            ? setIsShowCreateAccount(false)
            : setIsShowEditAccount(false)
        }}>
        <AccountDetail
          mode={selectedAccount.mode}
          item={selectedAccount.item}
          users={users}
          onSubmit={() => {
            // console.log('returnValues:', returnValues)
            handleGetAccounts()
            selectedAccount.mode === 'new'
              ? setIsShowCreateAccount(false)
              : setIsShowEditAccount(false)
          }}
          onCancel={() => {
            selectedAccount.mode === 'new'
              ? setIsShowCreateAccount(false)
              : setIsShowEditAccount(false)
          }}
        />
      </Modal>

      <Modal
        destroyOnClose
        title="Reset Password"
        open={isResetPassword}
        footer={[]}
        onCancel={() => {
          setIsResetPassword(false)
        }}>
        <ResetPasswordForm
          onSubmit={() => {
            handleGetAccounts()
            setIsResetPassword(false)
          }}
          onCancel={() => {
            setIsResetPassword(false)
          }}
          item={selectedAccount.item}
        />
      </Modal>
    </div>
  )
}

export default AccountPage
