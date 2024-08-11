import { configureStore } from '@reduxjs/toolkit'
import { MODULE_AUTH, authReducer } from './auth'
import { MODULE_COMMON, commonReducer } from './common'
import { ehsListPageReducer, MODULE_EHS_LIST_PAGE } from './ehslistpage'
import { ehsdetailReducer, MODULE_EHSREPORTDETAIL } from './ehsreportdetail'
import {
  ehsQuestionListReducer,
  MODULE_EHSREPORTDETAIL_QUESTIONLIST
} from './ehsreportdetail/ehsquestionliststore'

export const store = configureStore({
  reducer: {
    [MODULE_AUTH]: authReducer,
    [MODULE_COMMON]: commonReducer,
    [MODULE_EHS_LIST_PAGE]: ehsListPageReducer,
    [MODULE_EHSREPORTDETAIL]: ehsdetailReducer,
    [MODULE_EHSREPORTDETAIL_QUESTIONLIST]: ehsQuestionListReducer
  }
})
