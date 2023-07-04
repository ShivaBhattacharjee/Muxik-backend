// post method register route
export async function register(req,res){
    res.json('Register Route')
}

// post method login route
export async function login(req,res){
    res.json('Login Route')
}

// get request to get user data after login
export async function getUser(req,res){
    res.json('User Route')
}

// put request to update user
export async function updateUser (req,res){
    res.json("Update user route")
}

// get method to generate otp for verification
export async function generateOTP (req,res){
    res.json("Otp Generation Route")
}

// get method to verify otp

export async function verifyOTP (req,res){
    res.json("Verify Otp")
}

// get request to create a reset session

export async function resetSession (req,res){
    res.json("this is reset session")
}



// get request for reset session

export async function passwordReset(req,res){
    res.json("Remember your password you fucking dumb ass")
}

