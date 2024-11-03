import Accordion from "../_components/Accordion/accordion";
import Footer from "../_components/Footer/Footer";
import Header from "../_components/Header/Header";
import PricingCards from "./_components/PricingCards";
import 'animate.css';

export default async function Pricing() {
    const pricingFaqs = [
        {
            title: "What payment methods do you accept?",
            text: "We accept major credit cards and e-wallet payments such as g-cash and maya.",
            active: true,
        },
        {
            title: "Can I switch plans later?",
            text: "Yes! You can upgrade or downgrade your plan at any time through your account settings.",
            active: false,
        },
        {
            title: "What happens if I cancel my subscription?",
            text: "You will retain access to premium features until the end of your billing cycle, after which your account will revert to the Free Version.",
            active: false,
        },
    ]
    return (
        <main>
            <Header/>
            <div className="page-heading bg-image">
                <section className="pt-[200px] pb-[75px] page-width">
                    <div className="page-heading-wrapper uppercase">
                        <h1 className="text-white inner-page-headings">Pricing</h1>
                    </div>
                </section>
            </div>
            <section className="flex flex-col gap-[200px] bg-black py-[100px]">
                <div className="flex flex-col gap-[100px] page-width  animate__animated animate__fadeInUp duration-1000">
                    <div className="flex flex-col gap-[20px] justify-center">
                        <div className="flex justify-center">
                            <span className="section-label">Choose Your Plan</span>
                        </div>
                        <h2 className="section-headline text-center">Pricing Plans for Fitformotion</h2>
                        <p className="text-zinc-500 description text-center">At Fitformotion, we believe in making fitness accessible to everyone. Our freemium model allows you to choose a plan that best suits your fitness journey. Whether you&apos;re just starting or are ready to take your training to the next level, we have you covered!</p>
                    </div>
                    <PricingCards/>
                </div>
                <div className="flex max-[768px]:flex-col items-center gap-[50px] page-width">
                    <div className="flex flex-col gap-[20px] w-[50%] max-[768px]:w-[100%]">
                        <div className="flex">
                            <span className="section-label">Pricing FAQ</span>
                        </div>
                        <h2 className="section-headline">Frequently Asked Questions</h2>
                        <p className="text-zinc-500 description">Get all the answers you need! From payment options to managing your subscription, our FAQs cover common questions to help you make the most of our services.</p>
                    </div>
                    <div className="flex flex-col gap-[20px] w-[50%] max-[768px]:w-[100%] bg-[#070707] px-[50px] max-[768px]:px-[30px] py-[20px] max-[768px]:py-[10px] rounded-[20px]">
                        <div className="divide-y divide-zinc-900">
                            {pricingFaqs.map((faq, index) => (
                                <Accordion key={index} title={faq.title} id={`faqs-${index}`} active={faq.active}>
                                {faq.text}
                                </Accordion>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            <Footer/>
        </main>
    );
}