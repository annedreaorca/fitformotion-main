import Footer from "../_components/Footer/Footer";
import Header from "../_components/Header/Header";
import 'animate.css';
import Accordion from '../_components/Accordion/accordion';

export default async function Faq() {
    const faqs = [
        {
            title: "How can I filter the list of exercises on the Exercise page?",
            text: "To filter the list of exercises, click the 'Filter' button at the top of the page. Select the filters you want to apply, such as muscle group, equipment, or difficulty level, to narrow down the list to exercises that meet your criteria.",
            active: true,
        },
        {
            title: "How can I add an exercise to my favorites?",
            text: "To favorite an exercise, click the star icon next to the exercise you want to save. You can view all your favorited exercises by clicking the 'Filters' button and selecting 'My Favorites' on the Exercises page.",
            active: false,
        },
        {
            title: "How can I create my own workout routines?",
            text: "You can create workout routines in two ways: 1. Navigate to the Start Workout page and click the 'Create Routine' button to build a routine from scratch. 2. On the Browse Exercises page, click the 'plus icon' next to each exercise you want to include in your new routine.",
            active: false,
        },
        {
            title: "How do I set a personal goal in the app?",
            text: "To set a personal goal, first add an exercise to your favorites. Then, return to the dashboard page, where you can set your target weight goal for that exercise. Your progress towards this goal will be tracked and displayed on your dashboard.",
            active: false,
        },
        {
            title: "Where can I check the AI-powered predictions for progressive overloading?",
            text: "To check AI-powered predictions for progressive overloading, go to the Exercises tab, select the information icon of each exercise, and view the predictions under the Records section. This will provide you with recommended weights for each session based on your previous performance.",
            active: false,
        },
    ]

    return (
        <main>
            <Header/>
            <div className="page-heading bg-image">
                <section className="pt-[200px] pb-[75px] page-width">
                    <div className="page-heading-wrapper uppercase">
                        <h1 className="text-white inner-page-headings">Frequently Asked Questions</h1>
                    </div>
                </section>
            </div>
            <section className="bg-black">
                <div className="py-[75px] page-width animate__animated animate__fadeInUp duration-1000">
                    <div className="divide-y divide-zinc-900">
                        {faqs.map((faq, index) => (
                            <Accordion key={index} title={faq.title} id={`faqs-${index}`} active={faq.active}>
                            {faq.text}
                            </Accordion>
                        ))}
                    </div>
                </div>
            </section>
            <Footer/>
        </main>
    );
}