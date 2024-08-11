import config from './config'

const lists = {
  Accounts: {
    site: config.EHS_GEMBA_SITE,
    listName: 'Accounts'
  },
  AttachmentStore: {
    site: config.EHS_GEMBA_SITE,
    listName: 'AttachmentStore'
  },
  ImageList: {
    site: config.EHS_GEMBA_SITE,
    listName: 'ImageList'
  },
  ImageTestList: {
    site: config.EHS_GEMBA_SITE,
    listName: 'ImageTestList'
  },
  DocumentStore: {
    site: config.EHS_GEMBA_SITE,
    listName: 'DocumentStore'
  },
  Users: {
    site: config.EHS_GEMBA_SITE,
    listName: 'Users'
  },
  WorkLocations: {
    site: config.EHS_GEMBA_SITE,
    listName: 'WorkLocations'
  },
  Locations: {
    site: config.EHS_GEMBA_SITE,
    listName: 'Locations'
  },
  Areas: {
    site: config.EHS_GEMBA_SITE,
    listName: 'Areas'
  },
  WalkPlanContent: {
    site: config.EHS_GEMBA_SITE,
    listName: config.IN_TEST ? 'WalkPlanContent_DEV' : 'WalkPlanContent'
  },
  WalkPlanContentDetail: {
    site: config.EHS_GEMBA_SITE,
    listName: config.IN_TEST ? 'WalkPlanContentDetail_DEV' : 'WalkPlanContentDetail'
  },
  Machines: {
    site: config.EHS_GEMBA_SITE,
    listName: 'Machines'
  },
  Processes: {
    site: config.EHS_GEMBA_SITE,
    listName: 'Processes'
  },
  Tasks: {
    site: config.EHS_GEMBA_SITE,
    listName: 'Tasks'
  },
  QuestionList: {
    site: config.EHS_GEMBA_SITE,
    listName: 'QuestionList'
  },
  QuestionStandardDetail: {
    site: config.EHS_GEMBA_SITE,
    listName: 'QuestionStandardDetail'
  },
  StandardType: {
    site: config.EHS_GEMBA_SITE,
    listName: 'StandardType'
  },
  EHS_Reporting: {
    site: config.EHS_GEMBA_SITE,
    listName: 'EHS_Reporting'
  },
  Serverities: {
    site: config.EHS_GEMBA_SITE,
    listName: 'Serverities'
  },
  ReportSubject: {
    site: config.EHS_GEMBA_SITE,
    listName: 'ReportSubject'
  },
  AreaDepartments: {
    site: config.EHS_GEMBA_SITE,
    listName: 'AreaDepartments'
  },
  EHS_InvolvingPersons: {
    site: config.EHS_GEMBA_SITE,
    listName: 'EHS_InvolvingPersons'
  },
  EmployeeType: {
    site: config.EHS_GEMBA_SITE,
    listName: 'EmployeeType'
  },
  EHS_QuestionListDetails: {
    site: config.EHS_GEMBA_SITE,
    listName: 'EHS_QuestionListDetails'
  },
  Menu: {
    site: config.EHS_GEMBA_SITE,
    listName: 'Menu'
  }
}

export default lists
