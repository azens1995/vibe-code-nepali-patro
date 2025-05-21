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
  const theme = useMuiTheme();
  const allHolidays = getAllHolidays(year);
  const holidays: Holiday[] = [];

  // Get all holidays for the year
  Object.entries(allHolidays).forEach(([monthStr, monthHolidays]) => {
    const month = Number(monthStr);
    Object.entries(monthHolidays).forEach(([dayStr, name]) => {
      const day = Number(dayStr);
      holidays.push({
        date: `${getNepaliMonthName(month, 'ne')} ${convertToNepaliNumber(
          day
        )}`,
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
        width: '100%',
        borderRadius: 2,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow:
          theme.palette.mode === 'light'
            ? '0px 2px 8px rgba(0, 0, 0, 0.1)'
            : undefined,
      }}
    >
      <Typography
        variant='h6'
        sx={{
          mb: 2,
          color: 'primary.main',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexShrink: 0,
        }}
      >
        <CalendarTodayIcon fontSize='small' />
        {`सार्वजनिक बिदाहरू ${convertToNepaliNumber(year)}`}
      </Typography>

      <Box
        sx={{
          'overflow': 'auto',
          'flex': 1,
          'minHeight': 0,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: theme.palette.mode === 'dark' ? '#1E1E1E' : '#F5F5F5',
          },
          '&::-webkit-scrollbar-thumb': {
            'bgcolor': theme.palette.mode === 'dark' ? '#333333' : '#BDBDBD',
            'borderRadius': '4px',
            '&:hover': {
              bgcolor: theme.palette.mode === 'dark' ? '#444444' : '#9E9E9E',
            },
          },
        }}
      >
        {holidays.map((holiday, index) => {
          const isCurrentMonth = holiday.month === currentMonth;
          return (
            <Paper
              key={index}
              sx={{
                'p': 1.5,
                'mb': 1,
                'bgcolor': isCurrentMonth
                  ? 'primary.main'
                  : theme.palette.mode === 'dark'
                  ? '#2A2A2A'
                  : '#F5F5F5',
                'color': isCurrentMonth ? '#fff' : 'text.primary',
                'borderRadius': 1,
                'display': 'flex',
                'flexDirection': 'column',
                'gap': 0.5,
                'boxShadow':
                  theme.palette.mode === 'light' && !isCurrentMonth
                    ? '0px 1px 4px rgba(0, 0, 0, 0.1)'
                    : 'none',
                'transition': 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow:
                    theme.palette.mode === 'light' && !isCurrentMonth
                      ? '0px 4px 8px rgba(0, 0, 0, 0.1)'
                      : 'none',
                },
              }}
            >
              <Typography variant='subtitle2' sx={{ fontWeight: 'medium' }}>
                {holiday.name}
              </Typography>
              <Typography
                variant='caption'
                sx={{
                  color: isCurrentMonth ? 'inherit' : 'text.secondary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  opacity: theme.palette.mode === 'light' ? 0.87 : 0.7,
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
    const isSelected = isCurrentMonth && selectedDay === day;

    // Get current date to highlight today
    const currentDate = getCurrentNepaliDate();
    const isToday =
      currentDate.year === year &&
      currentDate.month === month &&
      currentDate.day === day;

    return (
      <Paper
        key={`${year}-${month}-${day}`}
        elevation={0}
        onClick={() => isCurrentMonth && setSelectedDay(day)}
        sx={{
          'position': 'relative',
          'width': '40px',
          'height': '40px',
          'display': 'flex',
          'flexDirection': 'column',
          'alignItems': 'center',
          'justifyContent': 'center',
          'cursor': isCurrentMonth ? 'pointer' : 'default',
          'opacity': isCurrentMonth ? 1 : 0.3,
          'bgcolor': isToday ? 'primary.main' : 'transparent',
          'borderRadius': '50%',
          'margin': 'auto',
          'color': !isCurrentMonth
            ? 'text.disabled'
            : isHolidayAndCurrent
            ? 'error.main'
            : isToday || isSelected
            ? '#fff'
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
                ? 'primary.main'
                : undefined,
          },
          ...(isSelected && {
            bgcolor: 'background.paper',
            border: '2px solid',
            borderColor: 'primary.main',
          }),
          'transition': 'all 0.2s ease',
        }}
      >
        <Typography
          variant='body2'
          sx={{
            fontWeight: isSelected || isToday || holiday ? 'bold' : 'normal',
            fontSize: { xs: '0.875rem', sm: '0.875rem', md: '0.875rem' },
            lineHeight: 1,
            color: 'inherit',
            mb: holiday ? 0.25 : 0,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {convertToNepaliNumber(day)}
        </Typography>
        {holiday && (
          <Typography
            variant='caption'
            sx={{
              fontSize: '0.5rem',
              fontWeight: 'medium',
              color: 'inherit',
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              opacity: isCurrentMonth ? 1 : 0.7,
              lineHeight: 1,
              position: 'relative',
              zIndex: 1,
              mt: -0.5,
            }}
          >
            •
          </Typography>
        )}
        <Typography
          variant='caption'
          sx={{
            fontSize: '0.6rem',
            color: isSelected ? 'inherit' : 'text.secondary',
            lineHeight: 1,
            position: 'absolute',
            bottom: 2,
            right: 2,
            zIndex: 1,
            opacity: 0.7,
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
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        overflow: 'hidden',
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
          overflow: 'hidden',
          maxWidth: '1800px',
          width: '100%',
          mx: 'auto',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              display:
                !isMobileOrTablet || mobileView === 'calendar'
                  ? 'flex'
                  : 'none',
              flex: { md: '0 0 800px' },
              flexDirection: 'column',
              height: '100%',
              minHeight: 0,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                mb: 2,
                flexShrink: 0,
              }}
            >
              <FormControl size='small' fullWidth variant='standard'>
                <InputLabel
                  id='year-select-label'
                  sx={{
                    'color': 'text.primary',
                    '&.Mui-focused': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {t('calendar.selectYear')}
                </InputLabel>
                <Select
                  labelId='year-select-label'
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  sx={{
                    'minHeight': '40px',
                    '& .MuiInput-input': {
                      pt: 2,
                      pb: 1,
                    },
                    '&:before': {
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    },
                    '&:hover:not(.Mui-disabled):before': {
                      borderBottom: '2px solid',
                      borderColor: 'text.primary',
                    },
                    '&.Mui-focused:after': {
                      borderColor: 'primary.main',
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: 'background.paper',
                        maxHeight: 300,
                      },
                    },
                  }}
                >
                  {years.map((y) => (
                    <MenuItem key={y} value={y}>
                      {convertToNepaliNumber(y)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size='small' fullWidth variant='standard'>
                <InputLabel
                  id='month-select-label'
                  sx={{
                    'color': 'text.primary',
                    '&.Mui-focused': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {t('calendar.selectMonth')}
                </InputLabel>
                <Select
                  labelId='month-select-label'
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  sx={{
                    'minHeight': '40px',
                    '& .MuiInput-input': {
                      pt: 2,
                      pb: 1,
                    },
                    '&:before': {
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    },
                    '&:hover:not(.Mui-disabled):before': {
                      borderBottom: '2px solid',
                      borderColor: 'text.primary',
                    },
                    '&.Mui-focused:after': {
                      borderColor: 'primary.main',
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: 'background.paper',
                        maxHeight: 300,
                      },
                    },
                  }}
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
                  sx={{
                    'bgcolor': 'action.hover',
                    '&:hover': {
                      bgcolor: 'action.selected',
                    },
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
                <IconButton
                  onClick={handleNextMonth}
                  size='small'
                  sx={{
                    'bgcolor': 'action.hover',
                    '&:hover': {
                      bgcolor: 'action.selected',
                    },
                  }}
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
                border: '1px solid',
                borderColor: 'divider',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0,
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
                  gap: { xs: 1, sm: 1.5 },
                  mb: { xs: 1, sm: 1.5 },
                  flexShrink: 0, // Prevent shrinking
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
                      opacity: (theme) =>
                        theme.palette.mode === 'light' ? 0.87 : 0.7,
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
                  gap: { xs: 1, sm: 1.5 },
                  gridTemplateRows: 'repeat(6, 1fr)',
                  flex: 1,
                  minHeight: 0, // Important for flex child
                  alignItems: 'center',
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
                  ? 'flex'
                  : 'none',
              flex: { md: '0 0 400px' },
              height: '100%',
              minHeight: 0,
            }}
          >
            <HolidayList year={year} currentMonth={month} />
          </Box>
        </Box>
      </Box>

      {isMobileOrTablet && (
        <Paper
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10,
          }}
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
