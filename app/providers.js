import { Providers } from '@/components/Providers'; // مسیر واقعی را تنظیم کنید
export default function ProvidersWrapper({ children }) {
  return <Providers>{children}</Providers>;
}