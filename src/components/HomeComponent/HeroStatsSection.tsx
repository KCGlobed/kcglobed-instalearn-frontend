import { ArrowRight } from "lucide-react"
import Button from "../Button"
import { useTranslation, Trans } from "react-i18next"

const HeroStatsSection = () => {
    const { t } = useTranslation();
    return (
        <>
            <section className="py-16 bg-[#1B1E22]">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-[600px_620px] gap-4 text-center">
                        <div className="">
                            <h2 className="text-white text-justify">
                                <Trans i18nKey="home.startLearningWith">
                                    Start learning with 67.1k <br />students around the world.
                                </Trans>
                            </h2>
                            <div className="flex gap-4 mt-8">
                                <Button
                                    variant="perple"
                                    title={t('home.enrollNow', 'Enroll now')}
                                    onClick={() => console.log("Enroll now")}
                                    className="h-[48px] px-6 rounded bg-perple text-white flex items-center gap-2"
                                    icon={<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                                />
                                <Button
                                    variant="light-gray"
                                    title={t('home.enrollTeamNow', 'Enroll Team now')}
                                    onClick={() => console.log("Enroll now")}
                                    className="h-[48px] px-6 rounded bg-light-gray text-white flex items-center gap-2"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-6 place-items-center">
                            <div>
                                <h2 className="text-4xl font-bold text-white">6.3k</h2>
                                <h3 className="text-gray-400">{t('home.onlineCourses', 'Online courses')}</h3>
                            </div>
                            <div>
                                <h2 className="text-4xl font-bold text-white">26k</h2>
                                <h3 className="text-gray-400">{t('home.certifiedInstructors', 'Certified Instructors')}</h3>
                            </div>
                            <div>
                                <h2 className="text-4xl font-bold text-white">99.9%</h2>
                                <h3 className="text-gray-400">{t('home.successRate', 'Success Rate')}</h3>
                            </div>
                        </div>


                    </div>
                </div>
            </section>
        </>
    )
}

export default HeroStatsSection