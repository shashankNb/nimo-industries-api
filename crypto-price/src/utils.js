import {sendMail} from "./email_conf.js";
import {mailTemplate} from "./template.js";
import mysql from './config.js';
import axios from "axios";

export const CryptoPriceConstants = {
    COINGECKO_API_URL: 'https://api.coingecko.com/api/v3/simple/price',
    CURRENCY: 'usd',
    INVESTOR_ID: 1,
    SEARCH_HISTORY_TABLE: 'search_history',
};

/**
 * Executes a database query.
 * @param {string} sql - The SQL query.
 * @param {Array} params - The parameters for the query.
 * @returns {Promise<Array>} - The result of the query.
 */
export const executeQuery = async (sql, params) => {
    try {
        return await mysql.query(sql, params);
    } catch (error) {
        console.error('Database query failed:', error);
        throw error;
    }
};

/**
 * Saves crypto search history to the database.
 * @param {string} cryptoId - The ID of the cryptocurrency.
 * @param {object} data - The crypto data.
 * @returns {Promise<void>}
 */
export const saveSearchHistory = async (cryptoId, data) => {
    const payload = {
        investor_id: CryptoPriceConstants.INVESTOR_ID,
        crypto_currency: cryptoId,
        data: JSON.stringify(data),
        created_at: new Date(),
    };

    const sql = `
        INSERT INTO ${CryptoPriceConstants.SEARCH_HISTORY_TABLE} 
        (investor_id, crypto_currency, data, created_at)
         VALUES 
         (?, ?, ?, ?)
    `;
    await executeQuery(sql, [payload.investor_id, payload.crypto_currency, payload.data, payload.created_at]);
};

/**
 * Sends an email notification.
 * @param {string} email - The recipient's email address.
 * @param {object} cryptoData - The crypto data to include in the email.
 * @returns {Promise<void>}
 */
export const sendCryptoPriceEmail = async (email, cryptoData) => {
    try {
        await sendMail({
            to: email,
            subject: 'Crypto Price',
            htmlContent: mailTemplate({name: 'User', data: cryptoData}),
        });
        console.log('Email sent successfully.');
    } catch (error) {
        console.error('Email sending failed:', error);
        throw error;
    }
};

/**
 * Fetches crypto details from CoinGecko API.
 * @param {string} cryptoId - The StringID of the cryptocurrency.
 * @param currencies - Must be in comma seperated format e.g. usd, aud, cad
 * @returns {Promise<object>} - The crypto price data.
 */
export const fetchCryptoPrice = async (cryptoId, currencies) => {
    const options = {
        headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': process.env.COIN_GEKO_API_KEY,
        },
        params: {
            ids: cryptoId,
            vs_currencies: currencies, // add comma seperated currencies as usd, aud, cad
        },
    };

    try {
        const response = await axios.get(CryptoPriceConstants.COINGECKO_API_URL, options);
        return response.data;
    } catch (error) {
        console.error('CoinGecko API request failed:', error);
        throw error;
    }
};

