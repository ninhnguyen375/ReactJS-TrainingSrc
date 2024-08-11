const list = (site, listName) => `${site}/_api/web/lists/getbytitle('${listName}')`

export default {
  list,
  getItems: (site, listName) => `${list(site, listName)}/items`,
  getItem: (site, listName, id) => `${list(site, listName)}/items(${id})`,
  addItem: (site, listName) => `${list(site, listName)}/items`,
  updateItem: (site, listName, id) => `${list(site, listName)}/items(${id})`,
  deleteItem: (site, listName, id) => `${list(site, listName)}/items(${id})`,
  // Attachment
  getAttachments: (site, listName, storeID) =>
    `${list(site, listName)}/items(${storeID})/AttachmentFiles`,
  getAttachment: (site, listName, storeID, fileName) =>
    `${list(site, listName)}/items(${storeID})/AttachmentFiles('${fileName}')/$value`,
  getAttachmentInfo: (site, listName, storeID, fileName) =>
    `${list(site, listName)}/items(${storeID})/AttachmentFiles('${fileName}')`,
  addAttachment: (site, listName, storeID, fileName) =>
    `${list(site, listName)}/items(${storeID})/AttachmentFiles/Add(FileName='${fileName}')`,
  updateAttachment: (site, listName, storeID, fileName) =>
    `${list(site, listName)}/items(${storeID})/AttachmentFiles('${fileName}')/$value`,
  deleteAttachment: (site, listName, storeID, fileName) =>
    `${list(site, listName)}/items(${storeID})/AttachmentFiles('${fileName}')`,
  // File
  getFile: (site, serverRelativeUrl) =>
    `${site}/_api/web/GetFileByServerRelativeUrl('${serverRelativeUrl}')/$value`,
  getFileInfo: (site, serverRelativeUrl) =>
    `${site}/_api/web/GetFileByServerRelativeUrl('${serverRelativeUrl}')`,
  addFile: (site, folder, fileName) =>
    `${site}/_api/web/GetFolderByServerRelativeUrl('${folder}')/Files/Add(url='${fileName}', overwrite=true)`,
  updateFile: (site, serverRelativeUrl) =>
    `${site}/_api/web/GetFileByServerRelativeUrl('${serverRelativeUrl}')/$value`,
  deleteFile: (site, serverRelativeUrl) =>
    `${site}/_api/web/GetFileByServerRelativeUrl('${serverRelativeUrl}')`,
  addFolder: (site) => `${site}/_api/web/folders`,
  deleteFolder: (site, serverRelativeUrl) =>
    `${site}/_api/web/GetFolderByServerRelativeUrl('${serverRelativeUrl}')`
}
