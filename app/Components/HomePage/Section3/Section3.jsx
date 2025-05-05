import Style from './section3.module.css';
import Image from 'next/image';
import womanEaring from '../../../public/asset/Section3/woman-earing.jpg';
import Necklace from '../../../public/asset/Section3/Necklace.jpg';
import Ring from '../../../public/asset/Section3/Ring3.jpg'

export default function Section3() {
  return (
    <div className={`${Style.section3} container`}>

        <div className={Style.sectionContainer}>
            <div className={Style.imageContainer}>
                <Image src={womanEaring} alt='Earing' className={Style.imageNecklace} />
            </div>
            <div className={Style.textContainer}>
                <h3>Adorn Yourself in Elegance: Discover Our Exquisite Earring Collection</h3>
                <p>Imagine the subtle shimmer that catches the light with every turn of your head,  the delicate whisper of artistry that frames your face. Our earring collection is    more than just jewelry; it's an ode to timeless elegance and individual expression.</  p>

                <p>From the understated grace of minimalist studs to the dazzling allure of     intricately designed drops, each pair in our collection is a testament to   exceptional craftsmanship and a passion for beauty. We meticulously select the    finest materials – radiant gemstones, lustrous metals, and shimmering accents – to     create pieces that not only adorn but also empower.</p>
            </div>
        </div>
        {/* ---------- */}

        <div className={Style.sectionContainer}>
            
            <div className={Style.textContainer}>
                <h3>A Gleaming Masterpiece: A Necklace That Captivates the Heart</h3>
                <p>At first glance, the eyes are drawn to the mesmerizing shimmer of the deep blue gemstone at the heart of this necklace. The artistically crafted facets of this precious stone capture the light, displaying a spectrum of deep blues and bright turquoise hues. It's as if a drop of the night sky or the depths of the ocean has been set within a golden frame.</  p>

                <p>The delicate gold setting, crafted with utmost care and artistry, embraces the valuable gemstone, enhancing its magnificent allure. The finely wrought gold chain drapes gracefully around the neck, exuding a sense of elegance and poise.</p>
                {/* <p>This necklace is more than just a piece of jewelry; it is a symbol of exquisite taste and authenticity. It holds a tale of art, refinement, and worth, and will undoubtedly become one of your most treasured possessions. The brilliance of this necklace will speak volumes about your beauty and uniqueness.</p> */}
            </div>
            <div className={Style.imageContainer}>
                <Image src={Necklace} alt='Necklace' className={Style.imageNecklace} />
            </div>
        </div>

        {/* ----------- */}

        <div className={Style.sectionContainer}>
            <div className={Style.imageContainer}>
                <Image src={Ring} alt='Ring' className={Style.imageNecklace} />
            </div>
            <div className={Style.textContainer}>
                <h3>Rose Gold Ring with Pink Sapphire and Diamond Accents – A Symbol of Love and Elegance</h3>
                <p>Add a touch of unparalleled beauty and romance to your hand with this stunning ring. Its delicate design, crafted in rose gold and adorned with a radiant pink sapphire surrounded by shimmering diamonds, creates a luxurious and romantic feel. This ring is not only perfect for a memorable and meaningful gift but also an ideal choice to express your unique sense of style and elegance.</p>
            </div>
        </div>
        
    </div>
  )
}
