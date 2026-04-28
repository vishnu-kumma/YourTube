import { WatchHistory } from "../models/watchHistory.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const BREAK_THRESHOLD = 1800; // 30 min
const COOLDOWN = 900; // 15 min

const healthcheck = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    let triggerBreak = false;
    let message = null;

    if (userId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const stats = await WatchHistory.aggregate([
            {
                $match: {
                    userId,
                    lastWatchedAt: { $gte: today }
                }
            },
            {
                $group: {
                    _id: null,
                    totalWatchTime: { $sum: "$watchDurationSeconds" },
                    lastBreak: { $max: "$lastBreakNotifiedAt" }
                }
            }
        ]);

        const watchTime = stats[0]?.totalWatchTime || 0;
        const lastBreak = stats[0]?.lastBreak;

        const now = new Date();

        if (watchTime > BREAK_THRESHOLD) {
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