import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Modal, Radio, Select } from 'antd'
import PropTypes from 'prop-types'
import lists from '../../common/lists'
import { getItemsService } from '../../common/services'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons/faCircleInfo'
import StandardTypeForm from './forms/StandardTypeForm'

const GembaCheckListQuestion = ({
  parentQuestionID,
  questionList,
  questionStandardDetailList,
  setAnswers,
  mode,
  formMode,
  selectedWalkPlanContent
}) => {
  const [childQuestions, setChildQuestions] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalContent, setModalContent] = useState('')
  const [walkPlanContentDetail, setWalkPlanContentDetail] = useState({})
  const [questionAnswers, setQuestionAnswers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isShowStandardTypeForm, setIsShowStandardTypeForm] = useState(false)
  const [questionStandard, setQuestionStandard] = useState({})

  const filterChildQuestion = async () => {
    const filteredQuestions = questionList.filter(
      (question) =>
        question.ParentQuestionID === parentQuestionID &&
        (question.ReportSubjectID === 'TCATVH' || question.ReportSubjectID === 'TCATTT') &&
        questionStandardDetailList.some((standardDetail) => standardDetail.Title === question.Title)
    )
    setChildQuestions(filteredQuestions)
  }

  const getWalkPlanContentDetail = async () => {
    setLoading(true)
    const result = await getItemsService(lists.WalkPlanContentDetail, {
      filter: `Title eq '${selectedWalkPlanContent.Title}'`,
      top: 1
    })
    setWalkPlanContentDetail(result.value[0])

    if (result.value.length === 0) {
      setQuestionAnswers([])
    } else {
      const parsedDetail = JSON.parse(result.value[0].ChecklistContent)
      setQuestionAnswers(parsedDetail)
      setAnswers(parsedDetail)
    }
    setLoading(false)
  }

  const showModal = (content) => {
    setModalContent(content)
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setIsShowStandardTypeForm(false)
  }

  const handleAnswerChange = (questionID, newAnswer) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = prevAnswers.map((item) =>
        item.questionID === questionID ? { ...item, answer: newAnswer } : item
      )
      return updatedAnswers
    })

    setQuestionAnswers((prevAnswers) => {
      const updatedAnswers = prevAnswers.map((item) =>
        item.questionID === questionID ? { ...item, answer: newAnswer } : item
      )
      return updatedAnswers
    })
  }

  const getRadioValue = (questionID) => {
    const answer = questionAnswers.find((item) => item.questionID === questionID)
    if (answer) {
      return answer.answer
    }
    return null
  }

  const handleRenderComponent = (question) => {
    if (question.ComponentType === 'Radio') {
      const componentValue = JSON.parse(question.ComponentValues)
      return (
        <Radio.Group
          horizontal
          onChange={(item) => handleAnswerChange(question.Title, item.target.value)}
          value={getRadioValue(question.Title)}
          disabled={mode === formMode.view}>
          {componentValue?.map((item) => (
            <Radio key={item.id} value={item.value}>
              {item.name}
            </Radio>
          ))}
        </Radio.Group>
      )
    }

    if (question.ComponentType === 'Checkbox') {
      return (
        <Checkbox
          onChange={(item) => handleAnswerChange(question.Title, item.target.checked)}
          checked={getRadioValue(question.Title)}
          disabled={mode === formMode.view}>
          Đúng
        </Checkbox>
      )
    }

    return null
  }

  useEffect(() => {
    if (parentQuestionID && questionStandardDetailList.length > 0) {
      filterChildQuestion()
    }
  }, [parentQuestionID, questionStandardDetailList])

  useEffect(() => {
    getWalkPlanContentDetail()
  }, [])

  return (
    <>
      {childQuestions?.map((question) => (
        <tr key={question.ID}>
          <td>
            <FontAwesomeIcon
              icon={faCircleInfo}
              className="mr-2 cursor-pointer"
              onClick={() => {
                setQuestionStandard(
                  questionStandardDetailList.find((item) => item.Title === question.Title)
                )
                setIsShowStandardTypeForm(true)
              }}
            />
            {question.Question}{' '}
            {!question.IsDetailRender && (
              <Button type="link" onClick={() => showModal(question.Question)}>
                More
              </Button>
            )}
          </td>
          <td>{handleRenderComponent(question)}</td>
        </tr>
      ))}
      {childQuestions?.map(
        (question) =>
          question.IsDetailRender && (
            <GembaCheckListQuestion
              key={question.ID}
              parentQuestionID={question.Title}
              questionList={questionList}
              questionStandardDetailList={questionStandardDetailList}
            />
          )
      )}
      <Modal title="Detail" open={isModalVisible} footer={[]} onCancel={handleCancel}>
        <p>{modalContent}</p>
      </Modal>

      <Modal
        title="Thông tin tiêu chuẩn"
        open={isShowStandardTypeForm}
        footer={[]}
        onCancel={handleCancel}
        destroyOnClose>
        <StandardTypeForm
          mode="view"
          questionStandard={questionStandard}
          onSubmit={() => {
            handleCancel()
          }}
          onCancel={() => {
            handleCancel()
          }}
        />
      </Modal>
    </>
  )
}

GembaCheckListQuestion.propTypes = {
  parentQuestionID: PropTypes.string.isRequired,
  questionList: PropTypes.array.isRequired,
  questionStandardDetailList: PropTypes.array.isRequired,
  setAnswers: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
  formMode: PropTypes.object.isRequired,
  selectedWalkPlanContent: PropTypes.object.isRequired
}

export default GembaCheckListQuestion
