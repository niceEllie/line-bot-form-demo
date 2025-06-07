require("dotenv").config();
const { Client, middleware } = require("@line/bot-sdk");
const { appendRow, updateStatusByBrand } = require("./sheet");
const { parseCommand } = require("./parser");

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const client = new Client(config);

exports.handler = [
  middleware(config),
  async (req, res) => {
    const events = req.body.events;
    for (const event of events) {
      if (event.type === "message" && event.message.type === "text") {
        const text = event.message.text.trim();
        const { command, data } = parseCommand(text);

        if (command === "#註冊完成") {
          await appendRow([
            new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" }),
            data.assistant,
            data.region,
            data.brand,
            data.mid,
            "待上線", "", "", "", "", ""
          ]);
          try {
            await client.replyMessage(event.replyToken, {
              type: "text",
              text: `已登記：${data.brand}`,
            });
          } catch (error) {
            console.error(
              "⚠️ 回覆訊息失敗：",
              error?.originalError?.response?.data || error?.response?.data || error
            );
          }
        } else if (command === "#上線完成") {
          await updateStatusByBrand(data.brand, "工作內容（處理狀態）", "上線完成");
          await updateStatusByBrand(
            data.brand,
            "完成日期＆時間",
            new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })
          );
          try {
            await client.replyMessage(event.replyToken, {
              type: "text",
              text: `已更新：${data.brand} 狀態為上線完成`,
            });
          } catch (error) {
            console.error(
              "⚠️ 回覆訊息失敗：",
              error?.originalError?.response?.data || error?.response?.data || error
            );
          }
        }
      }
    }
    res.sendStatus(200);
  },
];
