import Footer from "../../layouts/Footer"
import MainHeader from "../../layouts/MainHeader"
import TopHeader from "../../layouts/TopHeader"

const sections = [
    { id: "introduction", title: "1. Introduction" },
    { id: "information-we-collect", title: "2. Information We Collect" },
    { id: "how-we-use", title: "3. How We Use Your Information" },
    { id: "sharing", title: "4. Sharing of Information" },
    { id: "cookies", title: "5. Cookies & Tracking Technologies" },
    { id: "data-security", title: "6. Data Security" },
    { id: "data-retention", title: "7. Data Retention" },
    { id: "your-rights", title: "8. Your Rights & Choices" },
    { id: "children", title: "9. Children's Privacy" },
    { id: "third-party", title: "10. Third-Party Links" },
    { id: "changes", title: "11. Changes to This Policy" },
    { id: "contact", title: "12. Contact Us" },
]

const PrivacyPolicy = () => {
    return (
        <>
            <TopHeader />
            <MainHeader />

            <div className=" bg-[#F8F7FA] min-h-screen">

                {/* Hero Banner */}
                <div className="bg-gradient-to-br from-[#7367f0] to-[#5e50eb] py-14 px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-3">Legal</p>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
                            Privacy Policy
                        </h1>
                        <p className="text-white/80 text-base md:text-lg font-medium max-w-2xl mx-auto">
                            We are committed to protecting your personal information and your right to privacy.
                        </p>
                        <div className="mt-6 inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-sm font-semibold px-4 py-2 rounded-full backdrop-blur-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
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

                    {/* Policy Body */}
                    <article className="flex-1 space-y-10">

                        {/* 1 */}
                        <Section id="introduction" title="1. Introduction">
                            <p>Welcome to <strong>InstaLearn</strong> ("we", "our", or "us"), operated by KCGlobed Technologies Pvt. Ltd. We provide online learning and corporate training solutions through our platform at <strong>www.instalearn.in</strong> (the "Platform").</p>
                            <p>This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our Platform, create an account, purchase a course, or interact with any of our services. Please read this policy carefully. If you disagree with its terms, please discontinue use of the Platform.</p>
                            <p>By accessing or using InstaLearn, you agree to the collection and use of your information in accordance with this Privacy Policy.</p>
                        </Section>

                        {/* 2 */}
                        <Section id="information-we-collect" title="2. Information We Collect">
                            <p>We collect information you provide directly to us, information collected automatically when you use our Platform, and information from third-party sources.</p>
                            <Subtitle>2.1 Information You Provide</Subtitle>
                            <ul>
                                <li><strong>Account Registration:</strong> Name, email address, phone number, password, and profile picture.</li>
                                <li><strong>Payment Information:</strong> Billing address and payment method details (processed securely through PCI-compliant payment providers).</li>
                                <li><strong>Corporate Accounts:</strong> Company name, GST number, employee count, and designated admin contact details.</li>
                                <li><strong>Course Interactions:</strong> Notes, quiz answers, reviews, ratings, comments on announcements, and forum posts.</li>
                                <li><strong>Support Communications:</strong> Messages, emails, or other communications you send to our support team.</li>
                            </ul>
                            <Subtitle>2.2 Automatically Collected Information</Subtitle>
                            <ul>
                                <li><strong>Device & Browser Data:</strong> IP address, browser type, operating system, device identifiers, and screen resolution.</li>
                                <li><strong>Usage Data:</strong> Pages visited, courses enrolled in, videos watched, time spent, quiz attempts, login timestamps, and clickstream data.</li>
                                <li><strong>Cookies & Similar Technologies:</strong> Session cookies, persistent cookies, web beacons, and local storage data.</li>
                            </ul>
                            <Subtitle>2.3 Information from Third Parties</Subtitle>
                            <ul>
                                <li><strong>Social Login:</strong> If you register or sign in using Google or another OAuth provider, we receive your name, email, and profile picture as permitted by your privacy settings on that platform.</li>
                                <li><strong>Corporate Administrators:</strong> Employers or institutions may add you to the platform as a learner and provide your basic profile details.</li>
                            </ul>
                        </Section>

                        {/* 3 */}
                        <Section id="how-we-use" title="3. How We Use Your Information">
                            <p>We use the information we collect for the following purposes:</p>
                            <ul>
                                <li><strong>Provide & Improve Services:</strong> To operate the Platform, deliver courses, track your progress, issue certificates, and continuously improve our content and features.</li>
                                <li><strong>Account Management:</strong> To create and manage your account, verify your identity, and process transactions.</li>
                                <li><strong>Personalisation:</strong> To recommend relevant courses, customise your learning dashboard, and tailor content to your interests and skill level.</li>
                                <li><strong>Communication:</strong> To send you transactional emails (purchase confirmations, password resets), course reminders, progress reports, and, with your consent, promotional newsletters and updates.</li>
                                <li><strong>Analytics & Research:</strong> To understand how learners use the Platform, measure the effectiveness of our courses, and guide product development.</li>
                                <li><strong>Corporate Reporting:</strong> To provide corporate administrators with learner progress dashboards, completion rates, quiz reports, and downloadable analytics.</li>
                                <li><strong>Legal Compliance:</strong> To comply with applicable laws, respond to legal requests, and enforce our Terms of Service.</li>
                                <li><strong>Fraud Prevention & Security:</strong> To detect, investigate, and prevent fraudulent activity, abuse, and security breaches.</li>
                            </ul>
                        </Section>

                        {/* 4 */}
                        <Section id="sharing" title="4. Sharing of Information">
                            <p>We do not sell, rent, or trade your personal information to third parties. We may share your information in the following limited circumstances:</p>
                            <ul>
                                <li><strong>Service Providers:</strong> We engage trusted third-party vendors to support our operations, including cloud hosting (AWS / Google Cloud), payment processing (Razorpay), email delivery (SendGrid), and analytics (Google Analytics). These vendors are contractually obligated to protect your data and use it only for the services they provide to us.</li>
                                <li><strong>Corporate Administrators:</strong> If you access InstaLearn through an employer or institution, your learning data (progress, quiz scores, completion status) may be visible to your organisation's designated administrators.</li>
                                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction. We will notify you via email and a prominent notice on our Platform before your data becomes subject to a different privacy policy.</li>
                                <li><strong>Legal Requirements:</strong> We may disclose your information if required by law, court order, or governmental authority, or to protect the rights, property, or safety of InstaLearn, our users, or others.</li>
                                <li><strong>With Your Consent:</strong> We may share your information for any other purpose with your explicit consent.</li>
                            </ul>
                        </Section>

                        {/* 5 */}
                        <Section id="cookies" title="5. Cookies & Tracking Technologies">
                            <p>We use cookies and similar tracking technologies to enhance your experience on the Platform.</p>
                            <Subtitle>Types of Cookies We Use</Subtitle>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border border-gray-100 rounded-xl overflow-hidden">
                                    <thead className="bg-[#F8F7FA]">
                                        <tr>
                                            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-3 border-b border-gray-100">Cookie Type</th>
                                            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-3 border-b border-gray-100">Purpose</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        <tr className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-5 py-3 font-semibold text-[#2F2B3D]">Essential</td>
                                            <td className="px-5 py-3 text-gray-600">Required for the Platform to function (authentication sessions, shopping cart).</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-5 py-3 font-semibold text-[#2F2B3D]">Functional</td>
                                            <td className="px-5 py-3 text-gray-600">Remember your preferences (language, theme) across sessions.</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-5 py-3 font-semibold text-[#2F2B3D]">Analytics</td>
                                            <td className="px-5 py-3 text-gray-600">Collect aggregated usage data to help us understand and improve the Platform.</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-5 py-3 font-semibold text-[#2F2B3D]">Marketing</td>
                                            <td className="px-5 py-3 text-gray-600">Deliver relevant advertisements and track ad campaign performance (only with your consent).</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="mt-4">You can control cookie preferences through your browser settings. Note that disabling essential cookies may impair Platform functionality.</p>
                        </Section>

                        {/* 6 */}
                        <Section id="data-security" title="6. Data Security">
                            <p>We implement industry-standard technical and organisational measures to protect your personal data from unauthorised access, alteration, disclosure, or destruction. These measures include:</p>
                            <ul>
                                <li>TLS/SSL encryption for all data transmitted between your browser and our servers.</li>
                                <li>AES-256 encryption for sensitive data at rest.</li>
                                <li>Role-based access controls limiting employee access to personal data on a need-to-know basis.</li>
                                <li>Regular vulnerability assessments and penetration testing.</li>
                                <li>Secure payment processing — we do not store full card numbers on our servers.</li>
                            </ul>
                            <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-sm text-amber-800 font-medium mt-4">
                                <strong>Please note:</strong> No method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your data, we cannot guarantee its absolute security.
                            </div>
                        </Section>

                        {/* 7 */}
                        <Section id="data-retention" title="7. Data Retention">
                            <p>We retain your personal information for as long as your account is active or as needed to provide you services. Specifically:</p>
                            <ul>
                                <li><strong>Account Data:</strong> Retained for the duration of your account and for up to 3 years after account closure for legal and audit purposes.</li>
                                <li><strong>Transaction Records:</strong> Retained for 7 years in accordance with Indian financial regulations.</li>
                                <li><strong>Learning Activity Logs:</strong> Retained for 2 years from the date of activity to support progress tracking and dispute resolution.</li>
                                <li><strong>Marketing Preferences:</strong> Retained until you withdraw consent or request deletion.</li>
                            </ul>
                            <p>Upon expiry of the applicable retention period, we securely delete or anonymise your personal data.</p>
                        </Section>

                        {/* 8 */}
                        <Section id="your-rights" title="8. Your Rights & Choices">
                            <p>Depending on your jurisdiction, you may have the following rights regarding your personal data:</p>
                            <ul>
                                <li><strong>Access:</strong> Request a copy of the personal information we hold about you.</li>
                                <li><strong>Correction:</strong> Request that we correct inaccurate or incomplete data.</li>
                                <li><strong>Deletion:</strong> Request that we delete your personal data, subject to legal retention obligations.</li>
                                <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format and transfer it to another service provider.</li>
                                <li><strong>Objection:</strong> Object to or restrict our processing of your data in certain circumstances.</li>
                                <li><strong>Withdraw Consent:</strong> Where processing is based on your consent, withdraw it at any time without affecting the lawfulness of prior processing.</li>
                                <li><strong>Opt-Out of Marketing:</strong> Unsubscribe from promotional emails at any time via the link in any email or through your account settings.</li>
                            </ul>
                            <p>To exercise any of these rights, please contact us at <strong>privacy@instalearn.in</strong>. We will respond within 30 days of your request.</p>
                        </Section>

                        {/* 9 */}
                        <Section id="children" title="9. Children's Privacy">
                            <p>Our Platform is intended for users who are 13 years of age or older. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child under 13 has provided us with personal information, please contact us immediately at <strong>privacy@instalearn.in</strong> so we can delete such information.</p>
                            <p>For users between 13 and 18 years of age, we encourage parental guidance when using our Platform.</p>
                        </Section>

                        {/* 10 */}
                        <Section id="third-party" title="10. Third-Party Links">
                            <p>Our Platform may contain links to third-party websites, applications, or services (e.g., YouTube videos embedded in course content, external resource links). This Privacy Policy does not apply to those third-party services. We encourage you to review the privacy policies of any third-party sites you visit.</p>
                            <p>We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.</p>
                        </Section>

                        {/* 11 */}
                        <Section id="changes" title="11. Changes to This Policy">
                            <p>We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or for other operational reasons. When we make material changes, we will:</p>
                            <ul>
                                <li>Update the "Last updated" date at the top of this page.</li>
                                <li>Send a notification to the email address associated with your account.</li>
                                <li>Display a prominent notice on the Platform for at least 30 days.</li>
                            </ul>
                            <p>Your continued use of the Platform after the effective date of the revised policy constitutes your acceptance of the updated terms. We encourage you to review this page periodically.</p>
                        </Section>

                        {/* 12 */}
                        <Section id="contact" title="12. Contact Us">
                            <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please reach out to us:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                <ContactCard icon="✉️" label="Email" value="privacy@instalearn.in" href="mailto:privacy@instalearn.in" />
                                <ContactCard icon="📍" label="Address" value="KCGlobed Technologies Pvt. Ltd., 4th Floor, Tech Hub, Baner, Pune - 411045, Maharashtra, India" />
                                <ContactCard icon="📞" label="Phone" value="+91 20 4870 1200" href="tel:+912048701200" />
                                <ContactCard icon="⏰" label="Working Hours" value="Monday – Friday, 9:00 AM – 6:00 PM IST" />
                            </div>
                            <p className="mt-6 text-sm text-gray-500">We aim to respond to all privacy-related inquiries within <strong>5 business days</strong>. For urgent data protection matters, please mark your email subject as <em>"URGENT – Privacy Request"</em>.</p>
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

export default PrivacyPolicy