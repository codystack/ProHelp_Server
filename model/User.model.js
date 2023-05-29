import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema(
  {
    bio: {
      fullname: {
        type: String,
        default: "",
        required: false,
      },
      phone: {
        type: String,
        default: "",
        required: false,
      },
      gender: {
        type: String,
        default: "Male",
        required: false,
      },
      dob: {
        type: String,
        default: "",
        required: false,
      },
      nin: {
        type: String,
        required: false,
        default: "",
      },
      about: {
        type: String,
        default: "",
      },
      image: {
        type: String,
        default: "",
      },
    },
    address: {
      street: {
        type: String,
        default: "",
        required: false,
      },
      city: {
        type: String,
        default: "",
        required: false,
      },
      state: {
        type: String,
        default: "",
        required: false,
      },
      country: {
        type: String,
        default: "",
        required: false,
      },
      zipCode: {
        type: String,
        default: "",
        required: false,
      },
    },
    profession: {
      type: String,
      default: "",
      required: false,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
    },
    email: {
      type: String,
      required: [true, "Please provide a unique email"],
      unique: true,
    },
    authType: {
      type: String,
      required: [true, "Please provide a authentication type"],
      default: "regular",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    guarantor: {
      name: {
        type: String,
        required: false,
      },
      address: {
        type: String,
        required: false,
      },
      email: {
        type: String,
        required: false,
      },
      phone: {
        type: String,
        required: false,
      },
      relationship: {
        type: String,
        required: false,
      },
    },
    hasProfile: {
      type: Boolean,
      default: false,
    },
    documents: [
      {
        title: {
          type: String,
          required: false,
        },
        url: {
          type: String,
          required: false,
        },
        extension: {
          type: String,
          required: false,
        },
      },
    ],
    experience: [
      {
        company: {
          type: String,
          required: false,
        },
        companyLogo: {
          type: String,
          required: false,
        },
        role: {
          type: String,
          required: false,
        },
        region: {
          type: String,
          required: false,
        },
        country: {
          type: String,
          required: false,
        },
        workType: {
          type: String,
          required: false,
        },
        startDate: {
          type: String,
          required: false,
        },
        endate: {
          type: String,
          required: false,
        },
        stillHere: {
          type: Boolean,
          default: false,
        },
      },
    ],
    education: [
      {
        school: {
          type: String,
          required: false,
        },
        degree: {
          type: String,
          required: false,
        },
        course: {
          type: String,
          required: false,
        },
        schoolLogo: {
          type: String,
          required: false,
        },
        endate: {
          type: String,
          required: false,
        },
        stillSchooling: {
          type: Boolean,
          default: false,
        },
      },
    ],
    portfolio: [
      {
        name: {
          type: String,
          required: false,
        },
        description: {
          type: String,
          required: false,
        },
        url: {
          type: String,
          required: false,
        },
        assets: [
          {
            type: String,
            required: false,
          },
        ],
      },
    ],
    connections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    savedPros: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    hiredPros: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    accountType: { type: String, default: "freelancer" },
    reviews: [
      {
        reviewId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Review",
        },
        reviewer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
        },
      },
    ],
    rating: {
      type: Number,
    },
    skills: [
      {
        name: {
          type: String,
          required: false,
        },
        proficiency: {
          type: String,
          required: false,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
