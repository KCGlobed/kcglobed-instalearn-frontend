import React from 'react'
import { useNavigate } from 'react-router-dom'
import PromoStrip from '../../layouts/PromoStrip'
import TopHeader from '../../layouts/TopHeader'
import MainHeader from '../../layouts/MainHeader'
import Footer from '../../layouts/Footer'
import EnrollTeamSubscriptionPlan from '../../components/EnrollTeamComponent/EnrollTeamSubscriptionPlan'

const EnrollTeam = () => {
    const navigate = useNavigate();

    const onSelectPlan = (id: any) => {
        navigate('/enroll-team/checkout', { state: { planId: id } });
    }



    return (
        <>
            <PromoStrip />
            <TopHeader />
            <MainHeader />
            <EnrollTeamSubscriptionPlan onSelectPlan={onSelectPlan} />
            <Footer />
        </>
    )
}

export default EnrollTeam