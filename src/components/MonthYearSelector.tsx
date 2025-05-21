import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import {
  getNepaliMonthName,
  getNepaliMonthDays,
} from '../utils/nepaliCalendar';
import { convertToNepaliNumber } from '../utils/numberConverter';
import { getEnglishADDate } from '../utils/dateConversion';
import { useTranslation } from 'react-i18next';

interface MonthYearSelectorProps {
  year: number;
  month: number;
  years: number[];
  months: number[];
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  onNextMonth: () => void;
  onPrevMonth: () => void;
  onToday: () => void;
  language: string;
  currentDate: {
    year: number;
    month: number;
    day: number;
  };
}

const MonthYearSelector: React.FC<MonthYearSelectorProps> = ({
  year,
  month,
  years,
  months,
  onYearChange,
  onMonthChange,
  onNextMonth,
  onPrevMonth,
  language,
  currentDate,
}) => {
  const { t } = useTranslation();

  // Get English month names for current and next month
  const getEnglishMonthDisplay = () => {
    const firstDayOfMonth = getEnglishADDate(year, month, 1);
    const lastDayOfMonth = getEnglishADDate(
      year,
      month,
      getNepaliMonthDays(year, month)
    );

    const firstMonthName = firstDayOfMonth.toLocaleString('en-US', {
      month: 'long',
    });
    const lastMonthName = lastDayOfMonth.toLocaleString('en-US', {
      month: 'long',
    });
    const yearDisplay = lastDayOfMonth.getFullYear();

    return firstMonthName === lastMonthName
      ? `${firstMonthName} ${yearDisplay}`
      : `${firstMonthName}/${lastMonthName} ${yearDisplay}`;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 1, sm: 2 },
        mb: { xs: 1, sm: 2 },
        flexShrink: 0,
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: { xs: 1, sm: 2 },
          flex: { xs: '1 1 auto', sm: '0 1 auto' },
          maxWidth: '100%',
          width: { xs: '100%', sm: 'auto' },
          justifyContent: { xs: 'space-between', sm: 'flex-start' },
        }}
      >
        <FormControl
          size='small'
          variant='standard'
          sx={{
            minWidth: { xs: '45%', sm: '140px' },
            maxWidth: { xs: '45%', sm: '160px' },
          }}
        >
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
            onChange={(e) => onYearChange(Number(e.target.value))}
            sx={{
              'minHeight': '40px',
              '& .MuiInput-input': {
                pt: 2,
                pb: 1,
                pl: 1,
                pr: 3,
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

        <FormControl
          size='small'
          variant='standard'
          sx={{
            minWidth: { xs: '45%', sm: '160px' },
            maxWidth: { xs: '45%', sm: '200px' },
          }}
        >
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
            onChange={(e) => onMonthChange(Number(e.target.value))}
            sx={{
              'minHeight': '40px',
              '& .MuiInput-input': {
                pt: 2,
                pb: 1,
                pl: 1,
                pr: 3,
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
                {getNepaliMonthName(m, language)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Typography
        variant='h6'
        sx={{
          color: 'text.secondary',
          display: { xs: 'none', sm: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          fontWeight: 500,
          flex: 1,
          textAlign: 'center',
        }}
      >
        <CalendarTodayIcon fontSize='small' />
        {`${convertToNepaliNumber(currentDate.day)} ${getNepaliMonthName(
          currentDate.month,
          language
        )} ${convertToNepaliNumber(currentDate.year)}`}
      </Typography>

      <Typography
        variant='h6'
        sx={{
          color: 'text.secondary',
          display: { xs: 'flex', sm: 'none' },
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          fontWeight: 500,
          width: '100%',
          mb: 1,
          order: -1,
        }}
      >
        <CalendarTodayIcon fontSize='small' />
        {`${convertToNepaliNumber(currentDate.day)} ${getNepaliMonthName(
          currentDate.month,
          language
        )} ${convertToNepaliNumber(currentDate.year)}`}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: 1,
          alignItems: 'center',
          justifyContent: { xs: 'space-between', sm: 'flex-end' },
          flex: { xs: '0 0 auto', sm: '0 1 auto' },
          mt: { xs: 1, sm: 0 },
          width: { xs: '100%', sm: 'auto' },
          borderTop: { xs: '1px solid', sm: 'none' },
          borderColor: 'divider',
          pt: { xs: 1, sm: 0 },
        }}
      >
        <Box
          sx={{
            display: { xs: 'flex', sm: 'none' },
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Typography
            variant='caption'
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
            }}
          >
            {`${convertToNepaliNumber(currentDate.day)} ${getNepaliMonthName(
              currentDate.month,
              language
            )}`}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <IconButton
            onClick={onPrevMonth}
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

          <Typography
            variant='caption'
            sx={{
              color: 'text.secondary',
              display: { xs: 'block', sm: 'none' },
              fontWeight: 500,
              minWidth: 100,
              textAlign: 'center',
            }}
          >
            {getEnglishMonthDisplay()}
          </Typography>

          <IconButton
            onClick={onNextMonth}
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
    </Box>
  );
};

export default MonthYearSelector;
