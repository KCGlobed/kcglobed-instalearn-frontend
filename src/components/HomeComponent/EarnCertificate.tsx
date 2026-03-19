import Button from "../Button"

const EarnCertificate = () => {
    return (
        <div>
            <section className="w-full bg-home ">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-[900px] py-20 mx-auto">
                        <h2 className="text-4xl font-bold text-center  text-white">Earn master certifications like US CPA, US CMA, US EA, IFRS,
                            UK ACCA, CFA & Many More.</h2>
                        <div className="flex justify-center mt-8">
                            <Button
                                variant="primary"
                                title="Explore Programs"
                                onClick={() => console.log("Explore Programs")}
                                className="h-[48px] px-6 !rounded-none"
                            />
                        </div>
                    </div>
                </div>

            </section>
        </div>
    )
}

export default EarnCertificate