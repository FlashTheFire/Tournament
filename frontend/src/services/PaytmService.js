// Premium Paytm Payment Service for Free Fire Arena
class PaytmService {
  constructor() {
    this.qrApiBase = 'https://qr.udayscriptsx.workers.dev/';
    this.statusApiBase = 'https://paytm.udayscriptsx.workers.dev/';
    this.merchantId = 'UWjSzy23711328951174';
  }

  // Generate premium QR code for payment
  async generatePaymentQR(amount, orderId = null) {
    try {
      // Generate unique order ID if not provided
      if (!orderId) {
        orderId = this.generateOrderId();
      }

      // Construct UPI payment URL
      const upiData = `upi://pay?pa=paytmqr281005050101nbxw0hx35cpo@paytm&pn=Paytm Merchant&tr=${orderId}&tn=Adding Fund`;
      
      // QR API parameters
      const params = new URLSearchParams({
        data: upiData,
        body: 'dot',
        eye: 'frame13',
        eyeball: 'ball14',
        col1: '121f28',
        col2: '121f28',
        logo: 'https://i.postimg.cc/cCrHr3TQ/1000011838-removebg.png'
      });

      const qrUrl = `${this.qrApiBase}?${params.toString()}`;
      
      const response = await fetch(qrUrl);
      const qrData = await response.json();
      
      if (qrData.image) {
        return {
          success: true,
          qrImage: qrData.image,
          orderId: orderId,
          amount: amount,
          upiData: upiData
        };
      } else {
        throw new Error('Failed to generate QR code');
      }
    } catch (error) {
      console.error('QR Generation Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Check payment status with polling
  async checkPaymentStatus(orderId) {
    try {
      const statusUrl = `${this.statusApiBase}?mid=${this.merchantId}&id=${orderId}`;
      const response = await fetch(statusUrl);
      const statusData = await response.json();
      
      return {
        success: true,
        data: statusData,
        isPaid: statusData.STATUS === 'TXN_SUCCESS',
        amount: statusData.TXNAMOUNT || 0,
        transactionId: statusData.TXNID || null,
        message: statusData.RESPMSG || 'Unknown status'
      };
    } catch (error) {
      console.error('Payment Status Check Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Poll payment status with gaming-themed callbacks
  async pollPaymentStatus(orderId, onUpdate, maxAttempts = 60) {
    let attempts = 0;
    
    const poll = async () => {
      attempts++;
      const status = await this.checkPaymentStatus(orderId);
      
      // Provide status update with gaming theme
      onUpdate({
        attempt: attempts,
        maxAttempts: maxAttempts,
        status: status,
        progress: (attempts / maxAttempts) * 100,
        message: this.getGamingStatusMessage(attempts, status)
      });
      
      // Stop polling if payment successful or max attempts reached
      if (status.isPaid || attempts >= maxAttempts) {
        return status;
      }
      
      // Continue polling every 5 seconds
      setTimeout(poll, 5000);
    };
    
    return poll();
  }

  // Generate gaming-themed status messages
  getGamingStatusMessage(attempt, status) {
    if (status.isPaid) {
      return "🎉 VICTORY! Payment successful - funds added to battle account!";
    }
    
    const messages = [
      "🔍 Scanning battlefield for payment...",
      "⚡ Detecting enemy transactions...", 
      "🎯 Locking onto payment signal...",
      "🛡️ Verifying battle funds...",
      "🔥 Processing warrior payment...",
      "💎 Confirming diamond transaction...",
      "⚔️ Validating battle entry fee...",
      "🏆 Checking tournament registration..."
    ];
    
    return messages[attempt % messages.length];
  }

  // Generate unique order ID
  generateOrderId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 5);
  }

  // Get payment amounts for different purposes
  getPaymentAmounts() {
    return {
      quick: [
        { amount: 50, label: "Quick Entry", description: "Single tournament entry", coins: 500 },
        { amount: 100, label: "Battle Pack", description: "5 tournament entries", coins: 1200 },
        { amount: 250, label: "Warrior Pack", description: "Premium tournaments", coins: 3000 }
      ],
      popular: [
        { amount: 500, label: "Elite Pack", description: "VIP tournaments + bonuses", coins: 6500 },
        { amount: 1000, label: "Champion Pack", description: "Unlimited entries for 1 month", coins: 15000 },
        { amount: 2000, label: "Legend Pack", description: "All access + exclusive rewards", coins: 35000 }
      ]
    };
  }

  // Format currency for display
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  }

  // Convert amount to coins (gaming currency)
  amountToCoins(amount) {
    // 1 INR = 10 coins + bonus based on amount
    const baseCoins = amount * 10;
    const bonusPercentage = this.getBonusPercentage(amount);
    return Math.floor(baseCoins * (1 + bonusPercentage / 100));
  }

  // Get bonus percentage based on amount
  getBonusPercentage(amount) {
    if (amount >= 2000) return 75; // 75% bonus for Legend Pack
    if (amount >= 1000) return 50; // 50% bonus for Champion Pack  
    if (amount >= 500) return 30;  // 30% bonus for Elite Pack
    if (amount >= 250) return 20;  // 20% bonus for Warrior Pack
    if (amount >= 100) return 10;  // 10% bonus for Battle Pack
    return 0; // No bonus for Quick Entry
  }
}

// Export the service
export const paytmService = new PaytmService();
export default PaytmService;