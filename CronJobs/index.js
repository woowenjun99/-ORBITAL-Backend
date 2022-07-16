const app = require("express")();
const { checkNotification } = require("./scheduler/checkNotifications");

checkNotification;

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hi" });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("CRON JOB SET UP");
});
