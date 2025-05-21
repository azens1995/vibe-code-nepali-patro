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
  Divider,
  Drawer,
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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from './Header';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventIcon from '@mui/icons-material/Event';

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

interface MonthHolidays {
  [key: string]: string;
}

interface YearHolidays {
  [key: number]: MonthHolidays;
}

const HolidayList: React.FC<{ year: number; currentMonth: number }> = ({
  year,
  currentMonth,
}) => {
  const allHolidays: YearHolidays = getAllHolidays(year);
  const holidays: Holiday[] = [];

  // Convert the holiday data structure into a flat array
  Object.entries(allHolidays).forEach(([monthStr, monthHolidays]) => {
    const month = Number(monthStr);
    Object.entries(monthHolidays as MonthHolidays).forEach(([dayStr, name]) => {
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

const NepaliCalendar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [year, setYear] = useState<number>(2080);
  const [month, setMonth] = useState<number>(1);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);
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

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

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

  const calendarDays = generateCalendarDays(year, month);
  const startDay = getStartDayOfMonth(year, month);
  const prevMonthDays = getPreviousMonthDays(year, month, startDay);
  const nextMonthDays = getNextMonthDays(year, month, startDay, calendarDays);

  const getEnglishDateForNepali = (
    year: number,
    month: number,
    day: number
  ): string => {
    return getEnglishDate(year, month, day);
  };

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
  };

  // Get the Georgian months for the current Nepali month
  const getGeorgianMonthRange = (
    nepaliYear: number,
    nepaliMonth: number
  ): string => {
    // Get first day of the month
    const firstDayAD = getEnglishDate(nepaliYear, nepaliMonth, 1);
    // Get last day of the month
    const lastDayAD = getEnglishDate(
      nepaliYear,
      nepaliMonth,
      getNepaliMonthDays(nepaliYear, nepaliMonth)
    );

    const [, firstMonth] = firstDayAD.split(' ');
    const [, lastMonth] = lastDayAD.split(' ');

    return firstMonth === lastMonth ? firstMonth : `${firstMonth}/${lastMonth}`;
  };

  const renderCalendarDay = (
    day: number,
    month: number,
    year: number,
    isCurrentMonth: boolean = true
  ) => {
    const englishDate = getEnglishDateForNepali(year, month, day);
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

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          height: '100vh',
          bgcolor: 'background.default',
          pt: '64px',
          pb: { xs: '56px', md: 0 },
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header darkMode={darkMode} onThemeToggle={handleThemeToggle} />

        <Box
          sx={{
            width: '100%',
            mx: 'auto',
            p: { xs: 1, sm: 2 },
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexDirection: { xs: 'column', md: 'row' },
              overflow: 'hidden',
              height: '100%',
              minHeight: 0,
            }}
          >
            {/* Calendar View */}
            <Paper
              elevation={3}
              sx={{
                p: { xs: 1, sm: 2 },
                borderRadius: 2,
                bgcolor: 'background.paper',
                flex: 1,
                flexDirection: 'column',
                overflow: 'hidden',
                display: {
                  xs: mobileView === 'calendar' ? 'flex' : 'none',
                  md: 'flex',
                },
                position: 'relative',
                height: '100%',
              }}
            >
              {/* Controls section */}
              <Box
                sx={{
                  mb: { xs: 1, sm: 2 },
                  flexShrink: 0,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 1, sm: 2 },
                    alignItems: { xs: 'stretch', sm: 'center' },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                      flexWrap: 'nowrap',
                      minWidth: { xs: '100%', sm: 'auto' },
                    }}
                  >
                    <FormControl
                      size='small'
                      sx={{ width: { xs: '50%', sm: 120 } }}
                    >
                      <InputLabel>{t('calendar.selectYear')}</InputLabel>
                      <Select
                        value={year}
                        label={t('calendar.selectYear')}
                        onChange={(e) => setYear(Number(e.target.value))}
                      >
                        {years.map((y) => (
                          <MenuItem key={y} value={y}>
                            {y}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl
                      size='small'
                      sx={{ width: { xs: '50%', sm: 120 } }}
                    >
                      <InputLabel>{t('calendar.selectMonth')}</InputLabel>
                      <Select
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
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      flex: 1,
                      justifyContent: 'center',
                      bgcolor: 'background.paper',
                      p: { xs: 1, sm: 1.5 },
                      borderRadius: 1,
                      boxShadow: 1,
                    }}
                  >
                    <CalendarTodayIcon color='primary' fontSize='small' />
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'center', sm: 'baseline' },
                        gap: { xs: 0.5, sm: 2 },
                        width: '100%',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography
                        variant='body2'
                        color='text.primary'
                        sx={{
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          fontWeight: 'medium',
                        }}
                      >
                        {convertToNepaliNumber(getCurrentNepaliDate().day)}{' '}
                        {getNepaliMonthName(
                          getCurrentNepaliDate().month,
                          i18n.language
                        )}{' '}
                        {convertToNepaliNumber(getCurrentNepaliDate().year)}
                      </Typography>
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                        }}
                      >
                        <Box
                          component='span'
                          sx={{
                            width: '4px',
                            height: '4px',
                            bgcolor: 'text.secondary',
                            borderRadius: '50%',
                            display: { xs: 'none', sm: 'block' },
                          }}
                        />
                        {getEnglishDateForNepali(
                          getCurrentNepaliDate().year,
                          getCurrentNepaliDate().month,
                          getCurrentNepaliDate().day
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Calendar Grid */}
              <Box
                sx={{
                  'display': 'grid',
                  'gridTemplateColumns': 'repeat(7, 1fr)',
                  'gap': { xs: 0.5, sm: 1, md: 1.5 },
                  'gridTemplateRows': 'auto repeat(6, 1fr)',
                  'flex': 1,
                  'overflow': 'auto',
                  'minHeight': 0,
                  'px': { xs: 0.5, sm: 1 },
                  'pb': { xs: 0.5, sm: 1 },
                  '& > *': {
                    minHeight: 0,
                  },
                }}
              >
                {/* Weekday headers */}
                {Array.from({ length: 7 }, (_, i) => (
                  <Paper
                    key={`weekday-${i}`}
                    elevation={1}
                    sx={{
                      p: { xs: 0.25, sm: 1, md: 1.5 },
                      textAlign: 'center',
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      fontWeight: 'bold',
                      borderRadius: 1,
                      fontSize: {
                        xs: '0.7rem',
                        sm: '0.8rem',
                        md: '0.875rem',
                      },
                      position: 'sticky',
                      top: 0,
                      zIndex: 1,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      height: { xs: '24px', sm: '32px', md: '36px' },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {getWeekDayName(i, i18n.language)}
                  </Paper>
                ))}

                {/* Calendar days */}
                {prevMonthDays.map(({ day, month, year }) =>
                  renderCalendarDay(day, month, year, false)
                )}
                {calendarDays.map((day) => renderCalendarDay(day, month, year))}
                {nextMonthDays.map(({ day, month, year }) =>
                  renderCalendarDay(day, month, year, false)
                )}
              </Box>
            </Paper>

            {/* Holiday List */}
            <Box
              sx={{
                width: { xs: '100%', md: '300px' },
                flexShrink: 0,
                display: {
                  xs: mobileView === 'holidays' ? 'block' : 'none',
                  md: 'block',
                },
                overflow: 'hidden',
                height: '100%',
              }}
            >
              <HolidayList year={year} currentMonth={month} />
            </Box>
          </Box>
        </Box>

        {/* Bottom Navigation for Mobile/Tablet */}
        {isMobileOrTablet && (
          <Paper
            sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1100,
              borderRadius: 0,
              borderTop: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
            elevation={3}
          >
            <BottomNavigation
              value={mobileView}
              onChange={(_, newValue) => setMobileView(newValue)}
              showLabels
              sx={{
                'height': 56,
                '& .MuiBottomNavigationAction-root': {
                  py: 1,
                },
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
    </ThemeProvider>
  );
};

export default NepaliCalendar;
