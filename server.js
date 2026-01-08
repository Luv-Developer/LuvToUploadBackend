require("dotenv").config()
const express = require("express")
const app  = express()
const PORT = process.env.PORT
const path = require("path")
const http = require("http")
const {createClient} = require("@supabase/supabase-js")
const SUPABASEURL = process.env.SUPABASEURL
const SUPABASEKEY = process.env.SUPABASEKEY
const SECRETKEY = process.env.SECRETKEY
const supabase = createClient(SUPABASEURL,SUPABASEKEY)
const cors = require("cors")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const multer = require("multer")
const BUCKET_NAME = "files"


//Middlewares
app.set("view engine","ejs")
app.use(express.static(path.join(__dirname,"public")))
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors({
    origin:"https://luv-to-upload-signin.vercel.app",
    methods:["POST","GET"],
    credentials:true
}))

// Multer Memory Storage Configuration (upload buffer to Supabase Storage)
const storage = multer.memoryStorage()
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } })

// Ensure Supabase bucket exists
async function ensureBucket(bucketName) {
    try {
        const { data, error } = await supabase.storage.getBucket(bucketName)
        if (error && error.message && error.message.includes('not found')) {
            const { data: created, error: createErr } = await supabase.storage.createBucket(bucketName, { public: true })
            if (createErr) throw createErr
            return created
        }
        return data
    } catch (err) {
        // If getBucket isn't available or other error, rethrow
        throw err
    }
}

//Routes
app.get("/",(req,res)=>{
    res.render("home")
})
app.get("/signin",(req,res)=>{
    return res.redirect("https://luv-to-upload-signin.vercel.app")
})

app.post("/signin",async(req,res)=>{
    let {email,name,picture} = req.body
    try{
        let {data:user} = await supabase
        .from("users3")
        .select("email")
        .eq("email",email)
        .single()
        if(!user){
            let today = new Date()
            let date = String(today.getDate()).padStart(2,"0")
            let month = String(today.getMonth()+1).padStart(2,"0")
            let year = today.getFullYear()
            today = date + "/" + month + "/" + year
            let {data:insert,err} = await supabase
            .from("users3")
            .insert([{
                email:email,
                name:name,
                date:today,
                picture:picture
            }])
            if(err){
                return res.status(401).json({
                    message:"Error inserting user",
                    redirect:false,
                    error:err
                })
            }
            else{
                let token = jwt.sign({email},SECRETKEY)
                res.cookie("token",token)
                return res.status(201).redirect("/profile")
            }
        }
        else{
            let token = jwt.sign({email},SECRETKEY)
            res.cookie("token",token)
            return res.status(200).redirect("/profile")
        }
    }
    catch(err){
        return res.status(500).redirect("https://luv-to-upload-signin.vercel.app")
    }
})   

const issignedin = (req,res,next) => {
    let token = req.cookies.token
    try{
        if(!token){
            return res.redirect("/signin")
        }
        else{
            let data = jwt.verify(token,SECRETKEY)
            req.user = data
            next()
        }
    }
    catch(err){
        return res.redirect("/signin")
    }
}

app.get("/profile",issignedin,async(req,res)=>{
    let {data:user} = await supabase
    .from("users3")
    .select("*")
    .eq("email",req.user.email)
    .single()
    let {data:total} = await supabase
    .from("documents")
    .select("*")
    .eq("email",req.user.email)
    let length = total.length
    let name = user.name
    let email = user.email
    let picture = user.picture 
    let date = user.date
    res.render("profile",{name,email,picture,date,length})
})

app.get("/signout",(req,res)=>{
    res.cookie("token","")
    return res.redirect("/signin")
})

app.get("/upload",issignedin,(req,res)=>{
    res.render("upload")
})
app.post("/upload",issignedin,upload.single("file"),async(req,res)=>{
    try{
        if(!req.file){
            return res.redirect('/upload')
        }

        // Get user record
        let {data: user, error: userErr} = await supabase
            .from('users3')
            .select('*')
            .eq('email', req.user.email)
            .single()
        if (userErr || !user) {
            console.error('Could not find user for upload:', userErr || 'no user returned')
            return res.status(400).redirect('/upload')
        }

        // Prepare date
        let today = new Date()
        let date = String(today.getDate()).padStart(2,"0")
        let month = String(today.getMonth()+1).padStart(2,"0")
        let year = today.getFullYear()
        today = date + "/" + month + "/" + year

        // Ensure bucket exists
        try{
            await ensureBucket(BUCKET_NAME)
        }catch(bucketErr){
            console.warn('Bucket ensure warning:', bucketErr.message || bucketErr)
        }

        // Create a unique file path: user_email/timestamp-originalname
        const filePath = `${req.user.email}/${Date.now()}-${req.file.originalname}`

        // Upload buffer to Supabase Storage
        const { data: uploadData, error: uploadErr } = await supabase
            .storage
            .from(BUCKET_NAME)
            .upload(filePath, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: false
            })

        if (uploadErr) {
            return res.status(500).redirect('/upload')
        }

        // Get public URL for the uploaded file
        const { data: urlData, error: urlErr } = await supabase
            .storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath)
        if (urlErr) {
        }

        const publicUrl = (urlData && (urlData.publicUrl || urlData.publicURL)) || null
        let size = req.file.size / 1024 
        let origsize = Math.floor(size)
        const insertPayload = {
            email: user.email,
            name: user.name,
            date: today,
            url: publicUrl,
            filename:req.file.originalname,
            size:origsize,
            type:req.file.mimetype
        }

        const { data: insertion, error: insertErr } = await supabase
            .from('documents')
            .insert([insertPayload])

        if (insertErr) {
            if (insertErr && insertErr.status === 401 || insertErr.status === 403) {
            }
            return res.status(500).redirect('/upload')
        }

        return res.redirect('/all')
    }
    catch(err){
        return res.redirect('/upload')
    }
})

app.get("/all",issignedin,async(req,res)=>{
    let {data:docs} = await supabase
    .from("documents")
    .select("*")
    .eq("email",req.user.email)
    let length = docs.length
    res.render("all",{length,docs})
})

app.get("/delete/:filename",issignedin,async(req,res)=>{
    let filename = req.params.filename
    let {data:deleted} = await supabase
    .from("documents")
    .delete()
    .eq("filename",filename)
    return res.redirect("/all")
})


app.listen(PORT,()=>{
    console.log(`App is listening at ${PORT}`)
})