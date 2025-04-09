import dayjs from 'dayjs';
import {
    CryptoPriceConstants,
    executeQuery,
    fetchCryptoPrice,
    saveSearchHistory,
    sendCryptoPriceEmail
} from "./utils.js";

/**
 * Fetches crypto details, saves history, and sends an email.
 * @param {object} event - The API Gateway event.
 * @returns {Promise<object>} - The API response.
 */
export const fetchCryptoDetail = async (event) => {
    const {cryptoId, email, currencies} = JSON.parse(event.body);

    try {
        const cryptoData = await fetchCryptoPrice(cryptoId, currencies);
        await saveSearchHistory(cryptoId, cryptoData);
        await sendCryptoPriceEmail(email, cryptoData);

        return {
            statusCode: 200,
            body: JSON.stringify(cryptoData),
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({error: 'Failed to retrieve price or send email.'}),
        };
    }
};

/**
 * Fetches crypto search history based on date range and crypto ID.
 * @param {object} event - The API Gateway event.
 * @returns {Promise<object>} - The API response.
 */
export const fetchCryptoList = async (event) => {
    const {start_date, end_date, cryptoId} = JSON.parse(event.body);

    try {
        const startDate = dayjs(start_date).startOf('day').format('YYYY-MM-DD HH:mm:ss');
        const endDate = dayjs(end_date).endOf('day').format('YYYY-MM-DD HH:mm:ss');

        const sql = `
            SELECT *
            FROM ${CryptoPriceConstants.SEARCH_HISTORY_TABLE}
            WHERE investor_id = ?
              AND DATE(created_at) BETWEEN ? AND ?
              AND crypto_currency = ?
        `;
        const data = await executeQuery(sql, [CryptoPriceConstants.INVESTOR_ID, startDate, endDate, cryptoId]);

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({error: 'Failed to retrieve history.'}),
        };
    }
};