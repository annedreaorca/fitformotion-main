import Footer from "../_components/Footer/Footer";
import Header from "../_components/Header/Header";
import ComingSoon from "../_components/UnderMaintenance/UnderMaintenance";

export default async function AboutUs() {
    return (
        <main>
            <Header/>
            <div className="page-heading bg-image">
                <section className="pt-[200px] pb-[75px] page-width">
                    <div className="page-heading-wrapper uppercase">
                        <h1 className="text-white inner-page-headings">About Us</h1>
                    </div>
                </section>
            </div>
            <ComingSoon/>
            <Footer/>
        </main>
    );
}