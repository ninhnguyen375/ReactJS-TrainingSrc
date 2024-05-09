import Compressor from 'compressorjs'
import _ from 'lodash'
import moment from 'moment'
import dayjs from './dayjs'
import { utils, writeFile } from 'xlsx'

export function handleError(error, from) {
  let message = ''

  // for fetching
  if (error.response) {
    message = error.response.data

    if (message['odata.error']?.code?.indexOf('SPDuplicateValuesFoundException') > -1) {
      message = 'Duplicate Value'
    }

    if (message['odata.error']?.message?.value) {
      message = message['odata.error']?.message?.value
    }

    if (error.response?.status === 401) {
      message = '401'
    }
  } else {
    // for system
    message = error.message
  }

  message = JSON.stringify(message)

  if (message.indexOf('指定した名前は既に使用されています') > -1) {
    message = 'Tên file đã tồn tại'
  }

  console.error(`[handleError/${from}]`, message)

  return message
}

export const filterOption = (input, option = {}, ignoreValue = 'Other') => {
  try {
    if (option.key === ignoreValue) {
      return true
    }

    return (
      (option.label ? option.label : '')
        .toString()
        .toLocaleLowerCase()
        .indexOf(input.toLocaleLowerCase()) > -1 ||
      (option.value ? option.value : '')
        .toString()
        .toLocaleLowerCase()
        .indexOf(input.toLocaleLowerCase()) > -1 ||
      (option.key ? option.key : '')
        .toString()
        .toLocaleLowerCase()
        .indexOf(input.toLocaleLowerCase()) > -1 ||
      (option.filter1 ? option.filter1 : '')
        .toString()
        .toLocaleLowerCase()
        .indexOf(input.toLocaleLowerCase()) > -1 ||
      (option.filter2 ? option.filter2 : '')
        .toString()
        .toLocaleLowerCase()
        .indexOf(input.toLocaleLowerCase()) > -1 ||
      (option.filter3 ? option.filter3 : '')
        .toString()
        .toLocaleLowerCase()
        .indexOf(input.toLocaleLowerCase()) > -1
    )
  } catch (error) {
    return false
  }
}

export function hexToBase64(str) {
  return btoa(
    String.fromCharCode.apply(
      null,
      str
        .replace(/\r|\n/g, '')
        .replace(/([\da-fA-F]{2}) ?/g, '0x$1 ')
        .replace(/ +$/, '')
        .split(' ')
    )
  )
}

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result?.toString() || '')
    reader.onerror = (error) => reject(error)
  })
}

export function fileToBinary(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (evt) => {
      const bstr = evt.target.result
      resolve(bstr)
    }

    reader.onerror = () => reject('Fail')

    reader.readAsBinaryString(file)
  })
}

export function getNormalizedFile(file, quality = 0.5, max = 500) {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      maxWidth: max,
      maxHeight: max,
      success(normalizedFile) {
        resolve(normalizedFile)
      },
      error(error) {
        reject(error)
      },
      quality: quality
    })
  })
}

export function fileToBlob(file) {
  return new Promise((resolve, reject) => {
    var reader = new FileReader()
    reader.onload = function () {
      var blob = window.dataURLtoBlob(reader.result)

      resolve(blob)
    }
    reader.readAsDataURL(file)
  })
}

export function isImage(file) {
  const ext = file.name.split('.').pop().toLocaleLowerCase()

  return ['jpg', 'jpeg', 'png', 'gif', 'heic'].includes(ext)
}

export function updateItem(arr, item, update) {
  const tmpArr = [...arr]
  const index = tmpArr.findIndex((a) => _.isEqual(a, item))

  if (index === -1) {
    return tmpArr
  }

  if (!update) {
    tmpArr[index] = { ...item }
  } else {
    tmpArr[index] = { ...item, ...update }
  }

  return tmpArr
}

