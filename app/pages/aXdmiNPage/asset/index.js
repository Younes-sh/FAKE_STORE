import Image from 'next/image';
import Bracelet1 from '../../../public/asset/Bracelet1.jpg';
import Bracelet2 from '../../../public/asset/Bracelet2.jpg';
import Bracelet3 from '../../../public/asset/Bracelet3.jpg';


export default function asset() {
  return (
    <div>
        <h1>Asset</h1>
        <Image src={Bracelet1} alt="bracelet-1" width={300} height={300} />
        <Image src={Bracelet2} alt="bracelet-2" width={300} height={300} />
        <Image src={Bracelet3} alt="bracelet-3" width={300} height={300} />
    </div>
  )
}
