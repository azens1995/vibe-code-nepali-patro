import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  IconButton,
  BottomNavigation,
  BottomNavigationAction,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  generateCalendarDays,
  getNepaliMonthName,
  getWeekDayName,
  getCurrentNepaliDate,
  getNepaliHoliday,
  nepaliCalendarData,
  getNepaliMonthDays,
  getStartDayOfMonth,
  getAllHolidays,
} from '../utils/nepaliCalendar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getEnglishDate } from '../utils/dateConversion';
import Header from './Header';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventIcon from '@mui/icons-material/Event';
import { useTheme as useMuiTheme } from '@mui/material/styles';

// Utility function to convert English numbers to Nepali
const convertToNepaliNumber = (number: number | string): string => {
  const nepaliNumbers = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return number
    .toString()
    .split('')
    .map((digit) => nepaliNumbers[parseInt(digit, 10)])
    .join('');
};

interface Holiday {
  date: string;
  name: string;
  month: number;
  day: number;
}

const HolidayList: React.FC<{ year: number; currentMonth: number }> = ({
  year,
  currentMonth,
}) => {
  const allHolidays = getAllHolidays(year);
  const holidays: Holiday[] = [];

  // Convert the holiday data structure into a flat array
  Object.entries(allHolidays).forEach(([monthStr, monthHolidays]) => {
    const month = Number(monthStr);
    Object.entries(monthHolidays).forEach(([dayStr, name]) => {
      const day = Number(dayStr);
      holidays.push({
        date: `${getNepaliMonthName(month, 'en')} ${day}`,
        name,
        month,
        day,
      });
    });
  });

  // Sort holidays by month and day
  holidays.sort((a, b) => {
    if (a.month !== b.month) return a.month - b.month;
    return a.day - b.day;
  });

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        height: '100%',
        borderRadius: 2,
        bgcolor: 'background.paper',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography
        variant='h6'
        sx={{
          mb: 2,
          color: 'primary.main',
          fontWeight: 500,
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        <CalendarTodayIcon fontSize='small' />
        Holidays {year}
      </Typography>

      <Box
        sx={{
          'overflow': 'auto',
          'flex': 1,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: 'action.hover',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'primary.main',
            borderRadius: '4px',
          },
        }}
      >
        {holidays.map((holiday, index) => {
          const isCurrentMonth = holiday.month === currentMonth;
          return (
            <Paper
              key={index}
              elevation={isCurrentMonth ? 2 : 0}
              sx={{
                p: 1.5,
                mb: 1,
                borderRadius: 1,
                bgcolor: isCurrentMonth ? 'primary.main' : 'action.hover',
                color: isCurrentMonth ? 'primary.contrastText' : 'text.primary',
                transition: 'all 0.2s ease',
                border: isCurrentMonth ? 2 : 1,
                borderColor: isCurrentMonth ? 'primary.main' : 'divider',
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
              }}
            >
              <Typography
                variant='subtitle2'
                sx={{
                  fontWeight: isCurrentMonth ? 'bold' : 'medium',
                }}
              >
                {holiday.name}
              </Typography>
              <Typography
                variant='caption'
                sx={{
                  color: isCurrentMonth
                    ? 'primary.contrastText'
                    : 'text.secondary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <EventIcon fontSize='small' />
                {holiday.date}
              </Typography>
            </Paper>
          );
        })}
      </Box>
    </Paper>
  );
};

interface NepaliCalendarProps {
  onThemeChange: () => void;
  isDarkMode: boolean;
}

const NepaliCalendar: React.FC<NepaliCalendarProps> = ({
  onThemeChange,
  isDarkMode,
}) => {
  const { t, i18n } = useTranslation();
  const theme = useMuiTheme();
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [year, setYear] = useState<number>(2080);
  const [month, setMonth] = useState<number>(1);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [mobileView, setMobileView] = useState<'calendar' | 'holidays'>(
    'calendar'
  );

  const years = Array.from(
    { length: Object.keys(nepaliCalendarData).length },
    (_, i) => Number(Object.keys(nepaliCalendarData)[0]) + i
  );
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  useEffect(() => {
    const currentDate = getCurrentNepaliDate();
    setYear(currentDate.year);
    setMonth(currentDate.month);
    setSelectedDay(currentDate.day);
  }, []);

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const getPreviousMonthDays = (
    year: number,
    month: number,
    startDay: number
  ) => {
    if (startDay === 0) return [];
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const daysInPrevMonth = getNepaliMonthDays(prevYear, prevMonth);
    return Array.from({ length: startDay }, (_, i) => ({
      day: daysInPrevMonth - startDay + i + 1,
      month: prevMonth,
      year: prevYear,
    }));
  };

  const getNextMonthDays = (
    year: number,
    month: number,
    startDay: number,
    currentMonthDays: number[]
  ) => {
    const totalCells = 42; // 6 rows * 7 days
    const remainingCells = totalCells - (startDay + currentMonthDays.length);
    if (remainingCells <= 0) return [];

    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    return Array.from({ length: remainingCells }, (_, i) => ({
      day: i + 1,
      month: nextMonth,
      year: nextYear,
    }));
  };

  const handleThemeToggle = () => {
    onThemeChange();
  };

  const renderCalendarDay = (
    day: number,
    month: number,
    year: number,
    isCurrentMonth: boolean = true
  ) => {
    const englishDate = getEnglishDate(year, month, day);
    const dateObj = new Date(englishDate);
    const englishDay = dateObj.getDate();
    const holiday = getNepaliHoliday(year, month, day);
    const isHolidayAndCurrent = holiday && isCurrentMonth;

    return (
      <Paper
        key={`${year}-${month}-${day}`}
        elevation={1}
        onClick={() => isCurrentMonth && setSelectedDay(day)}
        sx={{
          'position': 'relative',
          'width': '100%',
          'aspectRatio': '1/1',
          'display': 'flex',
          'flexDirection': 'column',
          'alignItems': 'center',
          'justifyContent': 'center',
          'cursor': isCurrentMonth ? 'pointer' : 'default',
          'opacity': isCurrentMonth ? 1 : 0.5,
          'bgcolor':
            isCurrentMonth && selectedDay === day
              ? 'primary.main'
              : isHolidayAndCurrent
              ? 'error.light'
              : 'background.paper',
          'color':
            (isCurrentMonth && selectedDay === day) || isHolidayAndCurrent
              ? '#fff'
              : 'text.primary',
          '&:hover': {
            bgcolor:
              isCurrentMonth && selectedDay === day
                ? 'primary.dark'
                : isHolidayAndCurrent
                ? 'error.main'
                : 'action.hover',
          },
          'boxShadow': 1,
          'transition': 'all 0.2s ease',
          'p': { xs: 0.5, sm: 1 },
          'minWidth': { xs: '32px', sm: '40px', md: '48px' },
          'minHeight': { xs: '32px', sm: '40px', md: '48px' },
        }}
      >
        <Typography
          variant='body2'
          sx={{
            fontWeight: holiday ? 'bold' : 'normal',
            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
            lineHeight: 1,
            color: 'inherit',
            mb: holiday ? 0.25 : 0,
          }}
        >
          {convertToNepaliNumber(day)}
        </Typography>
        {holiday && (
          <Typography
            variant='caption'
            sx={{
              fontSize: { xs: '0.5rem', sm: '0.6rem' },
              fontWeight: 'medium',
              color: 'inherit',
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              opacity: isCurrentMonth ? 1 : 0.7,
              lineHeight: 1,
            }}
          >
            •
          </Typography>
        )}
        <Typography
          variant='caption'
          sx={{
            fontSize: { xs: '0.5rem', sm: '0.6rem' },
            color:
              (isCurrentMonth && selectedDay === day) || isHolidayAndCurrent
                ? 'rgba(255, 255, 255, 0.7)'
                : 'text.secondary',
            lineHeight: 1,
            position: 'absolute',
            bottom: { xs: 1, sm: 2 },
            right: { xs: 1, sm: 2 },
          }}
        >
          {englishDay}
        </Typography>
      </Paper>
    );
  };

  const calendarDays = generateCalendarDays(year, month);
  const startDay = getStartDayOfMonth(year, month);
  const prevMonthDays = getPreviousMonthDays(year, month, startDay);
  const nextMonthDays = getNextMonthDays(year, month, startDay, calendarDays);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      <Header darkMode={isDarkMode} onThemeToggle={handleThemeToggle} />

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          p: { xs: 1, sm: 2, md: 3 },
          gap: 2,
          mt: { xs: 7, sm: 8 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            height: '100%',
          }}
        >
          <Box
            sx={{
              display:
                !isMobileOrTablet || mobileView === 'calendar'
                  ? 'block'
                  : 'none',
              flex: { md: 2 },
              width: '100%',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                mb: 2,
              }}
            >
              <FormControl size='small' fullWidth>
                <InputLabel id='year-select-label'>
                  {t('calendar.selectYear')}
                </InputLabel>
                <Select
                  labelId='year-select-label'
                  value={year}
                  label={t('calendar.selectYear')}
                  onChange={(e) => setYear(Number(e.target.value))}
                >
                  {years.map((y) => (
                    <MenuItem key={y} value={y}>
                      {convertToNepaliNumber(y)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size='small' fullWidth>
                <InputLabel id='month-select-label'>
                  {t('calendar.selectMonth')}
                </InputLabel>
                <Select
                  labelId='month-select-label'
                  value={month}
                  label={t('calendar.selectMonth')}
                  onChange={(e) => setMonth(Number(e.target.value))}
                >
                  {months.map((m) => (
                    <MenuItem key={m} value={m}>
                      {getNepaliMonthName(m, i18n.language)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconButton
                  onClick={handlePrevMonth}
                  size='small'
                  sx={{ bgcolor: 'action.hover' }}
                >
                  <ArrowBackIcon />
                </IconButton>
                <IconButton
                  onClick={handleNextMonth}
                  size='small'
                  sx={{ bgcolor: 'action.hover' }}
                >
                  <ArrowForwardIcon />
                </IconButton>
              </Box>
            </Box>

            <Paper
              elevation={3}
              sx={{
                p: { xs: 1, sm: 2 },
                borderRadius: 2,
                bgcolor: 'background.paper',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: { xs: 0.5, sm: 1 },
                  mb: { xs: 0.5, sm: 1 },
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
                      fontWeight: 'medium',
                    }}
                  >
                    {getWeekDayName(i, i18n.language)}
                  </Typography>
                ))}
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: { xs: 0.5, sm: 1 },
                  gridTemplateRows: 'repeat(6, 1fr)',
                }}
              >
                {prevMonthDays.map((date) =>
                  renderCalendarDay(date.day, date.month, date.year, false)
                )}
                {calendarDays.map((day) => renderCalendarDay(day, month, year))}
                {nextMonthDays.map((date) =>
                  renderCalendarDay(date.day, date.month, date.year, false)
                )}
              </Box>
            </Paper>
          </Box>

          <Box
            sx={{
              display:
                !isMobileOrTablet || mobileView === 'holidays'
                  ? 'block'
                  : 'none',
              flex: { md: 1 },
              width: '100%',
              height: '100%',
            }}
          >
            <HolidayList year={year} currentMonth={month} />
          </Box>
        </Box>
      </Box>

      {isMobileOrTablet && (
        <Paper
          sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
          elevation={3}
        >
          <BottomNavigation
            value={mobileView}
            onChange={(_, newValue) => setMobileView(newValue)}
            sx={{
              height: 56,
              borderTop: 1,
              borderColor: 'divider',
            }}
          >
            <BottomNavigationAction
              label={t('calendar.view')}
              value='calendar'
              icon={<CalendarTodayIcon />}
            />
            <BottomNavigationAction
              label={t('calendar.holidays')}
              value='holidays'
              icon={<EventIcon />}
            />
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
};

export default NepaliCalendar;
