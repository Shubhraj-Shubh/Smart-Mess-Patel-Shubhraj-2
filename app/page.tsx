import { Button } from "@/components/ui/button";
import Link from "next/link";
import "./Home.css";
import Image from "next/image";
import { Handshake, ShieldCheck, Soup, Utensils } from "lucide-react";
import FAQs from "@/components/home/faqs";
import { Amatic_SC } from "next/font/google";

const amaticSC = Amatic_SC({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default async function Home() {
  return (
    <>
      <section className="hero relative flex justify-center items-center min-h-screen text-white">
        <div className="bg-[url('/home/hero.jpg')] absolute top-0 left-0 w-full h-full bg-cover bg-center"></div>
        <div className="bg-[#22222220] absolute top-0 left-0 w-full h-full bg-cover bg-center"></div>
        <div className="hero-content-area opacity-0 mt-24 animate-slidefade">
          <h1 className="text-[#ffffff] font-medium text-2xl md:text-6xl mb-4 drop-shadow-2xl ">
            Simplifying Mess at Patel Hall of Residence
          </h1>
          <div className="text-gray-100 font-medium md:text-xl mb-4 drop-shadow-2xl ">
            Designed to enhance convinence and transparency for boarders and
            mess staff, easy access to essential information, and improved mess
            services for everyone
          </div>
          <div className="flex gap-4">
            <Link href={"/dashboard"}>
              <Button
                type="button"
                className=" px-4 md:px-8 text-xl hover:bg-primary py-2 md:py-4 h-auto"
              >
                For Boarder
              </Button>
            </Link>
            <Link href={"/scan"}>
              <Button
                type="button"
                className=" px-4 md:px-8 text-xl hover:bg-primary py-2 md:py-4 h-auto"
              >
                For Staff
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="destinations py-24 px-2 text-center bg-gray-100">
        <h3
          className={`title text-5xl font-bold capitalize mb-6 ${amaticSC.className} `}
        >
          Patel Hall of Residence
        </h3>
        <p className="max-w-3xl mx-auto text-lg mb-10">
          Being the hall which once housed the Gymkhana, its walls speak of
          stories of the past and present. The motto of the hall is lux et
          veritas vincant (translated as “Let Light and Truth Prevail”) and the
          residents and alumni, better known as Patelians, live by this motto.
        </p>
        <hr className="w-64 h-1 bg-primary mb-12 mx-auto" />
        <div className="max-w-screen-xl m-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-2">
          <Image
            src={"/home/3.jpg"}
            alt="glimpses"
            width={1000}
            height={1000}
            style={{
              objectFit: "cover",
            }}
            className="lg:col-span-5 bg-center h-80"
          />
          <Image
            src={"/home/2.jpg"}
            alt="glimpses"
            width={1000}
            height={1000}
            style={{
              objectFit: "cover",
            }}
            className="lg:col-span-7 bg-center h-80"
          />
          <Image
            src={"/home/1.jpg"}
            alt="glimpses"
            width={1000}
            height={1000}
            style={{
              objectFit: "cover",
            }}
            className="lg:col-span-7 bg-center h-80"
          />
          <Image
            src={"/home/4.jpeg"}
            alt="glimpses"
            width={1000}
            height={1000}
            style={{
              objectFit: "cover",
            }}
            className="lg:col-span-5 bg-center h-80"
          />
        </div>
      </section>

      <section className="packages py-24 text-center">
        <h3
          className={`title text-5xl font-bold capitalize mb-6 ${amaticSC.className} `}
        >
          Mess Facilities
        </h3>
        <p className="max-w-2xl mx-auto text-lg mb-10">
          Our mess facilities are designed to provide a comfortable and
          welcoming space for all people. Enjoy delicious meals with your
          friends in a clean and hygienic environment.
        </p>
        <hr className="w-64 h-1 bg-primary mb-12 mx-auto" />
        <ul className="max-w-screen-xl m-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <li className="col-span-2 text-center p-6">
            <Soup className="mx-auto mb-2" />
            <h4 className="text-xl font-semibold mb-4">Quality Food</h4>
            <p>
              From healthy breakfasts to dinners, our quality food options will
              keep you energized and focused throughout your KGP life.
            </p>
          </li>
          <li className="col-span-2 text-center p-6">
            <Handshake className="mx-auto mb-2" />
            <h4 className="text-xl font-semibold mb-4">
              Friendly behaviour of staffs
            </h4>
            <p>
              Our friendly staff are dedicated to making your experience, truly
              unforgettable. From supportive event organizers, our staffs are
              always ready to serve.
            </p>
          </li>
          <li className="col-span-2 text-center p-6">
            <ShieldCheck className="mx-auto mb-2" />
            <h4 className="text-xl font-semibold mb-4">
              Proper cleaned and hygiene Mess
            </h4>
            <p>
              We maintain the highest standards of <em>cleanliness</em> and{" "}
              <em>hygiene</em> in our mess facilities, giving you complete peace
              of mind.
            </p>
          </li>
          <li className="col-span-2 text-center p-6">
            <Utensils className="mx-auto mb-2" />
            <h4 className="text-xl font-semibold mb-4">
              Grand dinners and Special dinners
            </h4>
            <p>
              Patel Hall&apos; <em>grand dinners</em> and{" "}
              <em>special dinners</em>, carefully crafted to create
              unforgettable memories, our dinner events are truly special.
            </p>
          </li>
        </ul>
      </section>
      <FAQs />
      <section className="testimonials py-24 text-center">
        <h3
          className={`title text-5xl font-bold capitalize mb-6 ${amaticSC.className} `}
        >
          Words of Wisdom from Sardar Vallabhbhai Patel
        </h3>

        <p className="max-w-2xl mx-auto text-lg mb-10">
          Sardar Vallabhbhai Patel played a crucial role in India&apos;s
          struggle for independence and later became the country&apos;s first
          <em> Deputy Prime Minister, Home Minister and Minister of States</em>. Patel&apos;s commitment to national
          integration and social justice continues to inspire Indians. His
          legacy is celebrated annually on October 31, known as{" "}
          <em> National Unity Day </em>.
        </p>

        <hr className="w-64 h-1 bg-primary mb-12 mx-auto" />
        <p className="quote text-xl font-light mb-6 max-w-screen-md mx-auto">
          The unity and integrity of India is the fundamental principle of our
          national life. Manpower without unity is not a strength unless it is
          harmonized and united properly, then it becomes a spiritual power
        </p>
        <p className="quote text-xl font-light mb-6 max-w-screen-md mx-auto">
          It is the prime responsibility of every citizen to feel that his
          country is free and to defend its freedom is his duty.
        </p>
        {/* <p className="author text-lg font-semibold mb-8">- Albert Herter</p> */}
        {/* <p className="author text-lg font-semibold mb-8">- Sharon Rosenberg</p> */}
        <p className="quote text-xl font-light mb-6 max-w-screen-md mx-auto">
          A leader is not a ruler, but a servant. A true leader is one who is
          willing to sacrifice his own interests for the good of his people.
        </p>
        {/* <p className="author text-lg font-semibold mb-8">- Luis Mendoza</p> */}
      </section>

      <section className="contact py-24 text-center bg-gray-100">
        <h3
          className={`title text-5xl font-bold capitalize mb-6 ${amaticSC.className} `}
        >
          Learn more
        </h3>
        <p className="max-w-3xl mx-auto text-lg mb-10">
          We are excited to introduce Mess Cards for all Patelians, aimed at
          addressing management issues and enhancing transparency in our mess
          system. The introduction of Mess Cards is designed to eliminate issues
          and provide a more streamlined experience. By using Mess Cards,
          Patelians can use a range of benefits, including accurate and
          error-free charging of add-ons, transparent tracking of expenses, and
          elimination of coupon confusion. Online complaint registration will
          also be available, making it easier for Patelians to report any issues
          or concerns.
        </p>
        <hr className="w-64 h-1 bg-primary mb-12 mx-auto" />
        <form className="flex justify-center items-center flex-wrap w-3/5 mx-auto">
          <input
            type="email"
            placeholder="Email"
            className="p-4 text-lg border border-gray-300 rounded mb-4 sm:mb-0 flex-grow mr-8"
          />
          <a
            href="#"
            className="btn bg-primary px-12 py-4 text-lg text-white font-bold uppercase rounded transition duration-400 hover:bg-[#ce5856]"
          >
            Subscribe now
          </a>
        </form>
      </section>
    </>
  );
}
