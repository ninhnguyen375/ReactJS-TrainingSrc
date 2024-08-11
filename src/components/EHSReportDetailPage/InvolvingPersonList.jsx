import { faEdit, faPlus, faTrash, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Col, Divider, Form, Modal, Row, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  closeDeleteInvolvingPersonModal,
  createInvolvingPerson,
  deleteInvovlingPerson,
  FORMMODE,
  getEmployeeTypes,
  MODULE_EHSREPORTDETAIL,
  openCreateForm,
  openDeleteInvolvingPersonModal,
  openEditForm,
  setIsShowInvolvingPersonModal,
  updateInvolvingPerson
} from '../../store/ehsreportdetail'
import UsersSelect from '../../common/components/UsersSelect'

function InvolvingPersonList() {
  const [selectedUser, setSelectedUser] = useState({})
  const {
    employeeTypes,
    involvingPersons,
    isShowInvolvingPersonModal,
    isCreatingInvolvingPerson,
    selectedInvolvingPerson,
    formMode,
    selectedDeleteInvolvingPerson,
    isShowDeleteInvolvingPersonModal,
    isDeletingInvolvingPerson
  } = useSelector((state) => state[MODULE_EHSREPORTDETAIL])

  const dispatch = useDispatch()
  const [form] = Form.useForm()

  const handleOnClickAddInvolvingPerson = () => {
    form.resetFields(['userID', 'EmployeeTypeID'])
    dispatch(openCreateForm())
    setSelectedUser(null)
  }

  const handleOnClickEditInvolvingPerson = (person) => {
    // Set giá trị cho form
    form.setFieldsValue({
      EmployeeTypeID: person.InvolvingPerson_EmployeeTypeID.Id
    })

    // Cập nhật thông tin người dùng được chọn để hiển thị đúng trong UsersSelect
    setSelectedUser({
      ID: person.InvolvingPersonID.Id,
      FullName: person.InvolvingPersonFullName,
      Title: person.InvolvingPersonGPID
    })

    dispatch(openEditForm(person))
  }

  const handleOnSubmit = async () => {
    try {
      await form.validateFields()
    } catch (error) {
      return
    }
    if (formMode === FORMMODE.CREATE) {
      dispatch(
        createInvolvingPerson({
          EHS_Reporting_IDId: 1,
          InvolvingPersonIDId: selectedUser.ID,
          InvolvingPerson_EmployeeTypeIDId: form.getFieldValue('EmployeeTypeID'),
          InvolvingPersonGPID: selectedUser.Title,
          InvolvingPersonFullName: selectedUser.FullName,
          InvolvingPerson_EmployeeType: employeeTypes.find(
            (et) => et.ID === form.getFieldValue('EmployeeTypeID')
          ).EmployeeType
        })
      )
    } else {
      dispatch(
        updateInvolvingPerson({
          ID: selectedInvolvingPerson.ID,
          value: {
            InvolvingPersonIDId: selectedUser.ID,
            InvolvingPerson_EmployeeTypeIDId: form.getFieldValue('EmployeeTypeID'),
            InvolvingPersonGPID: selectedUser.Title,
            InvolvingPersonFullName: selectedUser.FullName,
            InvolvingPerson_EmployeeType: employeeTypes.find(
              (et) => et.ID === form.getFieldValue('EmployeeTypeID')
            ).EmployeeType
          }
        })
      )
    }
  }

  const handleOnClickDeleteInvolvingPerson = (person) => {
    dispatch(openDeleteInvolvingPersonModal(person))
  }

  const handleConfirmDeleteInvolvingPerson = () => {
    dispatch(deleteInvovlingPerson(selectedDeleteInvolvingPerson.ID))
  }

  useEffect(() => {
    //Nếu chưa fetch thì fetch
    if (employeeTypes.length === 0) {
      dispatch(getEmployeeTypes())
    }
  }, [isShowInvolvingPersonModal])

  return (
    <div className="d-flex flex-col gap-3">
      <div className="d-flex justify-between items-center">
        <h1>Danh sách người liên quan</h1>
        <Button icon={<FontAwesomeIcon icon={faPlus} />} onClick={handleOnClickAddInvolvingPerson}>
          Thêm
        </Button>
      </div>
      <Row gutter={[24, 24]}>
        {involvingPersons.map((person) => (
          <Col key={person.ID} xl={6} md={12} xs={12} className="d-flex flex-col ">
            <div className=" d-flex h-full px-3 py-4 border rounded-tl-lg rounded-tr-lg">
              <div className="w-5">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <div className="flex-1 flex flex-col gap-2 pl-2">
                <h3 className="font-bold">{person.InvolvingPersonFullName}</h3>
                <span className="text-gray-400">{person.InvolvingPerson_EmployeeType}</span>
              </div>
            </div>
            <div className="d-flex justify-evenly items-center border-l border-r border-b rounded-bl-lg rounded-br-lg  ">
              <div
                className="flex-1 px-2 py-2  text-center hover:text-primaryColor hover:bg-gray-100 cursor-pointer"
                onClick={() => handleOnClickEditInvolvingPerson(person)}>
                <FontAwesomeIcon key="edit" icon={faEdit} />
              </div>
              <Divider className="w-2 m-0 " type="vertical" />
              <div
                className="flex-1 px-2 py-2 text-center hover:text-red-500 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleOnClickDeleteInvolvingPerson(person)}>
                <FontAwesomeIcon key="delete" icon={faTrash} />
              </div>
            </div>
          </Col>
        ))}
      </Row>

      <Modal
        open={isShowInvolvingPersonModal}
        title="Thông tin người liên quan"
        okButtonProps={{ loading: isCreatingInvolvingPerson }}
        onCancel={() => {
          if (!isCreatingInvolvingPerson) dispatch(setIsShowInvolvingPersonModal(false))
        }}
        onOk={handleOnSubmit}>
        <Divider className="mt-2" />
        <Form form={form} layout="vertical" className="pb-2">
          <Form.Item label="Loại nhân viên" name="EmployeeTypeID">
            <Select>
              {employeeTypes.map((type) => (
                <Select.Option key={type.ID} value={type.ID}>
                  {type.Title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Họ và tên" name="userID">
            <UsersSelect defaultSelectedUser={selectedUser} setSelectedUser={setSelectedUser} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={<h1>Xác nhận xóa</h1>}
        open={isShowDeleteInvolvingPersonModal}
        onCancel={() => {
          if (!isDeletingInvolvingPerson) dispatch(closeDeleteInvolvingPersonModal())
        }}
        onOk={handleConfirmDeleteInvolvingPerson}
        okButtonProps={{
          icon: <FontAwesomeIcon icon={faTrash} />,
          danger: true,
          loading: isDeletingInvolvingPerson
        }}
        centered>
        <p className="py-3">Bạn có chắc chắn muốn xóa người liên quan này?</p>
      </Modal>
    </div>
  )
}

export default InvolvingPersonList
