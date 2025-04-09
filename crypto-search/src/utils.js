import dayjs from "dayjs";
import axios from "axios";

export const CryptoConstants = {
    CRYPTO_LIST_API_URL: 'https://34s0nv237c.execute-api.ap-southeast-2.amazonaws.com/dev/crypto-list',
    DATE_FORMAT: 'dddd D[th] h a',
    INVESTOR_NAME: 'Business Investor',
};

/**
 * Transforms the crypto list data.
 * @param {Array} data - The crypto list data.
 * @returns {Array} - The transformed data.
 */
export const transformCryptoListData = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
        return [];
    }

    return data.map((item) => ({
        name: CryptoConstants.INVESTOR_NAME,
        cryptoRequestInfo: item.data ? JSON.parse(item.data) : null,
        requestedOn: dayjs(item.created_at, 'YYYY-MM-DD HH:mm:ss').format(CryptoConstants.DATE_FORMAT),
        ...item,
    }));
};

/**
 * Fetches crypto list data from the API.
 * @param {string} startDate - The start date.
 * @param {string} endDate - The end date.
 * @param {string} cryptoId - The crypto ID.
 * @returns {Promise<Array>} - The crypto list data.
 */
export const fetchCryptoListData = async (startDate, endDate, cryptoId) => {
    try {
        const response = await axios.post(CryptoConstants.CRYPTO_LIST_API_URL, {
            start_date: startDate,
            end_date: endDate,
            cryptoId: cryptoId,
        });
        return response.data;
    } catch (error) {
        console.error('API request failed:', error);
        throw error; // Rethrow for centralized error handling
    }
};