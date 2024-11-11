import React from 'react';
import TopBar from '../Widgets/Global/TopBar';
import SectonHero from '../Widgets/Index/SectionHero';
import SectionInfos from '../Widgets/Index/SectionInfos';
import SectionFAQ from '../Widgets/Index/SectionFaq';
import SectionFooter from '../Widgets/Index/SectionFooter';

const Index = () => {
    return (
        <>
            <TopBar />
            <SectonHero />
            <SectionInfos />
            <SectionFAQ />
            <SectionFooter />
        </>
    );
};

export default Index;