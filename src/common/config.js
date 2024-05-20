const config = {
  APP_NAME: 'training-react',
  BASE_URL: import.meta.env.VITE_BASE_URL,
  LOCAL_PROFILE: 'TRAINING_PROFILE',
  LOCAL_AUTHENTICATED: 'TRAINING_AUTHENTICATED',
  LOCAL_ACCESS_TOKEN: 'TRAINING_ACCESS_TOKEN',
  LOCAL_REFRESH_TOKEN: 'TRAINING_REFRESH_TOKEN',
  TIMEOUT: 50000,
  PAGE_SIZE: 500,
  TENANT_URL: 'https://suntorygroup.sharepoint.com',
  PTW_CSM_SITE: 'https://suntorygroup.sharepoint.com/sites/EHS-MS/PTW-CSM',
  GEMBA_PRD_SITE: 'https://suntorygroup.sharepoint.com/sites/SPVBOPS/GEMBA/PRD',
  MOC_SITE: 'https://suntorygroup.sharepoint.com/sites/SPVBMOC/MOC',
  TRAINING_SITE: 'https://suntorygroup.sharepoint.com/sites/SPVBOPS/GEMBA/Training',
  LAST_VERSION: '2024-04-25 17:00',
  IN_TEST: import.meta.env.VITE_IN_TEST === 'Yes',
  IGNORE_MAIL: false
}

export default config
