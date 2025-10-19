import React, { useState } from "react";

// Single-file React component (Tailwind CSS assumed available)
// Default export a landing page for MB "số đẹp" vouchers with 4 packages and 3 tiers each.

const initialPackages = {
  "25": {
    title: "Voucher MB - 25,000,000 VND",
    note: "Số tài khoản MB phải dưới 25,000,000 VND",
    tiers: {
      early: { label: "Early-bird", price: 199000, stock: 50 },
      normal: { label: "Giá thường", price: 249000, stock: 100 },
      vip: { label: "VIP (chọn 2 số)", price: 349000, stock: 10 }
    }
  },
  "50": {
    title: "Voucher MB - 50,000,000 VND",
    note: "Số tài khoản MB phải dưới 50,000,000 VND",
    tiers: {
      early: { label: "Early-bird", price: 589000, stock: 40 },
      normal: { label: "Giá thường", price: 689000, stock: 80 },
      vip: { label: "VIP (chọn 2 số)", price: 989000, stock: 10 }
    }
  },
  "100": {
    title: "Voucher MB - 100,000,000 VND",
    note: "Số tài khoản MB phải dưới 100,000,000 VND",
    tiers: {
      early: { label: "Early-bird", price: 1679000, stock: 30 },
      normal: { label: "Giá thường", price: 1779000, stock: 60 },
      vip: { label: "VIP (chọn 2 số)", price: 2679000, stock: 10 }
    }
  },
  "200": {
    title: "Voucher MB - 200,000,000 VND",
    note: "Số tài khoản MB phải dưới 200,000,000 VND",
    tiers: {
      early: { label: "Early-bird", price: 3669000, stock: 10 },
      normal: { label: "Giá thường", price: 4069000, stock: 20 },
      vip: { label: "VIP (chọn 2 số)", price: 6669000, stock: 5 }
    }
  }
};

