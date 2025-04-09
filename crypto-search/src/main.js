import {fetchCryptoListData, transformCryptoListData} from "./utils.js";

/**
 * Searches crypto history based on date range and crypto ID.
 * @param {object} event - The API Gateway event.
 * @returns {Promise<object>} - The API response.
 */
export const searchCryptoHistory = async (event) => {
    const {start_date, end_date, cryptoId} = JSON.parse(event.body);

    try {
        console.log('CryptoListPayload', {start_date, end_date, cryptoId});

        const cryptoListData = await fetchCryptoListData(start_date, end_date, cryptoId);
        const transformedData = transformCryptoListData(cryptoListData);

        return {
            statusCode: 200,
            body: JSON.stringify(transformedData),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify(error),
        };
    }
};