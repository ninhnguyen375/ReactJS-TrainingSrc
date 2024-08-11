import { fetchAuth } from './fetch'
import { fetchAxios } from './fetch'
import endpoints from './endpoints'
import config from './config'
import lists from './lists'

// Auth
export const loginService = async (userName, password) =>
  fetchAxios({ url: '/users/authenticate', method: 'post', data: { userName, password } })

export const hashPasswordService = async (password) =>
  fetchAxios({
    url: '/users/hash',
    params: { rawstring: password },
    method: 'post'
  })
export const registerService = async (userName, password, confirmPassword, role, refID) =>
  fetchAxios({
    url: '/users',
    method: 'post',
    data: { userName, password, confirmPassword, role, refID }
  })

export const changePasswordService = async (oldPassword, newPassword) =>
  fetchAuth({
    url: '/users/change-password',
    method: 'put',
    data: { old: oldPassword, new: newPassword }
  })

export const requestResetPasswordService = async (email) =>
  fetchAxios({
    url: '/users/reset/request',
    method: 'post',
    data: { email }
  })

export const verifyResetService = async (email, verifyCode) =>
  fetchAxios({
    url: '/users/reset/verify',
    method: 'post',
    data: { email, verifyCode }
  })

export const office365AuthService = async (token) =>
  fetchAxios({
    url: '/users/authenticate/office365',
    method: 'post',
    data: { token }
  })

export const getAuth = async () => {
  const authenticated = JSON.parse(localStorage.getItem(config.LOCAL_AUTHENTICATED))
  const role = authenticated?.user?.role
  let refInfo

  if (role === 'contractor') {
    refInfo = await fetchAuth({
      ignore401: true,
      url: '/Sharepoints/',
      params: {
        url:
          endpoints.getItems(config.EHS_GEMBA_SITE, 'Contractor') +
          `?$filter=ContractorID eq '${authenticated.user.refID}'&top=1`
      },
      method: 'get'
    })
    refInfo = refInfo[0]
  }

  if (role === 'user') {
    refInfo = await fetchAuth({
      ignore401: true,
      url: '/Sharepoints/',
      params: {
        url:
          endpoints.getItems(config.EHS_GEMBA_SITE, 'UserInfo') +
          `?$filter=UserID eq '${authenticated.user.refID}'&top=1`
      },
      method: 'get'
    })
    refInfo = refInfo[0]
  }

  const [account, user] = await Promise.all([
    getItemService(lists.Accounts, authenticated.user.id),
    getItemsService(lists.Users, {
      filter: `ID eq ${authenticated.user.refID}`,
      select:
        'Title,FullName,Email,Phone,EmployeeType/Title,EmployeeType/ID,EmployeeType/EmployeeType,DepartmentName',
      expand: 'EmployeeType'
    })
  ])
  const newProfile = {
    authenticated,
    user: user.value[0],
    account: account,
    refInfo: refInfo
  }

  return newProfile
}

export const refreshTokenService = async (accessToken, refreshToken) =>
  fetchAxios({ url: '/users/refresh', method: 'post', data: { accessToken, refreshToken } })

// File
export const getAttachmentFileService = async (list, storeID, fileName) =>
  fetchAuth({
    url: '/Sharepoints/',
    params: { url: endpoints.getAttachment(list.site, list.listName, storeID, fileName) },
    method: 'get',
    responseType: 'blob'
  })

export const getAttachmentInfoService = async (list, storeID, fileName) =>
  fetchAuth({
    url: '/Sharepoints/',
    params: { url: endpoints.getAttachmentInfo(list.site, list.listName, storeID, fileName) },
    method: 'get'
  })

export const getFilesService = async (
  list,
  { filter = '', orderBy = '', select = '', expand = '', top = config.PAGE_SIZE } = {}
) =>
  fetchAuth({
    url: '/Sharepoints/',
    params: {
      url:
        endpoints.list(list.site, list.listName) +
        `/files?$expand=${expand}&$select=${select}&$filter=${filter}&$orderby=${orderBy}&$top=${top}`
    },
    method: 'get',
    headers: {
      Accept: 'application/json;odata=nometadata'
    }
  })

