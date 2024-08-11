import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { MODULE_EHSREPORTDETAIL } from '.'
import {
  addListItemService,
  deleteListItemService,
  getItemsService,
  updateListItemService
} from '../../common/services'
import lists from '../../common/lists'

const initState = {
  selectedRadios: {},
  checkedQuestions: {},

  isShowModal: false,
  selectedQuestionDetail: {}
}

export const MODULE_EHSREPORTDETAIL_QUESTIONLIST = MODULE_EHSREPORTDETAIL + '_QUESTIONLIST'

export const handleIsCheckedCheckbox = createAsyncThunk(
  MODULE_EHSREPORTDETAIL_QUESTIONLIST + '/handleIsCheckedCheckbox',
  async (question) => {
    const response = await addListItemService(lists.EHS_QuestionListDetails, question)
    return response
  }
)

export const handleUncheckedCheckbox = createAsyncThunk(
  MODULE_EHSREPORTDETAIL_QUESTIONLIST + '/handleUncheckedCheckbox',
  async (question) => {
    const oldQuestionDetail = await getItemsService(lists.EHS_QuestionListDetails, {
      filter: `EHSReportID eq '${question.EHSReportID}' and QuestionID eq '${question.QuestionID}'`
    }).then((res) => res.value[0])
    if (oldQuestionDetail) {
      await deleteListItemService(lists.EHS_QuestionListDetails, oldQuestionDetail.ID)
    }
  }
)

export const handleIsCheckedRadio = createAsyncThunk(
  MODULE_EHSREPORTDETAIL_QUESTIONLIST + '/handleIsCheckedRadio',
  async (question) => {
    const [newQuestionDetail, oldQuestionDetail] = await Promise.all([
      addListItemService(lists.EHS_QuestionListDetails, question),
      getItemsService(lists.EHS_QuestionListDetails, {
        filter: `EHSReportID eq '${question.EHSReportID}' and ParentQuestionID eq '${question.ParentQuestionID}'`
      }).then((res) => res.value[0])
    ])
    if (oldQuestionDetail) {
      await deleteListItemService(lists.EHS_QuestionListDetails, oldQuestionDetail.ID)
    }
    return newQuestionDetail
  }
)

export const handleGetQuestionDetails = createAsyncThunk(
  MODULE_EHSREPORTDETAIL_QUESTIONLIST + '/handleGetQuestionDetails',
  async (question) => {
    const response = await getItemsService(lists.EHS_QuestionListDetails, {
      filter: `QuestionID eq '${question.QuestionID}' and EHSReportID eq '${question.EHSReportID}'`
    }).then((res) => res.value[0])
    return response
  }
)

export const handleSaveQuestionDetails = createAsyncThunk(
  MODULE_EHSREPORTDETAIL_QUESTIONLIST + '/handleSaveQuestionDetails',
  async ({ questionDetailID, description }) => {
    await updateListItemService(lists.EHS_QuestionListDetails, questionDetailID, {
      Description: description
    })
  }
)

const ehsQuestionListSlice = createSlice({
  name: MODULE_EHSREPORTDETAIL_QUESTIONLIST,
  initialState: initState,
  reducers: {
    setCheckedQuestions: (state, action) => {
      state.checkedQuestions = {
        ...state.checkedQuestions,
        [action.payload.question.Title]: action.payload.isChecked
      }
    },
    setSelectedRadios: (state, action) => {
      state.selectedRadios = {
        ...state.selectedRadios,
        [action.payload.groupID]: action.payload.question.Title
      }
    },
    setDefaultQuestionDetails: (state, action) => {
      state.selectedRadios = {
        ...action.payload.selectedRadios
      }
      state.checkedQuestions = {
        ...action.payload.checkedQuestions
      }
    },
    closeModal: (state) => {
      state.isShowModal = false
      state.selectedQuestionDetail = {}
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(handleIsCheckedCheckbox.fulfilled, (state, action) => {
        state.selectedQuestionDetail = action.payload
        state.isShowModal = true
      })
      .addCase(handleIsCheckedRadio.fulfilled, (state, action) => {
        state.selectedQuestionDetail = action.payload
        state.isShowModal = true
      })
      .addCase(handleUncheckedCheckbox.fulfilled, () => {})
      .addCase(handleGetQuestionDetails.fulfilled, (state, action) => {
        state.selectedQuestionDetail = action.payload
        state.isShowModal = true
      })
      .addCase(handleSaveQuestionDetails.fulfilled, (state) => {
        state.selectedQuestionDetail = {}
        state.isShowModal = false
      })
  }
})

export const {
  setSelectedRadios,
  setCheckedQuestions,
  setDefaultQuestionDetails,
  openModal,
  closeModal
} = ehsQuestionListSlice.actions

export const ehsQuestionListReducer = ehsQuestionListSlice.reducer
