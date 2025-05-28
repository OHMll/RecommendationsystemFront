const API_BASE_URL = 'http://localhost:8000/api';

// Generic function to fetch data from API
export const fetchDataApi = async (method, endpoint, data = {}, headers = {}) => {
    try {
        // Log request details
        console.log('Making API request to:', `${API_BASE_URL}/${endpoint}`);
        console.log('Request headers:', headers);
        

        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...headers
            },
            credentials: 'include',
            body: method !== 'GET' ? JSON.stringify(data) : undefined
        });

        // Log response status
        console.log('Response status:', response.status);

        // Read response data once
        const responseData = await response.json();

        if (!response.ok) {
            return { error: responseData.message };
        }

        return responseData;

    } catch (error) {
        console.error('API Error:', error);
        return { error: 'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง' };
    }
};

// Function for PUT and DELETE operations
export const sendDataApi = async (method, endpoint, data = {}, headers = {}) => {
    const isFormData = data instanceof FormData;

    try {
        console.log('Making API request to:', `${API_BASE_URL}/${endpoint}`);
        console.log('Request headers:', headers);

        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method,
            headers: isFormData ? undefined : {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...headers
            },
            body: method !== 'GET' ? (isFormData ? data : JSON.stringify(data)) : undefined,
        });

        const text = await response.text();
        try {
            const data = JSON.parse(text);
            throw new data;
        } catch (err) {
            console.error("Server response is not JSON:", text);
            throw new Error(`Invalid JSON: ${text}`);
        }
    } catch (error) {
        console.error('API call failed:', error);
        throw new error;
    }
};

// Function for sending OTP
export const sendOTPApi = async (username, email) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ username, email })
        });

        const text = await response.text();
        
        // ถ้า response เป็นข้อความธรรมดา
        if (!text.startsWith('{') && !text.startsWith('[')) {
            return { message: text };
        }

        try {
            const data = JSON.parse(text);
            if (!response.ok) {
                return { error: data.message || 'เกิดข้อผิดพลาดในการส่ง OTP' };
            }
            return data;
        } catch (err) {
            console.error("Server response is not valid JSON:", text);
            return { error: text };
        }
    } catch (error) {
        console.error('Error sending OTP:', error);
        return { error: 'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง' };
    }
};

// Function for verifying OTP
export const verifyOTPApi = async (username, otp, password) => {
    console.log(username, otp, password)
    try {
        const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ username, otp, password })
        });

        const data = await response.json();
        
        if (!response.ok) {
            return { error: data.message || 'เกิดข้อผิดพลาดในการยืนยัน OTP' };
        }

        return data;
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return { error: 'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง' };
    }
};
