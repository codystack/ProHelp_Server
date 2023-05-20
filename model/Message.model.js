import mongoose from "mongoose";

export const MessageSchema = mongoose.Schema(
  {
    sender: {
      name: {
        type: String,
        required: true,
      },
      photo: {
        type: String,
      },
      id: {
        type: String,
        required: true,
      },
    },
    receiver: {
      name: {
        type: String,
        required: true,
      },
      photo: {
        type: String,
      },
      id: {
        type: String,
        required: true,
      },
    },
    message: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    chatId: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", MessageSchema);
