import { Bot } from "grammy";
import { MyContext } from "types";
import "jsr:@std/dotenv/load";

import type { ParseModeFlavor } from "https://deno.land/x/grammy_parse_mode@1.10.0/mod.ts";

export const adminBot = new Bot<ParseModeFlavor<MyContext>>(
  Deno.env.get("ADMIN_BOT_KEY")!,
);
