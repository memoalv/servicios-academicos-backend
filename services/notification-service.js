"use-strict";

const connections = {};

/**
 * Register user in connections. This method must be executed as first in whole registration process.
 * @param userId id of user.
 * @param connectionId id of connection.
 */
const registerUser = (userId, connectionId) => {
  if (connections[userId] === undefined) {
    connections[userId] = {};
  }

  connections[userId][connectionId] = null;
  console.log(
    "Registered connection " +
      connectionId.substring(0, 4) +
      "*** for user " +
      userId
  );

};
/**
 * Register socket to communication. Must be executed after registerUser.
 * Modify socket object and set field userId and connectionId.
 * @param userId id of user.
 * @param connectionId id of connection.
 * @param socket socket.
 * @returns {boolean} if socket was registered or not, if false then you have to do everything again.
 */
const registerSocket = (userId, connectionId, socket) => {
  if (
    connections[userId] != null &&
    connections[userId][connectionId] == null
  ) {
    socket.userId = userId;
    socket.connectionId = connectionId;
    connections[userId][connectionId] = socket;
    console.log(
      "Registered socket for connection " +
        connectionId.substring(0, 4) +
        "*** and  user " +
        userId
    );
    return true;
  } else {
    console.log(
      "Not found empty conn for connection " +
        connectionId.substring(0, 4) +
        "*** and  user " +
        userId
    );
    return false;
  }
};
/**
 * Remove connection.
 * @param socket socket to remove.
 */
const removeConnection = (socket) => {
  var userId = socket.userId;
  var connectionId = socket.connectionId;
  if (
    userId &&
    connectionId &&
    connections[userId] &&
    connections[userId][connectionId]
  ) {
    console.log(
      "Removed socket for user " +
        userId +
        " and connection: " +
        connectionId.substring(0, 4) +
        "***"
    );
    delete connections[socket.connectionId];
  }
};
/**
 * Send notification to user.
 * @param userId id of user.
 * @param message message.
 */
const pushMessage = (userId, message) => {
  var userConnections = connections[userId];
  if (userConnections) {
    for (var connectionId in userConnections) {
      if (userConnections.hasOwnProperty(connectionId)) {
        var socket = userConnections[connectionId];
        if (socket != null) {
          socket.emit("message", message);
        }
      }
    }
  }
};

module.exports = {
  connections,
  registerUser,
  registerSocket,
  removeConnection,
  pushMessage
};
