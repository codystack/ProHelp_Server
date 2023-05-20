class WebSockets {
  

  constructor() {
    // Initialize the usersArr property as an empty array
    this.usersArr = [];
    // this.subscribeOtherUser = this.subscribeOtherUser.bind(this);
  }

  connection(client) {
    console.log("Connection established");
    client.on("connect", () => console.log("Socket us connected ahooo!!!"));
    // event fired when the chat room is disconnected
    client.on("disconnect", () => {
      this.usersArr = this.usersArr?.filter((user) => user.socketId !== client.id);
    });

    // add identity of user mapped to the socket id
    client.on("identity", (userId) => {
      console.log("USER IDENTITY >> ", userId);
      this.usersArr?.push({
        socketId: client.id,
        userId: userId,
      });
    });

    // subscribe person to chat & other user as well
    client.on("subscribe", (data) => {
      console.log("SUBSCRIBED DATA:: ", data);
      subscribeOtherUser(this.usersArr, data.room, data.otherUser);
      // client.join(data.room);
      // this.subscribeOtherUser(data.room, data.otherUser);
      client.join(data.room);
    });

    // mute a chat room
    client.on("unsubscribe", (room) => {
      client.leave(room);
    });

    client.emit("FromAPI", "The data from server to you!!!");
  }
  
}

function subscribeOtherUser(usersArr, room, otherUserId) {
  const userSockets = usersArr?.filter((user) => user.userId === otherUserId);
  userSockets?.forEach((userInfo) => {
    const socketConn = global.io.sockets.connected[userInfo.socketId];
    if (socketConn) {
      socketConn.join(room);
    }
  });
}


export default new WebSockets();
