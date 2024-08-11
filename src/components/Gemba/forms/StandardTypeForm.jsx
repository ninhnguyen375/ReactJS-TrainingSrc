import { Form, Input } from 'antd'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useForm } from 'antd/es/form/Form'
import { useUI } from '../../../common/UIProvider'
import AllImagesOfRecord from '../../../common/components/AllImagesOfRecord'
import TextArea from 'antd/es/input/TextArea'
import AsyncButton from '../../../common/components/AsyncButton'
import { handleError } from '../../../common/helpers'
import { getItemsService } from '../../../common/services'
import lists from '../../../common/lists'
import { set } from 'lodash'

const formMode = {
  edit: 'edit',
  new: 'new',
  view: 'view'
}

const propTypes = {
  questionStandard: PropTypes.object,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  mode: PropTypes.oneOf(['new', 'edit', 'view']).isRequired
}

const StandardTypeForm = ({ questionStandard, onSubmit, onCancel, mode }) => {
  const ui = useUI()
  const [form] = useForm()
  const [standardType, setStandardType] = useState({})

  const getStandardType = async (id) => {
    let data = await getItemsService(lists.StandardType, {
      filter: `Title eq '${id}' and Status eq 'Activated'`,
      top: 1
    })

    setStandardType(data.value[0])

    // Set form fields with fetched data
    form.setFieldsValue({
      StandardName: questionStandard.StandardName,
      StandardDescription: questionStandard.StandardDescription,
      StandardTypeID: data.value[0].StandardTypeName
    })
  }

  const handleSubmit = async () => {
    try {
      await form.validateFields()
    } catch (error) {
      return
    }

    const values = form.getFieldsValue()

    try {
      ui.notiSuccess('Successfully')

      return onSubmit(values)
    } catch (error) {
      ui.notiError('Failed')
      handleError(error)
    }
  }

  useEffect(() => {
    getStandardType(questionStandard.StandardTypeID)
  }, [])

  return (
    <div>
      <Form layout="vertical" form={form} disabled={mode === formMode.view ? true : false}>
        <Form.Item label="Tên tiêu chuẩn:" name="StandardName">
          <TextArea />
        </Form.Item>
        <Form.Item label="Hình ảnh:">
          <AllImagesOfRecord
            mode={mode === formMode.view ? 'Edit' : 'Edit'}
            listName={'QuestionStandardDetail'}
            storeID={questionStandard?.ID}
          />
        </Form.Item>
        <Form.Item label="Mô tả:" name="StandardDescription">
          <TextArea />
        </Form.Item>
        <Form.Item label="Kiểu:" name="StandardTypeID">
          <Input />
        </Form.Item>
      </Form>

      <div className="d-flex justify-content-end mt-4">
        <AsyncButton icon={<i className="fa-regular fa-circle-xmark"></i>} onClick={onCancel}>
          Cancel
        </AsyncButton>
        {mode === formMode.view ? null : (
          <AsyncButton
            icon={<i className="fa-solid fa-paper-plane"></i>}
            className="ms-2"
            type="primary"
            onClick={handleSubmit}>
            {mode === formMode.new ? 'Tạo' : 'Cập nhật'}
          </AsyncButton>
        )}
      </div>
    </div>
  )
}

StandardTypeForm.propTypes = propTypes

export default StandardTypeForm
