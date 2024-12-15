import { Bot } from "grammy";
import { MyContext } from "types";
import "jsr:@std/dotenv/load";

export const loyalityBot = new Bot<MyContext>(
  Deno.env.get("CLIENT_BOT_KEY")!,
  );