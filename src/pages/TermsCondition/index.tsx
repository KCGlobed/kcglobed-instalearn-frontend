import React from "react"
import Footer from "../../layouts/Footer"
import MainHeader from "../../layouts/MainHeader"
import TopHeader from "../../layouts/TopHeader"

const sections = [
    { id: "acceptance", title: "1. Acceptance of Terms" },
    { id: "definitions", title: "2. Definitions" },
    { id: "eligibility", title: "3. Eligibility" },
    { id: "account", title: "4. User Account & Registration" },
    { id: "purchases", title: "5. Purchases & Payment" },
    { id: "refunds", title: "6. Refund & Cancellation Policy" },
    { id: "ip", title: "7. Intellectual Property" },
    { id: "user-conduct", title: "8. User Conduct & Prohibited Activities" },
    { id: "corporate", title: "9. Corporate & Team Plans" },
    { id: "disclaimers", title: "10. Disclaimers & Limitation of Liability" },
    { id: "termination", title: "11. Termination" },
    { id: "governing-law", title: "12. Governing Law & Dispute Resolution" },
    { id: "changes", title: "13. Changes to These Terms" },
    { id: "contact", title: "14. Contact Us" },
]

const TermsCondition = () => {
    return (
        <>
            <TopHeader />
            <MainHeader />

            <div className="bg-[#F8F7FA] min-h-screen">

                {/* Hero Banner */}
                <div className="bg-gradient-to-br from-[#2F2B3D] to-[#444059] py-14 px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-white/60 text-sm font-semibold uppercase tracking-widest mb-3">Legal</p>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
                            Terms &amp; Conditions
                        </h1>
                        <p className="text-white/75 text-base md:text-lg font-medium max-w-2xl mx-auto">
                            Please read these terms carefully before using InstaLearn. By accessing our platform, you agree to be bound by these terms.
                        </p>
                        <div className="mt-6 inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-sm font-semibold px-4 py-2 rounded-full backdrop-blur-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Last updated: August 5, 2026
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-6xl mx-auto px-6 py-14 flex flex-col lg:flex-row gap-10">

                    {/* Sticky Table of Contents */}
                    <aside className="lg:w-72 shrink-0">
                        <div className="lg:sticky lg:top-28 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Table of Contents</h2>
                            <nav className="flex flex-col gap-1">
                                {sections.map((s) => (
                                    <a
                                        key={s.id}
                                        href={`#${s.id}`}
                                        className="text-sm text-gray-600 hover:text-[#7367f0] hover:bg-[#7367f0]/5 font-medium px-3 py-2 rounded-lg transition-colors"
                                    >
                                        {s.title}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Terms Body */}
                    <article className="flex-1 space-y-10">

                        {/* 1 */}
                        <Section id="acceptance" title="1. Acceptance of Terms">
                            <p>Welcome to <strong>InstaLearn</strong>, an online learning platform operated by <strong>KCGlobed Technologies Pvt. Ltd.</strong> ("Company", "we", "our", or "us"), registered under the Companies Act, 2013, with its registered office at 4th Floor, Tech Hub, Baner, Pune – 411045, Maharashtra, India.</p>
                            <p>By accessing, browsing, registering on, or using the InstaLearn platform at <strong>www.instalearn.in</strong> (the "Platform"), you ("User", "you", or "your") acknowledge that you have read, understood, and agree to be bound by these Terms &amp; Conditions ("Terms"), along with our Privacy Policy and any other policies published on the Platform.</p>
                            <p>If you do not agree to these Terms, you must immediately cease use of the Platform. We reserve the right to update these Terms at any time; continued use following any change constitutes your acceptance of the new Terms.</p>
                        </Section>

                        {/* 2 */}
                        <Section id="definitions" title="2. Definitions">
                            <ul>
                                <li><strong>"Platform"</strong> means the InstaLearn website, mobile applications, APIs, and all related services.</li>
                                <li><strong>"Content"</strong> means all video lectures, audio, text, images, quizzes, assessments, notes, certificates, and any other material available on the Platform.</li>
                                <li><strong>"Course"</strong> means a structured educational programme offered on the Platform, which may be free or paid.</li>
                                <li><strong>"Learner"</strong> means any registered individual user who accesses or enrols in courses on the Platform.</li>
                                <li><strong>"Corporate Account"</strong> means an organisational account used by a company or institution to provide access to the Platform for multiple learners.</li>
                                <li><strong>"Subscription"</strong> means a recurring paid plan that grants access to one or more courses or the full catalogue for a defined period.</li>
                                <li><strong>"Certificate"</strong> means the digital credential issued upon successful completion of a course or assessment.</li>
                            </ul>
                        </Section>

                        {/* 3 */}
                        <Section id="eligibility" title="3. Eligibility">
                            <p>To use the Platform, you must:</p>
                            <ul>
                                <li>Be at least <strong>13 years of age</strong>. Users between 13 and 18 must have parental or guardian consent.</li>
                                <li>Have the legal capacity to enter into a binding agreement under applicable law.</li>
                                <li>Not be barred from using the Platform under the laws of India or your country of residence.</li>
                                <li>Provide accurate, complete, and current registration information.</li>
                            </ul>
                            <p>Corporate administrators registering on behalf of an organisation warrant that they have the authority to bind the organisation to these Terms.</p>
                        </Section>

                        {/* 4 */}
                        <Section id="account" title="4. User Account & Registration">
                            <Subtitle>4.1 Account Creation</Subtitle>
                            <p>You may create an account using an email address and password, or by using a supported social login provider (e.g., Google). You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.</p>
                            <Subtitle>4.2 Account Security</Subtitle>
                            <p>You agree to notify us immediately at <strong>support@instalearn.in</strong> if you suspect any unauthorised use of your account. We are not liable for any loss arising from your failure to keep your credentials secure.</p>
                            <Subtitle>4.3 Accurate Information</Subtitle>
                            <p>You agree to provide truthful, accurate, and complete information during registration and to keep your profile up to date. Providing false information may result in immediate account suspension.</p>
                            <Subtitle>4.4 One Account Per Person</Subtitle>
                            <p>Each individual may hold only one personal account. Creating multiple accounts for the same individual is prohibited. Corporate accounts are governed separately under Section 9.</p>
                        </Section>

                        {/* 5 */}
                        <Section id="purchases" title="5. Purchases & Payment">
                            <Subtitle>5.1 Course Purchases</Subtitle>
                            <p>Certain courses and features on the Platform require payment. All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise.</p>
                            <Subtitle>5.2 Payment Processing</Subtitle>
                            <p>Payments are processed through our authorised payment gateway partner, <strong>Razorpay</strong>. By making a payment, you agree to Razorpay's terms of service. We do not store your full card or bank account details on our servers.</p>
                            <Subtitle>5.3 Subscription Plans</Subtitle>
                            <p>Subscription plans are billed on a recurring basis (monthly or annually) as selected at the time of purchase. Your subscription will automatically renew at the end of each billing cycle unless cancelled before the renewal date through your account settings.</p>
                            <Subtitle>5.4 Promotional Offers & Coupons</Subtitle>
                            <p>Discount codes and promotional offers are subject to their own terms and expiry dates. They cannot be combined, transferred, or applied after a purchase is completed.</p>
                            <Subtitle>5.5 GST</Subtitle>
                            <p>All transactions are subject to applicable Goods and Services Tax (GST) as per Indian tax laws. GST invoices will be generated and made available in your account dashboard.</p>
                        </Section>

                        {/* 6 */}
                        <Section id="refunds" title="6. Refund & Cancellation Policy">
                            <div className="bg-[#7367f0]/5 border border-[#7367f0]/20 rounded-xl px-5 py-4 text-sm font-medium text-[#2F2B3D]">
                                <strong>7-Day Money-Back Guarantee:</strong> We offer a full refund on individual course purchases if you request it within <strong>7 days</strong> of purchase and have completed <strong>less than 20%</strong> of the course content.
                            </div>
                            <Subtitle>Conditions for Refund</Subtitle>
                            <ul>
                                <li>The refund request must be submitted within 7 days of the original purchase date.</li>
                                <li>The course completion progress must be less than 20% at the time of the request.</li>
                                <li>Courses purchased during flash sales or at heavily discounted prices (more than 50% off) are not eligible for refunds.</li>
                                <li>Subscription plans can be cancelled at any time; however, no partial refunds are issued for the remaining subscription period.</li>
                                <li>Certificates already issued cannot be revoked post-refund, but access to course materials will be removed.</li>
                            </ul>
                            <p>To request a refund, contact us at <strong>support@instalearn.in</strong> with your order ID. Approved refunds will be processed within <strong>7–10 business days</strong> to the original payment method.</p>
                        </Section>

                        {/* 7 */}
                        <Section id="ip" title="7. Intellectual Property">
                            <Subtitle>7.1 Our Content</Subtitle>
                            <p>All content on the Platform — including but not limited to videos, text, images, quizzes, course materials, logos, trademarks, and software — is the exclusive property of KCGlobed Technologies Pvt. Ltd. or its licensors and is protected by applicable intellectual property laws.</p>
                            <Subtitle>7.2 Limited Licence to Learners</Subtitle>
                            <p>Upon purchasing or enrolling in a course, we grant you a <strong>limited, non-exclusive, non-transferable, revocable licence</strong> to access and use the course content solely for your personal, non-commercial educational purposes.</p>
                            <Subtitle>7.3 Prohibited Uses</Subtitle>
                            <ul>
                                <li>Downloading, recording, screen-capturing, or otherwise reproducing course videos or materials.</li>
                                <li>Redistributing, reselling, or sublicensing any course content to third parties.</li>
                                <li>Using course content for commercial training, public presentations, or derivative works without prior written consent.</li>
                                <li>Removing or altering any copyright, trademark, or proprietary notices.</li>
                            </ul>
                            <Subtitle>7.4 User-Generated Content</Subtitle>
                            <p>By submitting reviews, comments, notes, or other content on the Platform, you grant us a worldwide, royalty-free, perpetual licence to use, reproduce, and display such content in connection with operating and improving the Platform.</p>
                        </Section>

                        {/* 8 */}
                        <Section id="user-conduct" title="8. User Conduct & Prohibited Activities">
                            <p>You agree not to use the Platform to:</p>
                            <ul>
                                <li>Violate any applicable local, national, or international law or regulation.</li>
                                <li>Impersonate any person or entity, or falsely represent your affiliation with any organisation.</li>
                                <li>Engage in any form of cheating, academic dishonesty, or manipulation of quiz/assessment results.</li>
                                <li>Share your account credentials with others to circumvent paid access.</li>
                                <li>Upload, post, or transmit any content that is unlawful, defamatory, obscene, harassing, or infringing upon the rights of others.</li>
                                <li>Attempt to gain unauthorised access to any part of the Platform, other user accounts, or our backend systems.</li>
                                <li>Use automated tools, bots, scrapers, or data mining techniques to access or extract content from the Platform.</li>
                                <li>Interfere with or disrupt the integrity or performance of the Platform or its associated infrastructure.</li>
                                <li>Conduct or promote any illegal activity, including fraud, phishing, or spam.</li>
                            </ul>
                            <p>Violation of these rules may result in immediate account suspension or termination without notice and may subject you to legal liability.</p>
                        </Section>

                        {/* 9 */}
                        <Section id="corporate" title="9. Corporate & Team Plans">
                            <Subtitle>9.1 Corporate Accounts</Subtitle>
                            <p>Corporate accounts allow organisations to purchase and assign course access to multiple learners ("Team Members") within their organisation. The corporate administrator is responsible for managing seat assignments, monitoring learner progress, and ensuring compliance with these Terms by all Team Members.</p>
                            <Subtitle>9.2 Administrator Responsibilities</Subtitle>
                            <p>The designated administrator warrants that all Team Members are employees, contractors, or students of the registered organisation and that the account will not be used to grant access to unaffiliated individuals.</p>
                            <Subtitle>9.3 Reporting & Data</Subtitle>
                            <p>Corporate administrators have access to learner progress reports, quiz scores, video watch time, and completion data. This access is granted solely for internal training management purposes and must not be shared externally.</p>
                            <Subtitle>9.4 Seat Management</Subtitle>
                            <p>Unused seats do not roll over to subsequent billing periods. Adding seats mid-cycle will be billed on a pro-rated basis for the remaining period.</p>
                        </Section>

                        {/* 10 */}
                        <Section id="disclaimers" title="10. Disclaimers & Limitation of Liability">
                            <Subtitle>10.1 No Guarantee of Outcomes</Subtitle>
                            <p>InstaLearn provides educational content for informational and skill-development purposes only. We make no warranty that completing any course will result in specific career outcomes, employment, certification recognition by third parties, or financial gain.</p>
                            <Subtitle>10.2 Platform Availability</Subtitle>
                            <p>We strive to maintain 99.5% platform uptime but do not guarantee uninterrupted, error-free access. The Platform may be subject to scheduled maintenance windows or unforeseen downtime.</p>
                            <Subtitle>10.3 Disclaimer of Warranties</Subtitle>
                            <p>The Platform and its content are provided on an <strong>"as is"</strong> and <strong>"as available"</strong> basis without warranties of any kind, express or implied, including but not limited to merchantability, fitness for a particular purpose, or non-infringement.</p>
                            <Subtitle>10.4 Limitation of Liability</Subtitle>
                            <p>To the maximum extent permitted by applicable law, KCGlobed Technologies Pvt. Ltd. shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of data, revenue, or profit, arising out of your use of or inability to use the Platform — even if advised of the possibility of such damages. Our total aggregate liability to you shall not exceed the amount paid by you to us in the 12 months preceding the claim.</p>
                        </Section>

                        {/* 11 */}
                        <Section id="termination" title="11. Termination">
                            <Subtitle>11.1 By You</Subtitle>
                            <p>You may terminate your account at any time by contacting us at <strong>support@instalearn.in</strong>. Upon termination, your access to purchased courses will cease, though we may retain certain data as required by law or for audit purposes (see our Privacy Policy).</p>
                            <Subtitle>11.2 By Us</Subtitle>
                            <p>We reserve the right to suspend or permanently terminate your account, without prior notice, if we determine that you have:</p>
                            <ul>
                                <li>Violated these Terms or any applicable law.</li>
                                <li>Engaged in fraudulent, abusive, or harmful behaviour.</li>
                                <li>Failed to pay outstanding amounts due.</li>
                                <li>Provided false registration information.</li>
                            </ul>
                            <Subtitle>11.3 Effect of Termination</Subtitle>
                            <p>Upon termination, all licences granted to you under these Terms immediately cease. You will lose access to all course materials. Refund eligibility following a termination initiated by us due to your breach will be evaluated on a case-by-case basis.</p>
                        </Section>

                        {/* 12 */}
                        <Section id="governing-law" title="12. Governing Law & Dispute Resolution">
                            <Subtitle>12.1 Governing Law</Subtitle>
                            <p>These Terms shall be governed by and construed in accordance with the laws of the <strong>Republic of India</strong>, without regard to its conflict of law provisions.</p>
                            <Subtitle>12.2 Informal Resolution</Subtitle>
                            <p>Before initiating any formal legal proceedings, you agree to attempt to resolve any dispute with us informally by contacting us at <strong>legal@instalearn.in</strong>. We will make reasonable efforts to resolve the matter within 30 days.</p>
                            <Subtitle>12.3 Arbitration</Subtitle>
                            <p>If informal resolution fails, any dispute, controversy, or claim arising out of or relating to these Terms shall be referred to and finally resolved by arbitration in accordance with the <strong>Arbitration and Conciliation Act, 1996</strong>. The seat and venue of arbitration shall be <strong>Pune, Maharashtra</strong>, and the proceedings shall be conducted in English.</p>
                            <Subtitle>12.4 Jurisdiction</Subtitle>
                            <p>Subject to the arbitration clause above, the courts located in <strong>Pune, Maharashtra</strong> shall have exclusive jurisdiction over any disputes that require judicial intervention.</p>
                        </Section>

                        {/* 13 */}
                        <Section id="changes" title="13. Changes to These Terms">
                            <p>We reserve the right to modify these Terms at any time. When we make material changes, we will:</p>
                            <ul>
                                <li>Update the "Last updated" date at the top of this page.</li>
                                <li>Send a notification email to the address associated with your account at least <strong>15 days</strong> before the changes take effect.</li>
                                <li>Display a prominent banner on the Platform for the notice period.</li>
                            </ul>
                            <p>If you do not agree to the revised Terms, you must stop using the Platform before the effective date. Your continued use of the Platform after the effective date constitutes acceptance of the modified Terms.</p>
                        </Section>

                        {/* 14 */}
                        <Section id="contact" title="14. Contact Us">
                            <p>If you have any questions, concerns, or requests regarding these Terms, please contact our legal team:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                <ContactCard icon="✉️" label="Legal Email" value="legal@instalearn.in" href="mailto:legal@instalearn.in" />
                                <ContactCard icon="📞" label="Support Phone" value="+91 20 4870 1200" href="tel:+912048701200" />
                                <ContactCard icon="📍" label="Registered Address" value="KCGlobed Technologies Pvt. Ltd., 4th Floor, Tech Hub, Baner, Pune – 411045, Maharashtra, India" />
                                <ContactCard icon="⏰" label="Working Hours" value="Monday – Friday, 9:00 AM – 6:00 PM IST" />
                            </div>
                            <p className="mt-6 text-sm text-gray-500">For urgent legal matters, please mark your email subject as <em>"URGENT – Legal Matter"</em>. We aim to respond within <strong>5 business days</strong>.</p>
                        </Section>

                    </article>
                </div>
            </div>

            <Footer />
        </>
    )
}

/* ── Helper Components ───────────────────────────────────────────── */

const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
    <section id={id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 scroll-mt-28">
        <h2 className="text-xl font-extrabold text-[#2F2B3D] mb-5 pb-4 border-b border-gray-100">{title}</h2>
        <div className="space-y-4 text-[15px] text-gray-600 leading-relaxed [&_strong]:text-[#2F2B3D] [&_strong]:font-semibold [&_ul]:mt-3 [&_ul]:space-y-2.5 [&_ul]:pl-5 [&_li]:list-disc [&_li]:marker:text-[#7367f0]">
            {children}
        </div>
    </section>
)

const Subtitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-base font-bold text-[#2F2B3D] mt-5 mb-1">{children}</h3>
)

const ContactCard = ({ icon, label, value, href }: { icon: string; label: string; value: string; href?: string }) => (
    <div className="flex items-start gap-3 bg-[#F8F7FA] rounded-xl p-4 border border-gray-100">
        <span className="text-xl mt-0.5 shrink-0">{icon}</span>
        <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
            {href ? (
                <a href={href} className="text-sm font-semibold text-[#7367f0] hover:underline break-all">{value}</a>
            ) : (
                <p className="text-sm font-semibold text-[#2F2B3D] leading-snug">{value}</p>
            )}
        </div>
    </div>
)

export default TermsCondition
