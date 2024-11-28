import { Image } from "@nextui-org/react";
import Footer from "../_components/Footer/Footer";
import Header from "../_components/Header/Header";
export default async function TermsOfService() {
  const currentYear = new Date().getFullYear();
  return (
    <main>
      <div className="page-heading bg-image">
        <section className="pt-[75px] pb-[75px] page-width">
          <div className="page-heading-wrapper uppercase flex flex-col gap-[20px] items-center">
            <div className="flex items-center gap-[10px] justify-center w-11 h-[60px]">
              <img
                src="/images/logo/Fitformotion Brandmark Logo White Ver.svg"
                className="w-[40px]"
              />
              <p className="text-[18px] brand uppercase font-semibold text-zinc-900 dark:text-zinc-400">
                Fitformotion
              </p>
            </div>
            <h1 className="text-white inner-page-headings">Terms Of Service</h1>
          </div>
        </section>
        <section className="py-[75px] mx-auto flex justify-center bg-black">
          <div className="flex flex-col gap-[50px] section-container page-width animate__animated animate__fadeInUp duration-1000">
            <div className="flex flex-col gap-[20px]">
              <h2 className="section-headline">
                <span className="text-zinc-400">Welcome to</span> Fitformotion!
              </h2>
              <p>
                By using our app, you agree to the following terms and
                conditions. Please read them carefully.
              </p>
            </div>
            <ol className="flex flex-col gap-[30px] list-decimal pl-[20px] text-[20px]">
              <li>
                <div className="flex flex-col gap-[10px]">
                  <h3 className="text-[20px]">Acceptance of Terms</h3>
                  <p>
                    By accessing and using Fitformotion, you agree to comply
                    with these Terms and Conditions. If you disagree with any
                    part of the terms, you must not use the app
                  </p>
                </div>
              </li>
              <li>
                <div className="flex flex-col gap-[10px]">
                  <h3 className="text-[20px]">User Account</h3>
                  <p>
                    To access certain features, you may need to create an
                    account. You are responsible for maintaining the
                    confidentiality of your account information, including your
                    username and password, and for all activities under your
                    account.
                  </p>
                </div>
              </li>
              <li>
                <div className="flex flex-col gap-[10px]">
                  <h3 className="text-[20px]">License and Use Restrictions</h3>
                  <p>
                    Fitformotion grants you a limited, non-exclusive,
                    non-transferable license to use the app for personal, non-
                    commercial purposes. You agree not to:
                  </p>
                  <ul className="list-disc pl-[20px]">
                    <li>
                      <p>
                        Reproduce, modify, or distribute any part of the app.
                      </p>
                    </li>
                    <li>
                      <p>
                        Use the app for any unlawful or unauthorized purpose.
                      </p>
                    </li>
                    <li>
                      <p>
                        Interfere with or disrupt the app&apos;s functionality.
                      </p>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <div className="flex flex-col gap-[10px]">
                  <h3 className="text-[20px]">Health Disclaimer</h3>
                  <p>
                    Fitformotion is designed to support your fitness journey but
                    is not a substitute for professional medical advice or
                    personal training. Always consult with a healthcare
                    professional before starting a new fitness program.
                  </p>
                </div>
              </li>
              <li>
                <div className="flex flex-col gap-[10px]">
                  <h3 className="text-[20px]">Limitation of Liability </h3>
                  <p>
                    To the maximum extent permitted by law, Fitformotion shall
                    not be liable for any indirect, incidental, or consequential
                    damages arising out of your use of the app.
                  </p>
                </div>
              </li>
              <li>
                <div className="flex flex-col gap-[10px]">
                  <h3 className="text-[20px]">User Conduct</h3>
                  <p>
                    You agree not to engage in any behavior that could harm or
                    disrupt the app or violate the rights of other users. This
                    includes, but is not limited to, uploading malicious
                    software or using the platform for fraudulent activities.
                  </p>
                </div>
              </li>
              <li>
                <div className="flex flex-col gap-[10px]">
                  <h3 className="text-[20px]">Termination</h3>
                  <p>
                    We reserve the right to terminate or suspend your account at
                    any time if we find that you have violated these Terms and
                    Conditions.
                  </p>
                </div>
              </li>
              <li>
                <div className="flex flex-col gap-[10px]">
                  <h3 className="text-[20px]">Governing Law</h3>
                  <p>
                    These terms are governed by the laws of the{" "}
                    <b>Republic of the Philippines.</b> By using Fitformotion,
                    you agree that any legal issues will be handled in
                    accordance with Philippine laws
                  </p>
                </div>
              </li>
              <li>
                <div className="flex flex-col gap-[10px]">
                  <h3 className="text-[20px]">Contact Information</h3>
                  <p>
                    If you have any questions or concerns about these Terms and
                    Conditions, please feel free to contact us at{" "}
                    <a
                      href="mailto:support@fitformotion.com"
                      className="text-[#f2f2f2]"
                    >
                      support@fitformotion.com
                    </a>{" "}
                    or through by phone at{" "}
                    <a href="tel:+63 968 438 2598" className="text-[#f2f2f2]">
                      +63 968 438 2598
                    </a>
                    .
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </section>
        <section className="z-40 bg-[#070707] border-t-1 border-[#0c0c0c] footer-section">
          <div className="py-[40px] page-width">
            <p className="text-center text-[14px] text-stone-300">
              © {currentYear} Trifecta Proximity. All Rights Reserved.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
