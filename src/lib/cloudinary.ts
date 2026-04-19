import { v2 as cloudinary } from 'cloudinary'
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME ,
    api_key: process.env.CLOUD_KEY ,
    api_secret: process.env.CLOUD_SECRET
  });


const uploadOnCloudinary = async(file:Blob): Promise<string | null>=>{
    try {
        if(!file){
            return null
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return new Promise((res , rej)=>{
            const uploadStream = cloudinary.uploader.upload_stream({resource_type:"auto"} ,(err , result)=>{
                if(err){
                    rej(err)
                }
                else{
                    res(result?.secure_url ?? null)
                }

            })

            uploadStream.end(buffer);
        })


    } catch (error) {
        console.log("Cloudniary error", error);
        return null

    }

}


export default uploadOnCloudinary;
