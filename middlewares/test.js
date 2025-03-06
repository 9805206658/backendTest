const db = require("../configs/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const jwtSecret = process.env.JWT_SECRET;
// here login process are done 
exports.loginUser = async (req, res) => {
    const { contactNumber, password } = req.body;
    try {
         let sql = "SELECT * from userInfo where contactNumber=?";
         db.query(sql, [contactNumber], async (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "error during the time fetching the data", err });
            }
            if (results.length === 0) {
                // here sending the error when data is not found
                return res.status("401").json({ message: "the invalid credential" });
            }

            const user = results[0];
            console.log(user.password);
            console.log(password);
            // check the password
            // 
            const isMatch = await bcrypt.compare(password, user.password);
            console.log(isMatch);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const payload = {
                id: user.id,
                userName: user.userName,
                contactNumber: user.contactNumber
            }
            //  here generating the token
            const token = jwt.sign(payload, jwtSecret, { expiresIn: "1d" });
            // here sending reponse with the token 
            return res.status(200).json(
                {
                    message: "login succesfull",
                    token,
                    user: {
                        id: user.userId,
                        userName: user.userName,
                        contactNumber: user.contactNumber
                    },
                }
            )

        })
    }
    catch (err) {
        console.log("the error during the login time\n" + err);
        return res.status(500).json({ message: "the error are arise during the time of the login", err })
    }
}

exports.authenticateToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "access denied no token is provided" });
    }
    try {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Invalid token" });
            }
            else {
                if (req.route.path === "/tokenChecker") {
                    return res.status(200).json({ message: "token is valid" });
                }
            }
            req.user = user;
            next();
        });
    }
    catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
}
//here valid the token 

