import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    id: v.string(),
    token: v.number(),
    customerId: v.string(),
    plan: v.number(),
  }),

  workspace: defineTable({
    messages: v.any(),
    fileData: v.optional(v.any()),
    user: v.id("users"),
  }),
});
