import React from "react";
import {
  Backdrop,
  Box,
  Fade,
  IconButton,
  Modal,
  TextField,
  TextFieldProps,
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import {
  Close as CloseIcon,
  DateRange as DateRangeIcon
} from "@mui/icons-material";
import * as fns from "date-fns";
import {
  DateRange,
  DateRangePicker
} from "materialui-daterange-picker";

export type MuiDateRangePickerProps = {
  dateRange: DateRange;
  onDateRangeChange: (dateRange: DateRange) => void;
  fomat?: string;
  TextFieldProps?: TextFieldProps;
};

const useStyles = makeStyles({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default function FilterPicker(props: MuiDateRangePickerProps) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const format = props.fomat ?? "yyyy-MM-dd";

  const toggle = () => setOpen(!open);

  const getDisplayDateRange = (dateRange: DateRange): string => {
    const startDate = dateRange?.startDate
      ? fns.format(dateRange.startDate, format)
      : undefined;

    const endDate = dateRange?.endDate
      ? fns.format(dateRange.endDate, format)
      : undefined;

    return startDate || endDate ? `${startDate} - ${endDate}` : "";
  };

  return (
    <>
      <Box display="flex" alignItems="center">
        <TextField
          {...props.TextFieldProps}
          value={getDisplayDateRange(props.dateRange)}
          onClick={(e) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT') toggle();
            e.preventDefault();
          }}
          InputProps={{
            ...props.TextFieldProps?.InputProps,
            readOnly: true,
            endAdornment: (
              <IconButton
                id="icon"
                onClick={() => {
                  if (Object.keys(props.dateRange).length === 0) toggle();
                  else props.onDateRangeChange({})
                }}
              >
                {Object.keys(props.dateRange).length === 0 ? <DateRangeIcon /> : <CloseIcon />}
              </IconButton>
            )
          }}
        />
      </Box>
      <Modal
        className={classes.modal}
        open={open}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={open}>
          <div>
            <DateRangePicker
              open
              toggle={toggle}
              initialDateRange={props.dateRange}
              onChange={(range) => {
                props.onDateRangeChange(range);
                toggle();
              }}
            />
          </div>
        </Fade>
      </Modal>
    </>
  );
}
