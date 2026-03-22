import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Amatic_SC } from "next/font/google";

const amaticSC = Amatic_SC({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const faqs = [
  {
    question:
      "What's the main purpose of mess duty and what are the general points I need to check?",
    answer:
      "You should check that the cook's hair is covered with a cap, the server is wearing gloves and has their hair covered, and the surrounding areas are clean, including the drainage system. Also, ensure that the ingredients used are as per the contract with HMC.",
  },
  {
    question: "What's the process I need to follow for mess duty?",
    answer:
      "You need to contact the mess office 1 hour before lunch or dinner. Then, inspect the mess during breakfast, lunch, or dinner, depending on your shift. After the inspection, fill out the Mess Duty Form available in the Mess Office and submit it to the GSec Mess.",
  },
  {
    question:
      "What happens if I miss my mess duty or don't follow the process?",
    answer:
      "If you miss your mess duty, a fine of ₹500 will be imposed. So, make sure to show up and complete your duty, or arrange for someone to cover for you!",
  },
];

export default function FAQs() {
  return (
    <section className="contact py-24 text-center bg-gray-100">
      <h3
        className={`title text-5xl font-bold capitalize mb-6 ${amaticSC.className} `}
      >
        FAQ&apos;s
      </h3>
      <p className="max-w-3xl mx-auto text-lg mb-10">
        The purpose of mess duty is to ensure the quality of ingredients and
        hygiene matters in the mess.
      </p>
      <hr className="w-64 h-1 bg-primary mb-12 mx-auto" />
      <div className="max-w-screen-lg m-auto">
        {faqs.map((faq, index) => (
          <Accordion type="single" collapsible key={index}>
            <AccordionItem value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent className="text-left">
                <div
                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                  className=""
                ></div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}

        <Accordion type="single" collapsible>
          <AccordionItem value={`item-${faqs.length}`}>
            <AccordionTrigger>
              Mess rules of Patel Hall of Residence
            </AccordionTrigger>
            <AccordionContent className="text-left">
              <ul className="list-disc pl-4">
                <li>
                  Student&apos;s should not wear shorts/sleveless shirts inside
                  the mess.
                </li>
                <li>Mobile phone/earphones/headphones should NOT be used.</li>
                <li>Regional languages PROHIBITED. Use only Hindi/English.</li>
                <li>
                  Utensils should NOT be taken from mess premises. If caught
                  upto 500 ruppee fine will be imposed.
                </li>
                <li>
                  Students are expected to behave properly inside the mess.
                </li>
                <li>Students should eat with spoons wherever necessary.</li>
                <li>
                  Trashes should not be left on the tables. Please maintain a
                  clean and hygenic environment for others to eat.
                </li>
                <li>
                  To take anything extra, students must use their own mess
                  account.
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
