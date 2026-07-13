import { Schema, model, models } from "mongoose";

const organizationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Organization =
  models.Organization || model("Organization", organizationSchema);