export const getFileService = async (site, serverRelativeUrl) =>
  fetchAuth({
    url: '/Sharepoints/',
    params: { url: endpoints.getFile(site, serverRelativeUrl) },
    method: 'get',
    responseType: 'blob'
  })

export const getFileInfoService = async (site, serverRelativeUrl) =>
  fetchAuth({
    url: '/Sharepoints/',
    params: { url: endpoints.getFileInfo(site, serverRelativeUrl) },
    method: 'get'
  })

export const uploadFileService = async (list, storeID, fileName, file, handlePercent) => {
  const formData = new FormData()
  formData.append('file', file)

  return fetchAuth({
    url: '/Sharepoints/file',
    params: { url: endpoints.addAttachment(list.site, list.listName, storeID, fileName) },
    data: formData,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: handlePercent
  })
}

export const uploadFileToDocLibService = async (site, folder, fileName, file) => {
  const formData = new FormData()
  formData.append('file', file)

  return fetchAuth({
    url: '/Sharepoints/file',
    params: { url: endpoints.addFile(site, folder, fileName) },
    data: formData,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const deleteFileService = async (site, serverRelativeUrl) =>
  fetchAuth({
    url: '/Sharepoints/',
    params: { url: endpoints.deleteFile(site, serverRelativeUrl) },
    method: 'delete',
    headers: { 'Content-Type': 'multipart/form-data' }
  })

// Attachemnt
export const getAttachmentsService = async (list, storeID) =>
  fetchAuth({
    url: '/Sharepoints/',
    params: { url: endpoints.getAttachments(list.site, list.listName, storeID) },
    method: 'get'
  })

// List Item
export const getItemsService = async (
  list,
  { filter = '', orderBy = '', select = '', expand = '', top = config.PAGE_SIZE } = {}
) =>
  fetchAuth({
    url: '/Sharepoints/',
    params: {
      url:
        endpoints.getItems(list.site, list.listName) +
        `?&$orderby=${orderBy}&$select=${select}&$expand=${expand}&$filter=${filter}&$top=${top}`
    },
    method: 'get',
    headers: {
      Accept: 'application/json;odata=nometadata'
    }
  })

export const getNextLinkService = async (url) =>
  fetchAuth({
    url: '/Sharepoints/',
    params: { url },
    method: 'get',
    headers: {
      Accept: 'application/json;odata=nometadata'
    }
  })

export const getItemService = async (list, id) =>
  fetchAuth({
    url: '/Sharepoints/',
    params: { url: endpoints.getItem(list.site, list.listName, id) },
    method: 'get'
  })

export const getItemHistory = async (list, id) =>
  fetchAuth({
    url: '/Sharepoints/',
    params: { url: endpoints.getItem(list.site, list.listName, id) + '/Versions' },
    method: 'get'
  })

export const addListItemService = async (list, item) =>
  fetchAuth({
    url: '/Sharepoints/item',
    params: { url: endpoints.addItem(list.site, list.listName) },
    data: item,
    method: 'post'
  })

export const deleteListItemService = async (list, id) =>
  fetchAuth({
    url: '/Sharepoints/',
    params: { url: endpoints.deleteItem(list.site, list.listName, id) },
    method: 'delete'
  })

export const updateListItemService = async (list, id, item) =>
  fetchAuth({
    url: '/Sharepoints/item',
    params: { url: endpoints.updateItem(list.site, list.listName, id) },
    data: item,
    method: 'put'
  })

// List Item with type
/*export const getColumnsType = async (list) =>
  fetchAuth({
    url: '/Sharepoints/',
    params: {
      url: endpoints.getColumns(list.site, list.listName)
    },
    method: 'get',
    headers: {
      Accept: 'application/json;odata=nometadata'
    }
  })*/
export const addFolderService = async (site, serverRelativeUrl) => {
  return fetchAuth({
    url: '/Sharepoints/item',
    params: { url: endpoints.addFolder(site) },
    data: {
      ServerRelativeUrl: serverRelativeUrl
    },
    method: 'post'
  })
}

export const deleteFolderService = async (site, serverRelativeUrl) =>
  fetchAuth({
    url: '/Sharepoints/',
    params: { url: endpoints.deleteFolder(site, serverRelativeUrl) },
    method: 'delete'
  })
