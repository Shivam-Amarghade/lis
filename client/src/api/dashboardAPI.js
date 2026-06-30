import API from './axiosConfig';




export const extractRole = async () => {
    const response = await API.get("/employee-role/my-roles");
    return response.data;
};

export const extractDashboardFeature = async () => {
    const response = await API.get("/Dashboard");
    return response.data;
};