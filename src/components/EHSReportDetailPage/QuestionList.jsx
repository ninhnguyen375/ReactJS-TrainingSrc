import React, { useEffect } from 'react'
import { Checkbox, Collapse, Modal, Input, Radio, Form } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { MODULE_EHSREPORTDETAIL } from '../../store/ehsreportdetail'
import {
  setCheckedQuestions,
  setSelectedRadios,
  MODULE_EHSREPORTDETAIL_QUESTIONLIST,
  closeModal,
  handleIsCheckedCheckbox,
  handleIsCheckedRadio,
  handleUncheckedCheckbox,
  setDefaultQuestionDetails,
  handleGetQuestionDetails,
  handleSaveQuestionDetails
} from '../../store/ehsreportdetail/ehsquestionliststore'
import DocumentStore from '../../common/components/DocumentStore/DocumentStore'
import AllImagesOfRecord from '../../common/components/AllImagesOfRecord'
import lists from '../../common/lists'
import { useForm } from 'antd/es/form/Form'
import { debounce } from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

const QuestionList = () => {
  const { report, questionList, questionListDetails } = useSelector(
    (state) => state[MODULE_EHSREPORTDETAIL]
  )
  const { selectedRadios, checkedQuestions, isShowModal, selectedQuestionDetail } = useSelector(
    (state) => state[MODULE_EHSREPORTDETAIL_QUESTIONLIST]
  )

  const dispatch = useDispatch()
  const [form] = useForm()

  const handleOnCheckboxChange = debounce((question, isChecked) => {
    dispatch(setCheckedQuestions({ question, isChecked }))
    const isLastLevelQuestion =
      questionList.filter((q) => q.ParentQuestionID === question.Title).length === 0
    if (isLastLevelQuestion && isChecked) {
      dispatch(
        handleIsCheckedCheckbox({
          QuestionID: question.Title,
          EHSReportID: report?.ID || 1,
          ParentQuestionID: question.ParentQuestionID,
          Title: question.Question,
          ComponentType: question.ComponentType
        })
      )
    } else if (!isChecked && isLastLevelQuestion) {
      dispatch(
        handleUncheckedCheckbox({
          QuestionID: question.Title,
          EHSReportID: report?.ID || 1
        })
      )
    }
  }, 100)

  const handleOnRadioChange = debounce((groupID, question) => {
    dispatch(setSelectedRadios({ groupID, question }))
    const isLastLevelQuestion =
      questionList.filter((q) => q.ParentQuestionID === question.Title).length === 0
    if (isLastLevelQuestion) {
      dispatch(
        handleIsCheckedRadio({
          QuestionID: question.Title,
          EHSReportID: report?.ID || 1,
          ParentQuestionID: question.ParentQuestionID,
          Title: question.Question,
          ComponentType: question.ComponentType
        })
      )
    }
  }, 100)

  const handleOnClickInfoIcon = (question) => {
    dispatch(
      handleGetQuestionDetails({
        QuestionID: question.Title,
        EHSReportID: report?.ID || 1
      })
    )
  }

  const handleSubmit = () => {
    try {
      form.validateFields().then((values) => {
        dispatch(
          handleSaveQuestionDetails({
            questionDetailID: selectedQuestionDetail.ID,
            description: values.description
          })
        )
      })
    } catch (error) {
      return
    }
  }

  const renderQuestions = (questions, parentID = null) => {
    return (
      <div className="d-flex flex-col gap-2">
        {questions
          .filter((question) => question.ParentQuestionID === parentID)
          .map((question) => {
            const groupID = question.ParentQuestionID
            const isLastLevelQuestion =
              questionList.filter((q) => q.ParentQuestionID === question.Title).length === 0
            switch (question.ComponentType) {
              case 'Collapse':
                return (
                  <Collapse
                    header={question.Question}
                    className="bg-white  rounded-lg shadow-normal"
                    defaultActiveKey={[question.ID.toString()]}
                    key={question.ID}
                    items={[
                      {
                        key: question.ID,
                        label: question.Question,
                        children: renderQuestions(questions, question.Title)
                      }
                    ]}
                  />
                )
              case 'Checkbox':
                return (
                  <React.Fragment key={question.ID}>
                    <Checkbox
                      onChange={(e) => handleOnCheckboxChange(question, e.target.checked)}
                      checked={checkedQuestions[question.Title]}>
                      {question.Question}
                      {!!checkedQuestions[question.Title] && isLastLevelQuestion && (
                        <FontAwesomeIcon
                          className="ml-2 text-xl text-primaryColor"
                          icon={faInfoCircle}
                          onClick={() => handleOnClickInfoIcon(question)}
                        />
                      )}
                    </Checkbox>
                    {checkedQuestions[question.Title] && renderQuestions(questions, question.Title)}
                  </React.Fragment>
                )
              case 'Radio':
                return (
                  <React.Fragment key={question.ID}>
                    <Radio
                      onChange={() => handleOnRadioChange(groupID, question)}
                      checked={selectedRadios[groupID] === question.Title}>
                      {question.Question}
                      {selectedRadios[groupID] === question.Title && isLastLevelQuestion && (
                        <FontAwesomeIcon
                          className="ml-2 text-xl text-primaryColor"
                          icon={faInfoCircle}
                          onClick={() => handleOnClickInfoIcon(question)}
                        />
                      )}
                    </Radio>
                    {selectedRadios[groupID] === question.Title &&
                      renderQuestions(questions, question.Title)}
                  </React.Fragment>
                )
              default:
                return <span key={question.ID}>{question.Question}</span>
            }
          })}
      </div>
    )
  }

  useEffect(() => {
    if (selectedQuestionDetail) {
      form.setFieldsValue({
        description: selectedQuestionDetail.Description
      })
    }
  }, [selectedQuestionDetail])

  useEffect(() => {
    if (questionListDetails) {
      const defaultQuestionList = questionListDetails.reduce((acc, question) => {
        let parentQuestionID = question.ParentQuestionID

        let questions = [questionList.find((q) => q.Title === question.QuestionID)]
        while (parentQuestionID) {
          const parentQuestion = questionList.find((q) => q.Title === parentQuestionID)
          if (parentQuestion) {
            if (!acc.find((q) => q.ID === parentQuestion.ID)) {
              questions.unshift(parentQuestion) // Thêm vào đầu mảng
            }
            parentQuestionID = parentQuestion.ParentQuestionID
          } else {
            break // Thoát khỏi vòng lặp nếu không tìm thấy câu hỏi cha
          }
        }
        return acc.concat(questions) // Thêm mảng câu hỏi vào accumulator
      }, [])
      const defaultSelectedRadios = defaultQuestionList.reduce((acc, question) => {
        if (question.ComponentType === 'Radio') {
          acc[question.ParentQuestionID] = question.Title
        }
        return acc
      }, {})

      const defaultSelectedCheckboxes = defaultQuestionList.reduce((acc, question) => {
        if (question.ComponentType === 'Checkbox') {
          acc[question.Title] = true
        }
        return acc
      }, {})

      dispatch(
        setDefaultQuestionDetails({
          selectedRadios: defaultSelectedRadios,
          checkedQuestions: defaultSelectedCheckboxes
        })
      )
    }
  }, [questionListDetails])

  return (
    <div className="d-flex flex-col gap-2">
      {renderQuestions(questionList)}

      <Modal
        title={<label className="block font-bold mb-1">{selectedQuestionDetail?.Title}</label>}
        open={isShowModal}
        onOk={handleSubmit}
        centered
        onCancel={() => dispatch(closeModal())}
        okText="Lưu"
        cancelText="Hủy">
        <Form form={form} layout="vertical">
          <Form.Item
            label={<label className="block font-bold mb-1">Mô tả</label>}
            name="description"
            className="mb-2">
            <Input.TextArea rows={3} />
          </Form.Item>
          <div className="mt-2">
            <label className="block font-bold mb-1">Hình ảnh:</label>
            <AllImagesOfRecord
              listName={lists.QuestionList.listName}
              storeID={selectedQuestionDetail?.ID}
              mode={'Edit'}
            />
          </div>

          <div className="my-2">
            <label className="block font-bold mb-2">Đính kèm file:</label>
            <DocumentStore
              list={lists.EHS_QuestionListDetails}
              storeID={selectedQuestionDetail?.ID}
              mode="Edit"
            />
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default QuestionList
