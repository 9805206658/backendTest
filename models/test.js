// const db = require("../configs/db");
// const bcrypt = require("bcrypt");
// const errorHandler = require("../errorHanlder");
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const directoryPath=path.join(__dirname, 'uploads');

// // Get user information
// exports.getUsers = async (req, res) => {
//   try {
//   console.log();
//     const { userId } = req.params;
//     console.log(userId);
//     db.query("SELECT * FROM userInfo WHERE userId=?", [userId], (error, results) => {
//       if (error) {
//         console.error(error);
//         return res.status(500).json({ message: "Error while fetching the data", error });
//       }
//       res.json(results);
//     });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ message: "Unexpected error occurred", error: e });
//   }
// };

// // User registration
// exports.createUser = async (req, res) => {
//   console.log("from the create user ", req.body);
//   const { userName, contactNumber, dateBirth, email } = req.body;
//   const password = await bcrypt.hash(req.body.password, 10);
//   const birthDate = new Date(dateBirth);
//   const currDate = new Date();
//   const dorDate = currDate.toISOString().slice(0, 10);

//   if (isNaN(birthDate.getTime())) {
//     return res.status(400).json({ message: 'The date is in the invalid format' });
//   }

//   // Calculate age
//   let age = currDate.getFullYear() - birthDate.getFullYear();
//   const monthDiff = currDate.getMonth() - birthDate.getMonth();

//   const query = `INSERT INTO userInfo (userName, contactNumber, password, dateBirth, DOR, email) VALUES (?, ?, ?, ?, ?, ?)`;
//   try {
//     db.query(query, [userName, contactNumber, password, dateBirth, dorDate, email], (err, result) => {
//       if (err) {
//         console.error("Error in SQL query: ", err);
//         return res.status(500).json({ message: "Error during the insert", err });
//       }
//       return res.status(200).json({ message: "User created successfully", result });
//     });
//   } catch (err) {
//     console.error("Error while inserting the data: ", err);
//     return res.status(500).json({ message: "Error during the insert", err });
//   }
// };

// // Update user information
// exports.updateUser = async (req, res) => {
//   console.log(req.body);
//   const { userName, contactNumber, dateBirth, userId } = req.body;
//   const sql = "UPDATE userInfo SET userName=?, contactNumber=?, dateBirth=? WHERE userId=?";
//   db.query(sql, [userName, contactNumber, dateBirth, userId], (err, result) => {
//     errorHandler(err, result, res, "Error while updating the users");
//   });
// };

// // Password change request
// exports.passwordChangeRequest = async (req, res) => {
//   const { userId, oldPassword } = req.body;
//   db.query("SELECT password FROM userInfo WHERE userId=?", [userId], async (err, result) => {
//     if (err) {
//       return res.status(500).json({ message: "Error during password verification", err });
//     }
//     const isMatch = await bcrypt.compare(oldPassword, result[0].password);
//     if (isMatch) {
//       return res.status(200).json({ message: "Password is correct" });
//     } else {
//       return res.status(400).json({ message: "Incorrect old password" });
//     }
//   });
// };

// // Update password
// exports.passwordChange = async (req, res) => {
//   const { userId, newPassword } = req.body;
//   const hashedPassword = await bcrypt.hash(newPassword, 10);
//   db.query("UPDATE userInfo SET password=? WHERE userId=?", [hashedPassword, userId], (error, result) => {
//     if (error) {
//       return res.status(500).json({ message: "Error on the update of the password", error });
//     }
//     res.status(200).json({ message: "Successfully updated your password" });
//   });
// };

// // Set up file upload directory
// const uploadsDir = path.join(__dirname, "/uploads");
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
//   console.log(`Directory created: ${uploadsDir}`);
// }

 

// // Set up file storage for profile pictures
// const storage = multer.diskStorage({

//   destination: (req, file, cb) => {
//    cb(null, directoryPath);
//   fs.readdir(directoryPath,(err,files)=>
//   {if(err)
//     { console.log(err);}
//    files.forEach((files)=>
//   { if(files.split(":")[1]===file.originalname.split(":")[1])
//     { console.log(directoryPath+`/${files}`);
//       fs.unlink(directoryPath+`/${files}`,(err)=>
//       {
//         console.log(err);
//       })
//     } })});
//     // here reding directory;
//    },
//   filename: (req, file, cb) => {
//   cb(null, `${file.originalname}`);
//   },
// });

// // Export multer configuration
// exports.upload = multer({ storage });
// exports.getProfilePicture = async (req, res) => {
// ;
// const {userId } = req.params;
// fs.readdir(directoryPath,(err,files)=>
// {
//   if(err)
//   {
//     console.log(err);
//   }
//   files.forEach((files)=>
//   {
//     if(new Number(files.split(":")[1])==userId)
//     {
      
//       const filePath = path.join(__dirname, 'uploads', files);
//       res.download(filePath);
//       return 0;
//     }

//   })
//   // res.status(400).json({message:"file not found"});
// })};