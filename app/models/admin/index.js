import {models , model , Schema} from 'mongoose';


const AdminSchema = new Schema({
    username: String,
    password: String,
    isActive: {type: Boolean, default: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: Date,
});


const Admin = models.Admin || model("Admin", AdminSchema);
export default Admin;