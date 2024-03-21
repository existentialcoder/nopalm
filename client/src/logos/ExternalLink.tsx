import React from 'react';

import ExternalLinkLogoImg from '../assets/external-link.svg';

const ExternalLinkLogo: React.FC = () => {
    return (
        <div className="icon-container">
            <img src={ExternalLinkLogoImg} width={"50%"} height={"50%"} alt="External Link" />
        </div>
    )
};

export default ExternalLinkLogo;
