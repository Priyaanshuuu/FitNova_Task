import { Schema, model, models } from "mongoose";

export enum AppealStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

const appealSchema = new Schema(
  {
    callId: {
      type: Schema.Types.ObjectId,
      ref: "Call",
      required: true,
      index: true,
    },

    advisorId: {
      type: Schema.Types.ObjectId,
      ref: "Advisor",
      required: true,
      index: true,
    },

    issue: {
      type: String,
      required: true,
      trim: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: Object.values(AppealStatus),
      default: AppealStatus.PENDING,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Appeal =
  models.Appeal || model("Appeal", appealSchema);