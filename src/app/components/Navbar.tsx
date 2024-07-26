import Link from 'next/link';
import Image from 'next/image';
import logo from '/public/BITESlogo.png'; // Logonun doğru yolunu belirtin

export default function Navbar() {
  return (
    <nav className="bg-blue-500 h-16 flex items-center">
      <div className="container mx-auto flex justify-between items-center h-full">
        <div className="flex items-center h-full">
          <Image src={logo} alt="BITES Defence & Aerospace" width={64} height={64} className="h-full w-auto" />
          <span className="text-white text-lg font-bold ml-2">
            BITES Defence & Aerospace
          </span>
        </div>
        <div>
          <Link href="/" className="text-white mr-4">Home</Link>
          <Link href="/result" className="text-white mr-4">Results</Link>
          <Link href="/login" className="text-white mr-4">Login</Link>
          <Link href="/register" className="text-white">Register</Link>
        </div>
      </div>
    </nav>
  );
}
