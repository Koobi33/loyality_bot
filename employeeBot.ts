import { Bot } from "grammy";
import { createEmployeeApiRequest } from "api";

const bot = new Bot("7398628652:AAFeSjCBCngJN7duCrhd99UmFpqWQMkV71s");

bot.command("start", async (ctx) => {
  const inviteId = ctx.match;
  if (inviteId) {
    console.log(inviteId);
    try {
      await createEmployeeApiRequest({
        inviteId,
        employeeTgId: ctx.from!.id!,
      });
      await ctx.reply("Добро пожаловать, пупсик!");
    } catch {
      await ctx.reply("НАХУЙ ПОШЕЛ!");
    }
  }
});

bot.start();