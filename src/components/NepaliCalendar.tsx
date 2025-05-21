import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  useMediaQuery,
  Typography,
} from '@mui/material';
import {
  generateCalendarDays,
  getCurrentNepaliDate,
  nepaliCalendarData,
  getNepaliMonthDays,
  getStartDayOfMonth,
} from '../utils/nepaliCalendar';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventIcon from '@mui/icons-material/Event';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import Header from './Header';
import HolidayList from './HolidayList';
import CalendarGrid from './CalendarGrid';
import MonthYearSelector from './MonthYearSelector';

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
  const currentDate = getCurrentNepaliDate();

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

  const handleDateSelect = (year: number, month: number, day: number) => {
    setYear(year);
    setMonth(month);
    setSelectedDay(day);
    if (isMobileOrTablet) {
      setMobileView('calendar');
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
      <Header darkMode={isDarkMode} onThemeToggle={onThemeChange} />

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
            width: '100%',
          }}
        >
          <Box
            sx={{
              display:
                !isMobileOrTablet || mobileView === 'calendar'
                  ? 'flex'
                  : 'none',
              flex: { md: '1 1 auto' },
              flexDirection: 'column',
              height: '100%',
              minHeight: 0,
              maxWidth: { md: 'calc(100% - 420px)' },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 2, sm: 2 },
                mb: { xs: 1, sm: 2 },
                flexShrink: 0,
              }}
            >
              <MonthYearSelector
                year={year}
                month={month}
                years={years}
                months={months}
                currentDate={currentDate}
                onYearChange={setYear}
                onMonthChange={setMonth}
                onNext={handleNextMonth}
                onPrev={handlePrevMonth}
                language={i18n.language}
                t={t}
              />
            </Box>

            <CalendarGrid
              year={year}
              month={month}
              selectedDay={selectedDay}
              prevMonthDays={prevMonthDays}
              currentMonthDays={calendarDays}
              nextMonthDays={nextMonthDays}
              onDaySelect={setSelectedDay}
              currentDate={currentDate}
              language={i18n.language}
            />
          </Box>

          <Box
            sx={{
              display:
                !isMobileOrTablet || mobileView === 'holidays'
                  ? 'flex'
                  : 'none',
              flex: { md: '0 0 350px', lg: '0 0 400px', xl: '0 0 450px' },
              height: '100%',
              minHeight: 0,
              maxWidth: { md: '350px', lg: '400px', xl: '450px' },
              width: '100%',
            }}
          >
            <HolidayList
              year={year}
              currentMonth={month}
              onDateSelect={handleDateSelect}
            />
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
              display: { xs: 'flex', md: 'none' },
              borderTop: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
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

      <Box
        component='footer'
        sx={{
          py: 2,
          px: 3,
          mt: 'auto',
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
          textAlign: 'center',
          display: { xs: isMobileOrTablet ? 'none' : 'block', md: 'block' },
        }}
      >
        <Typography
          variant='body2'
          color='text.secondary'
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
            fontWeight: 500,
          }}
        >
          © {new Date().getFullYear()} Vibe Coding with Cursor by Azens
        </Typography>
      </Box>
    </Box>
  );
};

export default NepaliCalendar;
