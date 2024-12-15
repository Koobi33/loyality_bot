import { Bot } from "grammy";
import { createEmployeeApiRequest } from "api";
import "jsr:@std/dotenv/load";


const bot = new Bot(Deno.env.get("EMPLOYEE_BOT_KEY")!);

bot.command("start", async (ctx) => {
  const inviteId = ctx.match;
  if (inviteId) {
    console.log(ctx.from);
    try {
      await createEmployeeApiRequest({
        inviteId,
        employeeTgId: ctx.from!.id!,
        visibleEmployeeName: ctx.from?.username!
      });
      await ctx.reply("Добро пожаловать, пупсик!");
    } catch {
      await ctx.reply("НАХУЙ ПОШЕЛ!");
    }
  }
});

bot.start();