export function displayDate(date, format = 'DD/MM/YYYY') {
  //test
  if (!date) {
    return 'n/a'
  }

  const newDate = moment(date)

  if (!newDate?._isValid) {
    return <span className="text-danger">Invalid date</span>
  }

  return newDate.format(format)
}

export function displayDateTime(date) {
  if (!date) {
    return 'n/a'
  }

  return moment(date).format('DD/MM/YYYY HH:mm')
}

/**
 *
 * @param {DatePicker} date from datepicker
 */
export function getStartOfDate(date) {
  return moment(date.toDate().setHours(0, 0, 0)).toISOString()
}

/**
 *
 * @param {DatePicker} date from datepicker
 */
export function getEndOfDate(date) {
  return moment(date.toDate().setHours(23, 59, 59)).toISOString()
}

export async function batchPromises(arrPromises = [], initSize = 20) {
  const size = initSize
  const batchSize = Math.ceil(arrPromises.length / size)

  var batches = []
  var batchResults = []

  for (let i = 0; i < batchSize; i++) {
    batches[i] = arrPromises.slice(i * size, (i + 1) * size)
  }

  for (let i = 0; i < batches.length; i++) {
    const items = batches[i]

    const results = await Promise.all(items.map((p) => p()))

    batchResults = [...batchResults, ...results]
  }

  return batchResults
}

export const ConvertUTCToLocalHourAndMinuteTime = (UTCTime) => {
  const utcTime = UTCTime
  const utcDateTime = new Date(utcTime)
  const localHours = utcDateTime.getHours()
  const localMinutes = utcDateTime.getMinutes()
  const localTime = `${String(localHours).padStart(2, '0')}:${String(localMinutes).padStart(
    2,
    '0'
  )}`
  return localTime
}
export const getTimeValue = (DateTime) => {
  const timestamp = DateTime

  const date = new Date(timestamp)
  const hours = String(date.getHours()).padStart(2, '0') // 22 (pad with leading zero if necessary)
  const minutes = String(date.getMinutes()).padStart(2, '0') // 41 (pad with leading zero if necessary)

  const formattedTime = `${hours}:${minutes}`

  return formattedTime
}

export const getDateValue = (DateTime) => {
  const timestamp = DateTime

  const date = new Date(timestamp)
  const year = date.getFullYear() // 2023
  const month = String(date.getMonth() + 1).padStart(2, '0') // 06 (months are zero-based, so we add 1 and pad with leading zeros if necessary)
  const day = String(date.getDate()).padStart(2, '0') // 25 (pad with leading zeros if necessary)

  const formattedDate = `${year}-${month}-${day}`

  return formattedDate
}

export const convertDateTimeToDatejs = (date, time) => {
  if (date == null || time == null) {
    return null
  } else {
    var dayjsObj = dayjs(moment(date + time, 'YYYY-MM-DDLT'))

    return dayjsObj
  }
}

export const exportToExcel = (
  dataToExport,
  fileName,
  option = {
    sheetName: 'Data'
  }
) => {
  /* generate worksheet from state */
  const ws = utils.json_to_sheet(dataToExport)

  /* create workbook and append worksheet */
  const wb = utils.book_new()

  utils.book_append_sheet(wb, ws, option.sheetName)

  /* export to XLSX */
  writeFile(wb, fileName)
}

export const excelDateToMoment = (excelDateNumber) => {
  return moment(new Date((excelDateNumber - 25569) * 86400000))
}

// Sheet Verion at A1
export const getVersionExcelTemplate = (wb) => {
  try {
    const ws = wb.Sheets['Version']
    const versionText = ws['A1'].v

    return versionText
  } catch (error) {
    return 'notfound'
  }
}

