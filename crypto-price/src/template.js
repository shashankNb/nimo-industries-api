export const mailTemplate = (messagePayload) => {
    const tableRows = Object.entries(messagePayload.data)
        .map(([crypto, value]) => {
            const cryptoHeaderRow = `
        <tr>
          <td colspan="2" style="padding: 10px; background-color: #f4f4f4; text-align: center; font-weight: bold;">
            ${crypto.charAt(0).toUpperCase() + crypto.slice(1)}
          </td>
        </tr>
      `;

      const priceRows = Object.entries(value)
                .map(([key, nestedValue]) => `
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: center; background-color: #f9f9f9;">
              ${key.charAt(0).toUpperCase() + key.slice(1)}
            </td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">
              $${nestedValue.toLocaleString()}
            </td>
          </tr>
        `)
                .join('');

            return cryptoHeaderRow + priceRows;
        })
        .join('');

    return `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <div style="text-align: center; padding: 20px; background-color: #f4f4f4; border-radius: 5px; margin-bottom: 20px;">
          <h1 style="color: #4CAF50; text-align: left">Hello</h1>
          <p style="font-size: 16px; color: #555;">
            We're excited to share the latest cryptocurrency prices with you. Here’s a quick look at the current market values for some of the most popular digital currencies.
            Stay updated and informed with the latest data.
          </p>
        </div>
        <h2 style="color: #4CAF50; text-align: center;">Cryptocurrency Prices</h2>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #4CAF50; color: white;">
              <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Cryptocurrency</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Price (USD)</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
    </html>
  `;
};