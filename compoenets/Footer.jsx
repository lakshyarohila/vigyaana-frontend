'use client'
import Link from "next/link";
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-6">
      <div className="max-w-7xl mx-auto text-center">
        <p>© 2025 Vigyaana. All rights reserved.</p>
        <p>Empowering learners through technology-driven education.</p>

        <div className="mt-4">
          <p>Email: <spam className="underline">team.vigyaana@gmail.com</spam></p>
          
        </div>

        <div className="mt-4 flex justify-center gap-6">
          <a href="#" className="underline">Home</a>
          <a href="#" className="underline">Courses</a>
          <a href="#" className="underline">Blog</a>
          <a href="#" className="underline">Pricing</a>
          <a href="#" className="underline">Contact</a>
        </div>

        <div className="mt-4 flex justify-center gap-6">
          <a href="#" className="underline">FAQs</a>
          <a href="#" className="underline">Privacy Policy</a>
          <a href="#" className="underline">Terms & Conditions</a>
          <Link href="/about-us" className="underline">Support</Link>
        </div>

        <div className="mt-4 flex justify-center gap-6">
          <a href="#" className="underline">Facebook</a>
          <a href="#" className="underline">Twitter</a>
          <a href="#" className="underline">LinkedIn</a>
          <a href="#" className="underline">Instagram</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;