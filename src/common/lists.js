import config from './config'

const lists = {
  'Areas/Pitstops': {
    site: config.GEMBA_PRD_SITE,
    listName: 'Areas/Pitstops'
  },
  SA_EquipmentIO: {
    site: config.PTW_CSM_SITE,
    listName: 'SA_EquipmentIO'
  },
  SA_EquipmentIO_Transaction: {
    site: config.PTW_CSM_SITE,
    listName: 'SA_EquipmentIO_Transaction'
  },
  AttachmentStore: {
    site: config.PTW_CSM_SITE,
    listName: 'AttachmentStore'
  },
  DocumentStore: {
    site: config.PTW_CSM_SITE,
    listName: 'DocumentStore'
  },
  Base64Store: {
    site: config.PTW_CSM_SITE,
    listName: 'Base64Store'
  },
  Accounts: {
    site: config.PTW_CSM_SITE,
    listName: 'Accounts'
  },
  RequestForgotPassword: {
    site: config.PTW_CSM_SITE,
    listName: 'RequestForgotPassword'
  },
  Equipment: {
    site: config.PTW_CSM_SITE,
    listName: 'Equipment'
  },
  EquipmentType: {
    site: config.PTW_CSM_SITE,
    listName: 'EquipmentType'
  },
  EHS_AppLink: {
    site: config.PTW_CSM_SITE,
    listName: 'EHS_AppLink'
  },
  ContractorStaffs: {
    site: config.PTW_CSM_SITE,
    listName: 'ContractorStaffs'
  },
  Machine: {
    site: config.GEMBA_PRD_SITE,
    listName: 'Machine'
  },
  License_Training_Required: {
    site: config.PTW_CSM_SITE,

    listName: config.IN_TEST ? 'DEV_License_Training_Required' : 'License_Training_Required'
  },
  PTW_ConstructionMethod: {
    site: config.PTW_CSM_SITE,
    listName: 'PTW_ConstructionMethod'
  },
  PTW_DetailLicense: {
    site: config.PTW_CSM_SITE,
    listName: 'PTW_DetailLicense'
  },
  PTW_DetailChecklist_History: {
    site: config.PTW_CSM_SITE,
    listName: 'PTW_DetailChecklist_History'
  },
  PTW_EmployeeJoining: {
    site: config.PTW_CSM_SITE,
    listName: 'PTW_EmployeeJoining'
  },

  ProjectList: {
    site: config.PTW_CSM_SITE,
    listName: 'ProjectList'
  },
  PTW_License: {
    site: config.PTW_CSM_SITE,
    listName: 'PTW_License'
  },
  PTW_Main: {
    site: config.PTW_CSM_SITE,
    listName: 'PTW_Main'
  },
  PTW_JSA: {
    site: config.PTW_CSM_SITE,
    listName: 'PTW_JSA'
  },
  PTW_Question: {
    site: config.PTW_CSM_SITE,
    listName: 'PTW_Question'
  },
  PTW_PICBySelectedArea: {
    site: config.PTW_CSM_SITE,
    listName: 'PTW_PICBySelectedArea'
  },
  PTW_SelectedLicense: {
    site: config.PTW_CSM_SITE,
    listName: 'PTW_SelectedLicense'
  },
  PTW_SelectedArea: {
    site: config.PTW_CSM_SITE,
    listName: 'PTW_SelectedArea'
  },
  PTW_SupervisionResult: {
    site: config.PTW_CSM_SITE,
    listName: 'PTW_SupervisionResult'
  },
  PTW_SubmitHistory: {
    site: config.PTW_CSM_SITE,
    listName: 'PTW_SubmitHistory'
  },
  PTW_UserPermission: {
    site: config.PTW_CSM_SITE,
    listName: 'PTW_UserPermission'
  },
  PTW_Violation: {
    site: config.PTW_CSM_SITE,
    listName: 'PTW_Violation'
  },
  ProjectStaffs: {
    site: config.PTW_CSM_SITE,
    listName: 'ProjectStaffs'
  },
  UsersGPID: {
    site: config.GEMBA_PRD_SITE,
    listName: 'UsersGPID'
  },
  ConstructionMethod: {
    site: config.PTW_CSM_SITE,
    listName: 'ConstructionMethod'
  },
  CSM_JSA: {
    site: config.PTW_CSM_SITE,
    listName: 'CSM_JSA'
  },
  // abandoned
  // ContractorEquipment: {
  //   site: config.PTW_CSM_SITE,
  //   listName: 'ContractorEquipment'
  // },
  // ContractorChemical: {
  //   site: config.PTW_CSM_SITE,
  //   listName: 'ContractorChemical'
  // },
  Contractor: {
    site: config.PTW_CSM_SITE,
    listName: 'Contractor'
  },
  CSM_CompetenceTraining: {
    site: config.PTW_CSM_SITE,
    listName: 'CSM_CompetenceTraining'
  },
  CSM_StaffTracking: {
    site: config.PTW_CSM_SITE,
    listName: 'CSM_StaffTracking'
  },
  ProjectChemical: {
    site: config.PTW_CSM_SITE,
    listName: 'ProjectChemical'
  },
  ProjectEquipment: {
    site: config.PTW_CSM_SITE,
    listName: 'ProjectEquipment'
  },
  CSM_JSATracking: {
    site: config.PTW_CSM_SITE,
    listName: 'CSM_JSATracking'
  },
  EHS_MailTracking: {
    site: config.PTW_CSM_SITE,
    listName: 'EHS_MailTracking'
  },
  CSM_UserPermission: {
    site: config.PTW_CSM_SITE,
    listName: 'CSM_UserPermission'
  },
  RequestPopulateWord: {
    site: config.PTW_CSM_SITE,
    listName: 'RequestPopulateWord'
  },
  CSM_RunFlow: {
    site: config.PTW_CSM_SITE,
    listName: 'CSM_RunFlow'
  },
  WorkLocationSecurity: {
    site: config.PTW_CSM_SITE,
    listName: 'WorkLocationSecurity'
  },
  MOC_DocumentStore: {
    site: config.MOC_SITE,
    listName: 'MOC_DocumentStore'
  },
  Term: {
    site: config.PTW_CSM_SITE,
    listName: 'Term'
  },
  AnswerOfFormEHSAndQC: {
    site: config.PTW_CSM_SITE,
    listName: 'AnswerOfFormEHSAndQC'
  },
  SPVBChecklistEquipment: {
    site: config.PTW_CSM_SITE,
    listName: 'SPVBChecklistEquipment'
  },
  WorkLocationSlotMapping: {
    site: config.PTW_CSM_SITE,
    listName: 'WorkLocationSlotMapping'
  },
  WorkLocation: {
    site: config.GEMBA_PRD_SITE,
    listName: 'WorkLocation'
  },
  TodoList: {
    site: config.TRAINING_SITE,
    listName: 'TodoList'
  }
}

export default lists
