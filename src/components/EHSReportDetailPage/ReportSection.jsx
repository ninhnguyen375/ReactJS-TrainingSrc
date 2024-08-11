import { Divider, Row } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'

const propsType = {
  title: PropTypes.string,
  children: PropTypes.node
}
function ReportSection({ title, children }) {
  return (
    <Row gutter={[24, 16]} className="d-flex flex-col">
      <h1 className="font-semibold text-lg text-primaryColor">{title}</h1>
      <Divider className="m-0 " />
      {children}
    </Row>
  )
}

ReportSection.propTypes = propsType
export default ReportSection
