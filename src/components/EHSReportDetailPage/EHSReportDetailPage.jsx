import { Col, DatePicker, Form, Input, Radio, Row, Select, Steps } from 'antd'
import React, { useEffect } from 'react'
import FormItem from 'antd/es/form/FormItem'

import ReportSection from './ReportSection'
import ReportHeader from './ReportHeader'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../common/AuthProvider'
import { useDispatch, useSelector } from 'react-redux'
import {
  initOnCreateReport,
  MODULE_EHSREPORTDETAIL,
  onVisible,
  setSelectedArea,
  setSelectedLocation,
  setSelectedMachine,
  setSelectedProcess,
  setSelectedWorkLocation
} from '../../store/ehsreportdetail'
import InvolvingPersonList from './InvolvingPersonList'
import QuestionList from './QuestionList'

function EHSReportDetailPage() {
  const { profile } = useAuth()
  const {
    serverities,
    reportSubject,
    workLocations,
    locations,
    areas,
    machines,
    processes,
    tasks,
    areaDepartments,

    report,
    selectedWorkLocation,
    selectedLocation,
    selectedArea,
    selectedMachine,
    selectedProcess
  } = useSelector((state) => state[MODULE_EHSREPORTDETAIL])

  const location = useLocation()
  const [form] = Form.useForm()
  const dispatch = useDispatch()

  useEffect(() => {
    const pathSegments = location.pathname.split('/')

    if (location.pathname.includes('create')) {
      const reportSubjectID = pathSegments[pathSegments.length - 1]
      const user = profile.user
      dispatch(onVisible({ reportSubjectID }))
      // dispatch(
      //   initOnCreateReport({
      //     EmployeeGPID: user.Title,
      //     EmployeeDepartmentName: user.DepartmentName,
      //     EmployeeFullName: user.FullName,
      //     EmployeeType: user.EmployeeType.EmployeeType,
      //     ReportSubjectID: reportSubjectID
      //   })
      // )
    }
  }, [])

  useEffect(() => {
    form.setFieldsValue({
      EmployeeGPID: report.EmployeeGPID,
      EmployeeFullName: report.EmployeeFullName,
      EmployeeType: report.EmployeeType,
      EmployeeDepartmentName: report.EmployeeDepartmentName
      // AreaDepartment: report.AreaDepartment,
      // WorkLocation: report.WorkLocation,
      // Area: report.Area,
      // Location: report.Location,
      // Process: report.Process,
      // DateHappening: report.DateHappening
    })
  }, [report])

  return (
    <div className="relative d-flex flex-col gap-2 ">
      <ReportHeader />

      <div className="d-flex items-center justify-center w-full p-4">
        <Steps
          className="w-3/4"
          current={0}
          direction="horizontal"
          size="small"
          items={[
            {
              title: 'Tạo báo cáo'
            },
            {
              title: 'Thẩm định cấp 1'
            },
            {
              title: 'Thẩm định cấp 2'
            }
          ]}
        />
      </div>
      <div className="h-[1500px] py-4 px-7 ">
        <Form form={form} layout="vertical" className="">
          <ReportSection title="1. Thông tin người báo cáo">
            <Row gutter={[24, 16]}>
              <Col md={8} sm={24} xs={24}>
                <FormItem label="GPID" name="EmployeeGPID">
                  <Input />
                </FormItem>
              </Col>
              <Col md={8} sm={24} xs={24}>
                <FormItem label="Họ và tên nhân viên" name="EmployeeFullName">
                  <Input />
                </FormItem>
              </Col>
              <Col md={8} sm={24} xs={24}>
                <FormItem label="Loại nhân viên" name="EmployeeType">
                  <Input />
                </FormItem>
              </Col>
              <Col md={8} sm={24} xs={24}>
                <FormItem label="Khối" name="EmployeeDepartmentName">
                  <Input />
                </FormItem>
              </Col>
              <Col md={8} sm={24} xs={24}>
                <FormItem label="Bộ phận" name="AreaDepartment">
                  <Select>
                    {areaDepartments.map((areaDepartment) => (
                      <Select.Option key={areaDepartment.ID} value={areaDepartment.ID}>
                        {areaDepartment.AreaDepartmentName}
                      </Select.Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>
            </Row>
          </ReportSection>
          <ReportSection title="2. Thông tin khu vực nơi phát hiện hành vi">
            <Row gutter={[24, 16]}>
              <Col md={8} sm={24} xs={24}>
                <FormItem label="Nhà máy" name="WorkLocationIDId">
                  <Select
                    onChange={(WorkLocationID) => {
                      form.resetFields([
                        'LocationIDId',
                        'AreaIDId',
                        'MachineIDId',
                        'ProcessIDId',
                        'TaskIDId'
                      ])
                      dispatch(setSelectedWorkLocation({ ID: WorkLocationID }))
                    }}>
                    {workLocations.map((workLocation) => (
                      <Select.Option key={workLocation.ID} value={workLocation.ID}>
                        {workLocation.WorkLocationName}
                      </Select.Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>
              <Col md={8} sm={24} xs={24}>
                <FormItem label="Khu vực" name="LocationIDId">
                  <Select
                    onChange={(LocationID) => {
                      form.resetFields(['AreaIDId', 'MachineIDId', 'ProcessIDId', 'TaskIDId'])
                      dispatch(setSelectedLocation({ ID: LocationID }))
                    }}>
                    {locations
                      .filter((l) => l.WorkLocationID === selectedWorkLocation?.Title)
                      .map((location) => (
                        <Select.Option key={location.ID} value={location.ID}>
                          {location.LocationName}
                        </Select.Option>
                      ))}
                  </Select>
                </FormItem>
              </Col>
              <Col md={8} sm={24} xs={24}>
                <FormItem label="Vị trí" name="AreaIDId">
                  <Select
                    onChange={(AreaID) => {
                      form.resetFields(['MachineIDId', 'ProcessIDId', 'TaskIDId'])
                      dispatch(setSelectedArea({ ID: AreaID }))
                    }}>
                    {areas
                      .filter((a) => a.LocationID === selectedLocation?.Title)
                      .map((area) => (
                        <Select.Option key={area.ID} value={area.ID}>
                          {area.Title}
                        </Select.Option>
                      ))}
                  </Select>
                </FormItem>
              </Col>
              {reportSubject.NeedMachineInfo && (
                <Col md={8} sm={24} xs={24}>
                  <FormItem label="Máy móc/thiết bị" name="MachineIDId">
                    <Select
                      onChange={(MachineID) => {
                        form.resetFields(['ProcessIDId', 'TaskIDId'])
                        dispatch(setSelectedMachine({ ID: MachineID }))
                      }}>
                      {machines
                        .filter((m) => m.AreaID === selectedArea?.Title)
                        .map((machine) => (
                          <Select.Option key={machine.ID} value={machine.ID}>
                            {machine.Title}
                          </Select.Option>
                        ))}
                    </Select>
                  </FormItem>
                </Col>
              )}
              {reportSubject.NeedProcessInfo && (
                <Col md={8} sm={24} xs={24}>
                  <FormItem label="Quy trình" name="ProcessIDId">
                    <Select
                      onChange={(ProcessID) => {
                        form.resetFields(['TaskIDId'])
                        dispatch(setSelectedProcess({ ID: ProcessID }))
                      }}>
                      {processes
                        .filter((p) => p.MachineID === selectedMachine?.Title)
                        .map((process) => (
                          <Select.Option key={process.ID} value={process.ID}>
                            {process.Title}
                          </Select.Option>
                        ))}
                    </Select>
                  </FormItem>
                </Col>
              )}
              {reportSubject.NeedTaskInfo && (
                <Col md={8} sm={24} xs={24}>
                  <FormItem label="Công việc" name="TaskIDId">
                    <Select>
                      {tasks
                        .filter((t) => t.ProcessID === selectedProcess?.Title)
                        .map((task) => (
                          <Select.Option key={task.ID} value={task.ID}>
                            {task.Title}
                          </Select.Option>
                        ))}
                    </Select>
                  </FormItem>
                </Col>
              )}
            </Row>
          </ReportSection>
          <ReportSection title="3. Mô tả hành vi không an toàn">
            <Row gutter={[24, 16]}>
              <Col md={8} sm={24} xs={24}>
                <FormItem label="Ngày và giờ xảy ra" name="DateHappening">
                  <DatePicker
                    allowClear
                    defaultPickerValue={false}
                    className="w-full"
                    format="DD/MM/YYYY HH:mm"
                    showTime
                  />
                </FormItem>
              </Col>
              <Col md={24} sm={24} xs={24}>
                <FormItem label="Mức độ nghiêm trọng" name="Area">
                  <Radio.Group>
                    {serverities.map((serverity) => (
                      <Radio key={serverity.ID} value={serverity.ID}>
                        {serverity.ServerityName}
                      </Radio>
                    ))}
                  </Radio.Group>
                </FormItem>
              </Col>
              <Col md={24} sm={24} xs={24} className="mb-4">
                <InvolvingPersonList />
              </Col>
              <Col md={24} sm={24} xs={24} className="w-full mb-6 ">
                <QuestionList />
              </Col>
            </Row>
          </ReportSection>
          <ReportSection title="4. Danh sách người nhận báo cáo, thẩm định">
            <Row></Row>
          </ReportSection>
        </Form>
      </div>
    </div>
  )
}

export default EHSReportDetailPage
