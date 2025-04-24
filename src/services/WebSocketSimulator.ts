export class WebSocketSimulator {
  private interval: number;
  private callback: (data: any) => void;
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(callback: (data: any) => void, interval: number = 2000) {
    this.interval = interval;
    this.callback = callback;
  }

  connect() {
    this.timer = setInterval(() => {
      const updates = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        price: this.generateRandomPrice(),
        change1h: this.generateRandomChange(),
        change24h: this.generateRandomChange(),
        volume24h: this.generateRandomVolume()
      }));
      this.callback(updates);
    }, this.interval);
  }

  disconnect() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private generateRandomPrice(): number {
    return +(Math.random() * 1000).toFixed(2);
  }

  private generateRandomChange(): number {
    return +(Math.random() * 2 - 1).toFixed(2);
  }

  private generateRandomVolume(): number {
    return +(Math.random() * 1000000000).toFixed(0);
  }
} 