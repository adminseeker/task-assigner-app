const jwt = require("jsonwebtoken");

const generateAuthToken = (id,cb)=>{
    const payload = {
        user:{
            id
        }
    };
    jwt.sign(payload,process.env.JWT_SECRET,(error,token)=>{
        if(error) throw error;
        cb(token);
    })
}

module.exports = generateAuthToken;