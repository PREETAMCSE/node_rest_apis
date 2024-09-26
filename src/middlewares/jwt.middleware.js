import  jwt  from "jsonwebtoken";


const  jwtAuth = (req, res, next)=>{
    // 1. Read the token, return the error
    console.log(req.headers);
    const token = req.headers['authorization'];


    //2. If no token return the error
    if(!token){
        return res.status(401).send("Unauthorized");
    }
// 3.Check if token is valid or not
try{
const payload = jwt.verify(token, "P0XcbtFOks")
req.userId=payload.userId;
console.log(payload);
}catch(err){
    return res.status(401).send("Unauthorized");
}

//4. If valid return next middleware else return error
next(); 

}

export default jwtAuth;