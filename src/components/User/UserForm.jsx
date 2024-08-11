import React, { useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button, Checkbox, Form, Input } from 'antd'
import { useForm, useWatch } from 'antd/es/form/Form'
import { handleError } from '../../common/helpers'
import { addListItemService, getItemsService, updateListItemService } from '../../common/services'
import { useUI } from '../../common/UIProvider'
import lists from '../../common/lists'
import { debounce } from 'lodash'
import AsyncButton from '../../common/components/AsyncButton'

const formMode = {
  edit: 'edit',
  new: 'new',
  view: 'view'
}

const propTypes = {
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  mode: PropTypes.oneOf(['new', 'edit', 'view']).isRequired
}

const UserForm = ({ item, onSubmit, onCancel, mode }) => {
  const [form] = useForm()
  const ui = useUI()

  // states

  const firstName = useWatch('FirstName', form)
  const lastName = useWatch('LastName', form)

  useEffect(() => {
    form.setFieldsValue({
      FullName: (firstName || '').trim() + ' ' + (lastName || '').trim()
    })
  }, [firstName, lastName])

  const handleSubmit = async () => {
    try {
      await form.validateFields()
    } catch (error) {
      return
    }

    const values = form.getFieldsValue()

    try {
      if (mode === formMode.new) {
        await addListItemService(lists.Users, values)
      }

      if (mode === formMode.edit) {
        await updateListItemService(lists.Users, item.ID, values)
      }

      ui.notiSuccess('Successfully')
      return onSubmit(values)
    } catch (error) {
      ui.notiError('Failed')
      handleError(error)
    }
  }

  const handleCheckGPID = async (value) => {
    let returnValue = await getItemsService(lists.Users, {
      filter: `Title eq '${value}'`
    })

    return returnValue.value.length === 0
  }

  const debouncedCheckGPID = useCallback(
    debounce(async (value, callback) => {
      let isValid = await handleCheckGPID(value)
      callback(isValid)
    }, 500),
    []
  )

  const validatorGPID = async (_, value) => {
    if (!value) {
      return Promise.resolve()
    }

    if (mode === formMode.edit && value === item?.Title) {
      return Promise.resolve()
    }

    await handleValidatorGPIDSpecialChar(value)

    return new Promise((resolve, reject) => {
      debouncedCheckGPID(value, (isValid) => {
        if (isValid) {
          resolve()
        } else {
          reject(new Error('Mã GPID đã tồn tại'))
        }
      })
    })
  }

  const handleValidatorGPIDSpecialChar = async (value) => {
    const specialCharRegex = /^[a-zA-Z0-9]*$/
    if (!specialCharRegex.test(value)) {
      return Promise.reject(new Error('GPID chỉ chứa chữ cái và số'))
    }
  }

  return (
    <div>
      <Form layout="vertical" form={form} disabled={formMode.view === mode ? true : false}>
        <Form.Item
          initialValue={item?.Title}
          label="GPID"
          name="Title"
          rules={[
            { required: true, message: 'Không được bỏ trống' },
            { min: 6, message: 'GPID cần có ít nhất 6 ký tự' },
            {
              validator: validatorGPID
            }
          ]}>
          <Input></Input>
        </Form.Item>
        <Form.Item
          initialValue={item?.FirstName ? item.FirstName : ''}
          label="First Name"
          name="FirstName"
          rules={[{ required: true, message: 'Không được bỏ trống' }]}>
          <Input></Input>
        </Form.Item>
        <Form.Item
          initialValue={item?.LastName ? item.LastName : ''}
          label="Last Name"
          name="LastName"
          rules={[{ required: true, message: 'Không được bỏ trống' }]}>
          <Input></Input>
        </Form.Item>
        <Form.Item
          initialValue={item?.FullName}
          label="Full Name"
          name="FullName"
          rules={[{ required: true, message: 'Không được bỏ trống' }]}>
          <Input disabled></Input>
        </Form.Item>

        <Form.Item initialValue={item?.Email} label="Email" name="Email">
          <Input></Input>
        </Form.Item>

        <Form.Item initialValue={item?.Phone} label="Phone" name="Phone">
          <Input></Input>
        </Form.Item>

        <Form.Item
          initialValue={item?.IsActive}
          label="Activate"
          name="IsActive"
          valuePropName="checked">
          <Checkbox defaultChecked>Active</Checkbox>
        </Form.Item>
      </Form>

      {formMode.view === mode ? (
        ''
      ) : (
        <div className="d-flex justify-content-end mt-4">
          <Button icon={<i className="fa-regular fa-circle-xmark"></i>} onClick={onCancel}>
            Cancel
          </Button>
          <AsyncButton
            icon={<i className="fa-solid fa-paper-plane"></i>}
            className="ms-2"
            type="primary"
            onClick={handleSubmit}>
            {mode === formMode.new ? 'Create' : 'Update'}
          </AsyncButton>
        </div>
      )}
    </div>
  )
}

UserForm.propTypes = propTypes

export default UserForm
