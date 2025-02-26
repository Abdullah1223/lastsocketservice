const jwt = require('jsonwebtoken')
const JwtAuth2 =async (req,res,next)=>{
   const token = req.cookies.token
  
   if(!token) return res.status(403).send({message:'Not Logged in'})
     
    const Verified = await jwt.verify(token,process.env.SECRET_KEY,(err,decoded)=>{
      if(err){
         return res.status(403).send({Message:'Invalid Token Do Not Temper With It'})
        }
      
         
        return decoded;
    
    
    })
    
    if(Verified){
      req.body.user = Verified.payload;   
      next();
    }
    
}

module.exports = JwtAuth2;