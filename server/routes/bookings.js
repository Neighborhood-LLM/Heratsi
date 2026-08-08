// No database in the local build — a real deployment would persist this
// and/or notify staff. Here we just log it server-side and confirm to the client.
export default async function bookings(req, res) {
  const { name, phone, email, date, time, mode, serviceTitle } = req.body ?? {};

  if (!name || !phone || !email || !date || !time) {
    return res.status(400).json({ error: "Missing required booking fields" });
  }

  console.log("[booking request]", {
    service: serviceTitle,
    name,
    phone,
    email,
    date,
    time,
    mode,
    receivedAt: new Date().toISOString(),
  });

  return res.json({ ok: true });
}
