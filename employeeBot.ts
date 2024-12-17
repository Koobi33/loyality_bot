import { Bot } from "grammy";
import { createEmployeeApiRequest } from "api";
import "jsr:@std/dotenv/load";


const employeeBot = new Bot(Deno.env.get("EMPLOYEE_BOT_KEY")!);

employeeBot.command("start", async (ctx) => {
  const inviteId = ctx.match;
  if (inviteId) {
    try {
      await createEmployeeApiRequest({
        inviteId,
        employeeTgId: ctx.from!.id!,
        visibleEmployeeName: ctx.from?.username!
      });
      await ctx.reply("Добро пожаловать!");
    } catch {
      await ctx.reply("Доступ отклонен!");
    }
  }
});

employeeBot.start();
