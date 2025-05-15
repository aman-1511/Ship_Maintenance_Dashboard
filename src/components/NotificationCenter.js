import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Badge,

  Button,
  useTheme,
  useMediaQuery,
  
  Slide,
  Tooltip,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import {
  markAsRead,
  removeNotification,
  clearAllNotifications,
} from '../store/slices/notificationsSlice';

const NotificationCenter = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.items);
  const user = useSelector((state) => state.auth.user);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  
  const roleFilteredNotifications = notifications.filter(n => {
    if (!user) return false;
    if (n.userIds && n.userIds.includes(user.id)) return true;
    if (n.roles && n.roles.includes(user.role)) return true;
    if (!n.roles && !n.userIds) return true;
    return false;
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id));
  };

  const handleRemove = (id) => {
    dispatch(removeNotification(id));
  };

  const handleClearAll = () => {
    dispatch(clearAllNotifications());
  };

  const unreadCount = roleFilteredNotifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'error':
        return <WarningIcon color="error" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const groupedNotifications = roleFilteredNotifications.reduce((acc, notification) => {
    const date = new Date(notification.timestamp).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(notification);
    return acc;
  }, {});

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton 
          color="inherit" 
          onClick={handleOpen}
          sx={{
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Drawer
        anchor={isMobile ? 'bottom' : 'right'}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: isMobile ? '100%' : 360,
            height: isMobile ? '80vh' : '100%',
            borderTopLeftRadius: isMobile ? 16 : 0,
            borderTopRightRadius: isMobile ? 16 : 0,
          },
        }}
      >
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider',
        }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Notifications
            {unreadCount > 0 && (
              <Typography 
                component="span" 
                sx={{ 
                  ml: 1, 
                  color: 'text.secondary',
                  fontSize: '0.9rem',
                }}
              >
                ({unreadCount} unread)
              </Typography>
            )}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {roleFilteredNotifications.length > 0 ? (
          <List sx={{ 
            flexGrow: 1, 
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: theme.palette.divider,
              borderRadius: '4px',
            },
          }}>
            {Object.entries(groupedNotifications).map(([date, dateNotifications]) => (
              <Box key={date}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    px: 2,
                    py: 1,
                    color: 'text.secondary',
                    bgcolor: 'background.default',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  {date}
                </Typography>
                {dateNotifications.map((notification) => (
                  <Slide
                    key={notification.id}
                    direction="left"
                    in={true}
                    mountOnEnter
                    unmountOnExit
                  >
                    <ListItem
                      sx={{
                        bgcolor: notification.read ? 'inherit' : 'action.hover',
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          bgcolor: 'action.selected',
                        },
                      }}
                      secondaryAction={
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {!notification.read && (
                            <Tooltip title="Mark as read">
                              <IconButton
                                edge="end"
                                size="small"
                                onClick={() => handleMarkAsRead(notification.id)}
                              >
                                <CheckCircleIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Remove">
                            <IconButton
                              edge="end"
                              size="small"
                              onClick={() => handleRemove(notification.id)}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      }
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        {getNotificationIcon(notification.type)}
                        <ListItemText
                          primary={
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: notification.read ? 'normal' : 'bold',
                              }}
                            >
                              {notification.title}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.primary"
                                sx={{ display: 'block', mb: 0.5 }}
                              >
                                {notification.message}
                              </Typography>
                              <Typography
                                component="span"
                                variant="caption"
                                color="text.secondary"
                              >
                                {new Date(notification.timestamp).toLocaleTimeString()}
                              </Typography>
                            </>
                          }
                        />
                      </Box>
                    </ListItem>
                  </Slide>
                ))}
              </Box>
            ))}
          </List>
        ) : (
          <Box sx={{ 
            p: 4, 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}>
            <NotificationsIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
            <Typography color="text.secondary">
              No notifications
            </Typography>
          </Box>
        )}

        {roleFilteredNotifications.length > 0 && (
          <Box sx={{ 
            p: 2, 
            borderTop: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleClearAll}
              size="small"
            >
              Clear All Notifications
            </Button>
          </Box>
        )}
      </Drawer>
    </>
  );
};

export default NotificationCenter; 