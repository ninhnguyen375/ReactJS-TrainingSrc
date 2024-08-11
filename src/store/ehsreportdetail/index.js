import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  addListItemService,
  deleteListItemService,
  getItemService,
  getItemsService,
  updateListItemService
} from '../../common/services'
import lists from '../../common/lists'

export const onVisible = createAsyncThunk(
  'MODULE_EHSREPORTDETAIL/onVisible',
  async (data = { reportSubjectID: '' }) => {
    const [
      workLocations,
      locations,
      areas,
      machines,
      processes,
      tasks,
      areaDepartments,
      serverities,
      reportSubject,
      involvingPersons,
      questionListDetails
    ] = await Promise.all([
      getItemsService(lists.WorkLocations).then((res) => res.value),
      getItemsService(lists.Locations).then((res) => res.value),
      getItemsService(lists.Areas).then((res) => res.value),
      getItemsService(lists.Machines).then((res) => res.value),
      getItemsService(lists.Processes).then((res) => res.value),
      getItemsService(lists.Tasks).then((res) => res.value),
      getItemsService(lists.AreaDepartments).then((res) => res.value),
      getItemsService(lists.Serverities, {
        filter: `ReportSubjectID/Id eq ${data.reportSubjectID}`,
        select: 'ID,Title,ServerityName,ReportSubjectID/Id,ReportSubjectID/Title',
        expand: 'ReportSubjectID'
      }).then((res) => res.value),
      getItemService(lists.ReportSubject, data.reportSubjectID),
      getItemsService(lists.EHS_InvolvingPersons, {
        select:
          'ID,EHS_Reporting_ID/Id,InvolvingPerson_EmployeeType,InvolvingPersonGPID,InvolvingPersonFullName,InvolvingPersonID/Id,InvolvingPersonID/Title,InvolvingPersonID/FullName,InvolvingPerson_EmployeeTypeID/Id,InvolvingPerson_EmployeeTypeID/Title',
        expand: 'EHS_Reporting_ID,InvolvingPersonID,InvolvingPerson_EmployeeTypeID'
      }).then((res) => res.value),
      getItemsService(lists.EHS_QuestionListDetails).then((res) => res.value)
    ])

    const questionList = await getItemsService(lists.QuestionList, {
      filter: `ReportSubjectID eq '${reportSubject.Title}'`
    }).then((res) => res.value)

    return {
      workLocations,
      locations,
      areas,
      machines,
      processes,
      tasks,
      areaDepartments,
      serverities,
      reportSubject,
      involvingPersons,
      questionList,
      questionListDetails
    }
  }
)

export const initOnCreateReport = createAsyncThunk(
  'MODULE_EHSREPORTDETAIL/initOnCreateReport',
  async (
    data = {
      EmployeeGPID: '',
      EmployeeDepartmentName: '',
      EmployeeFullName: ''
    }
  ) => {
    const [newReport] = await Promise.all([
      addListItemService(lists.EHS_Reporting, {
        DateCreated: new Date(),
        EmployeeGPID: data.EmployeeGPID,
        EmployeeDepartmentName: data.EmployeeDepartmentName,
        EmployeeFullName: data.EmployeeFullName,
        EmployeeType: data.EmployeeType,
        Status: 'Nháp',
        ReportSubjectIDId: data.ReportSubjectID,
        Step: 1
      })
    ])
    return { newReport }
  }
)

export const getEmployeeTypes = createAsyncThunk(
  'MODULE_EHSREPORTDETAIL/getEmployeeTypes',
  async () => {
    const resp = await getItemsService(lists.EmployeeType)
    const employeeTypes = resp.value
    return { employeeTypes }
  }
)

