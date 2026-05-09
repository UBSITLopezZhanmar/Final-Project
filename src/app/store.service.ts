import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private http = inject(HttpClient);

  private products = signal([
    { name:'27" LG UltraGear', category:'MONITOR', price:18000, image:'assets/images/monitor1.png' },
    { name:'24" AOC 24G2', category:'MONITOR', price:8000, image:'assets/images/monitor2.png' },
    { name:'27" Dell UltraSharp', category:'MONITOR', price:28000, image:'assets/images/monitor3.png' },
    { name:'34" LG UltraWide', category:'MONITOR', price:20000, image:'assets/images/monitor4.png' },
    { name:'27" Samsung Odyssey', category:'MONITOR', price:15000, image:'assets/images/monitor5.png' },
    { name:'32" ViewSonic', category:'MONITOR', price:12000, image:'assets/images/monitor6.png' },
    { name:'27" ASUS TUF', category:'MONITOR', price:14000, image:'assets/images/monitor7.png' },
    { name:'24" BenQ GW2491E', category:'MONITOR', price:7000, image:'assets/images/monitor8.png' },
    { name:'27" MSI Optix', category:'MONITOR', price:12000, image:'assets/images/monitor9.png' },
    { name:'27" HP M27f', category:'MONITOR', price:10000, image:'assets/images/monitor10.png' },

    { name:'Logitech G Pro X', category:'KEYBOARD', price:6000, image:'assets/images/keyboard1.png' },
    { name:'Razer Huntsman Mini', category:'KEYBOARD', price:4000, image:'assets/images/keyboard2.png' },
    { name:'Corsair K70 RGB Pro', category:'KEYBOARD', price:6500, image:'assets/images/keyboard3.png' },
    { name:'SteelSeries Apex Pro', category:'KEYBOARD', price:9000, image:'assets/images/keyboard4.png' },
    { name:'HyperX Alloy Origins', category:'KEYBOARD', price:4500, image:'assets/images/keyboard5.png' },
    { name:'Keychron K2', category:'KEYBOARD', price:3500, image:'assets/images/keyboard6.png' },
    { name:'ASUS ROG Strix Scope', category:'KEYBOARD', price:5000, image:'assets/images/keyboard7.png' },
    { name:'Redragon K552 Kumara', category:'KEYBOARD', price:1500, image:'assets/images/keyboard8.png' },
    { name:'Microsoft Ergonomic Keyboard', category:'KEYBOARD', price:2500, image:'assets/images/keyboard9.png' },
    { name:'Anne Pro 2', category:'KEYBOARD', price:3000, image:'assets/images/keyboard10.png' },

    { name:'AMD Ryzen 7 7800X3D', category:'PC INTERNALS', price:24000, image:'assets/images/internals1.png' },
    { name:'Intel Core i7-14700K', category:'PC INTERNALS', price:23000, image:'assets/images/internals2.png' },
    { name:'NVIDIA RTX 4090', category:'PC INTERNALS', price:90000, image:'assets/images/internals3.png' },
    { name:'AMD Radeon RX 7900 XTX', category:'PC INTERNALS', price:45000, image:'assets/images/internals4.png' },
    { name:'ASUS ROG Strix Series', category:'PC INTERNALS', price:12000, image:'assets/images/internals5.png' },
    { name:'MSI MPG / MAG Series', category:'PC INTERNALS', price:8000, image:'assets/images/internals6.png' },
    { name:'Corsair Vengeance DDR5', category:'PC INTERNALS', price:6000, image:'assets/images/internals7.png' },
    { name:'G.Skill Trident Z5 RGB', category:'PC INTERNALS', price:7000, image:'assets/images/internals8.png' },
    { name:'Samsung 990 Pro NVMe SSD', category:'PC INTERNALS', price:6000, image:'assets/images/internals9.png' },
    { name:'Western Digital Black', category:'PC INTERNALS', price:5500, image:'assets/images/internals10.png' },

    { name:'DHT11 Sensor', category:'ARDUINO', price:80, image:'assets/images/arduino1.png' },
    { name:'Photoresistor', category:'ARDUINO', price:10, image:'assets/images/arduino2.png' },
    { name:'LCD 16x2 (I2C)', category:'ARDUINO', price:150, image:'assets/images/arduino3.png' },
    { name:'7 Segment', category:'ARDUINO', price:20, image:'assets/images/arduino4.png' },
    { name:'9V Battery', category:'ARDUINO', price:60, image:'assets/images/arduino5.png' },
    { name:'Arduino Uno R3', category:'ARDUINO', price:250, image:'assets/images/arduino6.png' },
    { name:'Breadboard Mini', category:'ARDUINO', price:50, image:'assets/images/arduino7.png' },
    { name:'RGB LED', category:'ARDUINO', price:10, image:'assets/images/arduino8.png' },
    { name:'Arduino Mega 2560', category:'ARDUINO', price:500, image:'assets/images/arduino9.png' },
    { name:'ESP32 C3 Mini', category:'ARDUINO', price:200, image:'assets/images/arduino10.png' },
  ]);

  monitors = computed(() => this.products().filter(p => p.category === 'MONITOR'));
  keyboards = computed(() => this.products().filter(p => p.category === 'KEYBOARD'));
  pc = computed(() => this.products().filter(p => p.category === 'PC INTERNALS'));
  arduino = computed(() => this.products().filter(p => p.category === 'ARDUINO'));

  cart = signal<any[]>([]);

  addToCart(item:any){
  this.cart.update(cartItems => {

    const existing = cartItems.find(i => i.name === item.name);

    if(existing){
      return cartItems.map(i =>
        i.name === item.name
          ? { ...i, qty: (i.qty || 1) + 1 }
          : i
      );
    }

    return [...cartItems, { ...item, qty: 1 }];
  });
}

  total = computed(() =>
    this.cart().reduce((sum, item) => 
    sum + (item.price * (item.qty || 1)), 0)
  );

  apiUrl = 'https://final-project-vwyp.onrender.com/api/orders';

  saveOrder(data:any){
    return this.http.post(this.apiUrl, data);
  }

  getOrders(){
    return this.http.get<any[]>(this.apiUrl);
  }

  deleteOrder(id: string){
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateOrder(id: string, data: any){
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }
}