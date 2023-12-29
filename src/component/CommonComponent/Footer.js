import React from 'react';

export default function Footer({ headerDesign }) {
    return (
        <div className={`${headerDesign === true ? "header-design" : ""} footer container`}>
            <div className="footer-center-content ">
                <h4 className="text-title">Terms and Conditions</h4>
                <p className="text-title footer-copy-right">&#169; 2022 - All Rights Reserved</p>
            </div>
        </div>
    );
};