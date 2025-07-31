import imageKit from "./imagekit";


export const uploadFile = async (file:File):Promise<string>=>{
        try {
            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes)
            console.log("bytes:",bytes)
            console.log("buffer:",buffer)
            const fileName = `avatar_${Date.now()}_${Math.random().toString(36).substring(7)}`;
            const uploadedImage = await imageKit.upload({
                file:buffer,
                fileName:fileName,
                folder:"/avatar"
            })
            return uploadedImage.url
        } catch (error) {
            console.log("failed to uplaod image!",error)
            throw new Error('Failed to upload avatar');
        }
}