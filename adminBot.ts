import { Bot } from "grammy";
import { MyContext } from "types";
import "jsr:@std/dotenv/load";

export const bot = new Bot<MyContext>(
  Deno.env.get("ADMIN_BOT_KEY")!,
);
