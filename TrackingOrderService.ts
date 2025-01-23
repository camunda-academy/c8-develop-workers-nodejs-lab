export class TrackingOrderService {   

    // Service duration in milliseconds
    private static readonly TRACKING_TIME: number = 10000; // 10 seconds
  
    // Simulate tracking order status with a delay
    public static async trackOrderStatus(): Promise<void> {
      return new Promise((resolve) => {
        setTimeout(resolve, TrackingOrderService.TRACKING_TIME);
      });
    }
  
    // Simulate packing items
    public static async packItems(): Promise<boolean> {
      return true;
    }
  
    // Simulate processing payment
    public static async processPayment(): Promise<string> {
      return String(Date.now());
    }
}