import mongoose from 'mongoose'
export default async function main() {
    try {
        const db = await mongoose.connect(process.env.MONGO_URL)
        if(db) {
            console.log("database has been connected")
        }
    } catch (error) {
        console.log("MongoDB Error " + error);   
    }
}