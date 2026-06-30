import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { extractRole, extractDashboardFeature } from "../api/dashboardAPI";
import { switchRole } from "../api/authAPI";

const DashboardPage = () => {
    const { user } = useSelector((state) => state.auth);

    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState("");
    const [userFeature, setUserFeature] = useState(null);

    useEffect(async () => {

        try {
            const roleResponse = await extractRole();

            // API response according to backend
            const roleList = roleResponse.roles || roleResponse;

            setRoles(roleList);

            if (roleList.length > 0) {
                setSelectedRole(roleList[0]);
            }

            const dashboardData = await extractDashboardFeature(roleResponse.roleId);
            setUserFeature(dashboardData);
        } catch (err) {
            console.log(err);
        }



    }, []);

    const handleRoleChange = async (e) => {
        const role = e.target.value;

        setSelectedRole(role);

        try {
            await switchRole(role);

            const dashboardData = await extractDashboardFeature();
            setUserFeature(dashboardData);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>

            <h2>Dashboard</h2>

            {/* Show only if user has more than one role */}
            {roles.length > 1 && (
                <select
                    value={selectedRole}
                    onChange={handleRoleChange}
                >
                    {roles.map((role) => (
                        <option key={role} value={role}>
                            {role}
                        </option>
                    ))}
                </select>
            )}

            <br />
            <br />

            <h3>Welcome {user?.name}</h3>

            <pre>{JSON.stringify(userFeature, null, 2)}</pre>

        </div>
    );
};

export default DashboardPage;
