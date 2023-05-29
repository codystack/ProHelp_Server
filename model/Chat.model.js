import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export const ChatSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ""),
    },
    initiator: {
      name: String,
      id: String,
      photo: String,
      email: String
    },
    receiver: {
      name: String,
      id: String,
      photo: String,
      email: String
    },
    userIds: [],
    recentMessage: {
      type: String,
      default: "",
    },
    unreadMsgs: [],
    chatInitiator: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Chat", ChatSchema);
