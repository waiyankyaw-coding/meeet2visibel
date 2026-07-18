const Booking = require('../models/booking');

const bookingController = {
  bookingList: async (req, res) => {
    try {
      const bookings = await Booking.find().populate('userId', 'name role');
      res.status(200).json(bookings);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch bookings' });
    }
  },

  createBooking: async (req, res) => {
    try {
      const { startTime, endTime } = req.body;

      if (!startTime || !endTime) {
        return res.status(400).json({ message: 'Start time and end time are required' });
      }

      const start = new Date(startTime);
      const end = new Date(endTime);

      if (start >= end) {
        return res.status(400).json({ message: 'Start time must be before end time' });
      }
      //past date not avaible to book
      if (start < new Date()) {
     return res.status(400).json({ message: 'Cannot book a time in the past' });
    }

     //duplicate meeting check
      const overlapping = await Booking.findOne({
        startTime: { $lt: end },
        endTime: { $gt: start },
      });

      if (overlapping) {
        return res.status(409).json({ message: 'This time slot overlaps with an existing booking' });
      }

      const newBooking = await Booking.create({
      userId: req.body.userId,
        startTime: start,
        endTime: end,
      });

      res.status(201).json(newBooking);
    } catch (err) {
      res.status(500).json({ message: 'Failed to create booking' });
    }
  },

  deleteBooking: async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.query;


    if (!userId || !role) {
      return res.status(400).json({ message: 'userId and role are required' });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const isOwnerOrAdmin = ['owner', 'admin'].includes(role);
    const isCreator = booking.userId.toString() === userId;

    if (!isOwnerOrAdmin && !isCreator) {
      return res.status(403).json({ message: 'Not allowed to delete this booking' });
    }

    await Booking.findByIdAndDelete(id);
    res.status(200).json({ message: 'Booking deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete booking' });
  }
},
  bookingSummary: async (req, res) => {
    try {
      const summary = await Booking.aggregate([
        {
          $group: {
            _id: '$userId',
            totalBookings: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: '$user' },
        {
          $project: {
            userId: '$_id',
            userName: '$user.name',
            totalBookings: 1,
            _id: 0,
          },
        },
      ]);

      res.status(200).json(summary);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch summary' });
    }
  },
};

module.exports = bookingController;