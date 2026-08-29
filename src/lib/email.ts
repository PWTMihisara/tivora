import nodemailer from 'nodemailer';

const FROM  = `TIVORA <${process.env.GMAIL_USER}>`;
const ADMIN = process.env.ADMIN_EMAIL ?? '';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

interface OrderItem { name: string; size: string; qty: number; price: number; originalPrice?: number; discountLabel?: string }

interface OrderEmailData {
  orderId:  string;
  customer: string;
  email:    string;
  address:  string;
  items:    OrderItem[];
  subtotal: number;
  tax:      number;
  shipping: number;
  total:    number;
}

const money = (n: number) =>
  'Rs. ' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function itemsTable(items: OrderItem[]) {
  return items.map(i => {
    const hasDiscount = i.originalPrice && i.originalPrice !== i.price;
    const priceCell = hasDiscount
      ? `<span style="color:#A6402E;font-weight:600">${money(i.price * i.qty)}</span>
         <br><span style="font-size:12px;color:#9a9a96;text-decoration:line-through">${money(i.originalPrice! * i.qty)}</span>
         <br><span style="font-size:10px;font-weight:700;background:#A6402E;color:#fff;padding:2px 6px;border-radius:3px">${i.discountLabel}</span>`
      : money(i.price * i.qty);
    return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f0ede8;font-size:14px;color:#0a0a0a">${i.name}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f0ede8;font-size:14px;color:#6b6b6b;text-align:center">${i.size}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f0ede8;font-size:14px;color:#6b6b6b;text-align:center">${i.qty}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f0ede8;font-size:14px;color:#0a0a0a;text-align:right">${priceCell}</td>
    </tr>`;
  }).join('');
}

function confirmationHtml(d: OrderEmailData) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f7f5f2;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f2;padding:40px 20px">
    <tr><td>
      <table width="600" cellpadding="0" cellspacing="0" align="center" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e7e5e0;max-width:100%">

        <tr>
          <td style="background:#0a0a0a;padding:32px 40px;text-align:center">
            <div style="font-size:22px;font-weight:800;letter-spacing:0.1em;color:#ffffff">TIVORA</div>
            <div style="font-size:11px;letter-spacing:0.18em;color:rgba(255,255,255,0.5);margin-top:4px">ORDER CONFIRMATION</div>
          </td>
        </tr>

        <tr>
          <td style="padding:40px">
            <p style="font-size:16px;font-weight:600;color:#0a0a0a;margin:0 0 8px">Thank you, ${d.customer}.</p>
            <p style="font-size:14px;color:#6b6b6b;margin:0 0 32px;line-height:1.6">Your order has been received and is being processed. We'll send another update when it ships.</p>

            <div style="background:#f7f5f2;border-radius:8px;padding:16px 20px;margin-bottom:32px;display:inline-block">
              <span style="font-size:11px;letter-spacing:0.14em;color:#9a9a96">ORDER</span>
              <span style="font-size:16px;font-weight:700;color:#0a0a0a;margin-left:12px">${d.orderId}</span>
            </div>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">
              <thead>
                <tr>
                  <th style="font-size:11px;letter-spacing:0.12em;color:#9a9a96;font-weight:600;text-align:left;padding-bottom:10px;border-bottom:2px solid #e7e5e0">ITEM</th>
                  <th style="font-size:11px;letter-spacing:0.12em;color:#9a9a96;font-weight:600;text-align:center;padding-bottom:10px;border-bottom:2px solid #e7e5e0">SIZE</th>
                  <th style="font-size:11px;letter-spacing:0.12em;color:#9a9a96;font-weight:600;text-align:center;padding-bottom:10px;border-bottom:2px solid #e7e5e0">QTY</th>
                  <th style="font-size:11px;letter-spacing:0.12em;color:#9a9a96;font-weight:600;text-align:right;padding-bottom:10px;border-bottom:2px solid #e7e5e0">TOTAL</th>
                </tr>
              </thead>
              <tbody>${itemsTable(d.items)}</tbody>
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px">
              <tr>
                <td style="font-size:13px;color:#6b6b6b;padding:4px 0">Subtotal</td>
                <td style="font-size:13px;color:#0a0a0a;text-align:right;padding:4px 0">${money(d.subtotal)}</td>
              </tr>
              <tr>
                <td style="font-size:13px;color:#6b6b6b;padding:4px 0">Tax (5%)</td>
                <td style="font-size:13px;color:#0a0a0a;text-align:right;padding:4px 0">${money(d.tax)}</td>
              </tr>
              <tr>
                <td style="font-size:13px;color:#6b6b6b;padding:4px 0">Shipping</td>
                <td style="font-size:13px;color:#0a0a0a;text-align:right;padding:4px 0">${d.shipping === 0 ? 'Free' : money(d.shipping)}</td>
              </tr>
              <tr>
                <td style="font-size:16px;font-weight:700;color:#0a0a0a;padding:12px 0 4px;border-top:1px solid #e7e5e0">Total</td>
                <td style="font-size:16px;font-weight:700;color:#0a0a0a;text-align:right;padding:12px 0 4px;border-top:1px solid #e7e5e0">${money(d.total)}</td>
              </tr>
            </table>

            ${d.address ? `
            <div style="background:#f7f5f2;border-radius:8px;padding:16px 20px">
              <div style="font-size:11px;letter-spacing:0.14em;color:#9a9a96;margin-bottom:6px">DELIVERY ADDRESS</div>
              <div style="font-size:14px;color:#0a0a0a;line-height:1.5">${d.address}</div>
            </div>` : ''}
          </td>
        </tr>

        <tr>
          <td style="background:#f7f5f2;padding:24px 40px;text-align:center;border-top:1px solid #e7e5e0">
            <p style="font-size:12px;color:#9a9a96;margin:0">Questions? Reply to this email — we're happy to help.</p>
            <p style="font-size:11px;color:#c0bdb8;margin:8px 0 0">© TIVORA. All rights reserved.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function adminAlertHtml(d: OrderEmailData) {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:24px;background:#f7f5f2;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:10px;border:1px solid #e7e5e0;padding:32px">
    <div style="font-size:13px;letter-spacing:0.12em;color:#9a9a96;margin-bottom:4px">NEW ORDER</div>
    <div style="font-size:22px;font-weight:800;color:#0a0a0a;margin-bottom:24px">${d.orderId}</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px">
      <tr><td style="font-size:13px;color:#6b6b6b;padding:4px 0;width:120px">Customer</td><td style="font-size:13px;color:#0a0a0a;font-weight:600">${d.customer}</td></tr>
      <tr><td style="font-size:13px;color:#6b6b6b;padding:4px 0">Email</td><td style="font-size:13px;color:#0a0a0a">${d.email}</td></tr>
      ${d.address ? `<tr><td style="font-size:13px;color:#6b6b6b;padding:4px 0">Address</td><td style="font-size:13px;color:#0a0a0a">${d.address}</td></tr>` : ''}
      <tr><td style="font-size:13px;color:#6b6b6b;padding:4px 0">Total</td><td style="font-size:15px;color:#0a0a0a;font-weight:700">${money(d.total)}</td></tr>
    </table>
    <div style="border-top:1px solid #e7e5e0;padding-top:16px">
      ${d.items.map(i => {
        const hasDiscount = i.originalPrice && i.originalPrice !== i.price;
        const priceStr = hasDiscount
          ? `<span style="color:#A6402E;font-weight:600">${money(i.price)}</span> <span style="text-decoration:line-through;color:#9a9a96">${money(i.originalPrice!)}</span> <span style="font-size:10px;background:#A6402E;color:#fff;padding:1px 5px;border-radius:3px">${i.discountLabel}</span>`
          : money(i.price);
        return `<div style="font-size:13px;color:#0a0a0a;padding:3px 0">${i.qty}× ${i.name} — ${i.size} — ${priceStr}</div>`;
      }).join('')}
    </div>
  </div>
</body>
</html>`;
}

export async function sendOrderConfirmation(data: OrderEmailData) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return;
  await transporter.sendMail({
    from:    FROM,
    to:      data.email,
    subject: `Order confirmed ${data.orderId} — TIVORA`,
    html:    confirmationHtml(data),
  });
}

export async function sendAdminOrderAlert(data: OrderEmailData) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD || !ADMIN) return;
  await transporter.sendMail({
    from:    FROM,
    to:      ADMIN,
    subject: `New order ${data.orderId} — ${data.customer} — ${money(data.total)}`,
    html:    adminAlertHtml(data),
  });
}

