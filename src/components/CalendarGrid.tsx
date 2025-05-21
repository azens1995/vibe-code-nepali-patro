import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { getWeekDayName } from '../utils/nepaliCalendar';
import { getEnglishDate } from '../utils/dateConversion';
import { convertToNepaliNumber } from '../utils/numberConverter';

interface CalendarGridProps {
  year: number;
  month: number;
  selectedDay: number | null;
  prevMonthDays: Array<{ day: number; month: number; year: number }>;
  currentMonthDays: number[];
  nextMonthDays: Array<{ day: number; month: number; year: number }>;
  onDaySelect: (day: number) => void;
  currentDate: {
    year: number;
    month: number;
    day: number;
  };
  language: string;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  year,
  month,
  selectedDay,
  prevMonthDays,
  currentMonthDays,
  nextMonthDays,
  onDaySelect,
  currentDate,
  language,
}) => {
  const theme = useMuiTheme();

  const renderCalendarDay = (
    day: number,
    month: number,
    year: number,
    isCurrentMonth: boolean = true
  ) => {
    const englishDate = getEnglishDate(year, month, day);
    const dateObj = new Date(englishDate);
    const englishDay = dateObj.getDate();
    const isSelected = isCurrentMonth && selectedDay === day;

    const isToday =
      currentDate.year === year &&
      currentDate.month === month &&
      currentDate.day === day;

    return (
      <Paper
        key={`${year}-${month}-${day}`}
        elevation={0}
        onClick={() => isCurrentMonth && onDaySelect(day)}
        sx={{
          'position': 'relative',
          'width': { xs: '40px', sm: '48px' },
          'height': { xs: '40px', sm: '48px' },
          'display': 'flex',
          'flexDirection': 'column',
          'alignItems': 'center',
          'justifyContent': 'center',
          'cursor': isCurrentMonth ? 'pointer' : 'default',
          'opacity': isCurrentMonth ? 1 : 0.3,
          'bgcolor': isToday
            ? 'primary.main'
            : isSelected
            ? theme.palette.mode === 'light'
              ? 'primary.light'
              : 'primary.dark'
            : 'transparent',
          'borderRadius': '50%',
          'margin': 'auto',
          'color': !isCurrentMonth
            ? 'text.disabled'
            : isToday || isSelected
            ? theme.palette.mode === 'light' && !isToday
              ? 'primary.main'
              : '#fff'
            : 'text.primary',
          '& .MuiTypography-root': {
            position: 'relative',
            zIndex: 2,
          },
          '&:hover': {
            bgcolor:
              !isSelected && !isToday
                ? 'action.hover'
                : isToday
                ? 'primary.dark'
                : isSelected
                ? theme.palette.mode === 'light'
                  ? 'primary.main'
                  : 'primary.light'
                : undefined,
            color: !isSelected && !isToday ? undefined : '#fff',
          },
          ...(isSelected && {
            boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
          }),
          ...(isToday && {
            '&:hover': {
              bgcolor: 'primary.dark',
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -1,
              left: -1,
              right: -1,
              bottom: -1,
              borderRadius: '50%',
              border: '2px solid',
              borderColor: 'primary.main',
            },
          }),
          'transition': 'all 0.2s ease',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant='body2'
            sx={{
              fontWeight: isSelected || isToday ? 'bold' : 'normal',
              fontSize: { xs: '0.875rem', sm: '1rem' },
              lineHeight: 1,
              color: 'inherit',
              mt: { xs: -1, sm: -1 },
            }}
          >
            {convertToNepaliNumber(day)}
          </Typography>
          <Typography
            variant='caption'
            sx={{
              fontSize: { xs: '0.625rem', sm: '0.75rem' },
              color: 'inherit',
              lineHeight: 1,
              position: 'absolute',
              bottom: { xs: -1, sm: -1 },
              right: { xs: -6, sm: -8 },
              zIndex: 1,
              opacity: 0.8,
              transform: 'scale(0.85)',
              transformOrigin: 'bottom right',
              bgcolor: 'transparent',
            }}
          >
            {englishDay}
          </Typography>
        </Box>
      </Paper>
    );
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 1, sm: 2 },
        borderRadius: 2,
        bgcolor: 'background.paper',
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: { xs: 'calc(100vh - 250px)', sm: 0 },
        boxShadow: (theme) =>
          theme.palette.mode === 'light'
            ? '0px 2px 8px rgba(0, 0, 0, 0.1)'
            : undefined,
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: { xs: 0.5, sm: 1 },
          p: { xs: 1, sm: 2 },
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
          boxShadow:
            theme.palette.mode === 'light'
              ? '0px 2px 8px rgba(0, 0, 0, 0.1)'
              : undefined,
        }}
      >
        {Array.from({ length: 7 }, (_, i) => (
          <Typography
            key={i}
            variant='subtitle2'
            align='center'
            sx={{
              color: i === 6 ? 'error.main' : 'text.primary',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              fontWeight: 600,
              opacity: theme.palette.mode === 'light' ? 0.87 : 0.7,
            }}
          >
            {getWeekDayName(i, language)}
          </Typography>
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: { xs: 1, sm: 1.5 },
          gridTemplateRows: {
            xs: 'repeat(6, minmax(48px, 1fr))',
            sm: 'repeat(6, minmax(56px, 1fr))',
          },
          flex: 1,
          minHeight: 0,
          alignItems: 'center',
          pb: { xs: 7, sm: 0 },
        }}
      >
        {prevMonthDays.map((date) =>
          renderCalendarDay(date.day, date.month, date.year, false)
        )}
        {currentMonthDays.map((day) => renderCalendarDay(day, month, year))}
        {nextMonthDays.map((date) =>
          renderCalendarDay(date.day, date.month, date.year, false)
        )}
      </Box>
    </Paper>
  );
};

export default CalendarGrid;
