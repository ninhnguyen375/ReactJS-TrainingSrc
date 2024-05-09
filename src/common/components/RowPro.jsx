import React, { useEffect, useState } from 'react'
import PropTypes from '../PropTypes'

const propTypes = {
  promise: PropTypes.func.isRequired,
  render: PropTypes.func.isRequired
}

const RowPro = ({ promise, render }) => {
  const [result, setResult] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getValue = async () => {
      setLoading(true)

      const res = await promise()
      setResult(res)

      setLoading(false)
    }

    getValue()
  }, [])

  if (loading) {
    return 'loading...'
  }

  return <>{render(result)}</>
}

RowPro.propTypes = propTypes

export default RowPro
