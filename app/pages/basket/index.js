import Style from './basket.module.css';
import { useContext, useMemo  } from 'react';
import { AppContext } from '../_app';
import BasketCard from '../../Components/Cards/BasketCard/BasketCard';
import Link from 'next/link';
import emptyCard from '@/public/asset/Basket/emptyCard.jpg';
import Image from 'next/image';

export default function BasketPage () {
    const {addToCard, addProduct} = useContext(AppContext);

    // استفاده از useMemo برای محاسبه مجموع قیمت به صورت کارآمد
    const totalPaye = useMemo(() => {
        return addProduct.reduce((sum, item) => {
            // اطمینان حاصل کنید که item.totalPrice وجود دارد و یک عدد است
            const price = typeof item.totalPrice === 'number' ? item.totalPrice : 0;
            return sum + price;
        }, 0);
    }, [addProduct]); // وابستگی به addProduct تا در صورت تغییر آن، دوباره محاسبه شود

    return (
        <div >
                <div className="container main">
                    <div className={Style.Subtotal}>
                        <h3>Subtotal</h3>
                        <p>Total pay: $ {totalPaye}</p>
                        <div className={Style.checkoutBtn}>
                            <Link href={'/PaymentPage'}>purchase to checkout</Link>
                        </div>
                    </div>
                    <div className={Style.basket}>

                        {addToCard > 0 ? (
                            <div>
                                {
                                  addProduct.map(item => <BasketCard key={item._id} {...item} />)
                                }
                            </div>) : (
                                <div >
                                <Image
                                  src={emptyCard}
                                  width={400}
                                  height={400}
                                  sizes="(max-width: 768px) 100vw, 50vw"
                                  alt="Empty Card"
                                />
                              </div>
                            )
                        }
                    </div>
                </div>
            

        </div>
    )
}

