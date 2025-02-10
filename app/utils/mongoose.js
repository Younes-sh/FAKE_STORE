import mongoose from "mongoose";

export default function MongoDB() {
    mongoose.connect(process.env.DATABASE_DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        if(mongoose.connections[0].readyState) {
            return
            console.log("Connected to MongoDB");
        }
    })
}