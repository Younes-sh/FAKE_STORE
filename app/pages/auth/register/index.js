import Style from './register.module.css';
import Image from "next/image";
import watch from '@/public/watch.jpg'

export default function RegisterPage() {
  return (
    <div className={Style.background}>
        <div className="container main">
        <div className={Style.Container}>
        <Image src={watch} alt="image" />
        <div className={Style.containerText}>
          <h2>Register</h2>
          <br />
          <h3>Sign up to receive Fake Store</h3>
          <br />
          {/* <input type="email" placeholder="Email address"/>
          <br />
          <input type="password" placeholder="Password"/>
          <br />
          <button type="submit">Login</button> */}

          <input type="email" placeholder="Email" className={Style.form__input}  />
          <label for="email" className={Style.form__label}>Email</label>

          <input type="username" placeholder="Username" className={Style.form__input}  />
          <label for="email" className={Style.form__label}>Username</label>

          <input type="password" placeholder="Password" className={Style.form__input}  />
          <label for="subject" className={Style.form__label}>Password</label>
          <button>Login</button>
          <br />
          <br />
          <br />
        </div>
        </div>
      </div>
    </div>
  )
}
