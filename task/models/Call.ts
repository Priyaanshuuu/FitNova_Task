import { Schema, model, models } from "mongoose";
import {
  ProcessingStatus,
  type ICall,
} from "@/types/call";
import { Severity } from "@/types/analysis";

const transcriptSegmentSchema = new Schema(
  {
    speaker: {
      type: String,
      required: true,
      enum: ["Advisor", "Customer", "Unknown"],
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    startTime: {
      type: Number,
      required: true,
    },

    endTime: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const scoreBreakdownSchema = new Schema(
  {
    needsDiscovery: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    productKnowledge: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    objectionHandling: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    compliance: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    trialBooking: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
  },
  {
    _id: false,
  }
);

const issueFlagSchema = new Schema(
  {
    issue: {
      type: String,
      required: true,
      trim: true,
    },

    severity: {
      type: String,
      enum: Object.values(Severity),
      required: true,
    },

    timestamp: {
      type: String,
      required: true,
    },

    quote: {
      type: String,
      required: true,
      trim: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const analysisSchema = new Schema(
  {
    summary: {
      type: String,
      required: true,
      trim: true,
    },

    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    scores: {
      type: scoreBreakdownSchema,
      required: true,
    },

    flags: {
      type: [issueFlagSchema],
      default: [],
    },

    coachingSuggestions: {
      type: [String],
      default: [],
    },
  },
  {
    _id: false,
  }
);

const callSchema = new Schema<ICall>(
  {
    advisorId: {
      type: Schema.Types.ObjectId,
      ref: "Advisor",
      required: true,
      index: true,
    },

    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: true,
      index: true,
    },

    audioUrl: {
      type: String,
      required: true,
    },

    duration: {
      type: Number,
      default: 0,
    },

    processingStatus: {
      type: String,
      enum: Object.values(ProcessingStatus),
      default: ProcessingStatus.UPLOADED,
      index: true,
    },

    transcript: {
      type: String,
      default: "",
    },

    diarizedTranscript: {
      type: [transcriptSegmentSchema],
      default: [],
    },

    analysis: {
      type: analysisSchema,
    },
  },
  {
    timestamps: true,
  }
);

callSchema.index({
  advisorId: 1,
  createdAt: -1,
});

callSchema.index({
  teamId: 1,
  createdAt: -1,
});

export const Call =
  models.Call || model<ICall>("Call", callSchema);