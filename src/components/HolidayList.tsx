import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getAllHolidays, getNepaliMonthName } from '../utils/nepaliCalendar';

interface HolidayListProps {
  year: number;
  currentMonth: number;
  onDateSelect: (year: number, month: number, day: number) => void;
}

const HolidayList: React.FC<HolidayListProps> = ({
  year,
  currentMonth,
  onDateSelect,
}) => {
  const { i18n } = useTranslation();
  const holidays = getAllHolidays(year);

  const renderHolidayItem = (month: string, day: string, holiday: string) => {
    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);
    const isCurrentMonth = monthNum === currentMonth;

    return (
      <ListItem
        key={`${month}-${day}`}
        disablePadding
        sx={{
          borderRadius: 1,
          mb: 0.5,
          bgcolor: isCurrentMonth ? 'action.selected' : 'transparent',
        }}
      >
        <ListItemButton
          onClick={() => onDateSelect(year, monthNum, dayNum)}
          sx={{
            'borderRadius': 1,
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          <ListItemText
            primary={
              <Typography
                variant='body1'
                sx={{
                  fontWeight: isCurrentMonth ? 600 : 400,
                  color: 'text.primary',
                }}
              >
                {holiday}
              </Typography>
            }
            secondary={
              <Typography
                variant='body2'
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.875rem',
                }}
              >
                {`${getNepaliMonthName(monthNum, i18n.language)} ${dayNum}`}
              </Typography>
            }
          />
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Paper
      elevation={3}
      sx={{
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Typography
          variant='h6'
          sx={{
            fontWeight: 600,
            color: 'text.primary',
          }}
        >
          {i18n.language === 'ne' ? 'चाडपर्वहरू' : 'Holidays & Events'}
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          px: 2,
          py: 1,
        }}
      >
        <List sx={{ py: 0 }}>
          {Object.entries(holidays).map(
            ([month, monthHolidays], monthIndex) => (
              <React.Fragment key={month}>
                {monthIndex > 0 && (
                  <Divider
                    sx={{
                      my: 1,
                      opacity: 0.5,
                    }}
                  />
                )}
                {Object.entries(monthHolidays).map(([day, holiday]) =>
                  renderHolidayItem(month, day, holiday)
                )}
              </React.Fragment>
            )
          )}
        </List>
      </Box>
    </Paper>
  );
};

export default HolidayList;
