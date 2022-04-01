import { Checkbox, FormControlLabel } from '@mui/material'
import { ReactComponent as CheckboxIcon } from '../../assets/componentsIcon/checkbox.svg'
import { ReactComponent as CheckboxCheckedIcon } from '../../assets/componentsIcon/checkbox_checked.svg'

interface Props {
  checked: boolean
  onChange?: () => void
  label?: string
  disabled?: boolean
}

export default function _Checkbox(props: Props) {
  const { checked, onChange, label = '', disabled } = props
  return (
    <FormControlLabel
      sx={{ margin: 0, fontWeight: 400, '& .MuiFormControlLabel-label': { fontSize: 18 } }}
      control={
        <Checkbox
          sx={{ padding: 0, marginRight: '12px' }}
          icon={<CheckboxIcon />}
          checkedIcon={<CheckboxCheckedIcon />}
        />
      }
      label={label}
      labelPlacement="end"
      onChange={onChange}
      checked={checked}
      disabled={disabled}
    />
  )
}
