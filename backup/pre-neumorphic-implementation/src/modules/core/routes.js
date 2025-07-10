const express = require('express');
const router = express.Router();
const dashboardController = require('./controllers/dashboard.controller');
const usersController = require('./controllers/users.controller');
const eventsController = require('./controllers/events.controller');
const notificationsController = require('./controllers/notifications.controller');
const authMiddleware = require('../../shared/middleware/auth.middleware');

// Middleware de autenticação para todas as rotas do core
router.use(authMiddleware.authenticate);

// Rotas do Dashboard
router.get('/dashboard', dashboardController.getDashboard);
router.get('/dashboard/stats', dashboardController.getStats);
router.get('/dashboard/recent', dashboardController.getRecentActivity);

// Rotas de Usuários
router.get('/users', usersController.getUsers);
router.get('/users/:id', usersController.getUserById);
router.post('/users', usersController.createUser);
router.put('/users/:id', usersController.updateUser);
router.delete('/users/:id', usersController.deleteUser);
router.put('/users/:id/password', usersController.changePassword);
router.put('/users/:id/permissions', usersController.updatePermissions);
router.get('/users/:id/activity', usersController.getUserActivity);

// Rotas de Eventos
router.get('/events', eventsController.getEvents);
router.get('/events/:id', eventsController.getEventById);
router.post('/events', eventsController.createEvent);
router.put('/events/:id', eventsController.updateEvent);
router.delete('/events/:id', eventsController.deleteEvent);
router.get('/events/calendar/:year/:month', eventsController.getCalendarEvents);
router.post('/events/:id/remind', eventsController.setReminder);

// Rotas de Notificações
router.get('/notifications', notificationsController.getNotifications);
router.get('/notifications/unread', notificationsController.getUnreadNotifications);
router.post('/notifications', notificationsController.createNotification);
router.put('/notifications/:id/read', notificationsController.markAsRead);
router.delete('/notifications/:id', notificationsController.deleteNotification);
router.put('/notifications/read-all', notificationsController.markAllAsRead);

module.exports = router;
