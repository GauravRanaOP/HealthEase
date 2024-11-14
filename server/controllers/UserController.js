import User from "../models/User.js"


// fetches user details by userId
export const getUserDetails = async (req, res) => {
    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).json({ message: "Server error: UserID is required."});
    }

    try {
        // retrieves the user from the database
        const user = await User.findById(userId).select("firstName lastName email");

        if (user) {
            res.status(200).json({ user });
        } else {
            res.status(404).json({ message: "Server error: User not found."});
        }
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({
            message: "Server error: Error fetching user details",
            error: error.message,
        });
    }
};