export default function MbVoucherLanding() {
  const [packages, setPackages] = useState(initialPackages);
  const [selectedPackage, setSelectedPackage] = useState("25");
  const [selectedTier, setSelectedTier] = useState("early");
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [note, setNote] = useState("");
  const [accountValue, setAccountValue] = useState(0);
  const [orders, setOrders] = useState([]);
  const BANK_ACCOUNT = "7007888888889";
  const CONTACT_ZALO = "0834.795.455";
  const CONTACT_EMAIL = "datisvietnamese@gmail.com";

  function formatVND(n) {
    return n.toLocaleString("vi-VN") + "₫";
  }

  function handlePlaceOrder(e) {
    e.preventDefault();
    const pkg = packages[selectedPackage];
    const tier = pkg.tiers[selectedTier];

    if (tier.stock <= 0) {
      alert("Rất tiếc, đã hết suất cho lựa chọn này.");
      return;
    }

    if (!fullname.trim() || !phone.trim()) {
      alert("Vui lòng nhập Tên đầy đủ và Số điện thoại.");
      return;
    }

    // Determine final price: if accountValue < package value then final amount due shown 0đ in confirmation
    const pkgValue = parseInt(selectedPackage, 10) * 1000000; // 25 -> 25,000,000
    const isCovered = accountValue >= pkgValue;
    const finalPrice = isCovered ? tier.price : 0; // if accountValue < pkgValue then 0đ applies per request

    // Create order
    const newOrder = {
      id: Date.now(),
      pkg: selectedPackage,
      tier: selectedTier,
      fullname,
      phone,
      recipientPhone,
      note,
      accountValue,
      priceShown: tier.price,
      finalPrice,
      createdAt: new Date().toISOString()
    };

    // Decrement stock for chosen tier
    setPackages(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy[selectedPackage].tiers[selectedTier].stock = Math.max(0, copy[selectedPackage].tiers[selectedTier].stock - 1);
      return copy;
    });

    setOrders(prev => [newOrder, ...prev]);

    // Clear fields (except contact)
    setFullname("");
    setPhone("");
    setRecipientPhone("");
    setNote("");
    setAccountValue(0);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 to-red-800 text-white p-6">
      <header className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/logo-mb.png" alt="MB" className="w-20 h-auto" />
          <div>
            <h1 className="text-3xl font-bold">MB VIP — Voucher Mở Tài Khoản Số Đẹp</h1>
            <p className="text-sm opacity-80">Số đẹp, dễ nhớ, thể hiện đẳng cấp. Giữ ngay trước khi hết!</p>
          </div>
        </div>
        <div className="text-right text-sm">
          <div>Liên hệ: Zalo {CONTACT_ZALO}</div>
          <div>Email: {CONTACT_EMAIL}</div>
          <div>Số tài khoản (nhận thanh toán): <span className="font-semibold">{BANK_ACCOUNT}</span></div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Package selection */}
        <section className="col-span-2 bg-white/10 rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-4">Chọn gói</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(packages).map(key => {
              const pkg = packages[key];
              return (
                <div key={key} className={`rounded-lg p-4 border ${selectedPackage===key?"border-yellow-300":"border-transparent"} bg-white/5`}> 
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{pkg.title}</h3>
                      <p className="text-sm opacity-80">{pkg.note}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm opacity-80">Giá gốc</div>
                      <div className="text-lg line-through opacity-80">{formatVND(parseInt(key,10)*1000000)}</div>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2">
                    {Object.keys(pkg.tiers).map(tk => {
                      const t = pkg.tiers[tk];
                      return (
                        <div key={tk} className="flex items-center justify-between bg-white/10 rounded-md p-2">
                          <div>
                            <div className="text-sm font-medium">{t.label}</div>
                            <div className="text-xs opacity-80">Suất còn: <span className="font-semibold">{t.stock}</span></div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm line-through opacity-70">{formatVND(parseInt(key,10)*1000000)}</div>
                            <div className="text-lg font-bold text-yellow-300">{formatVND(t.price)}</div>
                            <button
                              className={`mt-2 px-4 py-1 rounded-md text-sm ${selectedPackage===key && selectedTier===tk ? 'bg-yellow-300 text-black' : 'bg-white/20 text-white'}`}
                              onClick={() => { setSelectedPackage(key); setSelectedTier(tk); }}
                              disabled={t.stock<=0}
                            >
                              {t.stock>0? 'Chọn' : 'Hết'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 border-t border-white/10 pt-4">
            <h3 className="text-lg font-semibold">Thông tin đặt hàng</h3>
            <form onSubmit={handlePlaceOrder} className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm">Họ và tên</label>
                <input value={fullname} onChange={e=>setFullname(e.target.value)} className="w-full mt-1 p-2 rounded bg-white/10" placeholder="Nguyễn A B" />
              </div>
              <div>
                <label className="block text-sm">Số điện thoại</label>
                <input value={phone} onChange={e=>setPhone(e.target.value)} className="w-full mt-1 p-2 rounded bg-white/10" placeholder="08xxxxxxxx" />
              </div>

              <div>
                <label className="block text-sm">Số điện thoại nhận mã (nếu tặng)</label>
                <input value={recipientPhone} onChange={e=>setRecipientPhone(e.target.value)} className="w-full mt-1 p-2 rounded bg-white/10" placeholder="(tùy chọn)" />
              </div>

              <div>
                <label className="block text-sm">Giá trị tài khoản hiện tại (VND)</label>
                <input type="number" value={accountValue} onChange={e=>setAccountValue(Number(e.target.value))} className="w-full mt-1 p-2 rounded bg-white/10" placeholder="vd: 10000000" />
                <p className="text-xs opacity-70 mt-1">Nếu giá trị tài khoản &lt; mức gói, hệ thống sẽ áp dụng: <strong>Giảm còn 0đ</strong> (hiển thị trong xác nhận).</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm">Ghi chú / Yêu cầu</label>
                <textarea value={note} onChange={e=>setNote(e.target.value)} className="w-full mt-1 p-2 rounded bg-white/10" rows={3} placeholder="Ví dụ: muốn số có 9999 hoặc theo phong thủy..." />
              </div>

              <div className="md:col-span-2 flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm">Gói đã chọn:</div>
                  <div className="text-lg font-bold">{packages[selectedPackage].title} — {packages[selectedPackage].tiers[selectedTier].label}</div>
                  <div className="text-sm opacity-80">Giá hiển thị: {formatVND(packages[selectedPackage].tiers[selectedTier].price)}</div>
                </div>

                <div className="flex gap-3">
                  <button type="submit" className="px-6 py-3 bg-yellow-300 text-black rounded font-semibold">Đặt hàng & Giữ suất</button>
                  <button type="button" onClick={() => { setFullname(''); setPhone(''); setRecipientPhone(''); setNote(''); setAccountValue(0); }} className="px-4 py-3 bg-white/10 rounded">Xóa</button>
                </div>
              </div>

            </form>
          </div>
        </section>

        {/* Right: Live orders & contact */}
        <aside className="col-span-1 bg-white/6 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Thông tin liên hệ & Thanh toán</h3>
          </div>
          <div className="text-sm">
            <p>Thanh toán qua tài khoản MB: <span className="font-semibold">{BANK_ACCOUNT}</span></p>
            <p>Liên hệ (Zalo): <span className="font-semibold">{CONTACT_ZALO}</span></p>
            <p>Email: <span className="font-semibold">{CONTACT_EMAIL}</span></p>
          </div>

          <div className="pt-4 border-t border-white/10">
            <h4 className="font-semibold">Đơn hàng gần đây</h4>
            <div className="max-h-72 overflow-auto mt-2 space-y-2">
              {orders.length===0 && <div className="text-sm opacity-80">Chưa có đơn hàng. Hệ thống sẽ hiển thị đơn ngay sau khi khách đặt.</div>}
              {orders.map(o => (
                <div key={o.id} className="bg-white/5 p-3 rounded">
                  <div className="flex justify-between">
                    <div>
                      <div className="text-sm">{packages[o.pkg].title} — {packages[o.pkg].tiers[o.tier].label}</div>
                      <div className="text-xs opacity-80">{o.fullname} • {o.phone}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm line-through">{formatVND(o.priceShown)}</div>
                      <div className="font-bold">{o.finalPrice===0? '0₫' : formatVND(o.finalPrice)}</div>
                    </div>
                  </div>
                  <div className="text-xs opacity-70 mt-2">Ghi chú: {o.note || '—'}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <h4 className="font-semibold">Ghi chú quan trọng</h4>
            <ul className="text-sm mt-2 list-disc list-inside opacity-85 space-y-1">
              <li>Tất cả voucher chỉ dùng để mở tài khoản số đẹp theo điều kiện MB Bank.</li>
              <li>Nếu giá trị tài khoản của bạn nhỏ hơn mức gói được chọn, hệ thống sẽ giảm còn 0₫ (voucher hỗ trợ đầy đủ theo điều kiện).</li>
              <li>Vui lòng thanh toán vào tài khoản MB: <strong>{BANK_ACCOUNT}</strong> và gửi ảnh hóa đơn vào Zalo để xác thực.</li>
            </ul>
          </div>

        </aside>
      </main>

      <footer className="max-w-5xl mx-auto mt-8 text-center text-sm opacity-80">
        <div>© {new Date().getFullYear()} — MB Voucher Mini Shop</div>
        <div className="mt-2">Điện thoại/Zalo: {CONTACT_ZALO} — Email: {CONTACT_EMAIL} — Tài khoản MB: {BANK_ACCOUNT}</div>
      </footer>
    </div>
  );
}
