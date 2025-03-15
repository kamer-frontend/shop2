// Telegram integration for Mini Cafe

// Access environment variables directly in the frontend
const TELEGRAM_BOT_TOKEN = window.TELEGRAM_BOT_TOKEN || ""
const TELEGRAM_CHAT_ID = window.TELEGRAM_CHAT_ID || ""

// Format order message for Telegram
function formatOrderMessage(orderData) {
  const items = orderData.items.map((item) => `- ${item.name}: ${item.quantity}x ${item.price} UZS`).join("\n")

  return `
🆕 Yangi buyurtma!

👤 Mijoz: ${orderData.customer}
📞 Telefon: ${orderData.phone}
📍 Manzil: ${orderData.address}
💭 Izoh: ${orderData.comment || "Yo'q"}

🛍️ Buyurtma:
${items}

💰 Jami: ${orderData.total} UZS
  `.trim()
}

// Send message to Telegram
async function sendToTelegram(message) {
  try {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error("Telegram credentials are not configured")
      return false
    }

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    })

    const data = await response.json()
    return data.ok
  } catch (error) {
    console.error("Error sending message to Telegram:", error)
    return false
  }
}

// Handle order submission
async function handleOrderSubmission(orderData) {
  const message = formatOrderMessage(orderData)
  const success = await sendToTelegram(message)

  return { success }
}

// Export functions
export { handleOrderSubmission, formatOrderMessage, sendToTelegram }

