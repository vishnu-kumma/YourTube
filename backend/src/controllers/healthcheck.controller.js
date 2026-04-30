import { WatchHistory } from "../models/WatchHistory.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const BREAK_THRESHOLD = 30; // 30 min
const COOLDOWN = 15; // 15 min

const healthcheck = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    let triggerBreak = false;
    let message = null;

    if (userId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const stats = await WatchHistory.aggregate([
  { $match: { userId } },
  { $sort: { lastWatchedAt: -1 } },
  { $limit: 10 }
]);

let sessionTime = 0;
let lastBreak = null;

for (let i = 0; i < stats.length; i++) {
  if (i === 0) {
    sessionTime += stats[i].watchDurationSeconds;
    lastBreak = stats[i].lastBreakNotifiedAt;
  } else {
    const diff =
      (new Date(stats[i - 1].lastWatchedAt) -
        new Date(stats[i].lastWatchedAt)) /
      1000;

    // if gap > 2 min → break session
    if (diff > 120) break;

    sessionTime += stats[i].watchDurationSeconds;
  }
}

        const now = new Date();

        if (sessionTime > BREAK_THRESHOLD) {
            const canNotify =
                !lastBreak ||
                (now - new Date(lastBreak)) / 1000 > COOLDOWN;

            if (canNotify) {
                triggerBreak = true;
                message = "You've been watching for a while. Take a break!";

                // update cooldown timestamp
                await WatchHistory.updateMany(
                    { userId },
                    { $set: { lastBreakNotifiedAt: now } }
                );
            }
        }
    }

    return res.status(200).json(
        new ApiResponse(200, {
            status: "OK",
            triggerBreak,
            message
        })
    );
});

export { healthcheck };