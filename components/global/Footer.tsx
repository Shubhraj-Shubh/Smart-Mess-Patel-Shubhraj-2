import { Copyright } from "lucide-react";
import { Facebook, Instagram } from "react-bootstrap-icons";

export default function Footer() {
  return (
    <footer className="flex items-center justify-between bg-primary text-white py-6 px-12">
      <p className="text-sm">
        Patel Hall of Residence, IIT Kharagpur, Kharagpur, West Bengal, India
      </p>
      <p className="text-sm flex items-center gap-4">
        <Copyright /> Copyright 2025, All Rights Reserved
      </p>
      <ul className="flex space-x-6">
        {/* <li>
          <a href="#" className="text-xl">
            <TwitterX />
          </a>
        </li> */}
        <li>
          <a
            href="https://www.facebook.com/patelhallofresidence"
            target="_blank"
            className="text-xl"
          >
            <Facebook />
          </a>
        </li>
        <li>
          <a
            href="https://www.instagram.com/patelhall.iitkgp?igsh=OWt6czZlaWJrYTJ2"
            target="_blank"
            className="text-xl"
          >
            <Instagram />
          </a>
        </li>
      </ul>
    </footer>
  );
}