//InvovlingPerson
export const createInvolvingPerson = createAsyncThunk(
  'MODULE_EHSREPORTDETAIL/createInvolvingPerson',
  async (data) => {
    let newInvolvingPerson = await addListItemService(lists.EHS_InvolvingPersons, data)
    newInvolvingPerson = await getItemsService(lists.EHS_InvolvingPersons, {
      filter: `ID eq ${newInvolvingPerson.ID}`,
      select:
        'ID,EHS_Reporting_ID/Id,InvolvingPerson_EmployeeType,InvolvingPersonGPID,InvolvingPersonFullName,InvolvingPersonID/Id,InvolvingPersonID/Title,InvolvingPersonID/FullName,InvolvingPerson_EmployeeTypeID/Id,InvolvingPerson_EmployeeTypeID/Title',
      expand: 'EHS_Reporting_ID,InvolvingPersonID,InvolvingPerson_EmployeeTypeID'
    }).then((res) => res.value[0])

    return { newInvolvingPerson }
  }
)

export const updateInvolvingPerson = createAsyncThunk(
  'MODULE_EHSREPORTDETAIL/updateInvolvingPerson',
  async (data = { ID: '', value: {} }) => {
    await updateListItemService(lists.EHS_InvolvingPersons, data.ID, data.value)
    return data
  }
)

export const deleteInvovlingPerson = createAsyncThunk(
  'MODULE_EHSREPORTDETAIL/deleteInvovlingPerson',
  async (ID) => {
    await deleteListItemService(lists.EHS_InvolvingPersons, ID)
    return ID
  }
)

export const FORMMODE = {
  CREATE: 'CREATE',
  EDIT: 'EDIT'
}

const initState = {
  //Get 1 times
  serverities: [],
  workLocations: [],
  locations: [],
  areas: [],
  machines: [],
  processes: [],
  tasks: [],
  areaDepartments: [],
  employeeTypes: [],
  questionList: [],
  questionListDetails: [],

  report: {},
  reportSubject: {},
  selectedWorkLocation: {},
  selectedLocation: {},
  selectedArea: {},
  selectedMachine: {},
  selectedProcess: {},
  selectedTasks: {},

  //InvolvedPersons
  involvingPersons: [],
  isShowInvolvingPersonModal: false,
  isCreatingInvolvingPerson: false,
  selectedInvolvingPerson: {},
  formMode: FORMMODE.CREATE,
  selectedDeleteInvolvingPerson: {},
  isShowDeleteInvolvingPersonModal: false,
  isDeletingInvolvingPerson: false
}

export const MODULE_EHSREPORTDETAIL = 'MODULE/EHSREPORTDETAIL'