const STATUS_MESSAGES: Record<string, { headline: string; body: string; color: string }> = {
  Processing: {
    headline: 'Your order is being prepared.',
    body:     'Our team is carefully picking and packing your items. We\'ll notify you once it ships.',
    color:    '#1a6fb5',
  },
  Shipped: {
    headline: 'Your order is on its way!',
    body:     'Your package has been dispatched and is heading to you. Expect delivery within 2–5 business days.',
    color:    '#0a7a4a',
  },
  Delivered: {
    headline: 'Your order has been delivered.',
    body:     'We hope you love your new pieces. If you have any questions, just reply to this email.',
    color:    '#0a7a4a',
  },
  Cancelled: {
    headline: 'Your order has been cancelled.',
    body:     'Your order has been cancelled as requested. If you didn\'t request this, please contact us immediately.',
    color:    '#b02a2a',
  },
};

function statusUpdateHtml(orderId: string, customer: string, status: string) {
  const msg = STATUS_MESSAGES[status] ?? {
    headline: `Your order status has been updated to ${status}.`,
    body:     'Log in to your account to view the latest details.',
    color:    '#0a0a0a',
  };
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f7f5f2;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f2;padding:40px 20px">
    <tr><td>
      <table width="600" cellpadding="0" cellspacing="0" align="center" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e7e5e0;max-width:100%">
        <tr>
          <td style="background:#0a0a0a;padding:32px 40px;text-align:center">
            <div style="font-size:22px;font-weight:800;letter-spacing:0.1em;color:#ffffff">TIVORA</div>
            <div style="font-size:11px;letter-spacing:0.18em;color:rgba(255,255,255,0.5);margin-top:4px">ORDER UPDATE</div>
          </td>
        </tr>
        <tr>
          <td style="padding:40px">
            <div style="display:inline-block;background:${msg.color};color:#fff;font-size:11px;font-weight:700;letter-spacing:0.14em;padding:6px 14px;border-radius:4px;margin-bottom:24px">${status.toUpperCase()}</div>
            <p style="font-size:16px;font-weight:600;color:#0a0a0a;margin:0 0 8px">${msg.headline}</p>
            <p style="font-size:14px;color:#6b6b6b;margin:0 0 32px;line-height:1.6">Hi ${customer}, ${msg.body}</p>
            <div style="background:#f7f5f2;border-radius:8px;padding:16px 20px">
              <span style="font-size:11px;letter-spacing:0.14em;color:#9a9a96">ORDER</span>
              <span style="font-size:16px;font-weight:700;color:#0a0a0a;margin-left:12px">${orderId}</span>
            </div>
          </td>
        </tr>
        <tr>
          <td style="background:#f7f5f2;padding:24px 40px;text-align:center;border-top:1px solid #e7e5e0">
            <p style="font-size:12px;color:#9a9a96;margin:0">Questions? Reply to this email — we're happy to help.</p>
            <p style="font-size:11px;color:#c0bdb8;margin:8px 0 0">© TIVORA. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendStatusUpdate(orderId: string, customer: string, email: string, status: string) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return;
  if (!['Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) return;
  await transporter.sendMail({
    from:    FROM,
    to:      email,
    subject: `Order ${orderId} — ${status} | TIVORA`,
    html:    statusUpdateHtml(orderId, customer, status),
  });
}
