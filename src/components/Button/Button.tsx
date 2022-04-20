import React from 'react'
import { ButtonBase, Theme, useTheme } from '@mui/material'
import { SxProps } from '@mui/system'

interface Props {
  onClick?: ((e: React.MouseEvent<HTMLButtonElement>) => void) | (() => void)
  width?: string
  height?: string
  backgroundColor?: string
  disabled?: boolean
  color?: string
  children?: React.ReactNode
  fontSize?: string | number
  classname?: string
  style?: React.CSSProperties & SxProps<Theme>
  active?: boolean
  disableRipple?: boolean
  borderRadius?: string
}

export default function Button(props: Props) {
  const {
    onClick,
    disabled,
    style,
    width,
    height,
    fontSize,
    backgroundColor,
    color,
    disableRipple,
    borderRadius
  } = props
  const theme = useTheme()
  return (
    <ButtonBase
      disableRipple={disableRipple}
      onClick={onClick}
      disabled={disabled}
      sx={{
        width: width || '100%',
        height: height || 60,
        fontSize: fontSize || 16,
        fontWeight: 500,
        transition: '.3s',
        borderRadius: borderRadius || `${theme.shape.borderRadius}px`,
        background: backgroundColor || 'linear-gradient(265.56deg, #24F986 -0.27%, #1EF65B -0.26%, #00D060 98.59%);',
        color: color || theme.palette.primary.contrastText,
        '&:hover': {
          opacity: 0.6
        },
        '&:disabled': {
          opacity: 0.3
        },
        ...style
      }}
    >
      {props.children}
    </ButtonBase>
  )
}

export function BlackButton({ style, ...props }: Props) {
  const theme = useTheme()
  return (
    <Button
      {...props}
      style={{
        background: 'transparent',
        border: '2px solid #A5FFBE',
        color: theme.palette.primary.contrastText,
        '&:hover': {
          background: 'linear-gradient(265.56deg, #24F986 -0.27%, #1EF65B -0.26%, #00D060 98.59%);'
        },
        '&:disabled': {
          backgroundColor: '#B9B9B9'
        },
        ...style
      }}
    />
  )
}

export function DefaultButton({ style, active, ...props }: Props) {
  const theme = useTheme()

  return (
    <Button
      {...props}
      style={{
        color: active ? theme.palette.primary.contrastText : theme.palette.text.primary,
        backgroundColor: active ? theme.palette.primary.main : theme.palette.primary.contrastText,
        border: `1px solid ${active ? 'transparent' : 'rgba(0,0,0,0.1)'}`,
        '&:hover': {
          background: theme.palette.primary.main
        },
        ...style
      }}
    />
  )
}
