import Footer from "../_components/Footer/Footer";
import Header from "../_components/Header/Header";
import PricingCards from "./_components/PricingCards";

export default async function Pricing() {
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
            <section className="bg-black">
                <div className="flex flex-col gap-[50px] py-[75px] page-width">
                    <div className="flex flex-col gap-[20px] justify-center">
                        <div className="flex justify-center">
                            <span className="section-label">Choose Your Plan</span>
                        </div>
                        <h2 className="section-headline text-center">Pricing Plans for Fitformotion</h2>
                        <p className="text-zinc-500 description text-center">At Fitformotion, we believe in making fitness accessible to everyone. Our freemium model allows you to choose a plan that best suits your fitness journey. Whether you're just starting or are ready to take your training to the next level, we have you covered!</p>
                    </div>
                    <PricingCards/>
                </div>
            </section>
            <Footer/>
        </main>
    );
}