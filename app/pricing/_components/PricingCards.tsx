import { IconCircleCheckFilled } from "@tabler/icons-react";


export default async function PricingCards() {
    return (
        <div className="flex gap-[40px] max-[768px]:flex-col">
            <div className="bg-[#070707] p-[35px] w-[50%] rounded-[15px] border-1 border-zinc-900 max-[768px]:w-[100%]">
                <p className="font-[500] text-[16px] uppercase plan-type">Base Plan</p>
                <div className="flex items-end gap-[10px] mt-[20px]">
                    <span className="font-[500] text-[64px] max-[580px]:text-[55px] leading-[60px] text-white">Free</span>
                </div>
                <div className="flex gap-3 mt-[30px] justify-start">
                    <span className="bg-zinc-900 text-[#696969] w-[100%] py-[20px] px-[35px] rounded-[10px] text-center">
                        Current Plan
                    </span>
                </div>
                <div className="separator">
                    <hr className="border-[#1a1a1a] mt-[40px] mb-[40px]"/>
                </div>
                <div className="flex flex-col gap-[17px] pricing-includes">
                    <div className="">
                        <p className="font-[500] text-[16px] text-white">Features</p>
                    </div>
                    <ul className="flex flex-col gap-[12px] text-sm">
                        <li className="flex gap-3 items-center text-zinc-500">
                            <div><IconCircleCheckFilled width={20}  /></div>
                            <span>Access to a <span className="text-zinc-300 font-[500]">limited exercise library</span></span>
                        </li>
                        <li className="flex gap-3 items-center text-zinc-500">
                            <div><IconCircleCheckFilled width={20}  /></div>
                            <span>Suggested routines to kickstart your fitness journey</span>
                        </li>
                        <li className="flex gap-3 items-center text-zinc-500">
                            <div><IconCircleCheckFilled width={20}  /></div>
                            <span>Basic workout tracking to monitor your progress</span>
                        </li>
                        <li className="flex gap-3 items-center text-zinc-500">
                            <div><IconCircleCheckFilled width={20}  /></div>
                            <span>Community support for motivation and guidance</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="bg-[#070707] p-[35px] w-[50%] rounded-[15px] border-1 border-primary-800 max-[768px]:w-[100%]">
                <p className="font-[500] text-[16px] uppercase plan-type">Premium Plan</p>
                <div className="flex items-end gap-[10px] mt-[20px]">
                    <span className="font-[500] text-[64px] max-[580px]:text-[55px] leading-[60px] text-white">₱100</span>
                    <span className="text-zinc-500">/ month</span>
                </div>
                <div className="flex gap-3 mt-[30px]">
                    <a href="/premium" className="bg-primary-800 w-[100%] py-[20px] px-[35px] rounded-[10px] text-center transition-all duration-300 hover:opacity-80">
                        Upgrade to Premium
                    </a>
                </div>
                <div className="separator">
                    <hr className="border-[#1a1a1a] mt-[40px] mb-[40px]"/>
                </div>
                <div className="flex flex-col gap-[17px] pricing-includes">
                    <div className="">
                        <p className="font-[500] text-[16px] text-white">Features</p>
                    </div>
                    <ul className="flex flex-col gap-[12px] text-sm">
                        <li className="flex gap-3 items-center text-primary-800">
                            <div><IconCircleCheckFilled width={20}  /></div>
                            <span className="text-zinc-500"><span className="text-zinc-300 font-[500]">Unlock over 800 exercises,</span> including detailed guides and tips</span>
                        </li>
                        <li className="flex gap-3 items-center text-primary-800">
                            <div><IconCircleCheckFilled width={20}  /></div>
                            <span className="text-zinc-500"><span className="text-zinc-300 font-[500]">Tailored workout routines</span> designed to fit your specific goals and fitness level</span>
                        </li>
                        <li className="flex gap-3 items-center text-primary-800">
                            <div><IconCircleCheckFilled width={20}  /></div>
                            <span className="text-zinc-500">Access to the<span className="text-zinc-300 font-[500]"> AI-powered fitness chatbot</span> for personalized workout
                            recommendations and support</span>
                        </li>
                        <li className="flex gap-3 items-center text-primary-800">
                            <div><IconCircleCheckFilled width={20}  /></div>
                            <span className="text-zinc-500">Advanced progress tracking and analytics with insights into your performance</span>
                        </li>
                        <li className="flex gap-3 items-center text-primary-800">
                            <div><IconCircleCheckFilled width={20}  /></div>
                            <span className="text-zinc-500">Exclusive content and resources to enhance your fitness journey</span>
                        </li>
                        <li className="flex gap-3 items-center text-primary-800">
                            <div><IconCircleCheckFilled width={20}  /></div>
                            <span className="text-zinc-500">Priority support from our team of fitness experts</span>
                        </li>
                    </ul>
                </div>
            </div>

        </div>
    );
}