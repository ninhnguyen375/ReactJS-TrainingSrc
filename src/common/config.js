const config = {
  BASE_URL: import.meta.env.VITE_BASE_URL,
  TIMEOUT: 50000,
  PAGE_SIZE: 500,
  TENANT_URL: 'https://suntorygroup.sharepoint.com',
  PTW_CSM_SITE: 'https://suntorygroup.sharepoint.com/sites/EHS-MS/PTW-CSM',
  GEMBA_PRD_SITE: 'https://suntorygroup.sharepoint.com/sites/SPVBOPS/GEMBA/PRD',
  MOC_SITE: 'https://suntorygroup.sharepoint.com/sites/SPVBMOC/MOC',
  LAST_VERSION: '2024-04-25 17:00',
  IN_TEST: import.meta.env.VITE_IN_TEST === 'Yes',
  IGNORE_MAIL: false
}

export default config
