import Link from "next/link";
import Style from './login.module.css';
import Image from "next/image";
import jewlery from '@/public/jewlery.jpg'

export default function LoginPage() {
  return (
    <div className="container main">
      <div className={Style.Container}>
        <Image src={jewlery} alt="image" />
        <div className={Style.containerText}>
          <h2>Login</h2>
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

          <input type="password" placeholder="Password" className={Style.form__input}  />
          <label for="subject" className={Style.form__label}>Password</label>
          <button>Login</button>
          <br />
          <br />
          <br />

          <Link href={'/auth/register'}>Register</Link>
        </div>
      </div>
    </div>
  )
}
