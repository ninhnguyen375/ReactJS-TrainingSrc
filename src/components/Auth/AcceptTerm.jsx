import React, { useEffect, useState } from 'react'
import { handleError } from '../../common/helpers'
import { getItemService, updateListItemService } from '../../common/services'
import lists from '../../common/lists'
import AsyncButton from '../../common/components/AsyncButton'
import { Checkbox } from 'antd'
import { useAuth } from '../../common/AuthProvider'
import { useLocation, useNavigate } from 'react-router-dom'

const AcceptTerm = () => {
  const [termItem, setTermItem] = useState()
  const [loading, setLoading] = useState(true)
  const [checkedTerm, setCheckedTerm] = useState(false)

  const location = useLocation()
  const auth = useAuth()
  const navigate = useNavigate()
  const returnUrl = location.state?.returnUrl || '/'

  const getTerm = async () => {
    setLoading(true)
    try {
      const term = await getItemService(lists.Term, 1)
      setTermItem(term)
    } catch (error) {
      handleError(error)
    }

    setLoading(false)
  }
  useEffect(() => {
    getTerm()
  }, [])

  const handleClickAcceptTerm = async () => {
    try {
      await updateListItemService(lists.Accounts, auth.profile.authenticated.user.id, {
        IsAcceptedTerm: 'Yes'
      })

      await auth.fetchUser()

      if (returnUrl === '/term') {
        navigate('/', { replace: true })
      } else {
        navigate(returnUrl, { replace: true })
      }
    } catch (error) {
      handleError(error)
    }
  }

  if (loading) {
    return <div className="text-center">Loading term...</div>
  }

  return (
    <div style={{ maxWidth: 700, margin: 'auto' }}>
      <div dangerouslySetInnerHTML={{ __html: termItem?.TermContent }}></div>

      <div>
        <Checkbox onClick={(e) => setCheckedTerm(e.target.checked)}>
          Tôi đã đọc và chấp nhận với điều khoản nêu trên
        </Checkbox>
      </div>
      <div className="mt-2 mb-5">
        <AsyncButton
          disabled={!checkedTerm}
          onClick={handleClickAcceptTerm}
          block
          type="primary"
          icon={<i className="fa-solid fa-check"></i>}>
          Chấp nhận
        </AsyncButton>
      </div>
    </div>
  )
}

export default AcceptTerm
