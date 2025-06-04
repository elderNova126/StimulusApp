import { FC } from 'react';
import DatePicker from 'react-datepicker';
import './style.css';

interface Props {
  placeholder?: string;
  date?: Date;
  setDate: (date: Date) => void;
  open: boolean;
  minDate?: Date;
  required?: boolean;
  disabled?: boolean;
}

const CustomDatePicker: FC<Props> = ({ open, placeholder, date, setDate, minDate, required, disabled }) => {
  return (
    <DatePicker
      required={required}
      minDate={minDate}
      open={open && !disabled}
      className="picker"
      placeholderText={placeholder}
      selected={date}
      onChange={setDate}
      disabled={disabled}
    />
  );
};

export default CustomDatePicker;
