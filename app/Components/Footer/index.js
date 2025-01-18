import Style from './footer.module.css';

export default function Footer () {
    return (
        <div className={Style.footer}>
            <footer>
                &copy; 2023 Fake Store. All rights reserved.
            </footer>
        </div>
    )
}