import jwt from "jsonwebtoken";

const generateToken = async (res,userId) => {
    const token = jwt.sign({userId}, "secret", { expiresIn: '30d' });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 30 * 24 * 60 * 60 * 1000
    });
}

export default generateToken;