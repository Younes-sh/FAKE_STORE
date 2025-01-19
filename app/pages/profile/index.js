import Style from "./profile.module.css";
import Image from "next/image";
import User from "@/public/user.png";

export default function ProfilePage () {
    return (
        <div className="container main">
            <div className={Style.ProfilePage}>
                <div className={Style.header}>
                    <h1>Profile</h1>
                    <p>This is the profile page.</p>
                </div>

                <div className={Style.mainContainer}>
                    <div className={`${Style.div1} ${Style.section}`}>
                        <Image  src={User} width={50} alt="Profile"/>
                        <h2>User Name</h2>
                    </div>
                    <div className={`${Style.div2} ${Style.section}`}>
                        <div className={Style.textContainer}>
                            <h2>User Information</h2>
                            <p>Username: John Doe</p>
                            <p>Email: johndoe@example.com</p>
                            <p>Phone: 123-456-7890</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}