import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import "dayjs/locale/pt-br"; 

dayjs.locale("pt-br");


export default function Calendario() {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
            <DemoContainer components={['DateCalendar']}>
<DateCalendar
  defaultValue={dayjs()}
  views={['year', 'month', 'day']}
  sx={{
    width: 340,
    height: 500, // <<< Altura compacta igual ao container!
    minHeight: 230,
    maxHeight: 250,

    "& .MuiPickersCalendarHeader-root": {
      minHeight: 24,
      height: 28,
      color: "#222",
      fontWeight: "bold",
      fontSize: "1.06rem",
      mb: 0.2,
      pt: 1,
    },
    "& .MuiPickersCalendarHeader-label": {
      fontWeight: "bold",
      fontSize: "1.12rem",
      
    },
    "& .MuiPickersCalendarHeader-switchViewButton": {
      color: "#222",
      
    },
    "& .MuiPickersCalendarHeader-labelContainer": {
      color: "#222",
      fontWeight: "bold",
    },
    "& .MuiDayCalendar-header": {
      borderBottom: "2px solid #222",
      mb: 0.1,
      flex:1,

    },
    "& .MuiDayCalendar-weekDayLabel": {
      color: "#222",
      fontWeight: "bold",
      fontSize: "0.74rem",
      textTransform: "uppercase",
      letterSpacing: 0,
      height: 16,
      py: 0,
    },
    "& .MuiPickersDay-root": {
      color: "#222",
      fontWeight: 400,
      fontSize: "0.98rem",
      borderRadius: 2,
      minWidth: 30, // menor largura do botão dia
      minHeight: 30, // menor altura do botão dia
      lineHeight: 1.1,
      p: 0,
      m: 0,
    },
    "& .Mui-selected": {
      bgcolor: "#ffa726 !important",
      color: "#fff !important",
      fontWeight: "bold",
    },
    "& .MuiPickersDay-today": {
      border: "2px solid #ffa726",
    },
    "& .MuiDayCalendar-weekContainer": {
      minHeight: 21,
      m: 0,
      p: 0,
    },
    "& .MuiPickersDay-root.Mui-disabled": {
      color: "#ccc",
    },
  }}
/>



            </DemoContainer>
        </LocalizationProvider>
    );
}
