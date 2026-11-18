  1. Fase 1 – Fondasi & Guardrail (Hari ke-1)                                                                                                       
      • Setup Next.js 16 + TypeScript + Tailwind v4 + Biome + cspell.                                                                               
      • Buat skrip guardrail (larang tag HTML mentah, kunci UI ke shadcn/ui, isolasi rahasia env).                                                  
      • Setup Auth & Dynamic Permission (Admin studio, Fotografer, dan Klien/Customer).                                                             
  2. Fase 2 – Media Storage & Skema Database (Hari ke-2)                                                                                            
      • Setup storage S3/R2 + Sharp WebP (krusial sekali untuk kompresi portofolio & galeri foto).                                                  
      • Definisi skema database: Paket foto, Studio/Ruangan, Jadwal slot waktu (calendar slots), Reservasi (bookings), dan Pembayaran (DP / Lunas). 
  3. Fase 3 – Fitur Inti & Notifikasi (Hari ke-3)                                                                                                   
      • Kalender booking interaktif dengan pencegahan double-booking (race condition).                                                              
      • Portal klien (cek jadwal sesi foto, upload bukti bayar/integrasi gateway, dan unduh galeri foto).                                           
      • Notifikasi pengingat H-1 sesi foto via WhatsApp / Email / Web Push.  
