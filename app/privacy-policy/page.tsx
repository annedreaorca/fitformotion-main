import { Image } from "@nextui-org/react";
import Footer from "../_components/Footer/Footer";
import Header from "../_components/Header/Header";
export default async function PrivacyPolicy() {
  const currentYear = new Date().getFullYear();
  return (
    <main>
      <div className="page-heading bg-image">
        <section className="pt-[75px] pb-[75px] page-width">
          <div className="page-heading-wrapper uppercase flex flex-col gap-[20px] items-center">
            <div className="flex items-center gap-[10px] justify-center w-11 h-[60px]">
              <p className="text-[20px] brand uppercase font-semibold text-zinc-900 dark:text-zinc-400">
                Fitformotion
              </p>
            </div>
            <h1 className="text-white inner-page-headings">Privacy Policy</h1>
          </div>
        </section>
        <section className="py-[75px] mx-auto flex justify-center bg-black">
          <div className="flex flex-col gap-[50px] section-container page-width animate__animated animate__fadeInUp duration-1000">
            <div className="flex flex-col gap-[20px]">
              <p>
              Fitformotion values your privacy and is committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when using our AI Fitness Progressive Web App (PWA). By using the app, you consent to the data practices described in this policy
              </p>
            </div>
            <ol className="flex flex-col gap-[30px] list-decimal pl-[20px] text-[20px]">
              <li>
                <div className="flex flex-col gap-[10px]">
                  <h3 className="text-[20px]">Data Collection and Usage</h3>
                  <p>
                  We collect personal data to enhance your experience and provide personalized workout recommendations. The data we collect may include:
                  </p>
                  <ul>
                    <li><p><span className="font-[500] text-zinc-300">Personal Information:</span> Name, age, email address, and health and fitness related information such as height
                    and weight, etc.</p></li>
                  </ul>
                  <ul>
                    <li><p><span className="font-[500] text-zinc-300">Usage Data:</span> Workout logs, exercise preferences, and progress history</p></li>
                  </ul>
                  <div className="flex flex-col gap-[20px] mt-[20px]">
                    <h4 className="text-[18px]">Your information will be used solely for the following purposes:</h4>
                    <span className="flex flex-col gap-[10px]">
                      <p>To personalize your fitness experience.</p>
                      <p>To analyze and improve the app&apos;s performance and functionality.</p>
                      <p>To provide customer support when needed.</p>  
                    </span>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex flex-col gap-[10px]">
                  <h3 className="text-[20px]"> Data Privacy Statement</h3>
                  <p>
                  The respondents are assured that the personal data and sensitive information entrusted to the proponent shall be used with due diligence and prudence, for the sole purpose of completion of the study. As such, you acknowledge and agree that the responses given to any survey questionnaire are valid in accordance with any legal and regulatory standards and in compliance with the <b>Data Privacy Act of 2012.</b>
                  </p>
                  <p>
                  The data furnished and the identity of the respondent will be kept confidential. All responses will be used for academic purposes only. The researcher has sole ownership of the completed questionnaire, which will be inaccessible to anyone else upon the completion of the research.
                  </p>
                </div>
              </li>
              <li>
                <div className="flex flex-col gap-[10px]">
                  <h3 className="text-[20px]"> Data Sharing and Security</h3>
                  <p>
                  We do not share your data with third parties unless explicitly stated and consented to by you. Your data is stored securely and is protected against unauthorized access. We implement various security measures to maintain the safety of your personal information.
                  </p>
                </div>
              </li>
              <li>
                <div className="flex flex-col gap-[10px]">
                  <h3 className="text-[20px]">Retention and Deletion</h3>
                  <p>
                  Your data is retained for as long as you use the app and for any additional period necessary to comply with legal obligations. You may request data deletion at any time by contacting our support team
                  </p>
                </div>
              </li>
              <li>
                <div className="flex flex-col gap-[10px]">
                  <h3 className="text-[20px]">Rights to Access and Modify Data</h3>
                  <p>
                  You have the right to access, update, or request deletion of your personal information. To exercise these rights, please reach out to our support team at {""}
                    <a
                      href="mailto:support@fitformotion.com"
                      className="text-[#f2f2f2]"
                    >
                      support@fitformotion.com
                    </a>

                  </p>
                </div>
              </li>
              <li>
                <div className="flex flex-col gap-[10px]">
                  <h3 className="text-[20px]">Policy Changes</h3>
                  <p>
                  We may update this Privacy Policy from time to time. If we make significant changes, we will notify you
                  through the app or via email.
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
