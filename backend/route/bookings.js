const express = require('express');
const router = express.Router();
const bookingController = require('../controller/bookingsController');
router.get('/bookings', bookingController.bookingList);
router.get('/bookings/summary', bookingController.bookingSummary);
router.post('/bookings', bookingController.createBooking);
router.delete('/bookings/:id', bookingController.deleteBooking);

module.exports = router;