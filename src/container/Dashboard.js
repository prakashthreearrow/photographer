import React from "react";
import { getLocalStorageItem } from "../utils/helper";
import PhotographerDashboard from "../container/PhotographerDashboard";
import JobDashboard from "../container/JobModule/JobDashboard";

const Dashboard = () => {
    let userData = JSON.parse(getLocalStorageItem("userData"));

    return (
        <>
            {userData?.is_accepted === "1" ? <JobDashboard /> : <PhotographerDashboard />}
        </>
    );
};

export default Dashboard;