import React, { useState } from 'react'
import { Button, ButtonProps } from 'antd'

function isPromise(value: unknown): value is Promise<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'then' in value &&
    typeof (value as { then: unknown }).then === 'function'
  )
}

interface AsyncButtonProps extends ButtonProps {
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void | Promise<void>
}

const AsyncButton: React.FC<AsyncButtonProps> = ({
  onClick,
  loading: primitiveLoading,
  ...restProps
}) => {
  const [isHandlingClick, setHandlingClick] = useState<boolean>(false)

  return (
    <Button
      {...restProps}
      loading={primitiveLoading === undefined ? isHandlingClick : primitiveLoading}
      onClick={async (e) => {
        if (typeof onClick === 'function' && !isHandlingClick) {
          const returnValue = onClick(e)

          if (isPromise(returnValue)) {
            try {
              setHandlingClick(true)
              await returnValue
            } finally {
              setHandlingClick(false)
            }
          }
        }
      }}
    />
  )
}

export default AsyncButton
