import { Pagination } from 'antd'
import React, { useEffect, useState } from 'react'
import { handleError, updateItem } from '../helpers'
import { getNextLinkService } from '../services'
import PropTypes from '../PropTypes'
import _ from 'lodash'
import { useDebounce, useUpdateEffect } from 'usehooks-ts'

const initPage = { page: 1, link: '', nextLink: '' }

const propTypes = {
  getItems: PropTypes.func.isRequired,
  setItems: PropTypes.func.isRequired,
  items: PropTypes.array,
  loading: PropTypes.bool,
  setLoading: PropTypes.func
}

const SPPagination = ({
  getItems = (withLoading) => {},
  setItems,
  items = [],
  loading,
  setLoading
}) => {
  const [pages, setPages] = useState([initPage])
  const [currentPage, setCurrentPage] = useState(initPage)
  const [owningItems, setOwningItems] = useState(items)
  const dbItems = useDebounce(items, 100)
  const [disabled, setDisabled] = useState(loading)

  // Waiting for items and owningItems take their last value
  useUpdateEffect(() => {
    if (!_.isEqual(items, owningItems)) {
      setDisabled(true)
      getItemsWithPage({ page: 1, pPages: [initPage], withLoading: false })
    } else {
      setDisabled(false)
    }
  }, [dbItems])

  // Just disable pagination when items changed
  useUpdateEffect(() => {
    if (!_.isEqual(items, owningItems)) {
      setDisabled(true)
    }
  }, [items])

  useEffect(() => {
    getItemsWithPage()
  }, [])

  const getItemsWithPage = async ({ page = 1, pPages = [initPage], withLoading = true } = {}) => {
    if (withLoading) {
      setLoading(true)
    }

    setDisabled(true)

    try {
      let data
      let pageItem = pPages.find((p) => p.page === page)
      const lastPage = pPages[pPages.length - 1]
      let newPages = [...pPages]

      if (page === 1) {
        data = await getItems(withLoading)
      } else if (pageItem.link) {
        data = await getNextLinkService(pageItem.link)
        setItems(data.value)
      }

      setOwningItems(data.value)

      if (data['odata.nextLink'] && page === lastPage.page) {
        newPages.push({ page: page + 1, link: data['odata.nextLink'] })
        pageItem.nextLink = data['odata.nextLink']
      }

      newPages = updateItem(newPages, pageItem)

      setPages(newPages)
      setCurrentPage(pageItem)
    } catch (error) {
      handleError(error, 'getItemsWithPage')
    }

    setLoading(false)
    setDisabled(false)
  }

  if (pages.length === 1) {
    return null
  }

  return (
    <div className="d-flex justify-content-end">
      <Pagination
        showSizeChanger={false}
        onChange={(page) => {
          setCurrentPage(pages.find((p) => p.page === page))
          getItemsWithPage({ page, pPages: pages })
        }}
        disabled={disabled || loading}
        size="small"
        current={currentPage.page}
        total={pages.length * items.length}
        pageSize={items.length}
      />
    </div>
  )
}

SPPagination.propTypes = propTypes

export default SPPagination
