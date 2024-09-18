import Footer from "../_components/Footer/Footer";
import Header from "../_components/Header/Header";

export default function ContactUs() {
    return (
        <main>
            <Header/>
            <div className="page-heading bg-image">
                <section className="pt-[200px] pb-[75px] page-width">
                    <div className="page-heading-wrapper uppercase">
                        <h1 className="text-white">Contact Us</h1>
                    </div>
                </section>
            </div>
            <Footer/>
        </main>
    );
}