export function base64toFile(base64String, filename, mimeType, needToSplit = true) {
  // Split the base64 string to get the content type and data
  const base64Data = needToSplit ? base64String.split(',')[1] : base64String

  // Convert the base64 data to a binary array
  const binaryData = atob(base64Data)

  // Create a Uint8Array from the binary data
  const uint8Array = new Uint8Array(binaryData.length)
  for (let i = 0; i < binaryData.length; i++) {
    uint8Array[i] = binaryData.charCodeAt(i)
  }

  // Create a Blob from the Uint8Array
  const blob = new Blob([uint8Array], { type: mimeType })

  // Create a File from the Blob
  const file = new File([blob], filename, { type: mimeType })

  return file
}

export function getWLMappingID(src, WorkLocationID) {
  return src.find((w) => w.WorkLocationID === WorkLocationID)?.MappingID
}

export const downloadBase64File = (fileName, base64) => {
  let downloadName = fileName.replace(/\.[^/.]+$/, '')
  downloadName = `${downloadName}.pdf`

  const a = document.createElement('a')
  a.href = base64
  a.download = downloadName

  document.body.appendChild(a)
  a.click()

  document.body.removeChild(a)
}

export const customEncodeURIComponent = (str) => {
  return encodeURIComponent(str)
    .replace(/[!'()*]/g, function (c) {
      return '%' + c.charCodeAt(0).toString(16)
    })
    .replace(/%20/g, '%20')
}