const ehsdetailSlice = createSlice({
  name: MODULE_EHSREPORTDETAIL,
  initialState: initState,
  reducers: {
    setSelectedWorkLocation: (state, action) => {
      ;(state.selectedWorkLocation = state.workLocations.find((x) => x.ID === action.payload.ID)),
        (state.selectedLocation = {}),
        (state.selectedArea = {}),
        (state.selectedMachine = {}),
        (state.selectedProcess = {}),
        (state.selectedTasks = {})
    },
    setSelectedLocation: (state, action) => {
      ;(state.selectedLocation = state.locations.find((x) => x.ID === action.payload.ID)),
        (state.selectedArea = {}),
        (state.selectedMachine = {}),
        (state.selectedProcess = {}),
        (state.selectedTasks = {})
    },
    setSelectedArea: (state, action) => {
      ;(state.selectedArea = state.areas.find((x) => x.ID === action.payload.ID)),
        (state.selectedMachine = {}),
        (state.selectedProcess = {}),
        (state.selectedTasks = {})
    },
    setSelectedMachine: (state, action) => {
      ;(state.selectedMachine = state.machines.find((x) => x.ID === action.payload.ID)),
        (state.selectedProcess = {}),
        (state.selectedTasks = {})
    },
    setSelectedProcess: (state, action) => {
      ;(state.selectedProcess = state.processes.find((x) => x.ID === action.payload.ID)),
        (state.selectedTasks = {})
    },
    setSelectedTasks: (state, action) => {
      state.selectedTasks = state.tasks.find((x) => x.ID === action.payload.ID)
    },
    addInvolvingPerson: (state, action) => {
      state.involvingPersons.push(action.payload)
    },
    openEditForm: (state, action) => {
      state.formMode = FORMMODE.EDIT
      ;(state.isShowInvolvingPersonModal = true), (state.selectedInvolvingPerson = action.payload)
    },
    openCreateForm: (state) => {
      state.formMode = FORMMODE.CREATE
      state.isShowInvolvingPersonModal = true
    },
    setIsShowInvolvingPersonModal: (state, action) => {
      state.isShowInvolvingPersonModal = action.payload
    },
    openDeleteInvolvingPersonModal: (state, action) => {
      state.selectedDeleteInvolvingPerson = action.payload
      state.isShowDeleteInvolvingPersonModal = true
    },
    closeDeleteInvolvingPersonModal: (state) => {
      state.selectedDeleteInvolvingPerson = {}
      state.isShowDeleteInvolvingPersonModal = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(onVisible.fulfilled, (state, action) => {
        ;(state.workLocations = action.payload.workLocations),
          (state.locations = action.payload.locations),
          (state.areas = action.payload.areas),
          (state.machines = action.payload.machines),
          (state.processes = action.payload.processes),
          (state.tasks = action.payload.tasks),
          (state.areaDepartments = action.payload.areaDepartments),
          (state.serverities = action.payload.serverities),
          (state.reportSubject = action.payload.reportSubject),
          (state.involvingPersons = action.payload.involvingPersons)
        state.questionList = action.payload.questionList
        state.questionListDetails = action.payload.questionListDetails
      })
      .addCase(initOnCreateReport.fulfilled, (state, action) => {
        state.report = action.payload.newReport
      })
      .addCase(getEmployeeTypes.fulfilled, (state, action) => {
        state.employeeTypes = action.payload.employeeTypes
      })
      .addCase(createInvolvingPerson.pending, (state) => {
        state.isCreatingInvolvingPerson = true
      })
      .addCase(createInvolvingPerson.fulfilled, (state, action) => {
        state.involvingPersons.push(action.payload.newInvolvingPerson)
        state.isCreatingInvolvingPerson = false
        state.isShowInvolvingPersonModal = false
      })
      .addCase(createInvolvingPerson.rejected, (state) => {
        state.isCreatingInvolvingPerson = false
      })
      .addCase(updateInvolvingPerson.pending, (state) => {
        state.isCreatingInvolvingPerson = true
      })
      .addCase(updateInvolvingPerson.fulfilled, (state, action) => {
        const index = state.involvingPersons.findIndex((x) => x.ID === action.payload.ID)
        state.involvingPersons[index] = {
          ...state.involvingPersons[index],
          ...action.payload.value
        }
        state.isCreatingInvolvingPerson = false
        state.isShowInvolvingPersonModal = false
      })
      .addCase(updateInvolvingPerson.rejected, (state) => {
        state.isCreatingInvolvingPerson = false
      })
      .addCase(deleteInvovlingPerson.pending, (state) => {
        state.isDeletingInvolvingPerson = true
      })
      .addCase(deleteInvovlingPerson.fulfilled, (state, action) => {
        state.involvingPersons = state.involvingPersons.filter((x) => x.ID !== action.payload)
        state.isDeletingInvolvingPerson = false
        state.isShowDeleteInvolvingPersonModal = false
      })
      .addCase(deleteInvovlingPerson.rejected, (state) => {
        state.isDeletingInvolvingPerson = false
      })
  }
})

export const {
  setSelectedWorkLocation,
  setSelectedLocation,
  setSelectedArea,
  setSelectedMachine,
  setSelectedProcess,
  setSelectedTasks,
  addInvolvingPerson,
  openCreateForm,
  openEditForm,
  setIsShowInvolvingPersonModal,
  openDeleteInvolvingPersonModal,
  closeDeleteInvolvingPersonModal
} = { ...ehsdetailSlice.actions }
export const ehsdetailReducer = ehsdetailSlice.reducer
