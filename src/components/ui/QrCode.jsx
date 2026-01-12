'use client'
import React from 'react'
import { QRCodeSVG } from 'qrcode.react'

const QrCode = ({ value, options }) => {
  return (
    <QRCodeSVG
      value={value}
      {...options}
    />
  )
}

export default QrCode
