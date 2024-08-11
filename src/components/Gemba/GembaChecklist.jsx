import { Button, DatePicker, Form, Input, Row, Space } from 'antd'
import { useForm } from 'antd/es/form/Form'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useUI } from '../../common/UIProvider'
import dayjs from '../../common/dayjs'
import {
  addListItemService,
  getItemService,
  getItemsService,
  updateListItemService
} from '../../common/services'
import lists from '../../common/lists'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { handleError } from '../../common/helpers'
import GembaCheckListQuestion from './GembaCheckListQuestion'

const formMode = {
  edit: 'edit',
  new: 'new',
  view: 'view'
}
const propTypes = {
  mode: PropTypes.string
}

const GembaChecklist = ({ mode }) => {
  const ui = useUI()
  const { id } = useParams()
  const [form] = useForm()
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState({})
  const [selectedWalkPlanContent, setSelectedWalkPlanContent] = useState({})
  const [questionHeader, setQuestionHeader] = useState([])
  const [questionList, setQuestionList] = useState([])
  const [questionStandardDetailList, setQuestionStandardDetailList] = useState([])
  const [answers, setAnswers] = useState([])

  const getWalkPlanContentAndUserInfo = async (id) => {
    ui.setLoading(true)
    let result = await getItemService(lists.WalkPlanContent, id)
    setSelectedWalkPlanContent(result)

    let data = await getItemsService(lists.Users, {
      filter: `Title eq '${result?.GPID}'`,
      top: 1
    })
    setUserInfo(data.value[0])

    const workLocationRequest = getItemsService(lists.WorkLocations, {
      filter: `Title eq '${result?.WorkLocationID}'`,
      top: 1
    })
    const locationRequest = getItemsService(lists.Locations, {
      filter: `Title eq '${result?.LocationID}'`,
      top: 1
    })
    const areaRequest = getItemsService(lists.Areas, {
      filter: `Title eq '${result?.AreaID}'`,
      top: 1
    })
    const machineRequest = getItemsService(lists.Machines, {
      filter: `Title eq '${result?.MachineID}'`,
      top: 1
    })
    const processRequest = getItemsService(lists.Processes, {
      filter: `Title eq '${result?.ProcessID}'`,
      top: 1
    })
    const taskRequest = getItemsService(lists.Tasks, {
      filter: `Title eq '${result?.TaskID}'`,
      top: 1
    })

    const [workLocation, location, area, machine, process, task] = await Promise.all([
      workLocationRequest,
      locationRequest,
      areaRequest,
      machineRequest,
      processRequest,
      taskRequest
    ])

    // Set form fields with fetched data
    form.setFieldsValue({
      Date: dayjs(),
      WorkLocationID: workLocation?.value[0]?.WorkLocationName,
      LocationID: location?.value[0]?.LocationName,
      AreaID: area?.value[0]?.AreaName,
      MachineID: machine?.value[0]?.MachineName,
      ProcessID: process?.value[0]?.ProcessName,
      TaskID: task?.value[0]?.TaskName,
      UserInfo: `${data.value[0]?.FullName} - ${data.value[0]?.Title}`
    })
    ui.setLoading(false)
  }

  const getQuestionHeader = async () => {
    let result = await getItemsService(lists.QuestionList, {
      filter: `(ReportGroup eq 'GEMBAPC') and Status eq 'Activated' and Level eq 1`
    })
    setQuestionHeader(result.value)
  }

  const getAllQuestion = async () => {
    let result = await getItemsService(lists.QuestionList, {
      filter: `Status eq 'Activated' and ReportGroup eq 'GEMBAPC'`
    })
    setQuestionList(result.value)
  }

  const getQuestionStandardDetailList = async () => {
    let result = await getItemsService(lists.QuestionStandardDetail, {
      filter: `WorkLocationID eq '${selectedWalkPlanContent.WorkLocationID}' 
      and AreaID eq '${selectedWalkPlanContent.AreaID}' 
      and MachineID eq '${selectedWalkPlanContent.MachineID}' 
      and ProcessID eq '${selectedWalkPlanContent.ProcessID}' 
      and TaskID eq '${selectedWalkPlanContent.TaskID}'`
    })
    setQuestionStandardDetailList(result.value)
  }

  const onSubmit = () => {
    navigate('/gemba/route-pitstop/follow')
  }

  const handleSave = async () => {
    try {
      await form.validateFields()
    } catch (error) {
      return
    }

    try {
      let result = await getItemsService(lists.WalkPlanContentDetail, {
        filter: `Title eq '${selectedWalkPlanContent.Title}'`,
        top: 1
      })

      if (result.value.length === 0) {
        await addListItemService(lists.WalkPlanContentDetail, {
          Title: selectedWalkPlanContent.Title,
          ChecklistContent: JSON.stringify(answers)
        })
      } else {
        await updateListItemService(lists.WalkPlanContentDetail, result.value[0].ID, {
          ChecklistContent: JSON.stringify(answers)
        })
      }

      ui.notiSuccess('Successfully')
    } catch (error) {
      ui.notiError('Failed')
      handleError(error)
    }
  }

  const handleSend = async () => {
    try {
      await form.validateFields()
    } catch (error) {
      return
    }

    const values = form.getFieldsValue()

    try {
      ui.notiSuccess('Successfully')

      if (mode === formMode.new) {
        console.log('hello')
      }

      return onSubmit(values)
    } catch (error) {
      ui.notiError('Failed')
      handleError(error)
    }
  }

  useEffect(() => {
    getWalkPlanContentAndUserInfo(id)
    getQuestionHeader()
    getAllQuestion()
  }, [id])

  useEffect(() => {
    if (selectedWalkPlanContent) {
      getQuestionStandardDetailList()
    }
  }, [selectedWalkPlanContent])

  return (
    <div className="p-3">
      <Row justify="end" style={{ marginBottom: 16 }}>
        <Space>
          <Button
            type="default"
            onClick={handleSave}
            disabled={
              !dayjs(selectedWalkPlanContent?.Date, 'DD/MM/YYYY').isSame(dayjs(), 'day')
                ? true
                : false
            }>
            Lưu
          </Button>
          <Button
            type="primary"
            onClick={handleSend}
            disabled={
              !dayjs(selectedWalkPlanContent?.Date, 'DD/MM/YYYY').isSame(dayjs(), 'day')
                ? true
                : false
            }>
            Gửi
          </Button>
        </Space>
      </Row>
      <Form layout="vertical" form={form} disabled={mode === formMode.view ? true : false}>
        <Form.Item label="Ngày giờ:" name="Date">
          <DatePicker format={'DD/MM/YYYY HH:mm'} defaultValue={dayjs()} disabled />
        </Form.Item>
        <Form.Item label="Nhà máy:" name="WorkLocationID">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Khu vực:" name="LocationID">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Vị trí làm việc:" name="AreaID">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Máy, thiết bị liên quan:" name="MachineID">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Quy trình:" name="ProcessID">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Công việc:" name="TaskID">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Người thực hiện:" name="UserInfo">
          <Input disabled />
        </Form.Item>
        {questionHeader.map((question) =>
          question.IsDetailRender ? (
            <div key={question.ID}>
              <h2>{question.Question}</h2>
              <table>
                <thead>
                  <tr>
                    <th>Các tiêu chí</th>
                    <th>Câu trả lời</th>
                  </tr>
                </thead>
                <tbody>
                  <GembaCheckListQuestion
                    parentQuestionID={question.Title}
                    questionList={questionList}
                    questionStandardDetailList={questionStandardDetailList}
                    setAnswers={setAnswers}
                    mode={
                      dayjs(selectedWalkPlanContent?.Date, 'DD/MM/YYYY').isSame(dayjs(), 'day')
                        ? 'new'
                        : 'view'
                    }
                    formMode={formMode}
                    selectedWalkPlanContent={selectedWalkPlanContent}
                  />
                </tbody>
              </table>
            </div>
          ) : (
            ''
          )
        )}
      </Form>
    </div>
  )
}

GembaChecklist.propTypes = propTypes

export default GembaChecklist
