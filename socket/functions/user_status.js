const SOCKET_EVENT = require("../event.types");

const user_status = {};

const user_status_functions = {
  update_user_status: (userId, io, active = 1) => {
    if (user_status?.[userId] === undefined) user_status[userId] = active;
    else {
      user_status[userId] = user_status[userId] + (active === 0 ? -1 : 1);
    }

    io.emit(SOCKET_EVENT.STATUS_UPDATE(userId), user_status[userId]);
  },
  get_status: (userId) => (user_status?.[userId] ? user_status[userId] : 0),
};

module.exports = user_status_functions;