export const tiengVietKhongDau = (input) => {
  const dic = [
    { key: 'ạ', value: 'a' },
    { key: 'ả', value: 'a' },
    { key: 'ã', value: 'a' },
    { key: 'à', value: 'a' },
    { key: 'á', value: 'a' },
    { key: 'â', value: 'a' },
    { key: 'ậ', value: 'a' },
    { key: 'ầ', value: 'a' },
    { key: 'ấ', value: 'a' },
    { key: 'ẩ', value: 'a' },
    { key: 'ẫ', value: 'a' },
    { key: 'ă', value: 'a' },
    { key: 'ắ', value: 'a' },
    { key: 'ằ', value: 'a' },
    { key: 'ặ', value: 'a' },
    { key: 'ẳ', value: 'a' },
    { key: 'ẵ', value: 'a' },
    { key: 'ó', value: 'o' },
    { key: 'ò', value: 'o' },
    { key: 'ọ', value: 'o' },
    { key: 'õ', value: 'o' },
    { key: 'ỏ', value: 'o' },
    { key: 'ô', value: 'o' },
    { key: 'ộ', value: 'o' },
    { key: 'ổ', value: 'o' },
    { key: 'ỗ', value: 'o' },
    { key: 'ồ', value: 'o' },
    { key: 'ố', value: 'o' },
    { key: 'ơ', value: 'o' },
    { key: 'ờ', value: 'o' },
    { key: 'ớ', value: 'o' },
    { key: 'ợ', value: 'o' },
    { key: 'ở', value: 'o' },
    { key: 'ỡ', value: 'o' },
    { key: 'é', value: 'e' },
    { key: 'è', value: 'e' },
    { key: 'ẻ', value: 'e' },
    { key: 'ẹ', value: 'e' },
    { key: 'ẽ', value: 'e' },
    { key: 'ê', value: 'e' },
    { key: 'ế', value: 'e' },
    { key: 'ề', value: 'e' },
    { key: 'ệ', value: 'e' },
    { key: 'ể', value: 'e' },
    { key: 'ễ', value: 'e' },
    { key: 'ú', value: 'u' },
    { key: 'ù', value: 'u' },
    { key: 'ụ', value: 'u' },
    { key: 'ủ', value: 'u' },
    { key: 'ũ', value: 'u' },
    { key: 'ư', value: 'u' },
    { key: 'ự', value: 'u' },
    { key: 'ữ', value: 'u' },
    { key: 'ử', value: 'u' },
    { key: 'ừ', value: 'u' },
    { key: 'ứ', value: 'u' },
    { key: 'í', value: 'i' },
    { key: 'ì', value: 'i' },
    { key: 'ị', value: 'i' },
    { key: 'ỉ', value: 'i' },
    { key: 'ĩ', value: 'i' },
    { key: 'ý', value: 'y' },
    { key: 'ỳ', value: 'y' },
    { key: 'ỷ', value: 'y' },
    { key: 'ỵ', value: 'y' },
    { key: 'ỹ', value: 'y' },
    { key: 'đ', value: 'd' },
    { key: 'Ạ', value: 'A' },
    { key: 'Ả', value: 'A' },
    { key: 'Ã', value: 'A' },
    { key: 'À', value: 'A' },
    { key: 'Á', value: 'A' },
    { key: 'Â', value: 'A' },
    { key: 'Ậ', value: 'A' },
    { key: 'Ầ', value: 'A' },
    { key: 'Ấ', value: 'A' },
    { key: 'Ẩ', value: 'A' },
    { key: 'Ẫ', value: 'A' },
    { key: 'Ă', value: 'A' },
    { key: 'Ắ', value: 'A' },
    { key: 'Ằ', value: 'A' },
    { key: 'Ặ', value: 'A' },
    { key: 'Ẳ', value: 'A' },
    { key: 'Ẵ', value: 'A' },
    { key: 'Ó', value: 'O' },
    { key: 'Ò', value: 'O' },
    { key: 'Ọ', value: 'O' },
    { key: 'Õ', value: 'O' },
    { key: 'Ỏ', value: 'O' },
    { key: 'Ô', value: 'O' },
    { key: 'Ộ', value: 'O' },
    { key: 'Ổ', value: 'O' },
    { key: 'Ỗ', value: 'O' },
    { key: 'Ồ', value: 'O' },
    { key: 'Ố', value: 'O' },
    { key: 'Ơ', value: 'O' },
    { key: 'Ờ', value: 'O' },
    { key: 'Ớ', value: 'O' },
    { key: 'Ợ', value: 'O' },
    { key: 'Ở', value: 'O' },
    { key: 'Ỡ', value: 'O' },
    { key: 'É', value: 'E' },
    { key: 'È', value: 'E' },
    { key: 'Ẻ', value: 'E' },
    { key: 'Ẹ', value: 'E' },
    { key: 'Ẽ', value: 'E' },
    { key: 'Ê', value: 'E' },
    { key: 'Ế', value: 'E' },
    { key: 'Ề', value: 'E' },
    { key: 'Ệ', value: 'E' },
    { key: 'Ể', value: 'E' },
    { key: 'Ễ', value: 'E' },
    { key: 'Ú', value: 'U' },
    { key: 'Ù', value: 'U' },
    { key: 'Ụ', value: 'U' },
    { key: 'Ủ', value: 'U' },
    { key: 'Ũ', value: 'U' },
    { key: 'Ư', value: 'U' },
    { key: 'Ự', value: 'U' },
    { key: 'Ữ', value: 'U' },
    { key: 'Ử', value: 'U' },
    { key: 'Ừ', value: 'U' },
    { key: 'Ứ', value: 'U' },
    { key: 'Í', value: 'I' },
    { key: 'Ì', value: 'I' },
    { key: 'Ị', value: 'I' },
    { key: 'Ỉ', value: 'I' },
    { key: 'Ĩ', value: 'I' },
    { key: 'Ý', value: 'Y' },
    { key: 'Ỳ', value: 'Y' },
    { key: 'Ỷ', value: 'Y' },
    { key: 'Ỵ', value: 'Y' },
    { key: 'Ỹ', value: 'Y' },
    { key: 'Đ', value: 'D' }
  ]

  let output = ''

  ;(input || 'Nguyễn Hoàng Văn Nhứt, LÊN NÚI ĐỂ KIẾM TIỀN').split('').forEach((char) => {
    const newChar = dic.find((item) => item.key === char)?.value
    output += newChar || char
  })

  return output
}
