import http from "../utils/http-client";

const login = (data) => {
    return http.post('/user/login', data, {
        transformResponse: [(result) => {
            const parsed = JSON.parse(result);
            localStorage.setItem('authUser', JSON.stringify(parsed.data));
            return parsed;
        }]
    });
}

const profile = () => {
    return JSON.parse(localStorage.getItem('authUser'));
}

const getNotifications = () => {
    const data = {
        "limit":100,
        "offset":0
    }
    return http.post('/notification/get-list', data, {
        transformResponse: [(result) => {
            const parsed = JSON.parse(result).data;
            localStorage.setItem('notifications', JSON.stringify(parsed));
            return parsed;
        }]
    }).catch((err) => {localStorage.setItem('dataError', JSON.stringify(err));});
}

const createNotification = (data) => {
    const user = getAuthUser()
    return http.post('/notification/create', {'user_id': 1, 'company_id': user['company_id'], ...data}, {
        transformResponse: [(result) => {
            const parsed = JSON.parse(result);
            return parsed;
        }]
    });
}

const deleteNotification = (data) => {
    return http.post('/notification/delete', data, {
        transformResponse: [(result) => {
            const parsed = JSON.parse(result);
            return parsed;
        }]
    });
}

const logout = () => {
    localStorage.removeItem('authUser');
}

const getAuthUser = () => {
    return JSON.parse(localStorage.getItem('authUser'));
}

const methods = {
    login,
    profile,
    getNotifications,
    createNotification,
    deleteNotification,
    logout,
    getAuthUser
}

export default methods;


//CHECK ERRORS HANDLE
//SIMPLE LAYOUT FOR PROFILE PAGE