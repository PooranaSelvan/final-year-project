import bcrypt from "bcryptjs";

const users = [
    {
        name: "Poorana",
        email: "poorana@gmail.com",
        password: await bcrypt.hash("123456", 10),
        isAdmin: true,
        isSeller: true
    },
    {
        name: "Test User",
        email: "test1@gmail.com",
        password: await bcrypt.hash("123456", 10),
        isAdmin: true
    }
]

export default users;