import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    id: v.string(),
  },
  handler: async (ctx, args) => {
    // If user already exists, return the user
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();

    // If user does not exist, create the user
    if (user.length === 0) {
      const newUser = await ctx.db.insert("users", {
        name: args.name,
        email: args.email,
        picture: args.picture,
        id: args.id,
        token: 50000,
      });

      return {
        _id: newUser,
        name: args.name,
        email: args.email,
        picture: args.picture,
        id: args.id,
      };
    }

    return user[0];
  },
});

export const getUser = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();

    return user[0];
  },
});

export const updateToken = mutation({
  args: {
    token: v.number(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const res = await ctx.db.patch(args.userId, {
      token: args.token,
    });

    return res;
  },
});
