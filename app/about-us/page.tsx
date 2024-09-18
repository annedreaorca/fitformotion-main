import Footer from "../_components/Footer/Footer";
import Header from "../_components/Header/Header";

export default async function AboutUs() {
    return (
        <main>
            <Header/>
            <div className="page-heading bg-image">
                <section className="pt-[200px] pb-[75px] page-width">
                    <div className="page-heading-wrapper uppercase">
                        <h1 className="text-white">About Us</h1>
                    </div>
                </section>
            </div>
            <Footer/>
        </main>
    );
}